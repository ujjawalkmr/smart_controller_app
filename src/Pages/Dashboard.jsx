import React, { useState, useEffect } from "react";
import {
  devicePowerUpdate,
  getAllDevices,
  getDeviceById,
} from "../api/services/deviceService";
import { useDeviceContext } from "../context/DeviceContext";

import "../styles/Dashboard.css";
import Dropdown from "../Component/DropDown";
import DeviceControlCard from "../Component/DashboardComponent/DeviceControlCard";
import DeviceHeroCard from "../Component/DashboardComponent/DeviceHeroCard";
import CompressorControlCard from "../Component/DashboardComponent/CompressorControlCard";

const Dashboard = () => {
  /// device provide which is storing device data.
  const { deviceProvider, setSelectedDeviceProvider } = useDeviceContext();
  // control for device on/off
  const [isPowerOn, setIsPowerOn] = useState(true);

  // New States for Controls
  const [targetTemp, setTargetTemp] = useState(24); // in °C
  const [compressorSpeed, setCompressorSpeed] = useState(50); // in %
  const [selectedDeviceId, setSelectedDeviceId] = useState("eco");

  /// dropdown list set
  const [devices, setDevices] = useState([]);
  /// loader for when fetching all device.
  const [loadingFetchAll, setLoadingFetchAll] = useState(true);
  const [isLoadingById, setIsLoadingById] = useState(true);
  useEffect(() => {
    console.log("Context selectedDevice:", deviceProvider);
  }, [deviceProvider]);


  const fetchDeviceById = async (deviceId) => {
    try {
      setIsLoadingById(true);
      const response = await getDeviceById(deviceId);
      setSelectedDeviceProvider(response);
      if (response.command.devicePower == "ON") {
        console.log("Fetched device by ID:", response);
        setIsPowerOn(true);
      } else {
        setIsPowerOn(false);
      }
      console.log("provider check :", deviceProvider);
    } catch (error) {
      console.error("Failed to fetch device by ID:", error);
    } finally {
      setIsLoadingById(false);
    }
  };


  const fetchDevices = async () => {
    try {
      const response = await getAllDevices();

      console.log("Devices:", response);

      setDevices(response || []);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setDevices([]);
    } finally {
      setLoadingFetchAll(false);
    }
  };


   const updateDevicePower = async (deviceName, devicePower) => {
    try {
      const response = await devicePowerUpdate(deviceName, devicePower);
      setSelectedDeviceProvider((prev) => ({
        ...prev,
        command: {
          ...prev.command,
          devicePower,
        },
      }));
    } catch (error) {
      console.error("Failed to update device power:", error);
    }
  };

  const modeOptions = devices.map((device, index) => ({
    label: device.deviceKey,
    value: `esp_${index + 1}`,
  }));
  const handleGetAllDeviceOnDropDown = () => {
    console.log("Dropdown opened");
    fetchDevices();
  };
  const handleOnChangeById = (val, label) => {
    console.log("Selected Compressor Mode:", label);
    setSelectedDeviceId(val);
    fetchDeviceById(label);
  };
 
  const handlePowerToggle = () => {
    console.log(
      "Power button clicked. Current state:",
      deviceProvider.deviceKey,
    );
    setIsPowerOn((prev) => !prev);
    const newPower = isPowerOn ? "OFF" : "ON";
    updateDevicePower(deviceProvider.deviceKey, newPower);
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

        <DeviceHeroCard
          isPowerOn={isPowerOn}
          options={modeOptions}
          selectedDeviceId={selectedDeviceId}
          loading={loadingFetchAll}
          onDropdownOpen={handleGetAllDeviceOnDropDown}
          onDeviceChange={handleOnChangeById}
          onPowerToggle={handlePowerToggle}
        />

        {/* Device control card Grid */}
        <section className="metrics-grid">
          {/* Power Consumption */}
          <DeviceControlCard
            title="Power Usage"
            icon="⚡"
            value={isPowerOn ? "14.2 W" : "0.0 W"}
            footer={isPowerOn ? "Normal load" : "No power draw"}
          />
          <DeviceControlCard
            title="BLE Connections"
            icon="📶"
            value={isPowerOn ? "3 Devices" : "0 Devices"}
            footer={isPowerOn ? "1 ESP32 Provisioned" : "Bluetooth disabled"}
          />
          <DeviceControlCard
            title="Core Temp / Target"
            icon="🌡️"
            value={isPowerOn ? `38.5°C (${targetTemp}°C)` : "21.0°C"}
            showTempControls
            targetValue={targetTemp}
            onDecrease={handleTempDecrease}
            onIncrease={handleTempIncrease}
            disabled={!isPowerOn}
          />
          <DeviceControlCard
            title="Uptime"
            icon="⏱️"
            value={isPowerOn ? "04h 12m" : "00h 00m"}
            footer={isPowerOn ? "Continuous session" : "Offline"}
          />
        </section>

        {/* NEW: Interactive Device Controls Section */}
        <CompressorControlCard
          isPowerOn={isPowerOn}
          compressorSpeed={compressorSpeed}
          onSpeedChange={setCompressorSpeed}
        />
      </main>
    </div>
  );
};

export default Dashboard;
