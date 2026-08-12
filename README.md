import { useState } from "react";

import "../styles/WifiConnection.css";

import {
  findESP32 as findESP32Service,
  connectToESP32 as connectToESP32Service,
  sendWifiCredentials as sendWifiCredentialsService,
  resetWiFi as resetWiFiService,
  disconnectESP32 as disconnectESP32Service,
} from "../api/services/bluetoothService";

function WifiConnection() {
  // =====================================================
  // BLE Device
  // =====================================================

  const [device, setDevice] = useState(null);

  // =====================================================
  // GATT Server
  // =====================================================

  const [server, setServer] = useState(null);

  // =====================================================
  // BLE Characteristics
  // =====================================================

  const [ssidCharacteristic, setSsidCharacteristic] = useState(null);

  const [passwordCharacteristic, setPasswordCharacteristic] = useState(null);

  const [resetWiFiCharacteristic, setResetWiFiCharacteristic] = useState(null);

  // =====================================================
  // Wi-Fi Details
  // =====================================================

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // UI Status
  // =====================================================

  const [status, setStatus] = useState("Not connected");
  const [error, setError] = useState("");

  // =====================================================
  // Loading States
  // =====================================================

  const [connecting, setConnecting] = useState(false);
  const [sending, setSending] = useState(false);
  const [removingWiFi, setRemovingWiFi] = useState(false);

  // =====================================================
  // Find ESP32
  // =====================================================

  const findESP32 = async () => {
    setError("");
    setStatus("Searching for ESP32...");

    try {
      const selectedDevice = await findESP32Service();

      console.log("ESP32 found:", selectedDevice);

      setDevice(selectedDevice);

      setStatus(`Found: ${selectedDevice.name || "SmartHome-ESP32"}`);

      // Listen for disconnect
      selectedDevice.addEventListener(
        "gattserverdisconnected",
        handleDisconnect,
      );

      // Connect
      await connectToESP32(selectedDevice);
    } catch (error) {
      console.error("Bluetooth error:", error);

      if (error.name === "NotFoundError") {
        setStatus("No ESP32 selected");
      } else {
        setStatus("Connection failed");
        setError(error.message);
      }
    }
  };

  // =====================================================
  // Connect to ESP32
  // =====================================================

  const connectToESP32 = async (selectedDevice) => {
    try {
      setConnecting(true);
      setError("");
      setStatus("Connecting to ESP32...");

      const {
        server: gattServer,
        ssidCharacteristic: ssidChar,
        passwordCharacteristic: passwordChar,
        resetWiFiCharacteristic: resetWiFiChar,
      } = await connectToESP32Service(selectedDevice);

      console.log("GATT server connected:", gattServer);

      console.log("BLE characteristics found");

      setServer(gattServer);

      setSsidCharacteristic(ssidChar);
      setPasswordCharacteristic(passwordChar);
      setResetWiFiCharacteristic(resetWiFiChar);

      setStatus("ESP32 connected ✓");
    } catch (error) {
      console.error("Connection error:", error);

      setStatus("Failed to connect");
      setError(error.message);
    } finally {
      setConnecting(false);
    }
  };

  // =====================================================
  // Send Wi-Fi Credentials
  // =====================================================

  const sendWifiCredentials = async () => {
    setError("");

    try {
      setSending(true);

      setStatus("Sending Wi-Fi credentials...");

      await sendWifiCredentialsService(
        ssidCharacteristic,
        passwordCharacteristic,
        ssid,
        password,
      );

      setStatus("Wi-Fi credentials sent ✓");
    } catch (error) {
      console.error("Wi-Fi provisioning error:", error);

      setStatus("Failed to send Wi-Fi credentials");

      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // Remove Wi-Fi
  // =====================================================

  const removeWiFiFromESP32 = async () => {
    setError("");

    try {
      setRemovingWiFi(true);

      setStatus("Removing Wi-Fi from ESP32...");

      await resetWiFiService(resetWiFiCharacteristic);

      // Clear frontend Wi-Fi fields
      setSsid("");
      setPassword("");

      setStatus("Wi-Fi removed from ESP32 ✓");
    } catch (error) {
      console.error("Failed to remove Wi-Fi:", error);

      setStatus("Failed to remove Wi-Fi");

      setError(error.message);
    } finally {
      setRemovingWiFi(false);
    }
  };

  // =====================================================
  // Disconnect BLE
  // =====================================================

  const disconnectESP32 = () => {
      try {
        console.log("Disconnecting from ESP32...");
      disconnectESP32Service(device);
    } catch (error) {
      console.error("Disconnect error:", error);
    }

    // Clear frontend BLE state
    setDevice(null);
    setServer(null);

    setSsidCharacteristic(null);
    setPasswordCharacteristic(null);
    setResetWiFiCharacteristic(null);

    // Clear Wi-Fi form
    setSsid("");
    setPassword("");

    setStatus("Disconnected");
  };

  // =====================================================
  // Handle BLE Disconnect
  // =====================================================

  const handleDisconnect = () => {
    console.log("ESP32 disconnected");

    setDevice(null);
    setServer(null);

    setSsidCharacteristic(null);
    setPasswordCharacteristic(null);
    setResetWiFiCharacteristic(null);

    setStatus("ESP32 disconnected");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">
      <div className="container">
        <h1>Smart Home</h1>

        <h2>Add Device</h2>

        {/* ============================================
            STATUS
        ============================================ */}

        <p className="status">Status: {status}</p>

        {/* ============================================
            FIND ESP32
        ============================================ */}

        {!device && (
          <button
            className="scan-button"
            onClick={findESP32}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Find ESP32"}
          </button>
        )}

        {/* ============================================
            DEVICE INFORMATION
        ============================================ */}

        {device && (
          <div className="device-card">
            <div className="device-icon">⚡</div>

            <div className="device-info">
              <h3>{device.name || "SmartHome-ESP32"}</h3>

              <p>Bluetooth device</p>

              <p className="device-id">ID: {device.id}</p>
            </div>

            {server && <div className="connected">Connected ✓</div>}
          </div>
        )}

        {/* ============================================
            WIFI FORM
        ============================================ */}

        {device && server && (
          <div className="wifi-section">
            <h3>Connect ESP32 to Wi-Fi</h3>

            <p>Enter the Wi-Fi network that your ESP32 should connect to.</p>

            {/* Wi-Fi name */}

            <input
              type="text"
              placeholder="Wi-Fi name"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              disabled={sending || removingWiFi}
            />

            {/* Wi-Fi password */}

            <input
              type="password"
              placeholder="Wi-Fi password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={sending || removingWiFi}
            />

            {/* Send button */}

            <button
              className="wifi-button"
              onClick={sendWifiCredentials}
              disabled={sending || removingWiFi}
            >
              {sending ? "Sending..." : "Connect to Wi-Fi"}
            </button>

            {/* Forget Wi-Fi */}

            <button
              className="remove-wifi-button"
              onClick={removeWiFiFromESP32}
              disabled={removingWiFi || sending}
            >
              {removingWiFi ? "Removing Wi-Fi..." : "Forget Wi-Fi"}
            </button>
          </div>
        )}

        {/* ============================================
            DISCONNECT BLE
        ============================================ */}
        <h1>Disconnect ESP32</h1>
        {/* {device && ( */}
        <button
          className="disconnect-button"
          onClick={removeWiFiFromESP32}
        >
          Disconnect
        </button>
        {/* )} */}

        {/* ============================================
            ERROR
        ============================================ */}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default WifiConnection;
