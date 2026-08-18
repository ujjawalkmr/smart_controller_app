import "../../styles/Dashboard.css";

const DeviceControlCard = ({
  title,
  icon,
  value,
  footer,

  // Temperature controls
  showTempControls = false,
  targetValue,
  onDecrease,
  onIncrease,
  disabled = false,
}) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>

        <span className="metric-icon">{icon}</span>
      </div>

      <div className="metric-value">{value}</div>

      {showTempControls && (
        <div className="temp-control-buttons">
          <button
            className="btn-step"
            onClick={onDecrease}
            disabled={disabled}
          >
            -
          </button>

          <span className="target-label">Target: {targetValue}°C</span>

          <button
            className="btn-step"
            onClick={onIncrease}
            disabled={disabled}
          >
            +
          </button>
        </div>
      )}

      {footer && <div className="metric-footer">{footer}</div>}
    </div>
  );
};

export default DeviceControlCard;
