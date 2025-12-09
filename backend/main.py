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

# --- HTTP Endpoints (For the Chat/Agent) ---
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
    SOP Requirement: Returns all slots for that car.
    """
    history = get_history(reg_number)
    return history

# --- WEBSOCKET (For the Live Dashboard)  ---
@app.post("/api/voice-test")
def trigger_manual_call():
    """
    Allows the frontend 'Call Assist' button to trigger a voice alert manually.
    """
    print("📞 Manual Voice Test Triggered")
    success = send_alert("Hello. This is GLYTCH Assist. We detected a manual request for support. Connecting you now.")
    return {"status": "calling", "success": success}

@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🔌 WebSocket Connected: Frontend is listening...")
    
    # Load the simulation data
    csv_path = os.path.join(os.path.dirname(__file__), "data", "obd_simulation.csv")
    
    if not os.path.exists(csv_path):
        print("❌ Error: obd_simulation.csv not found!")
        await websocket.close()
        return

    df = pd.read_csv(csv_path)
    
    # 1. INITIALIZE FLAG HERE (Outside the loop)
    # We set this to False initially. Once it turns True, it STAYS True.
    has_triggered_alert = False  

    try:
        # Loop through the CSV rows indefinitely (Simulation Loop)
        while True:
            for index, row in df.iterrows():
                # 1. Prepare Data
                dtc_val = row["DTC_CODE"] if pd.notna(row["DTC_CODE"]) else None
                
                data_point = {
                    "timestamp": str(row["Timestamp"]),
                    "rpm": int(row["010C_RPM"]),
                    "speed": int(row["010D_SPEED"]),
                    "temp": int(row["0105_ECT"]),
                    "dtc": dtc_val
                }
                
                # --- [START] AUTO-BOOKING LOGIC ---
                # Check if there is a valid Error Code
                if dtc_val and str(dtc_val).strip() != "None":
                    
                    # 2. CHECK THE FLAG: Only book if we haven't done it yet
                    if not has_triggered_alert:  
                        print(f"⚠️ FAILURE TRIGGERED: {dtc_val}")
                        
                        # A. Send Voice Alert
                        error_msg = f"Critical fault {dtc_val} detected. Scheduling service."
                        send_alert(error_msg) 
                        
                        # B. Auto-Book Slot
                        slot = find_available_slot()
                        
                        if slot:
                            # --- CRITICAL FIX: Match the Frontend ID ---
                            veh_reg = "TN-22-BJ-2730" 
                            # -------------------------------------------
                            
                            success = book_slot(slot['SlotID'], veh_reg)
                            
                            if success:
                                print(f"✅ Auto-Booked Slot {slot['SlotID']} for {veh_reg}")
                                data_point["alert"] = f"Service Booked: {slot['Date']} {slot['Time']}"
                        else:
                            print("❌ No slots available for auto-booking.")
                        
                        # 3. LOCK THE FLAG: Triggered once, never trigger again for this session
                        has_triggered_alert = True  
                
                # --- [END] AUTO-BOOKING LOGIC ---

                
                # Send to Frontend
                await websocket.send_json(data_point)
                
                # Wait 1 second before sending the next row (Simulate real time)
                await asyncio.sleep(1)
                
    except WebSocketDisconnect:
        print("🔌 WebSocket Disconnected")
    except Exception as e:
        print(f"⚠️ WebSocket Error: {e}")