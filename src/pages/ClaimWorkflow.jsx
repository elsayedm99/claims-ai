import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { PhotoGallery } from '../components/PhotoGallery';
import { AIAssessment } from '../components/AIAssessment';
import { AgentReview } from '../components/AgentReview';
import { CostEstimate } from '../components/CostEstimate';
import { ApprovalPanel } from '../components/ApprovalPanel';
import { analyzeDamage, generateEstimate } from '../services/aiService';
import { formatDate } from '../utils/formatters';

const STEPS = [
  { label: 'Claim Info', number: 1 },
  { label: 'Photos', number: 2 },
  { label: 'AI Analysis', number: 3 },
  { label: 'Agent Review', number: 4 },
  { label: 'Cost Estimate', number: 5 },
  { label: 'Approval', number: 6 },
];

export function ClaimWorkflow({ claims, onUpdateClaim, role = 'agent' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = claims.find((c) => c.id === id);

  if (!claim) {
    return (
      <div className="card fade-in" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <h2>Claim Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-lg) 0' }}>The claim "{id}" could not be found.</p>
        <Link to="/" className="btn btn-primary">← Back to Dashboard</Link>
      </div>
    );
  }

  const [activeStep, setActiveStep] = useState(1);
  const [photos, setPhotos] = useState(claim?.photos || []);
  const [aiAssessment, setAiAssessment] = useState(claim?.aiAssessment || null);
  const [estimate, setEstimate] = useState(claim?.estimate || null);
  const [approval, setApproval] = useState(claim?.approval || null);
  const [agentNotes, setAgentNotes] = useState(claim?.agentNotes || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ stage: '', message: '', percent: 0 });
  const [reviewConfirmed, setReviewConfirmed] = useState(false);

  const updateClaim = useCallback(
    (updates) => {
      if (onUpdateClaim && claim) {
        onUpdateClaim({ ...claim, ...updates });
      }
    },
    [onUpdateClaim, claim]
  );

  if (!claim) {
    return (
      <div className="app-main">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <h2>Claim Not Found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-md)' }}>
            The claim "{id}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Determine which steps are completed
  const getStepStatus = (stepNumber) => {
    if (stepNumber === 1) return 'completed'; // claim info always available
    if (stepNumber === 2) return photos.length > 0 ? 'completed' : 'pending';
    if (stepNumber === 3) return aiAssessment ? 'completed' : 'pending';
    if (stepNumber === 4) return reviewConfirmed ? 'completed' : 'pending';
    if (stepNumber === 5) return estimate ? 'completed' : 'pending';
    if (stepNumber === 6) return approval ? 'completed' : 'pending';
    return 'pending';
  };

  const isStepClickable = (stepNumber) => {
    if (stepNumber === 1) return true;
    // Can click if the previous step is completed or it's the current step
    return getStepStatus(stepNumber - 1) === 'completed' || stepNumber === activeStep;
  };

  const handleStepClick = (stepNumber) => {
    if (isStepClickable(stepNumber)) {
      setActiveStep(stepNumber);
    }
  };

  const handlePhotoUpload = (newPhoto) => {
    const updated = [...photos, newPhoto];
    setPhotos(updated);
    updateClaim({ photos: updated });
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress({ stage: '', message: 'Starting...', percent: 0 });

    try {
      const result = await analyzeDamage(photos, (p) => setProgress(p));
      setAiAssessment(result);
      updateClaim({ aiAssessment: result, status: 'in_review' });
    } catch (err) {
      console.error('AI analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmReview = () => {
    setReviewConfirmed(true);

    // Generate estimate when review is confirmed
    if (aiAssessment) {
      const est = generateEstimate(aiAssessment);
      setEstimate(est);
      updateClaim({
        agentNotes,
        estimate: est,
        status: 'assessed',
      });
    }

    setActiveStep(5);
  };

  const handleApprove = (data) => {
    if (data.status === 'pending_approval') {
      // Agent submitting for review
      updateClaim({ status: 'pending_approval', agentNotes });
      setApproval(null);
      // Navigate back to dashboard after submission
      setTimeout(() => navigate('/'), 600);
    } else {
      // Adjuster approving
      setApproval(data);
      updateClaim({ approval: data, status: 'approved' });
      setTimeout(() => navigate('/'), 1200);
    }
  };

  const handleReject = (data) => {
    setApproval(data);
    updateClaim({ approval: data, status: 'rejected' });
    setTimeout(() => navigate('/'), 1200);
  };

  const handleContinue = () => {
    if (activeStep < 6) {
      setActiveStep(activeStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="card fade-in">
            <div className="card-header">
              <h2 className="card-title">📄 Claim Information</h2>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Policy Number</span>
                <span className="info-value">{claim.policyNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Accident Date</span>
                <span className="info-value">{formatDate(claim.accidentDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{claim.accidentLocation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vehicle</span>
                <span className="info-value">
                  {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} ({claim.vehicleInfo.color})
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Coverage Type</span>
                <span className="info-value">
                  <span className="coverage-badge">{claim.coverageType || 'Collision'}</span>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Deductible</span>
                <span className="info-value">${claim.deductible || 500}</span>
              </div>
              <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                <span className="info-label">Description</span>
                <span className="info-value">{claim.accidentDescription}</span>
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={handleContinue}>
                Continue →
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="fade-in">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📷 Damage Photos</h2>
              </div>
              <PhotoGallery photos={photos} onUpload={handlePhotoUpload} />
            </div>
            {photos.length > 0 && (
              <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleContinue}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="fade-in">
            <AIAssessment
              assessment={aiAssessment}
              photos={photos}
              onAnalyze={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
              progress={progress}
            />
            {aiAssessment && (
              <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleContinue}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="fade-in">
            <AgentReview
              assessment={aiAssessment}
              photos={photos}
              agentNotes={agentNotes}
              onNotesChange={setAgentNotes}
              onConfirm={handleConfirmReview}
              confirmed={reviewConfirmed}
            />
          </div>
        );

      case 5:
        return (
          <div className="fade-in">
            <CostEstimate estimate={estimate} assessment={aiAssessment} />
            {estimate && (
              <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleContinue}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="fade-in">
            <ApprovalPanel
              claim={claim}
              estimate={estimate}
              assessment={aiAssessment}
              onApprove={handleApprove}
              onReject={handleReject}
              approval={approval}
              role={role}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <div className="claim-detail-header">
        <div className="claim-detail-title">
          <h1>{claim.id}</h1>
          <p>{claim.policyholderName}</p>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="workflow-steps">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.number);
          const isActive = step.number === activeStep;
          const className = [
            'workflow-step',
            isActive ? 'active' : '',
            status === 'completed' && !isActive ? 'completed' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
              {index > 0 && (
                <div
                  className={`workflow-step-connector ${
                    getStepStatus(step.number - 1) === 'completed' ? 'completed' : ''
                  }`}
                />
              )}
              <div
                className={className}
                onClick={() => handleStepClick(step.number)}
                style={{ cursor: isStepClickable(step.number) ? 'pointer' : 'not-allowed' }}
              >
                <span className="workflow-step-number">
                  {status === 'completed' && !isActive ? '✓' : step.number}
                </span>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {renderStepContent()}
    </div>
  );
}
