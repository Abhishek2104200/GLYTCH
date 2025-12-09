import pandas as pd
import os


# --- FIX: Look inside the CURRENT folder (backend), not the parent ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
CSV_PATH = os.path.join(BASE_DIR, "data", "service_slots.csv")

def load_data():
    """Reads the CSV file into a Pandas DataFrame."""
    # Debug: Print where we are looking to confirm path
    # print(f"📂 Loading data from: {CSV_PATH}") 
    if not os.path.exists(CSV_PATH):
        print(f"❌ ERROR: File not found at {CSV_PATH}")
        return pd.DataFrame(columns=["SlotID", "Date", "Time", "Status", "VehicleReg"])
    return pd.read_csv(CSV_PATH)

def save_data(df):
    """Saves the DataFrame back to the CSV."""
    df.to_csv(CSV_PATH, index=False)
    print(f"💾 Data saved to: {CSV_PATH}")

def find_available_slot():
    """Finds the first row where Status is 'AVAILABLE'."""
    df = load_data()
    
    if df.empty:
        return None

    # Filter for available slots
    # Ensure we strip whitespace to avoid "AVAILABLE " mismatches
    available = df[df["Status"].str.strip() == "AVAILABLE"]
    
    if available.empty:
        return None
    
    # Return the first available slot as a dictionary
    return available.iloc[0].to_dict()

def book_slot(slot_id, reg_number):
    """Updates the slot status to BOOKED for the given Reg Number."""
    df = load_data()
    
    if df.empty:
        return False

    # Check if slot exists
    if slot_id in df["SlotID"].values:
        # Update the row
        df.loc[df["SlotID"] == slot_id, "Status"] = "BOOKED"
        df.loc[df["SlotID"] == slot_id, "VehicleReg"] = reg_number
        save_data(df)
        return True
    return False

def get_history(reg_number):
    """Returns all bookings for a specific car (For the Service Portal)."""
    df = load_data()
    
    if df.empty:
        return []

    history = df[df["VehicleReg"] == reg_number]
    return history.to_dict(orient="records")