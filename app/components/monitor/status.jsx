import './status.scss';

const MonitorStatus = ({ monitor }) => {
  const [lastHeartbeat] = monitor.heartbeats;

  return (
    <div className="monitor-status-container">
      <div className="monitor-status-content">
        <div className="monitor-status-title">Response</div>
        <div className="monitor-status-subtitle">(Currrent)</div>
        <div className="montior-status-text">{lastHeartbeat.latency}ms</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Avg Response</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">
          {monitor.averageHeartbeatLatency?.toFixed(0)}ms
        </div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Uptime</div>
        <div className="monitor-status-subtitle">(24 Hours)</div>
        <div className="montior-status-text">{monitor.uptimePercentage}%</div>
      </div>
      <div className="monitor-status-content">
        <div className="monitor-status-title">Cert expiry</div>
        <div className="monitor-status-subtitle">(Days Left)</div>
        <div className="montior-status-text">46</div>
      </div>
    </div>
  );
};

export default MonitorStatus;
