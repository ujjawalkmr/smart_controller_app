import mqttClient from "../mqtt/mqttClient";
import { MQTT_TOPICS } from "../mqtt/mqttTopics";

function DeviceControl({ device }) {

  if (!device) {
    return <p>Select a device</p>;
  }

  const turnOn = () => {

    const topic = MQTT_TOPICS.command(
      device.deviceId
    );

    const message = {
      command: "ON",
    };

    mqttClient.publish(
      topic,
      JSON.stringify(message),
      {
        qos: 1,
      }
    );

    console.log(
      "Published:",
      topic,
      message
    );
  };

  const turnOff = () => {

    const topic = MQTT_TOPICS.command(
      device.deviceId
    );

    const message = {
      command: "OFF",
    };

    mqttClient.publish(
      topic,
      JSON.stringify(message),
      {
        qos: 1,
      }
    );

    console.log(
      "Published:",
      topic,
      message
    );
  };

  return (
    <div>

      <h2>
        {device.name}
      </h2>

      <p>
        Device ID: {device.deviceId}
      </p>

      <button onClick={turnOn}>
        ON
      </button>

      <button onClick={turnOff}>
        OFF
      </button>

    </div>
  );
}

export default DeviceControl;