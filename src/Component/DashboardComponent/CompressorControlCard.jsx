import "../../styles/Dashboard.css";

const CompressorControlCard = ({
  isPowerOn,
  compressorSpeed,
  onSpeedChange,
}) => {
  return (
    <section className="controls-grid">
      <div
        className={`control-card ${
          !isPowerOn ? "disabled" : ""
        }`}
      >
        <div className="control-header">
          <h3>Compressor Speed</h3>

          <span className="control-value">
            {isPowerOn
              ? `${compressorSpeed}%`
              : "OFF"}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={isPowerOn ? compressorSpeed : 0}
          onChange={(e) =>
            onSpeedChange(Number(e.target.value))
          }
          disabled={!isPowerOn}
          className="slider"
        />
      </div>
    </section>
  );
};

export default CompressorControlCard;






{/* <section className="controls-grid">
        
          <div className={`control-card ${!isPowerOn ? "disabled" : ""}`}>
            <div className="control-header">
              <h3>Compressor Speed</h3>
              <span className="control-value">
                {isPowerOn ? `${compressorSpeed}%` : "OFF"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={isPowerOn ? compressorSpeed : 0}
              onChange={(e) => setCompressorSpeed(e.target.value)}
              disabled={!isPowerOn}
              className="slider"
            />
          </div>
        </section> */}