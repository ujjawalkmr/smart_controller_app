import mqtt from "mqtt";

const MQTT_BROKER = "wss://broker.hivemq.com:8884/mqtt";

const mqttClient = mqtt.connect(MQTT_BROKER, {
  clientId: `react_${Math.random().toString(16).slice(2)}`,
  clean: true,
  reconnectPeriod: 3000,
  connectTimeout: 10000,
  keepalive: 60,
});

mqttClient.on("connect", () => {
  console.log("✅ MQTT CONNECTED");
});

mqttClient.on("reconnect", () => {
  console.log("🔄 MQTT RECONNECTING");
});

mqttClient.on("close", () => {
  console.log("❌ MQTT DISCONNECTED");
});

mqttClient.on("error", (error) => {
  console.error("❌ MQTT ERROR:", error);
});

export default mqttClient;







// import mqtt from "mqtt";

// const MQTT_BROKER_URL = "ws://localhost:9001";

// const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
//   clientId: `react_${Math.random().toString(16).slice(2)}`,

//   clean: true,

//   reconnectPeriod: 1000,

//   connectTimeout: 30 * 1000,
// });

// mqttClient.on("connect", () => {
//   console.log("MQTT Connected");
// });

// mqttClient.on("reconnect", () => {
//   console.log("MQTT Reconnecting...");
// });

// mqttClient.on("error", (error) => {
//   console.error("MQTT Error:", error);
// });

// mqttClient.on("close", () => {
//   console.log("MQTT Disconnected");
// });

// export default mqttClient;










