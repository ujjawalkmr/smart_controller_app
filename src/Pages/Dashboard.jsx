import React, { useState, useEffect } from "react";

import { useDeviceContext } from "../context/DeviceContext";

import "../styles/Dashboard.css";
import devicesData from "../data/devices.json";
import Dropdown from "../Component/DropDown";
import DeviceControlCard from "../Component/DashboardComponent/DeviceControlCard";
import DeviceHeroCard from "../Component/DashboardComponent/DeviceHeroCard";
import CompressorControlCard from "../Component/DashboardComponent/CompressorControlCard";

const Dashboard = () => {
  const { deviceProvider, setSelectedDeviceProvider } = useDeviceContext();
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState("eco");
  const [loadingFetchAll, setLoadingFetchAll] = useState(false);
  const [devices, setDevices] = useState(devicesData.devices);
  const allKey = {
    devicePowerOnOff: "deviceSwitch",
  };
  const updateDevice = (deviceId, key, value) => {
    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.deviceId === deviceId
          ? {
              ...device,
              [key]: value,
            }
          : device,
      ),
    );

    console.log(`Updated device ${deviceId}: set ${key} to ${value} }`);
  };
  const updateSelectedDevice = (key, value) => {
    setSelectedDeviceProvider((currentDevice) => {
      if (!currentDevice) return null;

      return {
        ...currentDevice,
        [key]: value,
      };
    });
  };
  useEffect(() => {
    console.log("JSON data:", devicesData);
    console.log("JSON devices:", devicesData.devices);

    setDevices(devicesData.devices);
  }, []);

  useEffect(() => {
    console.log("Updated devices:", devices);
    console.log("Updated deviceProvider after power toggle:", deviceProvider);
  }, [devices]);

  const modeOptions = devices.map((device, index) => ({
    label: `${device.deviceId}`,
    value: `esp_${index + 1}`,
  }));
  const handleGetAllDeviceOnDropDown = () => {
    console.log("Dropdown opened");
  };
  const handleOnSelectedById = (val, label) => {
    console.log("Selected Compressor Mode:", label);
    const selectedDevice = devices.find((device) => device.deviceId === label);

    setSelectedDeviceId(val);
    setSelectedDeviceProvider(selectedDevice || null);
    console.log("Selected deviceProvider:", deviceProvider);
  };
  const handlePowerToggle = () => {
    const newPowerState = !isPowerOn;
    const powerValue = newPowerState ? "ON" : "OFF";

    console.log("Power toggled:", powerValue);

    setIsPowerOn(newPowerState);
    updateDevice(deviceProvider.deviceId, allKey.devicePowerOnOff, powerValue);
    updateSelectedDevice(allKey.devicePowerOnOff, powerValue);
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
          deviceProvider={deviceProvider}
          isPowerOn={isPowerOn}
          options={modeOptions}
          selectedDeviceId={selectedDeviceId}
          loading={loadingFetchAll}
          onDropdownOpen={handleGetAllDeviceOnDropDown}
          onDeviceChange={handleOnSelectedById}
          onPowerToggle={handlePowerToggle}
        />

        {/* Device control card Grid */}
        <section className="metrics-grid">
          {/* Power Consumption */}
          {/* <DeviceControlCard
            title="Power Usage"
            icon="⚡"
            value={isPowerOn && deviceProvider ? "14.2 W" : "0.0 W"}
            footer={
              isPowerOn && deviceProvider ? "Normal load" : "No power draw"
            }
          /> */}
          {/* <DeviceControlCard
            title="BLE Connections"
            icon="📶"
            value={isPowerOn && deviceProvider ? "3 Devices" : "0 Devices"}
            footer={
              isPowerOn && deviceProvider
                ? "1 ESP32 Provisioned"
                : "Bluetooth disabled"
            }
          /> */}
          {/* <DeviceControlCard
            title="Core Temp / Target"
            icon="🌡️"
            value={
              isPowerOn && deviceProvider
                ? `38.5°C (${targetTemp}°C)`
                : "21.0°C"
            }
            showTempControls
            targetValue={targetTemp}
            onDecrease={handleTempDecrease}
            onIncrease={handleTempIncrease}
            disabled={!isPowerOn || !deviceProvider}
          /> */}
          {/* <DeviceControlCard
            title="Uptime"
            icon="⏱️"
            value={isPowerOn && deviceProvider ? "04h 12m" : "00h 00m"}
            footer={
              isPowerOn && deviceProvider ? "Continuous session" : "Offline"
            }
          /> */}
        </section>

        {/* NEW: Interactive Device Controls Section */}
        {/* <CompressorControlCard
          isPowerOn={isPowerOn}
          compressorSpeed={compressorSpeed}
          onSpeedChange={setCompressorSpeed}
        /> */}
      </main>
    </div>
  );
};

export default Dashboard;
