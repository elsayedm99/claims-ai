import { STATUS_LABELS } from '../data/mockClaims';

export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge-dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
