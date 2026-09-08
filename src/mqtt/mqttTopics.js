export const MQTT_TOPICS = {
  DISCOVERY: "esp/discovery/+",

  command: (deviceId) => `esp/${deviceId}/command`,

  status: (deviceId) => `esp/${deviceId}/status`,
};