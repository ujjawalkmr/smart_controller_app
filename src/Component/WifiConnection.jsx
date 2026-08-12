import { useState } from "react";

import "../styles/WifiConnection.css";

// =====================================================
// BLE SERVICE
// =====================================================

import {
  findESP32 as findESP32Service,
  connectToESP32 as connectToESP32Service,
  sendWifiCredentials as sendWifiCredentialsService,
  resetWiFi as resetWiFiService,
  disconnectESP32 as disconnectESP32Service,
} from "../api/services/bluetoothService";

// =====================================================
// COMPONENTS
// =====================================================

import DeviceInfo from "../Component/WifiConnection/DeviceInfo.jsx";

import WifiForm from "../Component/WifiConnection/WifiForm.jsx";

// =====================================================
// HOOK
// =====================================================

import useWifiStatus from "../hooks/useWifiStatus";

// =====================================================
// COMPONENT
// =====================================================

function WifiConnection() {
  // =====================================================
  // BLE STATE
  // =====================================================

  const [device, setDevice] = useState(null);

  const [server, setServer] = useState(null);

  const [ssidCharacteristic, setSsidCharacteristic] = useState(null);

  const [passwordCharacteristic, setPasswordCharacteristic] = useState(null);

  const [resetWiFiCharacteristic, setResetWiFiCharacteristic] = useState(null);

  // =====================================================
  // WIFI STATE
  // =====================================================

  const [ssid, setSsid] = useState("");

  const [password, setPassword] = useState("");

  const [wifiStatus, setWifiStatus] = useState("NOT_CONNECTED");

  // =====================================================
  // GENERAL UI STATE
  // =====================================================

  const [status, setStatus] = useState("Not connected");

  const [error, setError] = useState("");

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [connecting, setConnecting] = useState(false);

  const [sending, setSending] = useState(false);

  const [removingWiFi, setRemovingWiFi] = useState(false);

  // =====================================================
  // BLE DISCONNECTED
  // =====================================================

  const handleDisconnect = () => {
    console.log("ESP32 Bluetooth disconnected");

    setDevice(null);

    setServer(null);

    setSsidCharacteristic(null);

    setPasswordCharacteristic(null);

    setResetWiFiCharacteristic(null);

    setWifiStatus("NOT_CONNECTED");

    setSending(false);

    setStatus("ESP32 disconnected");
  };

  // =====================================================
  // FIND ESP32
  // =====================================================

  const findESP32 = async () => {
    setError("");

    setStatus("Searching for ESP32...");

    setConnecting(true);

    try {
      const selectedDevice = await findESP32Service();

      console.log("ESP32 found:", selectedDevice);

      setDevice(selectedDevice);

      setStatus(`Found: ${selectedDevice.name || "SmartHome-ESP32"}`);

      // -------------------------------------------------
      // BLE disconnect listener
      // -------------------------------------------------

      selectedDevice.addEventListener(
        "gattserverdisconnected",
        handleDisconnect,
      );

      // -------------------------------------------------
      // Connect
      // -------------------------------------------------

      await connectToESP32(selectedDevice);
    } catch (error) {
      console.error("Bluetooth error:", error);

      if (error.name === "NotFoundError") {
        setStatus("No ESP32 selected");
      } else {
        setStatus("Connection failed");

        setError(error.message);
      }
    } finally {
      setConnecting(false);
    }
  };

  // =====================================================
  // CONNECT ESP32
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

        wifiStatusCharacteristic: wifiStatusChar,
      } = await connectToESP32Service(selectedDevice);

      console.log("GATT server:", gattServer);

      console.log("SSID characteristic:", ssidChar);

      console.log("Password characteristic:", passwordChar);

      console.log("RESET characteristic:", resetWiFiChar);

      console.log("STATUS characteristic:", wifiStatusChar);

      // -------------------------------------------------
      // Save characteristics
      // -------------------------------------------------

      setServer(gattServer);

      setSsidCharacteristic(ssidChar);

      setPasswordCharacteristic(passwordChar);

      setResetWiFiCharacteristic(resetWiFiChar);

      setWifiStatus("NOT_CONNECTED");

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
  // SEND WIFI CREDENTIALS
  // =====================================================

  const sendWifiCredentials = async () => {
    setError("");

    // ---------------------------------------------------
    // Validate SSID
    // ---------------------------------------------------

    if (!ssid.trim()) {
      setError("Please enter Wi-Fi name.");

      return;
    }

    // ---------------------------------------------------
    // Validate password
    // ---------------------------------------------------

    if (!password.trim()) {
      setError("Please enter Wi-Fi password.");

      return;
    }

    // ---------------------------------------------------
    // Check BLE characteristics
    // ---------------------------------------------------

    if (!ssidCharacteristic) {
      setError("SSID characteristic not available.");

      return;
    }

    if (!passwordCharacteristic) {
      setError("Password characteristic not available.");

      return;
    }

    try {
      setSending(true);

      setWifiStatus("CONNECTING");

      setStatus("Sending Wi-Fi credentials...");

      // -------------------------------------------------
      // Send SSID + password
      // -------------------------------------------------

      await sendWifiCredentialsService(
        ssidCharacteristic,

        passwordCharacteristic,

        ssid,

        password,
      );

      // -------------------------------------------------
      // IMPORTANT
      //
      // Do not set CONNECTED here.
      //
      // ESP32 will send:
      //
      // CONNECTING
      // CONNECTED
      // FAILED
      // -------------------------------------------------

      setStatus("Credentials sent. Connecting...");
    } catch (error) {
      console.error("Wi-Fi provisioning error:", error);

      setWifiStatus("FAILED");

      setStatus("Failed to send Wi-Fi credentials");

      setError(error.message);

      setSending(false);
    }
  };

  // =====================================================
  // REMOVE WIFI
  // =====================================================

  const removeWiFiFromESP32 = async () => {
    setError("");

    // -------------------------------------------------
    // Check RESET characteristic
    // -------------------------------------------------

    if (!resetWiFiCharacteristic) {
      console.log("Reset Wi-Fi characteristic not available");

      setError("Reset Wi-Fi characteristic not available");

      return;
    }

    try {
      setRemovingWiFi(true);

      setStatus("Removing Wi-Fi from ESP32...");

      // ------------------------------------------------
      // Send RESET
      // ------------------------------------------------

      await resetWiFiService(resetWiFiCharacteristic);

      console.log("RESET command sent");

      // ------------------------------------------------
      // IMPORTANT
      //
      // Do NOT clear UI here.
      //
      // Wait for:
      //
      // ESP32 → DISCONNECTED
      //
      // The hook will handle it.
      // ------------------------------------------------
    } catch (error) {
      console.error("Failed to remove Wi-Fi:", error);

      setStatus("Failed to remove Wi-Fi");

      setError(error.message);

      setRemovingWiFi(false);
    }
  };

  // =====================================================
  // WIFI STATUS HOOK
  // =====================================================

  useWifiStatus({
    device,

    setDevice,

    setServer,

    setSsidCharacteristic,

    setPasswordCharacteristic,

    setResetWiFiCharacteristic,

    setWifiStatus,

    setStatus,

    setSending,

    setRemovingWiFi,

    setSsid,

    setPassword,

    disconnectESP32: disconnectESP32Service,
  });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">
      <div className="container">
        {/* =============================================
            TITLE
        ============================================= */}

        <h1>Smart Home</h1>

        <h2>Add Device</h2>

        {/* =============================================
            GENERAL STATUS
        ============================================= */}

        <p className="status">Status: {status}</p>

        {/* =============================================
            FIND ESP32
        ============================================= */}

        {!device && (
          <button
            className="scan-button"
            onClick={findESP32}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Find ESP32"}
          </button>
        )}

        {/* =============================================
            DEVICE INFORMATION
        ============================================= */}

        {device && (
          <DeviceInfo
            device={device}
            server={server}
          />
        )}

        {/* =============================================
            WIFI FORM
        ============================================= */}

        {device && server && (
          <WifiForm
            ssid={ssid}
            password={password}
            setSsid={setSsid}
            setPassword={setPassword}
            wifiStatus={wifiStatus}
            sending={sending}
            removingWiFi={removingWiFi}
            sendWifiCredentials={sendWifiCredentials}
            removeWiFiFromESP32={removeWiFiFromESP32}
          />
        )}

        {/* =============================================
            DISCONNECT BUTTON
        ============================================= */}

        {/* {device && (
          <button
            className="disconnect-button"
            onClick={removeWiFiFromESP32}
            disabled={removingWiFi || sending || !resetWiFiCharacteristic}
          >
            {removingWiFi ? "Disconnecting..." : "Disconnect"}
          </button>
        )} */}
         <button
            className="disconnect-button"
            onClick={removeWiFiFromESP32}
            disabled={removingWiFi || sending }
          >
            {removingWiFi ? "Disconnecting..." : "Disconnect"}
          </button>

        {/* =============================================
            ERROR
        ============================================= */}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default WifiConnection;
