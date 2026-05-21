import { useState } from 'react';
import { getSeverityColor } from '../utils/formatters';

function AnnotationViewer({ photo, area, onClose }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const borderColor = getSeverityColor(area.severity);

  return (
    <div className="annotation-overlay" onClick={onClose}>
      <div className="annotation-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="annotation-viewer-header">
          <h3>AI Detection — {area.part}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Bias prevention hint */}
        {!showOverlay && (
          <div className="annotation-bias-hint">
            👁️ Review the photo yourself first, then reveal the AI's detection to compare.
          </div>
        )}

        <div className="annotation-image-container">
          {photo ? (
            <img src={photo.url} alt="Damage" className="annotation-image" />
          ) : (
            <div className="annotation-image-placeholder">
              <span>🚗</span>
              <p>Vehicle damage photo</p>
            </div>
          )}

          {/* AI detection bounding box — only shown when toggled */}
          {showOverlay && area.boundingBox && (
            <div
              className="annotation-box"
              style={{
                left: `${area.boundingBox.x}%`,
                top: `${area.boundingBox.y}%`,
                width: `${area.boundingBox.w}%`,
                height: `${area.boundingBox.h}%`,
                borderColor,
                boxShadow: `0 0 0 2px ${borderColor}40, inset 0 0 20px ${borderColor}15`,
              }}
            >
              <span
                className="annotation-box-label"
                style={{ background: borderColor }}
              >
                {area.part} — {area.severity}
              </span>
              <span
                className="annotation-box-confidence"
                style={{ background: borderColor }}
              >
                {Math.round(area.confidence * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          className={`btn btn-sm annotation-toggle ${showOverlay ? 'btn-accent' : 'btn-secondary'}`}
          onClick={() => setShowOverlay(!showOverlay)}
        >
          {showOverlay ? '🔍 Hide AI Detection' : '🤖 Show AI Detection'}
        </button>

        {/* Details — only shown when overlay is visible */}
        {showOverlay && (
          <div className="annotation-details">
            <div className="annotation-detail-row">
              <span className="annotation-detail-label">Damage Type</span>
              <span>{area.type}</span>
            </div>
            <div className="annotation-detail-row">
              <span className="annotation-detail-label">Severity</span>
              <span style={{ color: borderColor, fontWeight: 600 }}>{area.severity}</span>
            </div>
            <div className="annotation-detail-row">
              <span className="annotation-detail-label">Confidence</span>
              <span>{Math.round(area.confidence * 100)}%</span>
            </div>
            <div className="annotation-detail-row">
              <span className="annotation-detail-label">Recommended Action</span>
              <span>{area.repairAction}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AgentReview({ assessment, photos, agentNotes, onNotesChange, onConfirm, confirmed }) {
  const [itemStates, setItemStates] = useState({});
  const [viewingArea, setViewingArea] = useState(null);

  if (!assessment) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <p>Run AI analysis first to review findings.</p>
        </div>
      </div>
    );
  }

  const handleAction = (index, action) => {
    setItemStates((prev) => ({
      ...prev,
      [index]: prev[index] === action ? null : action,
    }));
  };

  const confirmedCount = Object.values(itemStates).filter((v) => v === 'confirmed').length;
  const flaggedCount = Object.values(itemStates).filter((v) => v === 'flagged').length;
  const hasConfirmedAny = confirmedCount > 0;
  const totalItems = assessment.damageAreas.length;

  return (
    <div className="card fade-in">
      {/* Human checkpoint header */}
      <div className="human-checkpoint-header">
        <div className="human-checkpoint-icon">🧑‍💼</div>
        <div className="human-checkpoint-content">
          <h3 className="human-checkpoint-title">Human Checkpoint</h3>
          <p className="human-checkpoint-desc">
            Review and validate AI findings before proceeding. Click "View Detection" to inspect the AI's damage annotation on the photo, then confirm or flag each finding.
          </p>
        </div>
      </div>

      {/* Progress summary */}
      <div className="review-progress">
        <div className="review-progress-bar">
          <div
            className="review-progress-fill confirmed"
            style={{ width: `${(confirmedCount / totalItems) * 100}%` }}
          />
          <div
            className="review-progress-fill flagged"
            style={{ width: `${(flaggedCount / totalItems) * 100}%` }}
          />
        </div>
        <div className="review-progress-stats">
          <span className="review-stat confirmed">✓ {confirmedCount} confirmed</span>
          <span className="review-stat flagged">⚑ {flaggedCount} flagged</span>
          <span className="review-stat remaining">
            {totalItems - confirmedCount - flaggedCount} remaining
          </span>
        </div>
      </div>

      {/* Review items */}
      <div className="review-actions">
        {assessment.damageAreas.map((area, index) => {
          const state = itemStates[index];
          let itemClass = 'review-item';
          if (state === 'confirmed') itemClass += ' review-item--confirmed';
          if (state === 'flagged') itemClass += ' review-item--flagged';

          return (
            <div className={itemClass} key={index}>
              <div className="review-item-info">
                <span className="review-item-part">
                  {state === 'confirmed' && <span className="review-check">✓</span>}
                  {state === 'flagged' && <span className="review-flag">⚑</span>}
                  {area.part}
                </span>
                <span className="review-item-detail">
                  {area.type} • {area.severity} • {Math.round(area.confidence * 100)}% confidence • {area.repairAction}
                </span>
              </div>
              <div className="review-item-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setViewingArea(area)}
                  title="View AI detection on photo"
                >
                  🔍 View Detection
                </button>
                <button
                  className={`btn btn-sm ${state === 'confirmed' ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => handleAction(index, 'confirmed')}
                >
                  ✓ Confirm
                </button>
                <button
                  className={`btn btn-sm ${state === 'flagged' ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => handleAction(index, 'flagged')}
                >
                  ⚑ Flag
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flagged warning */}
      {flaggedCount > 0 && (
        <div className="review-warning">
          ⚠️ {flaggedCount} flagged item{flaggedCount > 1 ? 's' : ''} will be escalated for manual inspection
        </div>
      )}

      {/* Agent notes */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <label className="form-label">Agent Notes</label>
        <textarea
          className="agent-notes-area"
          placeholder="Add your observations, adjustments, or concerns here..."
          value={agentNotes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      {/* Confirm button */}
      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={onConfirm}
          disabled={!hasConfirmedAny || confirmed}
        >
          {confirmed ? '✓ Assessment Confirmed' : 'Confirm Assessment & Continue'}
        </button>
      </div>

      {/* Annotation viewer modal */}
      {viewingArea && (
        <AnnotationViewer
          photo={photos?.[0] || null}
          area={viewingArea}
          onClose={() => setViewingArea(null)}
        />
      )}
    </div>
  );
}
