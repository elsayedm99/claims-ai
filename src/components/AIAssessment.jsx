import { useState, useEffect, useRef } from 'react';
import { getSeverityColor, getConfidenceColor } from '../utils/formatters';

function getSeverityWidth(severity) {
  switch (severity) {
    case 'Minor': return '33%';
    case 'Moderate': return '66%';
    case 'Severe': return '100%';
    default: return '0%';
  }
}

const PROCESSING_STAGES = [
  { key: 'uploading', label: 'Uploading images to AI model' },
  { key: 'detecting', label: 'Detecting damage areas' },
  { key: 'classifying', label: 'Classifying damage severity' },
  { key: 'estimating', label: 'Cross-referencing repair databases' },
  { key: 'generating', label: 'Generating assessment report' },
];

function getStageIndex(stage) {
  return PROCESSING_STAGES.findIndex((s) => s.key === stage);
}

function ConfidenceRing({ value, size = 36 }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;
  const color = getConfidenceColor(value);

  return (
    <div className="confidence-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--color-border)" strokeWidth="3"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="confidence-ring-value" style={{ color, fontSize: size * 0.28 }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

export function AIAssessment({ assessment, photos, onAnalyze, isAnalyzing, progress }) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isAnalyzing) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 0.1), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isAnalyzing]);

  // Trigger view
  if (!assessment && !isAnalyzing) {
    return (
      <div className="card ai-trigger-card">
        <div className="ai-analysis-trigger">
          <div className="ai-trigger-icon">🤖</div>
          <h3 className="ai-trigger-title">AI Damage Assessment</h3>
          <p>
            Our computer vision model will analyze the uploaded photos to detect damage areas,
            classify severity, and estimate repair costs.
          </p>
          <div className="ai-model-badge">
            <span className="ai-model-badge-dot" />
            DamageNet v2.4 • Computer Vision
          </div>
          <div className="ai-model-stats">
            <span>🎯 94.2% accuracy</span>
            <span>📊 50,000+ claims analyzed</span>
            <span>⚡ ~3s processing time</span>
          </div>
          <button
            className="btn btn-primary btn-lg glow-accent"
            onClick={onAnalyze}
            disabled={!photos || photos.length === 0}
          >
            ▶ Run AI Analysis
          </button>
          {(!photos || photos.length === 0) && (
            <p className="ai-trigger-hint">Upload photos first to enable analysis.</p>
          )}
        </div>
      </div>
    );
  }

  // Progress view
  if (isAnalyzing && !assessment) {
    const currentStageIdx = getStageIndex(progress?.stage);

    return (
      <div className="card ai-progress-card">
        <div className="ai-progress">
          <div className="ai-progress-timer">
            <span className="ai-progress-timer-value">{elapsed.toFixed(1)}s</span>
            <span className="ai-progress-timer-label">Processing Time</span>
          </div>

          <div className="ai-progress-bar">
            <div
              className="ai-progress-fill"
              style={{ width: `${progress?.percent || 0}%` }}
            />
          </div>

          <div className="ai-progress-stages">
            {PROCESSING_STAGES.map((stage, idx) => {
              let icon = '○';
              let className = 'ai-stage-item';
              if (idx < currentStageIdx) { icon = '✓'; className += ' completed'; }
              else if (idx === currentStageIdx) { icon = '⟳'; className += ' active'; }

              return (
                <div className={className} key={stage.key}>
                  <span className="ai-stage-icon">{icon}</span>
                  <span className="ai-stage-label">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Results view
  const avgConfidence = assessment.damageAreas.reduce((sum, a) => sum + a.confidence, 0) / assessment.damageAreas.length;

  return (
    <div className="card fade-in">
      {/* Time saved comparison */}
      <div className="ai-time-saved">
        <span className="ai-time-saved-badge">
          ⚡ Processed in {assessment.processingTime}
        </span>
        <span className="ai-time-saved-compare">
          Manual review avg: <strong>32 min</strong>
        </span>
      </div>

      <div className="ai-results-header">
        <h2 className="card-title">🤖 AI Damage Assessment</h2>
        <div className="ai-results-meta">
          <span>⏱ {assessment.processingTime}</span>
          <span>🧠 {assessment.modelVersion}</span>
          <span>📷 {assessment.analyzedPhotos} photos</span>
        </div>
      </div>

      {/* Overall summary row */}
      <div className="ai-summary-row">
        <div className="ai-summary-item">
          <span
            className="overall-severity"
            style={{
              background: `${getSeverityColor(assessment.overallSeverity)}20`,
              color: getSeverityColor(assessment.overallSeverity),
            }}
          >
            Overall: {assessment.overallSeverity}
          </span>
        </div>
        <div className="ai-summary-item">
          <span className="ai-summary-label">Avg Confidence</span>
          <ConfidenceRing value={avgConfidence} size={48} />
        </div>
        <div className="ai-summary-item">
          <span className="ai-summary-label">Areas Detected</span>
          <span className="ai-summary-value">{assessment.damageAreas.length}</span>
        </div>
      </div>

      {/* Damage list */}
      <div className="damage-list stagger-children">
        {assessment.damageAreas.map((area, index) => (
          <div
            className="damage-item"
            key={index}
            style={{ borderLeft: `3px solid ${getSeverityColor(area.severity)}` }}
          >
            <div className="damage-item-part">{area.part}</div>
            <div className="damage-item-type">{area.type}</div>
            <div className="damage-item-severity">
              <div className="severity-bar">
                <div
                  className="severity-bar-fill"
                  style={{
                    width: getSeverityWidth(area.severity),
                    background: getSeverityColor(area.severity),
                  }}
                />
                <span
                  className="severity-bar-label"
                  style={{ color: getSeverityColor(area.severity) }}
                >
                  {area.severity}
                </span>
              </div>
            </div>
            <div className="damage-item-confidence">
              <ConfidenceRing value={area.confidence} size={32} />
            </div>
            <div className="damage-item-action">{area.repairAction}</div>
          </div>
        ))}
      </div>

      <div className="ai-recommendation">
        <strong>💡 AI Recommendation: </strong>
        {assessment.recommendation}
      </div>
    </div>
  );
}
