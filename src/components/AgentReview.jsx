import { useState } from 'react';
import { getSeverityColor } from '../utils/formatters';
import { DAMAGE_TYPES, SEVERITY_LEVELS } from '../data/mockClaims';

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
              <span className="annotation-detail-label">Repair Action</span>
              <span>{area.repairAction}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const EMPTY_NEW_DAMAGE = {
  part: '',
  type: Object.values(DAMAGE_TYPES)[0],
  severity: Object.values(SEVERITY_LEVELS)[0],
  repairAction: 'Repair',
};

/* ===== Senior Adjuster Read-Only View ===== */
function AdjusterReviewSummary({ assessment, agentReviewData, agentNotes }) {
  const { itemStates = {}, flagComments = {}, addedDamages = [] } = agentReviewData || {};

  const confirmedCount = Object.values(itemStates).filter((v) => v === 'confirmed').length;
  const flaggedCount = Object.values(itemStates).filter((v) => v === 'flagged').length;
  const totalAI = assessment.damageAreas.length;

  return (
    <div className="card fade-in">
      {/* Header */}
      <div className="human-checkpoint-header">
        <div className="human-checkpoint-icon">👔</div>
        <div className="human-checkpoint-content">
          <h3 className="human-checkpoint-title">Agent Review Summary</h3>
          <p className="human-checkpoint-desc">
            The claims agent has reviewed the AI assessment below. Review their decisions before approving or rejecting this claim.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="review-progress">
        <div className="review-progress-bar">
          <div
            className="review-progress-fill confirmed"
            style={{ width: `${(confirmedCount / totalAI) * 100}%` }}
          />
          <div
            className="review-progress-fill flagged"
            style={{ width: `${(flaggedCount / totalAI) * 100}%` }}
          />
        </div>
        <div className="review-progress-stats">
          <span className="review-stat confirmed">✓ {confirmedCount} confirmed</span>
          <span className="review-stat flagged">⚑ {flaggedCount} flagged</span>
          {addedDamages.length > 0 && (
            <span className="review-stat added">+ {addedDamages.length} added by agent</span>
          )}
        </div>
      </div>

      {/* AI findings with agent decisions */}
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
                  {!state && <span className="review-pending-badge">—</span>}
                  {area.part}
                  <span className="adjuster-verdict-badge" data-state={state || 'unreviewed'}>
                    {state === 'confirmed' ? 'Agent Confirmed' : state === 'flagged' ? 'Agent Flagged' : 'Not Reviewed'}
                  </span>
                </span>
                <span className="review-item-detail">
                  {area.type} • {area.severity} • {Math.round(area.confidence * 100)}% confidence • {area.repairAction}
                </span>
              </div>

              {/* Flag comment — read-only */}
              {state === 'flagged' && flagComments[index] && (
                <div className="flag-comment-container flag-comment-readonly">
                  <span className="flag-comment-label">Agent's reason:</span> {flagComments[index]}
                </div>
              )}
            </div>
          );
        })}

        {/* Agent-added damages */}
        {addedDamages.map((damage, idx) => (
          <div className="review-item review-item--added" key={`added-${idx}`}>
            <div className="review-item-info">
              <span className="review-item-part">
                <span className="review-added-badge">+ AGENT</span>
                {damage.part}
                <span className="adjuster-verdict-badge" data-state="added">AI Missed — Agent Added</span>
              </span>
              <span className="review-item-detail">
                {damage.type} • {damage.severity} • {damage.repairAction}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Agent notes */}
      {agentNotes && (
        <div className="adjuster-agent-notes">
          <span className="adjuster-notes-label">📝 Agent Notes</span>
          <p className="adjuster-notes-text">{agentNotes}</p>
        </div>
      )}
    </div>
  );
}

/* ===== Main Component ===== */
export function AgentReview({ assessment, photos, agentNotes, onNotesChange, onConfirm, confirmed, role, agentReviewData }) {
  const [itemStates, setItemStates] = useState({});
  const [flagComments, setFlagComments] = useState({});
  const [viewingArea, setViewingArea] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDamage, setNewDamage] = useState(EMPTY_NEW_DAMAGE);
  const [addedDamages, setAddedDamages] = useState([]);

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

  // Senior adjuster sees read-only summary of agent's review
  if (role === 'adjuster' && agentReviewData) {
    return (
      <AdjusterReviewSummary
        assessment={assessment}
        agentReviewData={agentReviewData}
        agentNotes={agentNotes}
      />
    );
  }

  const handleAction = (index, action) => {
    setItemStates((prev) => ({
      ...prev,
      [index]: prev[index] === action ? null : action,
    }));
    // Clear flag comment if un-flagging
    if (action === 'flagged' && itemStates[index] === 'flagged') {
      setFlagComments((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const handleFlagComment = (index, comment) => {
    setFlagComments((prev) => ({
      ...prev,
      [index]: comment,
    }));
  };

  const handleAddDamage = () => {
    if (!newDamage.part.trim()) return;
    setAddedDamages((prev) => [
      ...prev,
      {
        ...newDamage,
        part: newDamage.part.trim(),
        confidence: 0,
        addedByAgent: true,
        estimatedParts: 0,
        estimatedLabor: 0,
        boundingBox: null,
      },
    ]);
    setNewDamage(EMPTY_NEW_DAMAGE);
    setShowAddForm(false);
  };

  const handleRemoveAdded = (addedIndex) => {
    setAddedDamages((prev) => prev.filter((_, i) => i !== addedIndex));
  };

  const handleConfirmAndPersist = () => {
    // Bundle the review state and pass it up
    const reviewData = {
      itemStates,
      flagComments,
      addedDamages,
      reviewedAt: new Date().toISOString(),
    };
    onConfirm(reviewData);
  };

  // Combine AI findings + agent-added damages for counting
  const allDamageAreas = [...assessment.damageAreas, ...addedDamages];
  const totalItems = allDamageAreas.length;

  const confirmedCount = Object.values(itemStates).filter((v) => v === 'confirmed').length;
  const flaggedCount = Object.values(itemStates).filter((v) => v === 'flagged').length;
  const hasConfirmedAny = confirmedCount > 0;

  // Agent-added items use indices starting after AI items
  const aiItemCount = assessment.damageAreas.length;

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
          {addedDamages.length > 0 && (
            <span className="review-stat added">+ {addedDamages.length} added by agent</span>
          )}
        </div>
      </div>

      {/* Review items — AI findings */}
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

              {/* Flag comment input — appears when item is flagged */}
              {state === 'flagged' && (
                <div className="flag-comment-container">
                  <input
                    type="text"
                    className="flag-comment-input"
                    placeholder="Why is this finding incorrect? (e.g., 'Damage is on right fender, not left')"
                    value={flagComments[index] || ''}
                    onChange={(e) => handleFlagComment(index, e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Agent-added damage items */}
        {addedDamages.map((damage, addedIndex) => {
          const globalIndex = aiItemCount + addedIndex;
          const state = itemStates[globalIndex];

          return (
            <div className="review-item review-item--added" key={`added-${addedIndex}`}>
              <div className="review-item-info">
                <span className="review-item-part">
                  <span className="review-added-badge">+ AGENT</span>
                  {damage.part}
                </span>
                <span className="review-item-detail">
                  {damage.type} • {damage.severity} • {damage.repairAction} • Added by agent (AI missed)
                </span>
              </div>
              <div className="review-item-actions">
                <button
                  className={`btn btn-sm ${state === 'confirmed' ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => handleAction(globalIndex, 'confirmed')}
                >
                  ✓ Confirm
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleRemoveAdded(addedIndex)}
                  title="Remove this item"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add missed damage */}
      <div className="add-damage-section">
        {!showAddForm ? (
          <button
            className="btn btn-sm btn-secondary add-damage-trigger"
            onClick={() => setShowAddForm(true)}
          >
            + Add Missed Damage
          </button>
        ) : (
          <div className="add-damage-form">
            <div className="add-damage-form-header">
              <span className="add-damage-form-title">🔎 AI Missed Something?</span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => { setShowAddForm(false); setNewDamage(EMPTY_NEW_DAMAGE); }}
              >
                Cancel
              </button>
            </div>
            <div className="add-damage-form-fields">
              <div className="add-damage-field">
                <label className="form-label">Damaged Part</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Right Quarter Panel"
                  value={newDamage.part}
                  onChange={(e) => setNewDamage((d) => ({ ...d, part: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="add-damage-field">
                <label className="form-label">Damage Type</label>
                <select
                  className="form-select"
                  value={newDamage.type}
                  onChange={(e) => setNewDamage((d) => ({ ...d, type: e.target.value }))}
                >
                  {Object.values(DAMAGE_TYPES).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="add-damage-field">
                <label className="form-label">Severity</label>
                <select
                  className="form-select"
                  value={newDamage.severity}
                  onChange={(e) => setNewDamage((d) => ({ ...d, severity: e.target.value }))}
                >
                  {Object.values(SEVERITY_LEVELS).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="add-damage-field">
                <label className="form-label">Repair Action</label>
                <select
                  className="form-select"
                  value={newDamage.repairAction}
                  onChange={(e) => setNewDamage((d) => ({ ...d, repairAction: e.target.value }))}
                >
                  <option value="Repair">Repair</option>
                  <option value="Repair & Repaint">Repair & Repaint</option>
                  <option value="Replace">Replace</option>
                  <option value="Inspect Further">Inspect Further</option>
                </select>
              </div>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAddDamage}
              disabled={!newDamage.part.trim()}
            >
              + Add Finding
            </button>
          </div>
        )}
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
          onClick={handleConfirmAndPersist}
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
