/**
 * Formatting utilities
 */

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getConfidenceColor(confidence) {
  if (confidence >= 0.9) return 'var(--color-success)';
  if (confidence >= 0.8) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export function getSeverityColor(severity) {
  switch (severity) {
    case 'Minor':
      return 'var(--color-success)';
    case 'Moderate':
      return 'var(--color-warning)';
    case 'Severe':
      return 'var(--color-danger)';
    default:
      return 'var(--color-text-secondary)';
  }
}
