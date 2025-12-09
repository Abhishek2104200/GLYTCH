import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE_DIR, "manuals", "car_service_manual.pdf")
DB_PATH = os.path.join(BASE_DIR, "chroma_db")

# Global variables
retriever = None
vector_db = None
all_pages_text = []  # Store raw text for the "Safety Net" keyword search

def initialize_rag():
    """
    Builds the Vector Database and caches raw text for keyword searching.
    """
    global retriever, vector_db, all_pages_text
    print("🔄 Initializing Hybrid RAG Engine...")

    if not os.path.exists(PDF_PATH):
        print(f"❌ ERROR: Manual not found at {PDF_PATH}")
        return False

    print("🧠 Loading AI Model...")
    try:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    except Exception as e:
        print(f"❌ Model Error: {e}")
        return False

    # 1. Load PDF Text (For both Vector DB and Keyword Search)
    print("📚 Reading PDF Manual...")
    loader = PyPDFLoader(PDF_PATH)
    docs = loader.load()
    
    # Cache text for Safety Net Search
    all_pages_text = docs 

    # 2. Vector Database Management
    if os.path.exists(DB_PATH) and os.listdir(DB_PATH):
        print("💾 Loading existing Vector Database...")
        vector_db = Chroma(persist_directory=DB_PATH, embedding_function=embeddings)
    else:
        print(f"✂️  Splitting {len(docs)} pages into chunks...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        print("nW  Creating Vector Embeddings...")
        vector_db = Chroma.from_documents(
            documents=splits, 
            embedding=embeddings, 
            persist_directory=DB_PATH
        )
        print("✅ Database Created!")

    retriever = vector_db.as_retriever(search_kwargs={"k": 4}) # Increased k for better recall
    print("🚀 Hybrid RAG System Ready!")
    return True

def run_rag_search(query):
    """
    Smart Search: Finds the EXACT line for a code.
    If found -> Returns ONLY that line (Clean & Precise).
    If not found -> Falls back to AI Analysis (Helpful).
    """
    global retriever, all_pages_text
    
    if retriever is None:
        initialize_rag()
    
    print(f"🔎 RAG Searching for: {query}")

    # --- STRATEGY 1: EXACT CODE SNIPER ---
    query_upper = query.upper().strip()
    potential_codes = [word for word in query_upper.split() if word.startswith("P") and len(word) == 5 and word[1:].isdigit()]
    
    if potential_codes:
        code = potential_codes[0] # e.g. "P0300"
        print(f"🎯 Exact Code Detected: {code}. Scanning for precise line...")
        
        for doc in all_pages_text:
            if code in doc.page_content:
                # Split page into lines and find the specific one
                lines = doc.page_content.split('\n')
                for line in lines:
                    if code in line:
                        # Found it! Return JUST this line.
                        return f"✅ MANUAL MATCH:\n{line.strip()}"

    # --- STRATEGY 2: AI FALLBACK (Only if exact match fails) ---
    print("🤖 No exact code found. Asking AI...")
    docs = retriever.invoke(query)
    
    if not docs:
        return "No relevant information found."
        
    # Get the top result only (to keep it clean)
    best_doc = docs[0]
    return f"🤖 AI ANALYSIS:\n{best_doc.page_content[:200]}...\n(Source: PDF Page {best_doc.metadata.get('page', '?')})"

def get_retriever():
    if retriever is None:
        initialize_rag()
    return retriever