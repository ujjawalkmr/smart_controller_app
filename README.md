                    ┌──────────────┐
                    │    ESP32     │
                    │   ESP-001    │
                    └──────┬───────┘
                           │
                    Publish data
                           │
                           ▼
                 ┌──────────────────┐
                 │   MQTT BROKER    │
                 │     HiveMQ       │
                 └────────┬─────────┘
                          │
                          │
                          ▼
                  ┌───────────────┐
                  │ React Frontend│
                  └───────┬───────┘
                          │
                          │ User selects
                          │ ESP-001
                          ▼
                 ┌──────────────────┐
                 │ Selected Device  │
                 │    ESP-001       │
                 └────────┬─────────┘
                          │
                 Publish command
                          │
                          ▼
                 ┌──────────────────┐
                 │   MQTT BROKER    │
                 │     HiveMQ       │
                 └────────┬─────────┘
                          │
                          ▼
                    ┌──────────────┐
                    │    ESP32     │
                    │   ESP-001    │
                    └──────────────┘


                    src/
│
├── components/
│   ├── Navbar.jsx
│   ├── DeviceCard.jsx
│   ├── CustomerCard.jsx
│   └── DeviceControl.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Devices.jsx
│   ├── Customers.jsx
│   └── CustomerDevices.jsx
│
├── mqtt/
│   ├── mqttClient.js
│   ├── mqttTopics.js
│   └── mqttDiscovery.js
│
├── App.jsx
├── main.jsx
└── index.css