from backend.rag_engine import run_rag_search
from backend.ueba_guard import validate_action
from backend.booking_manager import find_available_slot, book_slot
from backend.voice_service import send_alert

def run_agent_workflow(user_query, vehicle_data=None):
    print(f"🧠 Agent Workflow Triggered: {user_query}")
    
    # 1. RAG Search (Now checks the PDF)
    rag_result = run_rag_search(user_query)
    
    response = {
        "analysis": rag_result,
        "steps": [],
        "booking_status": None
    }

    # 2. Logic: Check if the RAG result discusses a Fault Code
    # We look for keywords in the retrieved manual text
    critical_keywords = ["P0217", "Overheating", "High Input", "Circuit Malfunction"]
    
    is_critical = any(k.lower() in rag_result.lower() for k in critical_keywords)

    if is_critical:
        response["steps"] = [
            "1. STOP the vehicle immediately.",
            "2. Check coolant levels.",
            "3. Do not open radiator cap while hot."
        ]
        
        # 3. Safety Layer
        current_data = vehicle_data if vehicle_data else {"temp": 115} 
        is_safe, safety_msg = validate_action("book_service", current_data)
        
        if is_safe:
            slot = find_available_slot()
            if slot:
                response["booking_status"] = f"Slot found at {slot['Time']}. Auto-booking initiated."
            else:
                response["booking_status"] = "No service slots available."
        else:
            response["booking_status"] = f"Booking blocked: {safety_msg}"

    return response