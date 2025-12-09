import time
from backend.rag_engine import get_retriever
from backend.ueba_guard import validate_action
from backend.booking_manager import find_available_slot, book_slot
from backend.voice_service import send_alert  # We will write this next

def run_agent_workflow(user_query, vehicle_data=None):
    """
    SOP Defined Workflow:
    Input -> RAG -> Safety Check -> Slot Check -> Decision.
    """
    print(f"🧠 Agent Workflow Triggered: {user_query}")
    
    # 1. RAG: Consult the Manual
    retriever = get_retriever()
    docs = retriever.invoke(user_query)
    manual_context = docs[0].page_content
    
    response = {
        "analysis": "Analyzing system parameters...",
        "steps": [],
        "booking_status": "Not required"
    }

    # 2. Logic: If P0217 (Overheating) is detected
    if "P0217" in user_query or "overheating" in user_query.lower():
        response["analysis"] = "CRITICAL: Engine Overtemp (P0217) detected. Immediate action required."
        response["steps"] = [
            "1. STOP the vehicle immediately.",
            "2. Do not open the radiator cap.",
            "3. Allow engine to cool for 15 minutes."
        ]
        
        # 3. Safety Layer (UEBA)
        # We simulate vehicle data if not provided
        current_data = vehicle_data if vehicle_data else {"temp": 115} 
        is_safe, safety_msg = validate_action("book_service", current_data)
        
        if is_safe:
            # 4. Booking Check (Find a slot)
            slot = find_available_slot()
            if slot:
                # 5. Voice Action (Trigger the call)
                alert_message = f"Hello, your car is overheating. I have found a service slot at {slot['Time']}. booking it now."
                send_alert(alert_message)
                
                # Auto-book simulation
                # In a real scenario, we might ask for confirmation, but for the demo, we show availability.
                response["booking_status"] = f"Slot found at {slot['Time']}. Auto-booking initiated."
            else:
                response["booking_status"] = "No service slots available immediately."
        else:
            response["booking_status"] = f"Booking blocked by Safety Layer: {safety_msg}"

    else:
        # Fallback for normal queries
        response["analysis"] = "System Normal. " + manual_context[:100] + "..."
        
    return response