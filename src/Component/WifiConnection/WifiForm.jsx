function WifiForm({
  ssid,
  password,

  setSsid,
  setPassword,

  wifiStatus,

  sending,
  removingWiFi,

  sendWifiCredentials,
  removeWiFiFromESP32,
}) {

  return (

    <div className="wifi-section">

      {/* =================================================
          TITLE
      ================================================= */}

      <h3>
        Connect ESP32 to Wi-Fi
      </h3>


      <p>
        Enter the Wi-Fi network that your
        ESP32 should connect to.
      </p>


      {/* =================================================
          WIFI NAME
      ================================================= */}

      <input
        type="text"
        placeholder="Wi-Fi name"

        value={ssid}

        onChange={(e) =>
          setSsid(e.target.value)
        }

        disabled={
          sending ||
          removingWiFi
        }
      />


      {/* =================================================
          WIFI PASSWORD
      ================================================= */}

      <input
        type="password"
        placeholder="Wi-Fi password"

        value={password}

        onChange={(e) =>
          setPassword(e.target.value)
        }

        disabled={
          sending ||
          removingWiFi
        }
      />


      {/* =================================================
          CONNECT WIFI BUTTON
      ================================================= */}

      <button
        className="wifi-button"

        onClick={
          sendWifiCredentials
        }

        disabled={
          sending ||
          removingWiFi
        }
      >

        {sending
          ? "Connecting..."
          : "Connect to Wi-Fi"}

      </button>


      {/* =================================================
          CONNECTING
      ================================================= */}

      {wifiStatus === "CONNECTING" && (

        <div className="wifi-status">

          Connecting to Wi-Fi...

        </div>

      )}


      {/* =================================================
          CONNECTED
      ================================================= */}

      {wifiStatus === "CONNECTED" && (

        <div className="wifi-status">

          Wi-Fi connected successfully ✓

        </div>

      )}


      {/* =================================================
          FAILED
      ================================================= */}

      {wifiStatus === "FAILED" && (

        <div className="wifi-status">

          Wi-Fi connection failed ❌

        </div>

      )}


      {/* =================================================
          NOT CONNECTED
      ================================================= */}

      {wifiStatus === "NOT_CONNECTED" && (

        <div className="wifi-status">

          Wi-Fi not connected

        </div>

      )}


      {/* =================================================
          FORGET WIFI
      ================================================= */}

      <button
        className="remove-wifi-button"

        onClick={
          removeWiFiFromESP32
        }

        disabled={
          removingWiFi ||
          sending
        }
      >

        {removingWiFi
          ? "Removing Wi-Fi..."
          : "Forget Wi-Fi"}

      </button>

    </div>

  );

}

export default WifiForm;