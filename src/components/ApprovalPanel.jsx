import { useState } from 'react';
import { formatCurrency, formatDateTime, getSeverityColor } from '../utils/formatters';

export function ApprovalPanel({ claim, estimate, assessment, onApprove, onReject, approval, role }) {
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    window.print();
  };

  const handleSend = (action) => {
    showToast(`✅ ${action} — ${claim.id}`);
  };

  const renderHandoffActions = () => (
    <div className="handoff-actions">
      <div className="handoff-label">Handoff</div>
      <div className="handoff-buttons">
        <button className="btn btn-secondary" onClick={handleExport}>
          📄 Export Report
        </button>
        {approval?.decision === 'approved' ? (
          <button className="btn btn-primary" onClick={() => handleSend('Authorization sent to repair shop')}>
            📧 Send Authorization
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => handleSend('Claim returned to agent for amendment')}>
            📧 Return to Agent
          </button>
        )}
      </div>
      {toast && <div className="handoff-toast">{toast}</div>}
    </div>
  );

  const renderSummary = () => (
    <div className="approval-summary">
      <div className="approval-summary-item">
        <span className="approval-summary-label">Claim ID</span>
        <span className="approval-summary-value">{claim.id}</span>
      </div>
      <div className="approval-summary-item">
        <span className="approval-summary-label">Policyholder</span>
        <span className="approval-summary-value">{claim.policyholderName}</span>
      </div>
      <div className="approval-summary-item">
        <span className="approval-summary-label">Vehicle</span>
        <span className="approval-summary-value">
          {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model}
        </span>
      </div>
      <div className="approval-summary-item">
        <span className="approval-summary-label">Coverage</span>
        <span className="approval-summary-value">{claim.coverageType || 'Collision'}</span>
      </div>
      {estimate && (
        <div className="approval-summary-item">
          <span className="approval-summary-label">Estimated Total</span>
          <span className="approval-summary-value">{formatCurrency(estimate.totalCost)}</span>
        </div>
      )}
      {claim.deductible && (
        <div className="approval-summary-item">
          <span className="approval-summary-label">Deductible</span>
          <span className="approval-summary-value">{formatCurrency(claim.deductible)}</span>
        </div>
      )}
      {estimate && claim.deductible && (
        <div className="approval-summary-item">
          <span className="approval-summary-label">Net Payout</span>
          <span className="approval-summary-value" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
            {formatCurrency(estimate.totalCost - claim.deductible)}
          </span>
        </div>
      )}
      {assessment && (
        <div className="approval-summary-item">
          <span className="approval-summary-label">Overall Severity</span>
          <span className="approval-summary-value" style={{ color: getSeverityColor(assessment.overallSeverity) }}>
            {assessment.overallSeverity}
          </span>
        </div>
      )}
    </div>
  );

  const renderCaseFile = () => (
    <div className="approval-case-file">
      <h4 className="approval-section-title">📋 Agent Case File</h4>

      {/* AI Findings Summary */}
      {assessment && (
        <div className="approval-findings">
          <span className="approval-findings-label">AI Damage Findings</span>
          <div className="approval-findings-list">
            {assessment.damageAreas.map((area, idx) => (
              <div className="approval-finding-chip" key={idx}>
                <span
                  className="approval-finding-dot"
                  style={{ background: getSeverityColor(area.severity) }}
                />
                {area.part} — {area.severity}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Notes */}
      {claim.agentNotes && (
        <div className="approval-agent-notes">
          <span className="approval-findings-label">Agent Notes</span>
          <p>{claim.agentNotes}</p>
        </div>
      )}

      {/* AI Recommendation */}
      {assessment?.recommendation && (
        <div className="approval-ai-rec">
          <span className="approval-findings-label">AI Recommendation</span>
          <p>{assessment.recommendation}</p>
        </div>
      )}
    </div>
  );

  // Agent view — no approval yet: submit for review
  if (role === 'agent' && !approval) {
    return (
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">📋 Claim Summary</h2>
        </div>
        {renderSummary()}
        {renderCaseFile()}
        <div className="approval-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onApprove({ status: 'pending_approval' })}
          >
            Submit for Senior Review
          </button>
        </div>
      </div>
    );
  }

  // Agent view — approval exists: show decision
  if (role === 'agent' && approval) {
    return (
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">📋 Approval Decision</h2>
        </div>
        {renderSummary()}
        <div className={`approval-decision ${approval.decision}`}>
          <h3>{approval.decision === 'approved' ? '✅ Claim Approved' : '❌ Claim Rejected'}</h3>
          <p>Reviewer: {approval.reviewer}</p>
          {approval.comments && <p>{approval.comments}</p>}
          {approval.decidedAt && <p>Date: {formatDateTime(approval.decidedAt)}</p>}
          {approval.decision === 'approved' && estimate && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <p><strong>Authorization:</strong></p>
              <p>Claim: {claim.id}</p>
              <p>Approved Amount: {formatCurrency(estimate.totalCost)}</p>
              <p>Reviewer: {approval.reviewer}</p>
              <p>Date: {formatDateTime(approval.decidedAt)}</p>
            </div>
          )}
        </div>
        {renderHandoffActions()}
      </div>
    );
  }

  // Adjuster view
  if (role === 'adjuster') {
    if (approval) {
      return (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title">📋 Review Complete</h2>
          </div>
          {renderSummary()}
          <div className={`approval-decision ${approval.decision}`}>
            <h3>{approval.decision === 'approved' ? '✅ Claim Approved' : '❌ Claim Rejected'}</h3>
            <p>Reviewer: {approval.reviewer}</p>
            {approval.comments && <p>{approval.comments}</p>}
            {approval.decidedAt && <p>Date: {formatDateTime(approval.decidedAt)}</p>}
          </div>
          {renderHandoffActions()}
        </div>
      );
    }

    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectDetails, setRejectDetails] = useState('');

    const rejectionReasons = [
      'Insufficient documentation',
      'Damage inconsistent with reported incident',
      'Pre-existing damage suspected',
      'Coverage exclusion applies',
      'Requires in-person inspection',
    ];

    return (
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">📋 Senior Review</h2>
        </div>
        {renderSummary()}
        {renderCaseFile()}

        {!showRejectForm && (
          <>
            <textarea
              className="approval-comment-input"
              placeholder="Add review comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="approval-actions">
              <button
                className="btn btn-success btn-lg"
                onClick={() =>
                  onApprove({
                    decision: 'approved',
                    reviewer: 'Sr. Adjuster Williams',
                    comments: comment,
                    decidedAt: new Date().toISOString(),
                  })
                }
              >
                Approve
              </button>
              <button
                className="btn btn-danger btn-lg"
                onClick={() => setShowRejectForm(true)}
              >
                Reject
              </button>
            </div>
          </>
        )}

        {showRejectForm && (
          <div className="rejection-form fade-in">
            <h4 className="rejection-form-title">⚠️ Rejection Details</h4>
            <p className="rejection-form-desc">Provide a reason so the agent can amend and resubmit.</p>

            <label className="form-label">Reason</label>
            <select
              className="rejection-reason-select"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              {rejectionReasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>

            <label className="form-label" style={{ marginTop: 'var(--space-md)' }}>Details</label>
            <textarea
              className="approval-comment-input"
              placeholder="Explain what needs to be corrected or what additional information is needed..."
              value={rejectDetails}
              onChange={(e) => setRejectDetails(e.target.value)}
            />

            <div className="approval-actions">
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setShowRejectForm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-lg"
                disabled={!rejectReason || !rejectDetails.trim()}
                onClick={() =>
                  onReject({
                    decision: 'rejected',
                    reviewer: 'Sr. Adjuster Williams',
                    reason: rejectReason,
                    comments: `${rejectReason}: ${rejectDetails}`,
                    decidedAt: new Date().toISOString(),
                  })
                }
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
