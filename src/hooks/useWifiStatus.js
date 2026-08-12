import { useEffect } from "react";

const useWifiStatus = ({
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

  disconnectESP32,
}) => {

  useEffect(() => {

    const handleWiFiStatus = (event) => {

      const esp32Status =
        event.detail;


      console.log(
        "Wi-Fi status received from ESP32:",
        esp32Status
      );


      // =================================================
      // CONNECTING
      // =================================================

      if (
        esp32Status === "CONNECTING"
      ) {

        setWifiStatus(
          "CONNECTING"
        );

        setStatus(
          "Connecting ESP32 to Wi-Fi..."
        );

        return;
      }


      // =================================================
      // CONNECTED
      // =================================================

      if (
        esp32Status === "CONNECTED"
      ) {

        setWifiStatus(
          "CONNECTED"
        );

        setStatus(
          "Wi-Fi connected successfully ✓"
        );

        setSending(false);

        return;
      }


      // =================================================
      // FAILED
      // =================================================

      if (
        esp32Status === "FAILED"
      ) {

        setWifiStatus(
          "FAILED"
        );

        setStatus(
          "Wi-Fi connection failed ❌"
        );

        setSending(false);

        return;
      }


      // =================================================
      // NOT CONNECTED
      // =================================================

      if (
        esp32Status === "NOT_CONNECTED"
      ) {

        setWifiStatus(
          "NOT_CONNECTED"
        );

        setStatus(
          "Wi-Fi not connected"
        );

        setSending(false);

        return;
      }


      // =================================================
      // DISCONNECTED
      //
      // ESP32 has confirmed that:
      //
      // SSID removed
      // Password removed
      // Wi-Fi disconnected
      // =================================================

      if (
        esp32Status === "DISCONNECTED"
      ) {

        console.log(
          "================================="
        );

        console.log(
          "ESP32 CONFIRMED WIFI REMOVED"
        );

        console.log(
          "================================="
        );


        // -------------------------------------------------
        // Wi-Fi status
        // -------------------------------------------------

        setWifiStatus(
          "NOT_CONNECTED"
        );


        // -------------------------------------------------
        // Confirmation message
        // -------------------------------------------------

        setStatus(
          "Wi-Fi disconnected successfully ✓"
        );


        // -------------------------------------------------
        // Stop loading
        // -------------------------------------------------

        setSending(false);

        setRemovingWiFi(false);


        // -------------------------------------------------
        // Disconnect Bluetooth
        // -------------------------------------------------

        if (device) {

          disconnectESP32(
            device
          );

        }


        // -------------------------------------------------
        // Clear BLE state
        // -------------------------------------------------

        setDevice(null);

        setServer(null);

        setSsidCharacteristic(null);

        setPasswordCharacteristic(null);

        setResetWiFiCharacteristic(null);


        // -------------------------------------------------
        // Clear Wi-Fi fields
        // -------------------------------------------------

        setSsid("");

        setPassword("");

        return;
      }

    };


    // ===================================================
    // ADD EVENT LISTENER
    // ===================================================

    window.addEventListener(
      "esp32-wifi-status",
      handleWiFiStatus
    );


    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {

      window.removeEventListener(
        "esp32-wifi-status",
        handleWiFiStatus
      );

    };

  }, [
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
    disconnectESP32,
  ]);

};

export default useWifiStatus;