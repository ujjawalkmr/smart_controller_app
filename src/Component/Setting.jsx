import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  // State for form controls
  const [formData, setFormData] = useState({
    deviceName: 'ESP32-Controller-01',
    wifiSsid: '',
    wifiPassword: '',
    ipMode: 'dhcp', // 'dhcp' or 'static'
    staticIp: '192.168.1.150',
    mqttServer: 'broker.hivemq.com',
    mqttPort: '1883',
    enableMqtt: true,
    telemetryInterval: 5,
  });

  const [statusMessage, setStatusMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Form Submission (Save to ESP)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Example: Replace with your actual API endpoint (e.g., fetch('http://192.168.4.1/api/settings', ...))
    console.log('Sending settings to ESP:', formData);
    
    setStatusMessage('Settings saved! Restarting controller...');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Handle ESP Reboot
  const handleReboot = () => {
    if (window.confirm('Are you sure you want to reboot the ESP controller?')) {
      console.log('Sending reboot command to ESP...');
      setStatusMessage('Reboot command sent!');
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <div className="esp-container">
      <div className="esp-card">
        <div className="esp-header">
          <h2>ESP Controller Settings</h2>
          <p>Configure network, MQTT, and device parameters</p>
        </div>

        {statusMessage && <div className="esp-alert">{statusMessage}</div>}

        <form onSubmit={handleSubmit} className="esp-form">
          {/* Section: General */}
          <div className="esp-section">
            <h3 className="esp-section-title">General Settings</h3>
            <div className="esp-group">
              <label htmlFor="deviceName">Device Name</label>
              <input
                type="text"
                id="deviceName"
                name="deviceName"
                value={formData.deviceName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Section: Wi-Fi Configuration */}
          <div className="esp-section">
            <h3 className="esp-section-title">Wi-Fi Configuration</h3>
            <div className="esp-group">
              <label htmlFor="wifiSsid">Wi-Fi SSID</label>
              <input
                type="text"
                id="wifiSsid"
                name="wifiSsid"
                placeholder="Enter Network Name"
                value={formData.wifiSsid}
                onChange={handleChange}
                required
              />
            </div>

            <div className="esp-group">
              <label htmlFor="wifiPassword">Wi-Fi Password</label>
              <input
                type="password"
                id="wifiPassword"
                name="wifiPassword"
                placeholder="Enter Network Password"
                value={formData.wifiPassword}
                onChange={handleChange}
              />
            </div>

            <div className="esp-group">
              <label htmlFor="ipMode">IP Assignment</label>
              <select
                id="ipMode"
                name="ipMode"
                value={formData.ipMode}
                onChange={handleChange}
              >
                <option value="dhcp">DHCP (Automatic)</option>
                <option value="static">Static IP</option>
              </select>
            </div>

            {formData.ipMode === 'static' && (
              <div className="esp-group">
                <label htmlFor="staticIp">Static IP Address</label>
                <input
                  type="text"
                  id="staticIp"
                  name="staticIp"
                  value={formData.staticIp}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Section: MQTT Configuration */}
          <div className="esp-section">
            <h3 className="esp-section-title">MQTT & Telemetry</h3>
            
            <div className="esp-group checkbox-group">
              <label htmlFor="enableMqtt">Enable MQTT</label>
              <input
                type="checkbox"
                id="enableMqtt"
                name="enableMqtt"
                checked={formData.enableMqtt}
                onChange={handleChange}
              />
            </div>

            {formData.enableMqtt && (
              <>
                <div className="esp-row">
                  <div className="esp-group flex-2">
                    <label htmlFor="mqttServer">Broker Address</label>
                    <input
                      type="text"
                      id="mqttServer"
                      name="mqttServer"
                      value={formData.mqttServer}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="esp-group flex-1">
                    <label htmlFor="mqttPort">Port</label>
                    <input
                      type="number"
                      id="mqttPort"
                      name="mqttPort"
                      value={formData.mqttPort}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="esp-group">
                  <label htmlFor="telemetryInterval">
                    Telemetry Interval (seconds)
                  </label>
                  <input
                    type="number"
                    id="telemetryInterval"
                    name="telemetryInterval"
                    min="1"
                    value={formData.telemetryInterval}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="esp-actions">
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleReboot}
            >
              Reboot ESP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;