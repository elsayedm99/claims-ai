import { dashboardMetrics } from '../data/mockClaims';

const METRIC_ICONS = {
  'Avg Processing Time': '⚡',
  'Claims Processed Today': '📋',
  'AI Assessment Accuracy': '🎯',
  'Est. Cost Savings (Monthly)': '💰',
  'Pending Review': '⏳',
};

export function MetricsBanner() {
  const metrics = Object.values(dashboardMetrics);

  return (
    <div className="metrics-banner">
      {metrics.map((metric) => (
        <div className="metric-card" key={metric.label}>
          <div className="metric-card-icon">
            {METRIC_ICONS[metric.label] || '📊'}
          </div>
          <div className="metric-value">
            {metric.label === 'Avg Processing Time' && metric.previousValue ? (
              <>
                <span className="metric-old-value">{metric.previousValue}</span>
                <span className="metric-arrow">→</span>
                {metric.value}
              </>
            ) : (
              <>
                {metric.label === 'AI Assessment Accuracy' && (
                  <span className="metric-live-dot" />
                )}
                {metric.value}
              </>
            )}
          </div>
          <div className="metric-label">{metric.label}</div>
          {metric.improvement && (
            <div className="metric-improvement">
              ↑ {metric.improvement} faster
            </div>
          )}
          <div className="metric-bar">
            <div
              className="metric-bar-fill"
              style={{
                width: metric.label === 'AI Assessment Accuracy' ? '94.2%' :
                       metric.label === 'Avg Processing Time' ? '87%' :
                       metric.label === 'Claims Processed Today' ? '72%' : '65%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
