# 🚗 GLYTCH AutoSync

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-2.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![React](https://img.shields.io/badge/React-18-cyan)

> **Proactive Vehicle Intelligence. Real-time Diagnostics.**

**GLYTCH AutoSync** is a next-generation vehicle management platform designed to transform car ownership from reactive to proactive. By orchestrating a **3D Digital Twin**, **Real-Time Telemetry**, and **AI Predictive Maintenance**, the system empowers drivers to visualize their car's health instantly and automates critical service bookings before a breakdown occurs.

---

## ✨ Novelty & Key Features

* **🏎️ 3D Digital Twin**: Interactive, real-time 3D visualization of the vehicle state using Three.js.
* **📡 Real-Time Telemetry**: WebSocket-powered streaming of RPM, Speed, and Temperature data directly from the backend simulation.
* **🤖 AI Diagnostics Agent**: A Gemini-style chat assistant that explains cryptic OBD-II fault codes (like `P0217`) in plain English.
* **🔮 Predictive Maintenance**: A custom Neural Network (TensorFlow/Keras) that calculates failure probability based on mileage, age, and history.
* **🗣️ Voice Alert System**: Critical faults trigger an immediate voice call to the driver with actionable advice via text-to-speech integration.
* **📅 Automated & Manual Booking**: Seamlessly bridges the gap between diagnosis and repair with one-click service slot booking.

---

## 🏗️ Architecture Overview

The system operates in a unified loop:

1.  **Simulation Core:** The Backend streams CSV-based OBD-II data via WebSockets.
2.  **Digital Twin:** The Frontend receives data updates and animates the 3D car model.
3.  **Neural Engine:** When the user requests a health check, the Keras model analyzes vehicle parameters.
4.  **Action Hub:** Critical alerts trigger the Voice Service and enable the Booking Manager.

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Three.js (React Three Fiber), Vite |
| **Backend** | FastAPI, Python, WebSockets, Uvicorn |
| **AI/ML** | TensorFlow, Keras, Scikit-Learn, Pandas, NumPy |
| **Data** | CSV-based Database (Simulation), Joblib (Model Serialization) |
| **Tools** | Git, Postman, Google Colab |

---

## 🚀 Getting Started

These instructions will set up the full stack (Frontend + Backend) locally on your machine.

### Prerequisites

* **Node.js** (v16+)
* **Python** (v3.9+)
* **Git**

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone [https://github.com/Abhishek2104200/GLYTCH.git](https://github.com/Abhishek2104200/GLYTCH.git)
cd GLYTCH
````

#### 2\. Backend Configuration

The backend powers the API, AI Model, and WebSocket stream.

**Step A: Navigate to backend**

```bash
cd backend
```

**Step B: Create Virtual Environment**

*Windows:*

```bash
python -m venv venv
venv\Scripts\activate
```

*Mac/Linux:*

```bash
python3 -m venv venv
source venv/bin/activate
```

**Step C: Install Dependencies**
This installs FastAPI, AI libraries, and the compatibility layer (tf-keras) needed for the model.

```bash
pip install fastapi uvicorn pandas numpy scikit-learn tensorflow tf-keras joblib langchain requests
```

**Step D: Run the Server**

```bash
# Ensure you are running this from the root folder context if possible, or adjust path
uvicorn main:app --reload --reload-exclude "*.csv"
```

✅ **The backend will start at** `http://127.0.0.1:8000`

#### 3\. Frontend Configuration

The frontend handles the 3D visualizations and User Interface.

**Step A: Open a new terminal and navigate to frontend**

```bash
cd frontend
```

**Step B: Install Node Packages**

```bash
# Install core dependencies
npm install

# Install 3D, Routing, and Icon libraries
npm install three @react-three/fiber @react-three/drei lucide-react axios react-router-dom
```

**Step C: Run the Application**

```bash
npm run dev
```

✅ **The app will open at** `http://localhost:5173`

-----

## 🎮 Usage Guide

**Dashboard (Command Center):**

  * Open the app. You will see the 3D Digital Twin rotating and live data (RPM/Temp) updating.
  * Wait for the simulation to hit an error code (e.g., `P0217`), or observe the "System Online" status.

**Predictive Maintenance:**

  * Click the "Predict Maint." button on the dashboard.
  * Enter vehicle details (Mileage, Age, etc.) and click "Run Prediction".
  * The AI will calculate the failure probability percentage.

**Service Booking:**

  * Click "Book Slot" to navigate to the Service Portal and reserve a time slot.

**AI Assistant:**

  * Use the chat window on the right to ask questions like "What does my temperature reading mean?".

-----

## 🧩 Project Structure

```text
GLYTCH/
├── backend/
│   ├── data/
│   │   └── obd_simulation.csv    # Simulated vehicle telemetry data
│   ├── ml_models/
│   │   ├── vehicle_model.keras   # Trained Neural Network
│   │   ├── scaler.pkl            # Data Scaler
│   │   └── model_columns.pkl     # Feature mapping
│   ├── venv/                     # Python Virtual Environment
│   ├── main.py                   # FastAPI Entry Point (HTTP + WebSocket + AI)
│   ├── agent_workflow.py         # AI Agent Logic
│   ├── booking_manager.py        # Service Slot Management
│   ├── voice_service.py          # Text-to-Speech Alert System
│   └── requirements.txt          # Backend Dependencies
│
├── frontend/
│   ├── public/
│   │   └── Car Model.glb         # 3D Asset
│   ├── src/
│   │   ├── components/
│   │   │   ├── Car3D.jsx         # 3D Viewer Component
│   │   │   └── CarSchematic.jsx  # 2D Data Overlay
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main Command Center
│   │   │   ├── ServicePortal.jsx # Booking Management
│   │   │   └── PredictiveMaintenance.jsx # AI Prediction Page
│   │   ├── App.jsx               # Routing Logic
│   │   └── main.jsx              # React Entry Point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

-----

## 👥 Contributors

A huge shoutout to the team who made this happen:

  * **Abhishek.S.B** - Full Stack Integration, System Architect & 3D Implementation.
  * **Khushwant** - Lead Data Scientist (AI/ML Models & Training).
  * **Kalanidhiyan** - Frontend Developer (Visuals, 2D Schematics & UI).
  * **Anish** - Backend Developer (Booking Logic & Database Management).
  * **Sukhesh** - Research Lead (OBD-II Protocols & Documentation).

-----



