import React, { useState, useEffect } from "react";
import { deviceOnOff, getAllDevices } from "../api/services/deviceService";

import "../styles/Dashboard.css";
import Dropdown from "../Component/DropDown";

const Dashboard = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);

  // New States for Controls
  const [targetTemp, setTargetTemp] = useState(24); // in °C
  const [compressorSpeed, setCompressorSpeed] = useState(50); // in %
  const [compressorMode, setCompressorMode] = useState("eco");

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const response = await getAllDevices();

      console.log("Devices:", response);

      setDevices(response || []);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);
  // const modeOptions = [
  //   { label: "Eco Mode (Energy Saver)", value: "eco" },
  //   { label: "Performance Mode", value: "perf" },
  //   { label: "Turbo Mode", value: "turbo" },
  //   { label: "Silent Mode", value: "silent" },
  // ];
  const modeOptions = devices.map((device, index) => ({
    label: device.deviceKey,
    value: `esp_${index + 1}`,
  }));

  const handleToggle = () => {
    setIsPowerOn((prev) => !prev);
  };

  // Temperature adjustment handlers
  const handleTempIncrease = () => {
    if (isPowerOn && targetTemp < 40) {
      setTargetTemp((prev) => prev + 1);
    }
  };

  const handleTempDecrease = () => {
    if (isPowerOn && targetTemp > 16) {
      setTargetTemp((prev) => prev - 1);
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
            <Dropdown
              label=""
              options={
                loading ? [{ label: "Please wait...", value: "" }] : modeOptions
              }
              value={compressorMode}
              onTapOpenDropdown={() => {
                console.log("Dropdown opened");
                fetchDevices();
              }}
              onChange={(val) => {
                setCompressorMode(val);
                console.log("Selected Compressor Mode:", val);
              }}
              // onChange={(val) => setCompressorMode(val)}
              size="md"
              style={{ width: "350px" }}
            />
            {/* <h2>Main Device Hub</h2> */}
            <p>
              {isPowerOn
                ? "ESP32 Controller active and broadcasting telemetry data."
                : "System is powering down. Telemetry paused."}
            </p>
          </div>

          <div className="power-control">
            <button
              className={`power-btn ${isPowerOn ? "on" : "off"}`}
              onClick={handleToggle}
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
                <line
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="12"
                />
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
            <div className="metric-value">{isPowerOn ? "14.2 W" : "0.0 W"}</div>
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
            <div className="metric-value">
              {isPowerOn ? "3 Devices" : "0 Devices"}
            </div>
            <div className="metric-footer">
              {isPowerOn ? "1 ESP32 Provisioned" : "Bluetooth disabled"}
            </div>
          </div>

          {/* Temperature with inline adjusters */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Core Temp / Target</span>
              <span className="metric-icon">🌡️</span>
            </div>
            <div className="metric-value">
              {isPowerOn ? `38.5°C (${targetTemp}°C)` : "21.0°C"}
            </div>
            <div className="temp-control-buttons">
              <button
                className="btn-step"
                onClick={handleTempDecrease}
                disabled={!isPowerOn}
              >
                -
              </button>
              <span className="target-label">Target: {targetTemp}°C</span>
              <button
                className="btn-step"
                onClick={handleTempIncrease}
                disabled={!isPowerOn}
              >
                +
              </button>
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

        {/* NEW: Interactive Device Controls Section */}
        <section className="controls-grid">
          {/* Compressor Speed Controller */}
          <div className={`control-card ${!isPowerOn ? "disabled" : ""}`}>
            <div className="control-header">
              <h3>Compressor Speed</h3>
              <span className="control-value">
                {isPowerOn ? `${compressorSpeed}%` : "OFF"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={isPowerOn ? compressorSpeed : 0}
              onChange={(e) => setCompressorSpeed(e.target.value)}
              disabled={!isPowerOn}
              className="slider"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
