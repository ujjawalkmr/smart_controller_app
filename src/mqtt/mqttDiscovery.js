import mqttClient from "./mqttClient";
import { MQTT_TOPICS } from "./mqttTopics";

export const startDiscovery = (onDeviceFound) => {
  mqttClient.subscribe(
    MQTT_TOPICS.DISCOVERY,
    { qos: 1 },
    (error) => {
      if (error) {
        console.error("Discovery subscription failed:", error);
        return;
      }

      console.log(
        "Subscribed to:",
        MQTT_TOPICS.DISCOVERY
      );
    }
  );

  const handleMessage = (topic, message) => {
    if (!topic.startsWith("esp/discovery/")) {
      return;
    }

    try {
      const device = JSON.parse(message.toString());

      console.log("Device discovered:", device);

      onDeviceFound(device);
    } catch (error) {
      console.error(
        "Invalid discovery message:",
        error
      );
    }
  };

  mqttClient.on("message", handleMessage);

  // Return cleanup function
  return () => {
    mqttClient.off("message", handleMessage);

    mqttClient.unsubscribe(MQTT_TOPICS.DISCOVERY);
  };
};