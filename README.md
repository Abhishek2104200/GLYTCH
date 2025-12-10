# 🚗 GLYTCH AutoSync

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-2.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![React](https://img.shields.io/badge/React-18-cyan)

> **Proactive Vehicle Intelligence. Real-time Diagnostics. Zero Anxiety.**

GLYTCH AutoSync transforms vehicle ownership from reactive to proactive. By combining a **3D Digital Twin**, **Real-Time Telemetry**, and **AI Predictive Maintenance**, we empower drivers to understand their car's health instantly and automate service bookings before a breakdown occurs.

---

## 🌟 Key Features

* **🏎️ 3D Digital Twin**: Interactive, real-time 3D visualization of the vehicle state.
* **📡 Real-Time Telemetry**: WebSocket-powered streaming of RPM, Speed, and Temperature data.
* **🤖 AI Diagnostics Agent**: A Gemini-style chat assistant that explains OBD-II fault codes in plain English.
* **🔮 Predictive Maintenance**: Neural Network (TensorFlow/Keras) that calculates failure probability based on mileage and history.
* **🗣️ Voice Alert System**: Critical faults trigger an immediate voice call to the driver with actionable advice.
* **📅 Automated Booking**: One-click service slot booking when critical issues are detected.

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

## 📂 Project Structure

```bash
GLYTCH/
├── backend/
│   ├── data/
│   │   └── obd_simulation.csv    # Simulated vehicle telemetry data
│   ├── ml_models/
│   │   ├── vehicle_model.keras   # Trained Neural Network
│   │   ├── scaler.pkl            # Data Scaler
│   │   └── model_columns.pkl     # Feature mapping
│   ├── venv/                     # Python Virtual Environment
│   ├── main.py                   # FastAPI Entry Point (HTTP + WebSocket)
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
