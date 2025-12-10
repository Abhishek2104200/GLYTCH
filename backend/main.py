import asyncio
import pandas as pd
import os
import json
import joblib
import numpy as np
from tensorflow.keras.models import load_model
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

# ==========================================
# 🧠 AI MODEL LOADING (NEW ADDITION)
# ==========================================
print("🧠 Loading Predictive Maintenance Models...")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "ml_models")

# Global variables for the AI
vehicle_model = None
scaler = None
model_columns = None

try:
    vehicle_model = load_model(os.path.join(MODEL_DIR, "vehicle_model.keras"))
    scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
    model_columns = joblib.load(os.path.join(MODEL_DIR, "model_columns.pkl"))
    print("✅ AI Models Loaded Successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not load AI models. Prediction feature will be disabled. Error: {e}")

# ==========================================
# 📝 DATA MODELS
# ==========================================

# Existing Agent Query Model
class UserQuery(BaseModel):
    query: str
    vehicle_data: dict = None

# NEW: Prediction Request Model
class MaintenanceRequest(BaseModel):
    mileage: int
    vehicle_age: int
    reported_issues: int
    engine_size: int
    maintenance_history: str  # "Good", "Average", "Poor"

# ==========================================
# 🌐 HTTP ENDPOINTS
# ==========================================

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
    success = send_alert("Hello. This is Autosync Assist. We detected a manual request for support. Connecting you now.")
    return {"status": "calling", "success": success}

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

# --- NEW ENDPOINT: PREDICTIVE MAINTENANCE ---
@app.post("/api/predict-maintenance")
def predict_maintenance(data: MaintenanceRequest):
    if not vehicle_model:
        return {"error": "AI Model not loaded on server."}

    try:
        # 1. Prepare Input Dictionary
        input_data = {
            'Mileage': data.mileage,
            'Vehicle_Age': data.vehicle_age,
            'Reported_Issues': data.reported_issues,
            'Engine_Size': data.engine_size,
            # Handle the specific categorical column format used in training
            'Maintenance_History_' + data.maintenance_history: 1 
        }

        # 2. Align with Training Columns (The Map)
        # Create a dataframe with all columns set to 0
        df_input = pd.DataFrame(columns=model_columns)
        df_input.loc[0] = 0  

        # Fill in the user's data
        for col, val in input_data.items():
            if col in df_input.columns:
                df_input.at[0, col] = val
        
        # 3. Scale (The Math Adjuster)
        input_scaled = scaler.transform(df_input)

        # 4. Predict (The Brain)
        prediction_prob = vehicle_model.predict(input_scaled)[0][0]
        prediction_percent = round(float(prediction_prob) * 100, 2)
        
        # 5. Return Result
        status = "MAINTENANCE REQUIRED" if prediction_prob > 0.5 else "Vehicle Healthy"
        color = "red" if prediction_prob > 0.5 else "green"
        
        return {
            "probability": prediction_percent,
            "status": status,
            "color": color
        }

    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        return {"error": str(e)}

# ==========================================
# 🔌 WEBSOCKET SIMULATION
# ==========================================

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
                        if dtc_val in FAULT_CODES:
                            fault_info = FAULT_CODES[dtc_val]
                            fault_description = fault_info["desc"]
                            advice = fault_info["advice"]
                        else:
                            fault_description = "Critical Unidentified Fault"
                            advice = f"Diagnostic code {dtc_val} requires manual inspection."

                        veh_voice_format = "T N 22, B J, 27 30"
                        current_temp = int(row["0105_ECT"])

                        # Voice Script
                        voice_msg = (
                            f"Diagnostic Trouble Code {dtc_val} detected. "
                            f"{fault_description}. "
                            f"Current engine temperature is {current_temp} degrees celsius. "
                            f"{advice} "
                            f"We are initiating an emergency service booking for vehicle {veh_voice_format}."
                        )
                        
                        # Voice Alert
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