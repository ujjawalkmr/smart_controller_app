               ┌─────────────────────┐
             │    React Frontend   │
             │                     │
             │  ESP01 selected     │
             └──────────┬──────────┘
                        │
                 MQTT over WebSocket
                        │
                        ▼
               ┌─────────────────┐
               │   MQTT Broker   │
               └───────┬─────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       ESP01         ESP02        ESP03    