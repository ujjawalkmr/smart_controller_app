// =====================================================
// BLE UUIDs
// =====================================================

const SERVICE_UUID =
  "12345678-1234-1234-1234-123456789001";

const SSID_UUID =
  "12345678-1234-1234-1234-123456789002";

const PASSWORD_UUID =
  "12345678-1234-1234-1234-123456789003";

const RESET_WIFI_UUID =
  "12345678-1234-1234-1234-123456789004";

const WIFI_STATUS_UUID =
  "12345678-1234-1234-1234-123456789005";


// =====================================================
// FIND ESP32
// =====================================================

export const findESP32 = async () => {
  const device =
    await navigator.bluetooth.requestDevice({
      filters: [
        {
          name: "SmartHome-ESP32",
        },
      ],

      optionalServices: [
        SERVICE_UUID,
      ],
    });

  return device;
};


// =====================================================
// CONNECT TO ESP32
// =====================================================

export const connectToESP32 = async (device) => {

  if (!device) {
    throw new Error(
      "ESP32 device is not available"
    );
  }

  // ---------------------------------------------------
  // Connect GATT
  // ---------------------------------------------------

  const server =
    await device.gatt.connect();

  console.log(
    "GATT server connected"
  );


  // ---------------------------------------------------
  // Get service
  // ---------------------------------------------------

  const service =
    await server.getPrimaryService(
      SERVICE_UUID
    );


  console.log(
    "BLE service found"
  );


  // ---------------------------------------------------
  // SSID characteristic
  // ---------------------------------------------------

  const ssidCharacteristic =
    await service.getCharacteristic(
      SSID_UUID
    );


  // ---------------------------------------------------
  // Password characteristic
  // ---------------------------------------------------

  const passwordCharacteristic =
    await service.getCharacteristic(
      PASSWORD_UUID
    );


  // ---------------------------------------------------
  // Reset Wi-Fi characteristic
  // ---------------------------------------------------

  const resetWiFiCharacteristic =
    await service.getCharacteristic(
      RESET_WIFI_UUID
    );


  // ---------------------------------------------------
  // Wi-Fi status characteristic
  // ---------------------------------------------------

  const wifiStatusCharacteristic =
    await service.getCharacteristic(
      WIFI_STATUS_UUID
    );


  // ---------------------------------------------------
  // Start notifications
  // ---------------------------------------------------

  await wifiStatusCharacteristic
    .startNotifications();


  // ---------------------------------------------------
  // Listen for ESP32 status
  // ---------------------------------------------------

  wifiStatusCharacteristic.addEventListener(
    "characteristicvaluechanged",
    (event) => {

      const decoder =
        new TextDecoder();

      const status =
        decoder.decode(
          event.target.value
        );

      console.log(
        "ESP32 Wi-Fi status:",
        status
      );


      // Send status to React
      window.dispatchEvent(
        new CustomEvent(
          "esp32-wifi-status",
          {
            detail: status,
          }
        )
      );
    }
  );


  console.log(
    "All BLE characteristics found"
  );


  // ---------------------------------------------------
  // Return everything
  // ---------------------------------------------------

  return {

    server,

    ssidCharacteristic,

    passwordCharacteristic,

    resetWiFiCharacteristic,

    wifiStatusCharacteristic,

  };
};


// =====================================================
// SEND WIFI CREDENTIALS
// =====================================================

export const sendWifiCredentials = async (
  ssidCharacteristic,
  passwordCharacteristic,
  ssid,
  password
) => {

  if (!ssidCharacteristic) {
    throw new Error(
      "SSID characteristic not available"
    );
  }

  if (!passwordCharacteristic) {
    throw new Error(
      "Password characteristic not available"
    );
  }


  const encoder =
    new TextEncoder();


  // ---------------------------------------------------
  // Send SSID
  // ---------------------------------------------------

  await ssidCharacteristic.writeValue(
    encoder.encode(ssid)
  );


  console.log(
    "SSID sent to ESP32"
  );


  // ---------------------------------------------------
  // Send password
  // ---------------------------------------------------

  await passwordCharacteristic.writeValue(
    encoder.encode(password)
  );


  console.log(
    "Password sent to ESP32"
  );
};


// =====================================================
// RESET / REMOVE WIFI
// =====================================================

export const resetWiFi = async (
  resetWiFiCharacteristic
) => {

  if (!resetWiFiCharacteristic) {

    throw new Error(
      "Reset Wi-Fi characteristic not available"
    );

  }


  const encoder =
    new TextEncoder();


  await resetWiFiCharacteristic.writeValue(
    encoder.encode("RESET")
  );


  console.log(
    "RESET command sent to ESP32"
  );
};


// =====================================================
// DISCONNECT BLUETOOTH
// =====================================================

export const disconnectESP32 = (
  device
) => {

  if (!device) {
    console.log(
      "No ESP32 device to disconnect"
    );

    return;
  }


  if (
    device.gatt &&
    device.gatt.connected
  ) {

    console.log(
      "Disconnecting BLE..."
    );

    device.gatt.disconnect();

  }

};




















































// import {
//   ESP32_DEVICE_NAME,
//   SERVICE_UUID,
//   SSID_UUID,
//   PASSWORD_UUID,
//   RESET_WIFI_UUID,
// } from "../../config/bluetoothConfig.js";

// // =====================================================
// // Check Web Bluetooth Support
// // =====================================================

// export const checkBluetoothSupport = () => {
//   if (!navigator.bluetooth) {
//     throw new Error(
//       "Web Bluetooth is not supported. Please use Google Chrome or Microsoft Edge."
//     );
//   }
// };

// // =====================================================
// // Find ESP32
// // =====================================================

// export const findESP32 = async () => {
//   checkBluetoothSupport();

//   const device = await navigator.bluetooth.requestDevice({
//     filters: [
//       {
//         name: ESP32_DEVICE_NAME,
//       },
//     ],
//     optionalServices: [SERVICE_UUID],
//   });

//   return device;
// };

// // =====================================================
// // Connect to ESP32
// // =====================================================

// export const connectToESP32 = async (device) => {
//   if (!device) {
//     throw new Error("ESP32 device is not available.");
//   }

//   // Connect GATT
//   const server = await device.gatt.connect();

//   // Get BLE service
//   const service = await server.getPrimaryService(SERVICE_UUID);

//   // Get SSID characteristic
//   const ssidCharacteristic =
//     await service.getCharacteristic(SSID_UUID);

//   // Get password characteristic
//   const passwordCharacteristic =
//     await service.getCharacteristic(PASSWORD_UUID);

//   // Get reset Wi-Fi characteristic
//   const resetWiFiCharacteristic =
//     await service.getCharacteristic(RESET_WIFI_UUID);

//   return {
//     server,
//     ssidCharacteristic,
//     passwordCharacteristic,
//     resetWiFiCharacteristic,
//   };
// };

// // =====================================================
// // Send Wi-Fi Credentials
// // =====================================================

// export const sendWifiCredentials = async (
//   ssidCharacteristic,
//   passwordCharacteristic,
//   ssid,
//   password
// ) => {
//   if (!ssidCharacteristic || !passwordCharacteristic) {
//     throw new Error(
//       "ESP32 BLE characteristics are not available."
//     );
//   }

//   if (!ssid.trim()) {
//     throw new Error("Please enter your Wi-Fi name.");
//   }

//   if (!password) {
//     throw new Error("Please enter your Wi-Fi password.");
//   }

//   const encoder = new TextEncoder();

//   const ssidData = encoder.encode(ssid.trim());
//   const passwordData = encoder.encode(password);

//   // Send SSID
//   await ssidCharacteristic.writeValue(ssidData);

//   // Small delay
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   // Send password
//   await passwordCharacteristic.writeValue(passwordData);
// };

// // =====================================================
// // Reset / Remove Wi-Fi
// // =====================================================

// export const resetWiFi = async (resetWiFiCharacteristic) => {
//   if (!resetWiFiCharacteristic) {
//     throw new Error(
//       "Reset Wi-Fi characteristic is not available."
//     );
//   }

//   const encoder = new TextEncoder();

//   const resetData = encoder.encode("RESET");

//   await resetWiFiCharacteristic.writeValue(resetData);
// };

// // =====================================================
// // Disconnect ESP32
// // =====================================================

// export const disconnectESP32 = (device) => {
//   console.log("Disconnecting start from ESP32...");
//   if (device?.gatt?.connected) {
//     console.log("Disconnecting done...");
//     device.gatt.disconnect();
//   }
// };