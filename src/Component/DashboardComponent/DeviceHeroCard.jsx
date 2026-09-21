import "../../styles/Dashboard.css";
import Dropdown from "../DropDown";

const DeviceHeroCard = ({
  isPowerOn,
  options = [],
  selectedDeviceId,
  loading = false,
  onDropdownOpen,
  onDeviceChange,
  onPowerToggle,
  deviceProvider,
}) => {
  // Simplify options logic: show loading state or actual options
  const dropdownOptions = loading 
    ? [{ label: "Please wait...", value: "" }] 
    : options;

  const isButtonDisabled = !deviceProvider;

  return (
    <section className={`hero-card ${isPowerOn ? "active-glow" : "muted"}`}>
      <div className="hero-info">
        <Dropdown
          label=""
          options={dropdownOptions}
          value={selectedDeviceId}
          onTapOpenDropdown={onDropdownOpen}
          onChange={onDeviceChange}
          size="md"
          className="hero-dropdown" // Use CSS class for responsive sizing instead of inline styles
        />

        <p className="hero-status-text">
          {isPowerOn
            ? "ESP32 Controller active and broadcasting telemetry data."
            : "System is powering down. Telemetry paused."}
        </p>
      </div>

      <div className="power-control">
        <button
          className={`power-btn ${isPowerOn ? "on" : "off"} ${isButtonDisabled ? "disabled" : ""}`}
          onClick={onPowerToggle}
          disabled={isButtonDisabled}
          aria-label="Toggle Power"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>

        <span className="power-label">
          {deviceProvider && isPowerOn ? "POWER ON" : "POWER OFF"}
        </span>
      </div>
    </section>
  );
};

export default DeviceHeroCard;