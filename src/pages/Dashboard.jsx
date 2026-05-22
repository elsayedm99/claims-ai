import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatters';
import { MetricsBanner } from '../components/MetricsBanner';
import { StatusBadge } from '../components/StatusBadge';

/* ---- helpers ---- */
function getPriorityColor(claim) {
  const status = claim.status;
  const severity = claim.aiAssessment?.overallSeverity;
  if (severity === 'Severe' || status === 'new') return 'var(--color-danger)';
  if (severity === 'Moderate' || status === 'in_review' || status === 'pending_approval')
    return 'var(--color-warning)';
  return 'var(--color-success)';
}

/* ---- Activity Feed data ---- */
const ACTIVITY_ITEMS = [
  {
    text: 'CLM-2024-004 approved by Sr. Adjuster Williams',
    time: '2 hours ago',
    color: 'var(--color-success)',
  },
  {
    text: 'AI assessment completed for CLM-2024-005',
    time: '5 hours ago',
    color: 'var(--color-accent)',
  },
  {
    text: 'New claim CLM-2024-001 received',
    time: '8 hours ago',
    color: 'var(--color-info)',
  },
];

/* ---- NewClaimModal ---- */
function NewClaimModal({ onClose, onAddClaim }) {
  const [form, setForm] = useState({
    policyholderName: '',
    policyNumber: '',
    make: '',
    model: '',
    year: '',
    accidentDate: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-2024-${String(Date.now()).slice(-3)}`,
      policyNumber: form.policyNumber || 'POL-0000000',
      policyholderName: form.policyholderName,
      policyholderEmail: '',
      policyholderPhone: '',
      vehicleInfo: {
        make: form.make,
        model: form.model,
        year: Number(form.year) || 2024,
        color: '',
        vin: '',
      },
      accidentDate: form.accidentDate || new Date().toISOString().slice(0, 10),
      reportedDate: new Date().toISOString().slice(0, 10),
      accidentDescription: form.description,
      accidentLocation: '',
      coverageType: 'Collision',
      deductible: 500,
      photos: [],
      status: 'new',
      aiAssessment: null,
      estimate: null,
      approval: null,
      agentNotes: '',
      assignedAgent: null,
      createdAt: new Date().toISOString(),
    };
    if (onAddClaim) {
      onAddClaim(newClaim);
    } else {
      console.log('New claim created:', newClaim);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Initiate New Claim</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Policyholder Name</label>
            <input
              className="form-input"
              name="policyholderName"
              value={form.policyholderName}
              onChange={handleChange}
              placeholder="e.g. Sarah Mitchell"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Policy Number</label>
            <input
              className="form-input"
              name="policyNumber"
              value={form.policyNumber}
              onChange={handleChange}
              placeholder="e.g. POL-8834721"
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Make</label>
              <input
                className="form-input"
                name="make"
                value={form.make}
                onChange={handleChange}
                placeholder="e.g. Toyota"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                className="form-input"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Camry"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                className="form-input"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g. 2023"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Accident Date</label>
            <input
              className="form-input"
              name="accidentDate"
              type="date"
              value={form.accidentDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the incident..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photos</label>
            <div className="photo-upload-zone">
              <span className="photo-upload-zone-icon">📷</span>
              <span className="photo-upload-zone-text">
                Drag & drop photos or click to upload
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- Dashboard ---- */
export function Dashboard({ claims, onAddClaim }) {
  const navigate = useNavigate();
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = claims.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.policyholderName.toLowerCase().includes(q) ||
      `${c.vehicleInfo.year} ${c.vehicleInfo.make} ${c.vehicleInfo.model}`
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="fade-in">
      {/* Page header with New Claim button */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Claims Dashboard</h1>
            <p>AI-powered claims processing and assessment overview</p>
          </div>
          <button
            className="btn btn-primary new-claim-btn"
            onClick={() => setShowNewClaimModal(true)}
          >
            <span className="btn-icon">＋</span> New Claim
          </button>
        </div>
      </div>

      {/* Metrics */}
      <MetricsBanner />

      {/* Time-saved banner */}
      <div className="time-saved-banner">
        <span className="time-saved-icon">⏱️</span>
        <span className="time-saved-text">
          AI-assisted processing has saved an estimated{' '}
          <strong>142 hours</strong> this month
        </span>
        <span className="time-saved-sparkle">✨</span>
      </div>

      {/* Search bar */}
      <div className="table-toolbar">
        <div className="table-search-wrapper">
          <span className="table-search-icon">🔍</span>
          <input
            className="table-search-input"
            type="text"
            placeholder="Search claims by ID, policyholder, or vehicle…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="table-result-count">
          {filteredClaims.length} claim{filteredClaims.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Claims table */}
      <div className="claims-table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th className="th-claim-id">Claim ID</th>
              <th>Policyholder</th>
              <th>Vehicle</th>
              <th>Accident Date</th>
              <th>📷</th>
              <th>Status</th>
              <th className="cell-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <tr
                key={claim.id}
                onClick={() => navigate(`/claim/${claim.id}`)}
              >
                <td>
                  <span
                    className="priority-dot"
                    style={{ background: getPriorityColor(claim) }}
                    title="Priority"
                  />
                  <span className="claim-id">{claim.id}</span>
                </td>
                <td>
                  <span className="claim-policyholder">
                    {claim.policyholderName}
                  </span>
                </td>
                <td>
                  <span className="claim-vehicle">
                    {claim.vehicleInfo.year} {claim.vehicleInfo.make}{' '}
                    {claim.vehicleInfo.model}
                  </span>
                </td>
                <td>{formatDate(claim.accidentDate)}</td>
                <td>
                  <span className="photo-count">
                    📷 {claim.photos?.length || 0}
                  </span>
                </td>
                <td>
                  <StatusBadge status={claim.status} />
                </td>
                <td className="cell-action">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/claim/${claim.id}`);
                    }}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        <h3 className="activity-feed-title">Recent Activity</h3>
        {ACTIVITY_ITEMS.map((item, idx) => (
          <div className="activity-feed-item" key={idx}>
            <span
              className="activity-dot"
              style={{ background: item.color }}
            />
            <span className="activity-text">{item.text}</span>
            <span className="activity-time">{item.time}</span>
          </div>
        ))}
      </div>

      {/* New Claim Modal */}
      {showNewClaimModal && (
        <NewClaimModal
          onClose={() => setShowNewClaimModal(false)}
          onAddClaim={onAddClaim}
        />
      )}
    </div>
  );
}
