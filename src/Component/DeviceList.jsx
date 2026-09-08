import { useEffect, useState } from "react";
import { startDiscovery } from "../mqtt/mqttDiscovery";

function DeviceList({ onSelectDevice }) {

  const [devices, setDevices] = useState([]);

  useEffect(() => {

    const cleanup = startDiscovery((device) => {

      setDevices((previousDevices) => {

        const exists = previousDevices.some(
          (item) => item.deviceId === device.deviceId
        );

        if (exists) {

          return previousDevices.map((item) =>
            item.deviceId === device.deviceId
              ? device
              : item
          );

        }

        return [...previousDevices, device];

      });

    });

    return cleanup;

  }, []);

  return (
    <div>

      <h2>My ESP Devices</h2>

      {devices.length === 0 && (
        <p>Searching for devices...</p>
      )}

      {devices.map((device) => (

        <div
          key={device.deviceId}
          onClick={() => onSelectDevice(device)}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >

          <h3>{device.name}</h3>

          <p>
            Device ID: {device.deviceId}
          </p>

        </div>

      ))}

    </div>
  );
}

export default DeviceList;