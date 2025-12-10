import asyncio
import pandas as pd
import os
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.agent_workflow import run_agent_workflow
from backend.booking_manager import find_available_slot, book_slot, get_history
from backend.voice_service import send_alert

app = FastAPI(title="GLYTCH AutoSync", version="2.0")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Model ---
class UserQuery(BaseModel):
    query: str
    vehicle_data: dict = None

# --- HTTP Endpoints ---
@app.get("/")
def read_root():
    return {"status": "GLYTCH System Online", "version": "2.0.0"}

@app.post("/api/analyze")
def analyze_vehicle(request: UserQuery):
    """
    Standard HTTP endpoint for the AI Agent.
    """
    print(f"📩 API Received: {request.query}")
    result = run_agent_workflow(request.query, request.vehicle_data)
    return result

@app.get("/api/service-history/{reg_number}")
def get_service_history(reg_number: str):
    """
    Returns all slots for that car.
    """
    history = get_history(reg_number)
    return history

@app.post("/api/voice-test")
def trigger_manual_call():
    """
    Triggers a manual voice alert.
    """
    print("📞 Manual Voice Test Triggered")
    success = send_alert("Hello. This is autosync Assist. We detected a manual request for support. Connecting you now.")
    return {"status": "calling", "success": success}

# --- NEW ENDPOINT: MANUAL BOOKING (This was missing) ---
@app.post("/api/book-manual")
def manual_booking():
    """
    Triggered by the 'Book Service' button on the dashboard.
    """
    print("📅 Manual Booking Requested")
    
    # 1. Find a slot
    slot = find_available_slot()
    
    if slot:
        # 2. Book it for your specific User ID
        veh_reg = "TN-22-BJ-2730"
        success = book_slot(slot['SlotID'], veh_reg)
        
        if success:
            print(f"✅ Manually Booked Slot {slot['SlotID']}")
            return {
                "status": "success", 
                "message": f"Service Confirmed: {slot['Date']} at {slot['Time']}",
                "slot": slot
            }
    
    print("❌ Manual Booking Failed: No Slots")
    return {"status": "failed", "message": "No available service slots found in the database."}

# --- WEBSOCKET ---
# --- WEBSOCKET ---
@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🔌 WebSocket Connected: Frontend is listening...")
    
    csv_path = os.path.join(os.path.dirname(__file__), "data", "obd_simulation.csv")
    
    if not os.path.exists(csv_path):
        print("❌ Error: obd_simulation.csv not found!")
        await websocket.close()
        return

    df = pd.read_csv(csv_path)
    has_triggered_alert = False  

    # --- 1. DEFINE YOUR CODES HERE ---
    # Add any codes you want the voice to recognize specifically.
    FAULT_CODES = {
        "P0217": {
            "desc": "Engine Coolant Over Temperature Condition",
            "advice": "Stop the vehicle immediately to prevent engine damage."
        },
        "P0300": {
            "desc": "Random Multiple Cylinder Misfire Detected",
            "advice": "Reduce speed and avoid heavy acceleration."
        },
        "P0115": {
            "desc": "Engine Coolant Temperature Circuit Malfunction",
            "advice": "Check coolant levels immediately."
        },
        "P0101": {
            "desc": "Mass Air Flow Sensor Performance Problem",
            "advice": "Engine performance may be reduced."
        }
    }

    try:
        while True:
            for index, row in df.iterrows():
                dtc_val = row["DTC_CODE"] if pd.notna(row["DTC_CODE"]) else None
                
                data_point = {
                    "timestamp": str(row["Timestamp"]),
                    "rpm": int(row["010C_RPM"]),
                    "speed": int(row["010D_SPEED"]),
                    "temp": int(row["0105_ECT"]),
                    "dtc": dtc_val
                }
                
                # --- AUTO-BOOKING & VOICE ALERT LOGIC ---
                if dtc_val and str(dtc_val).strip() != "None":
                    if not has_triggered_alert:
                        print(f"⚠️ FAILURE TRIGGERED: {dtc_val}")
                        
                        # --- SMART LOOKUP ---
                        # Check if we know this code
                        if dtc_val in FAULT_CODES:
                            fault_info = FAULT_CODES[dtc_val]
                            fault_description = fault_info["desc"]
                            advice = fault_info["advice"]
                        else:
                            # Fallback for unknown codes (reads the code itself)
                            fault_description = "Critical Unidentified Fault"
                            advice = f"Diagnostic code {dtc_val} requires manual inspection."

                        # Spaced out vehicle number so the AI reads it clearly
                        veh_voice_format = "T N 22, B J, 27 30"
                        current_temp = int(row["0105_ECT"])

                        # The Voice Script
                        voice_msg = (
                            f"Diagnostic Trouble Code {dtc_val} detected. "
                            f"{fault_description}. "
                            f"Current engine temperature is {current_temp} degrees celsius. "
                            f"{advice} "
                            f"We are initiating an emergency service booking for vehicle {veh_voice_format}."
                        )
                        
                        # Send the detailed message
                        send_alert(voice_msg) 
                        
                        # --- BOOKING LOGIC ---
                        slot = find_available_slot()
                        if slot:
                            veh_reg = "TN-22-BJ-2730" 
                            success = book_slot(slot['SlotID'], veh_reg)
                            if success:
                                print(f"✅ Auto-Booked Slot {slot['SlotID']}")
                                data_point["alert"] = f"Service Booked: {slot['Date']} {slot['Time']}"
                        
                        has_triggered_alert = True  
                
                await websocket.send_json(data_point)
                await asyncio.sleep(1)
                
    except WebSocketDisconnect:
        print("🔌 WebSocket Disconnected")
    except Exception as e:
        print(f"⚠️ WebSocket Error: {e}")