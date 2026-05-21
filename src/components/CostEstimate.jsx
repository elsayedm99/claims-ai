import { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

export function CostEstimate({ estimate, assessment, onUpdateEstimate }) {
  const [lineItems, setLineItems] = useState(estimate?.lineItems || []);
  const [isEdited, setIsEdited] = useState(false);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemParts, setNewItemParts] = useState('');
  const [newItemLabor, setNewItemLabor] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!estimate) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-state-icon">💰</span>
          <p>Complete the assessment review to generate a cost estimate.</p>
        </div>
      </div>
    );
  }

  const totalParts = lineItems.reduce((s, i) => s + i.parts, 0);
  const totalLabor = lineItems.reduce((s, i) => s + i.labor, 0);
  const totalCost = totalParts + totalLabor;
  const partsPercent = totalCost > 0 ? Math.round((totalParts / totalCost) * 100) : 50;
  const laborPercent = 100 - partsPercent;

  const handleCostChange = (index, field, value) => {
    const numValue = parseFloat(value) || 0;
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: numValue } : item))
    );
    setIsEdited(true);
  };

  const handleAddItem = () => {
    if (!newItemDesc.trim()) return;
    const newItem = {
      description: newItemDesc,
      parts: parseFloat(newItemParts) || 0,
      labor: parseFloat(newItemLabor) || 0,
    };
    setLineItems((prev) => [...prev, newItem]);
    setNewItemDesc('');
    setNewItemParts('');
    setNewItemLabor('');
    setShowAddForm(false);
    setIsEdited(true);
  };

  const handleRemoveItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
    setIsEdited(true);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">💰 AI-Generated Cost Estimate</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {isEdited && (
            <span className="estimate-adjusted-badge">Agent Adjusted</span>
          )}
          <div className="ai-model-badge">
            <span className="ai-model-badge-dot" />
            DamageNet v2.4
          </div>
        </div>
      </div>

      {/* Cost breakdown bar */}
      <div className="cost-breakdown-bar">
        <div className="cost-breakdown-segment parts" style={{ width: `${partsPercent}%` }}>
          Parts {partsPercent}%
        </div>
        <div className="cost-breakdown-segment labor" style={{ width: `${laborPercent}%` }}>
          Labor {laborPercent}%
        </div>
      </div>

      {/* Line items table */}
      <table className="estimate-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Parts</th>
            <th style={{ textAlign: 'right' }}>Labor</th>
            <th style={{ textAlign: 'right' }}>Total</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td style={{ textAlign: 'right' }}>
                <input
                  className="estimate-edit-input"
                  type="number"
                  value={item.parts}
                  onChange={(e) => handleCostChange(index, 'parts', e.target.value)}
                  min="0"
                  step="10"
                />
              </td>
              <td style={{ textAlign: 'right' }}>
                <input
                  className="estimate-edit-input"
                  type="number"
                  value={item.labor}
                  onChange={(e) => handleCostChange(index, 'labor', e.target.value)}
                  min="0"
                  step="10"
                />
              </td>
              <td style={{ textAlign: 'right', fontWeight: 500 }}>
                {formatCurrency(item.parts + item.labor)}
              </td>
              <td>
                <button
                  className="btn-icon-only"
                  onClick={() => handleRemoveItem(index)}
                  title="Remove line item"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Total Estimated Cost</td>
            <td style={{ textAlign: 'right' }}>{formatCurrency(totalParts)}</td>
            <td style={{ textAlign: 'right' }}>{formatCurrency(totalLabor)}</td>
            <td style={{ textAlign: 'right', color: 'var(--color-accent)', fontSize: 'var(--font-size-lg)' }}>
              {formatCurrency(totalCost)}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Add line item */}
      {showAddForm ? (
        <div className="add-line-item-form">
          <input
            className="form-input"
            placeholder="Description (e.g., Airbag Replacement)"
            value={newItemDesc}
            onChange={(e) => setNewItemDesc(e.target.value)}
          />
          <input
            className="form-input estimate-cost-input"
            type="number"
            placeholder="Parts $"
            value={newItemParts}
            onChange={(e) => setNewItemParts(e.target.value)}
          />
          <input
            className="form-input estimate-cost-input"
            type="number"
            placeholder="Labor $"
            value={newItemLabor}
            onChange={(e) => setNewItemLabor(e.target.value)}
          />
          <button className="btn btn-sm btn-primary" onClick={handleAddItem}>Add</button>
          <button className="btn btn-sm btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      ) : (
        <button
          className="btn btn-sm btn-secondary"
          style={{ marginTop: 'var(--space-md)' }}
          onClick={() => setShowAddForm(true)}
        >
          + Add Line Item
        </button>
      )}

      {/* Confidence range */}
      <div className="estimate-range">
        <div className="estimate-range-visual">
          <div className="estimate-range-bar">
            <div className="estimate-range-marker low" style={{ left: '0%' }}>
              <span>{formatCurrency(estimate.confidenceRange.low)}</span>
            </div>
            <div className="estimate-range-fill" />
            <div className="estimate-range-marker mid" style={{ left: '50%' }}>
              <span>{formatCurrency(totalCost)}</span>
            </div>
            <div className="estimate-range-marker high" style={{ left: '100%' }}>
              <span>{formatCurrency(estimate.confidenceRange.high)}</span>
            </div>
          </div>
          <div className="estimate-range-labels">
            <span>Low</span>
            <span>Estimate</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="cost-estimate-note">
        📊 Based on DamageNet v2.4 analysis cross-referenced with industry repair cost databases and regional labor rates.
        {isEdited && ' Costs have been manually adjusted by the reviewing agent.'}
      </div>
    </div>
  );
}
