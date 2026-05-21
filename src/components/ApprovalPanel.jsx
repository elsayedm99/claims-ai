import { useState } from 'react';
import { formatCurrency, formatDateTime, getSeverityColor } from '../utils/formatters';

export function ApprovalPanel({ claim, estimate, assessment, onApprove, onReject, approval, role }) {
  const [comment, setComment] = useState('');

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
        </div>
      );
    }

    return (
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">📋 Senior Review</h2>
        </div>
        {renderSummary()}
        {renderCaseFile()}

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
            onClick={() =>
              onReject({
                decision: 'rejected',
                reviewer: 'Sr. Adjuster Williams',
                comments: comment,
                decidedAt: new Date().toISOString(),
              })
            }
          >
            Reject
          </button>
        </div>
      </div>
    );
  }

  return null;
}
