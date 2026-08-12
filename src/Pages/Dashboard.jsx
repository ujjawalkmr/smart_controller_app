import React, { useState } from "react";
import { deviceOnOff } from "../api/services/deviceService";

import "../styles/Dashboard.css";

const Dashboard = () => {
    const [isPowerOn, setIsPowerOn] = useState(true);
    
//      useEffect(() => {

//     const getDeviceStatus = async () => {

//       try {

//         const response = await axios.get(
//           `http://localhost:5000/api/devices/${deviceId}/status`
//         );

//         console.log(
//           "Device status:",
//           response.data
//         );

//         setIsPowerOn(
//           response.data.power === "ON"
//         );

//       } catch (error) {

//         console.error(
//           "Failed to get device status:",
//           error
//         );

//       }

//     };

//     getDeviceStatus();

//   }, [deviceId]);

    
  
   const togglePower = async () => {

    const newState = !isPowerOn;

    const power = newState
      ? "ON"
      : "OFF";


    try {

      const response = await deviceOnOff(power);

      console.log(
        "Command response:",
        response.data
      );


      // Update UI after API succeeds
      setIsPowerOn(newState);

    } catch (error) {

      console.error(
        "Failed to control device:",
        error
      );

    }
  };

  return (
    <div className="dashboard-layout">
     

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header Banner */}
        <header className="dash-header">
          <div>
            <span className="subtitle">Smart Operations Center</span>
            <h1>Apex Control Dashboard</h1>
          </div>

          <div className={`status-pill ${isPowerOn ? "online" : "offline"}`}>
            <span className="status-dot"></span>
            {isPowerOn ? "System Online" : "Standby Mode"}
          </div>
        </header>

        {/* Hero Control Card with On/Off Button */}
        <section className={`hero-card ${isPowerOn ? "active-glow" : "muted"}`}>
          <div className="hero-info">
            <h2>Main Device Hub</h2>
            <p>
              {isPowerOn
                ? "ESP32 Controller active and broadcasting telemetry data."
                : "System is powering down. Telemetry paused."}
            </p>
          </div>

          <div className="power-control">
            <button
              className={`power-btn ${isPowerOn ? "on" : "off"}`}
              onClick={togglePower}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </button>
            <span className="power-label">
              {isPowerOn ? "POWER ON" : "POWER OFF"}
            </span>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="metrics-grid">
          {/* Power Consumption */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Power Usage</span>
              <span className="metric-icon">⚡</span>
            </div>
            <div className="metric-value">
              {isPowerOn ? "14.2 W" : "0.0 W"}
            </div>
            <div className="metric-footer">
              {isPowerOn ? "Normal load" : "No power draw"}
            </div>
          </div>

          {/* Connected Nodes */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">BLE Connections</span>
              <span className="metric-icon">📶</span>
            </div>
            <div className="metric-value">{isPowerOn ? "3 Devices" : "0 Devices"}</div>
            <div className="metric-footer">
              {isPowerOn ? "1 ESP32 Provisioned" : "Bluetooth disabled"}
            </div>
          </div>

          {/* Temperature */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Core Temp</span>
              <span className="metric-icon">🌡️</span>
            </div>
            <div className="metric-value">{isPowerOn ? "38.5°C" : "21.0°C"}</div>
            <div className="metric-footer">
              {isPowerOn ? "Optimal temperature" : "Ambient level"}
            </div>
          </div>

          {/* System Uptime */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Uptime</span>
              <span className="metric-icon">⏱️</span>
            </div>
            <div className="metric-value">
              {isPowerOn ? "04h 12m" : "00h 00m"}
            </div>
            <div className="metric-footer">
              {isPowerOn ? "Continuous session" : "Offline"}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;