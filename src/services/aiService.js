/**
 * Simulated AI Service
 * 
 * In production, this would call a computer vision model (e.g., fine-tuned 
 * on car damage datasets) via API. The model would:
 * 1. Detect and segment damage areas in photos
 * 2. Classify damage type and severity
 * 3. Cross-reference with repair cost databases
 * 4. Generate a structured assessment with confidence scores
 * 
 * For this prototype, we simulate realistic responses with processing delays.
 */

import { DAMAGE_TYPES, SEVERITY_LEVELS } from '../data/mockClaims';

// Simulated damage detection results based on image analysis
const DAMAGE_TEMPLATES = [
  [
    {
      part: 'Front Bumper',
      type: DAMAGE_TYPES.DENT,
      severity: SEVERITY_LEVELS.MODERATE,
      confidence: 0.87,
      repairAction: 'Replace',
      estimatedParts: 650,
      estimatedLabor: 320,
      boundingBox: { x: 15, y: 55, w: 45, h: 30 },
    },
    {
      part: 'Hood',
      type: DAMAGE_TYPES.SCRATCH,
      severity: SEVERITY_LEVELS.MINOR,
      confidence: 0.92,
      repairAction: 'Repair & Repaint',
      estimatedParts: 120,
      estimatedLabor: 280,
      boundingBox: { x: 20, y: 20, w: 50, h: 35 },
    },
    {
      part: 'Left Headlight Assembly',
      type: DAMAGE_TYPES.CRACK,
      severity: SEVERITY_LEVELS.SEVERE,
      confidence: 0.78,
      repairAction: 'Replace',
      estimatedParts: 480,
      estimatedLabor: 150,
      boundingBox: { x: 5, y: 40, w: 20, h: 22 },
    },
    {
      part: 'Grille',
      type: DAMAGE_TYPES.CRACK,
      severity: SEVERITY_LEVELS.MODERATE,
      confidence: 0.83,
      repairAction: 'Replace',
      estimatedParts: 220,
      estimatedLabor: 90,
      boundingBox: { x: 25, y: 42, w: 35, h: 18 },
    },
  ],
  [
    {
      part: 'Rear Bumper',
      type: DAMAGE_TYPES.DENT,
      severity: SEVERITY_LEVELS.MODERATE,
      confidence: 0.91,
      repairAction: 'Replace',
      estimatedParts: 580,
      estimatedLabor: 290,
      boundingBox: { x: 10, y: 58, w: 50, h: 28 },
    },
    {
      part: 'Trunk Lid',
      type: DAMAGE_TYPES.DENT,
      severity: SEVERITY_LEVELS.MINOR,
      confidence: 0.85,
      repairAction: 'Paintless Dent Repair',
      estimatedParts: 0,
      estimatedLabor: 200,
      boundingBox: { x: 20, y: 15, w: 45, h: 40 },
    },
    {
      part: 'Right Tail Light',
      type: DAMAGE_TYPES.CRACK,
      severity: SEVERITY_LEVELS.MODERATE,
      confidence: 0.89,
      repairAction: 'Replace',
      estimatedParts: 320,
      estimatedLabor: 120,
      boundingBox: { x: 65, y: 35, w: 22, h: 25 },
    },
  ],
  [
    {
      part: 'Driver Side Door',
      type: DAMAGE_TYPES.DENT,
      severity: SEVERITY_LEVELS.SEVERE,
      confidence: 0.93,
      repairAction: 'Replace',
      estimatedParts: 1200,
      estimatedLabor: 450,
      boundingBox: { x: 25, y: 20, w: 40, h: 50 },
    },
    {
      part: 'Driver Side Window',
      type: DAMAGE_TYPES.SHATTER,
      severity: SEVERITY_LEVELS.SEVERE,
      confidence: 0.97,
      repairAction: 'Replace',
      estimatedParts: 350,
      estimatedLabor: 150,
      boundingBox: { x: 30, y: 8, w: 30, h: 28 },
    },
    {
      part: 'Side Mirror',
      type: DAMAGE_TYPES.CRACK,
      severity: SEVERITY_LEVELS.MODERATE,
      confidence: 0.86,
      repairAction: 'Replace',
      estimatedParts: 280,
      estimatedLabor: 90,
      boundingBox: { x: 5, y: 15, w: 18, h: 20 },
    },
    {
      part: 'Rocker Panel',
      type: DAMAGE_TYPES.SCRATCH,
      severity: SEVERITY_LEVELS.MINOR,
      confidence: 0.79,
      repairAction: 'Repair & Repaint',
      estimatedParts: 80,
      estimatedLabor: 220,
      boundingBox: { x: 15, y: 72, w: 55, h: 15 },
    },
  ],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateOverallSeverity(damageAreas) {
  const severityOrder = [SEVERITY_LEVELS.MINOR, SEVERITY_LEVELS.MODERATE, SEVERITY_LEVELS.SEVERE];
  const maxSeverity = damageAreas.reduce((max, area) => {
    const currentIndex = severityOrder.indexOf(area.severity);
    const maxIndex = severityOrder.indexOf(max);
    return currentIndex > maxIndex ? area.severity : max;
  }, SEVERITY_LEVELS.MINOR);
  return maxSeverity;
}

function generateRecommendation(overallSeverity, damageAreas) {
  const hasStructural = damageAreas.some(
    (a) => a.type === DAMAGE_TYPES.STRUCTURAL || a.severity === SEVERITY_LEVELS.SEVERE
  );

  if (hasStructural) {
    return 'Significant damage detected. Recommend detailed inspection before repair authorization. Consider total loss evaluation for structural damage.';
  }
  if (overallSeverity === SEVERITY_LEVELS.MODERATE) {
    return 'Moderate damage identified. Standard repair authorization recommended. No structural concerns detected.';
  }
  return 'Minor damage — standard repair authorization recommended. Quick turnaround expected.';
}

/**
 * Simulate AI damage assessment
 * Adds realistic processing delay and returns structured assessment
 */
export async function analyzeDamage(photos, onProgress) {
  const startTime = performance.now();

  // Simulate processing stages
  if (onProgress) onProgress({ stage: 'uploading', message: 'Uploading images to AI model...', percent: 10 });
  await sleep(600);

  if (onProgress) onProgress({ stage: 'detecting', message: 'Detecting damage areas...', percent: 30 });
  await sleep(800);

  if (onProgress) onProgress({ stage: 'classifying', message: 'Classifying damage severity...', percent: 55 });
  await sleep(700);

  if (onProgress) onProgress({ stage: 'estimating', message: 'Cross-referencing repair databases...', percent: 75 });
  await sleep(600);

  if (onProgress) onProgress({ stage: 'generating', message: 'Generating assessment report...', percent: 90 });
  await sleep(400);

  // Select a template based on number of photos (deterministic for demo consistency)
  const templateIndex = photos.length % DAMAGE_TEMPLATES.length;
  const damageAreas = DAMAGE_TEMPLATES[templateIndex].map((area) => ({
    part: area.part,
    type: area.type,
    severity: area.severity,
    confidence: area.confidence,
    repairAction: area.repairAction,
    boundingBox: area.boundingBox,
  }));

  const overallSeverity = calculateOverallSeverity(damageAreas);
  const endTime = performance.now();
  const processingTime = ((endTime - startTime) / 1000).toFixed(1);

  if (onProgress) onProgress({ stage: 'complete', message: 'Assessment complete', percent: 100 });

  return {
    damageAreas,
    overallSeverity,
    processingTime: `${processingTime}s`,
    recommendation: generateRecommendation(overallSeverity, damageAreas),
    modelVersion: 'DamageNet v2.4',
    analyzedPhotos: photos.length,
  };
}

/**
 * Generate cost estimate from AI assessment
 */
export function generateEstimate(assessment) {
  // Find the matching template to get cost data
  const template = DAMAGE_TEMPLATES.find((t) =>
    t.some((area) => area.part === assessment.damageAreas[0]?.part)
  );

  if (!template) {
    // Fallback estimate
    return {
      lineItems: assessment.damageAreas.map((area) => ({
        description: `${area.part} — ${area.repairAction}`,
        parts: Math.round(200 + Math.random() * 800),
        labor: Math.round(100 + Math.random() * 400),
      })),
      totalCost: 0,
      confidenceRange: { low: 0, high: 0 },
      adjustedByAgent: false,
    };
  }

  const lineItems = template.map((area) => ({
    description: `${area.part} — ${area.repairAction}`,
    parts: area.estimatedParts,
    labor: area.estimatedLabor,
  }));

  // Add paint & materials line item
  lineItems.push({
    description: 'Paint Materials & Blending',
    parts: 150,
    labor: 0,
  });

  const totalCost = lineItems.reduce((sum, item) => sum + item.parts + item.labor, 0);

  return {
    lineItems,
    totalCost,
    confidenceRange: {
      low: Math.round(totalCost * 0.85),
      high: Math.round(totalCost * 1.15),
    },
    adjustedByAgent: false,
  };
}
