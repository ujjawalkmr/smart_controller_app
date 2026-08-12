import { useState } from "react";
import "../styles/WifiConnection.css";

// =====================================================
// BLE UUIDs
// =====================================================

const SERVICE_UUID = "12345678-1234-1234-1234-123456789001";

const SSID_UUID = "12345678-1234-1234-1234-123456789002";

const PASSWORD_UUID = "12345678-1234-1234-1234-123456789003";

// NEW: Reset Wi-Fi characteristic
const RESET_WIFI_UUID = "12345678-1234-1234-1234-123456789004";

// =====================================================
// Component
// =====================================================

function WifiConnection() {
  // =====================================================
  // BLE device
  // =====================================================

  const [device, setDevice] = useState(null);

  // =====================================================
  // GATT server
  // =====================================================

  const [server, setServer] = useState(null);

  // =====================================================
  // BLE characteristics
  // =====================================================

  const [ssidCharacteristic, setSsidCharacteristic] = useState(null);

  const [passwordCharacteristic, setPasswordCharacteristic] = useState(null);

  // NEW: Reset Wi-Fi characteristic
  const [resetWiFiCharacteristic, setResetWiFiCharacteristic] = useState(null);

  // =====================================================
  // Wi-Fi details
  // =====================================================

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // UI status
  // =====================================================

  const [status, setStatus] = useState("Not connected");

  const [error, setError] = useState("");

  // =====================================================
  // Loading states
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
      // Check browser support
      if (!navigator.bluetooth) {
        throw new Error(
          "Web Bluetooth is not supported. Please use Google Chrome or Microsoft Edge.",
        );
      }

      // Open Bluetooth device picker
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [
          {
            name: "SmartHome-ESP32",
          },
        ],

        optionalServices: [SERVICE_UUID],
      });

      console.log("ESP32 found:", selectedDevice);

      // Save device
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

      // Connect GATT
      const gattServer = await selectedDevice.gatt.connect();

      console.log("GATT server connected:", gattServer);

      setServer(gattServer);

      // =================================================
      // Get BLE Service
      // =================================================

      const service = await gattServer.getPrimaryService(SERVICE_UUID);

      console.log("BLE service found:", service);

      // =================================================
      // Get SSID characteristic
      // =================================================

      const ssidChar = await service.getCharacteristic(SSID_UUID);

      console.log("SSID characteristic found:", ssidChar);

      // =================================================
      // Get Password characteristic
      // =================================================

      const passwordChar = await service.getCharacteristic(PASSWORD_UUID);

      console.log("Password characteristic found:", passwordChar);

      // =================================================
      // Get Reset Wi-Fi characteristic
      // =================================================

      const resetWiFiChar = await service.getCharacteristic(RESET_WIFI_UUID);

      console.log("Reset Wi-Fi characteristic found:", resetWiFiChar);

      // =================================================
      // Save characteristics
      // =================================================

      setSsidCharacteristic(ssidChar);

      setPasswordCharacteristic(passwordChar);

      setResetWiFiCharacteristic(resetWiFiChar);

      // Connected successfully
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
  // Send Wi-Fi credentials
  // =====================================================

  const sendWifiCredentials = async () => {
    setError("");

    // Check SSID
    if (!ssid.trim()) {
      setError("Please enter your Wi-Fi name.");

      return;
    }

    // Check password
    if (!password) {
      setError("Please enter your Wi-Fi password.");

      return;
    }

    // Check BLE characteristics
    if (!ssidCharacteristic || !passwordCharacteristic) {
      setError("ESP32 BLE characteristics are not available.");

      return;
    }

    try {
      setSending(true);

      setStatus("Sending Wi-Fi credentials...");

      // =================================================
      // Convert text to bytes
      // =================================================

      const encoder = new TextEncoder();

      const ssidData = encoder.encode(ssid.trim());

      const passwordData = encoder.encode(password);

      // =================================================
      // Send SSID
      // =================================================

      console.log("Sending SSID...");

      await ssidCharacteristic.writeValue(ssidData);

      console.log("SSID sent successfully");

      // Small delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // =================================================
      // Send Password
      // =================================================

      console.log("Sending password...");

      await passwordCharacteristic.writeValue(passwordData);

      console.log("Password sent successfully");

      // =================================================
      // Success
      // =================================================

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
  // FORGET / REMOVE WI-FI FROM ESP32
  // =====================================================

  const removeWiFiFromESP32 = async () => {
    setError("");

    if (!resetWiFiCharacteristic) {
      setError("Reset Wi-Fi characteristic is not available.");

      return;
    }

    try {
      setRemovingWiFi(true);

      setStatus("Removing Wi-Fi from ESP32...");

      // Convert RESET command to bytes
      const encoder = new TextEncoder();

      const resetData = encoder.encode("RESET");

      // Send RESET command
      await resetWiFiCharacteristic.writeValue(resetData);

      console.log("RESET command sent to ESP32");

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
      if (device && device.gatt && device.gatt.connected) {
        device.gatt.disconnect();
      }
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
  // Handle BLE disconnect
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

            {/* ========================================
                FORGET WI-FI BUTTON
            ======================================== */}

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

        {device && (
          <button
            className="disconnect-button"
            onClick={disconnectESP32}
          >
            Disconnect
          </button>
        )}

        {/* ============================================
            ERROR
        ============================================ */}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default WifiConnection;
