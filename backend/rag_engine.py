import os
from langchain_core.documents import Document

# Define paths (Just to keep file structure valid)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE_DIR, "manuals", "car_service_manual.pdf")
DB_PATH = os.path.join(BASE_DIR, "chroma_db")

class MockRetriever:
    """
    A fake search engine that always returns the right answer for the demo.
    This prevents API errors during the presentation.
    """
    def invoke(self, query):
        """Simulates searching the manual."""
        print(f"🔎 RAG Search Triggered for: {query}")
        
        # DEMO LOGIC: If the query is about the specific error code, return the manual page.
        if "P0217" in query or "overheating" in query.lower():
            return [
                Document(
                    page_content="""
                    DTC CODE: P0217
                    Description: Engine Overtemp Condition.
                    Diagnosis: The engine coolant temperature has exceeded the safe threshold (usually 240°F / 115°C).
                    Immediate Action: Stop the vehicle, turn off engine, check coolant levels.
                    Severity: CRITICAL. Risk of permanent engine block damage.
                    """,
                    metadata={"source": "car_service_manual.pdf", "page": 4}
                )
            ]
        
        # Fallback for other queries
        return [Document(page_content="No specific manual entry found for this query.", metadata={})]

    # LangChain compatibility (some versions use get_relevant_documents)
    def get_relevant_documents(self, query):
        return self.invoke(query)

def build_vector_store():
    """Simulates building the database."""
    print("📚 Loading PDF Manual...")
    print("✂️ Splitting text...")
    print("💾 Saving to Simulation DB...")
    print("✅ Knowledge Base Built! (SIMULATION MODE)")
    return True

def get_retriever():
    """Returns our fake retriever."""
    return MockRetriever()

# Function to test it directly
if __name__ == "__main__":
    build_vector_store()
    # Test the search
    retriever = get_retriever()
    result = retriever.invoke("What is error P0217?")
    print("\nTest Result:")
    print(result[0].page_content)