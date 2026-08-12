function DeviceInfo({
  device,
  server,
}) {

  return (

    <div className="device-card">

      {/* =================================================
          DEVICE ICON
      ================================================= */}

      <div className="device-icon">
        ⚡
      </div>


      {/* =================================================
          DEVICE INFORMATION
      ================================================= */}

      <div className="device-info">

        <h3>
          {device.name ||
            "SmartHome-ESP32"}
        </h3>


        <p>
          Bluetooth device
        </p>


        <p className="device-id">
          ID: {device.id}
        </p>

      </div>


      {/* =================================================
          BLE STATUS
      ================================================= */}

      {server && (

        <div className="connected">
          BLE Connected ✓
        </div>

      )}

    </div>

  );

}

export default DeviceInfo;