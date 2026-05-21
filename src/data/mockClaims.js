// Pre-seeded claims data for the prototype
// In production, this would come from a backend API

export const DAMAGE_TYPES = {
  SCRATCH: 'Scratch',
  DENT: 'Dent',
  CRACK: 'Crack',
  SHATTER: 'Shatter',
  STRUCTURAL: 'Structural Damage',
  PAINT: 'Paint Damage',
};

export const SEVERITY_LEVELS = {
  MINOR: 'Minor',
  MODERATE: 'Moderate',
  SEVERE: 'Severe',
};

export const CLAIM_STATUSES = {
  NEW: 'new',
  IN_REVIEW: 'in_review',
  ASSESSED: 'assessed',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  [CLAIM_STATUSES.NEW]: 'New',
  [CLAIM_STATUSES.IN_REVIEW]: 'In Review',
  [CLAIM_STATUSES.ASSESSED]: 'Assessed',
  [CLAIM_STATUSES.PENDING_APPROVAL]: 'Pending Approval',
  [CLAIM_STATUSES.APPROVED]: 'Approved',
  [CLAIM_STATUSES.REJECTED]: 'Rejected',
};

// Sample car damage images (using placeholder URLs — in production these would be real uploads)
const SAMPLE_IMAGES = {
  frontBumper: '/images/front-bumper.png',
  sidePanel: '/images/side-door.png',
  rearDamage: '/images/rear-bumper.png',
  hoodDamage: '/images/hood-headlight.png',
};

export const initialClaims = [
  {
    id: 'CLM-2024-001',
    policyNumber: 'POL-8834721',
    policyholderName: 'Sarah Mitchell',
    policyholderEmail: 'sarah.mitchell@email.com',
    policyholderPhone: '(555) 234-8901',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      vin: '1HGBH41JXMN109186',
    },
    accidentDate: '2024-12-15',
    reportedDate: '2024-12-15',
    accidentDescription:
      'Rear-ended at a traffic light intersection. The other driver was at fault. Police report filed. No injuries reported.',
    accidentLocation: '5th Ave & Main St, Portland, OR',
    coverageType: 'Collision',
    deductible: 500,
    photos: [
      {
        id: 'p1',
        url: SAMPLE_IMAGES.frontBumper,
        label: 'Front bumper damage',
        uploadedAt: '2024-12-15T14:30:00Z',
      },
      {
        id: 'p2',
        url: SAMPLE_IMAGES.hoodDamage,
        label: 'Hood damage',
        uploadedAt: '2024-12-15T14:31:00Z',
      },
    ],
    status: CLAIM_STATUSES.NEW,
    aiAssessment: null,
    estimate: null,
    approval: null,
    agentNotes: '',
    assignedAgent: null,
    createdAt: '2024-12-15T14:00:00Z',
  },
  {
    id: 'CLM-2024-002',
    policyNumber: 'POL-5529103',
    policyholderName: 'James Rodriguez',
    policyholderEmail: 'j.rodriguez@email.com',
    policyholderPhone: '(555) 876-5432',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      color: 'Blue',
      vin: '2HGFC2F59MH523847',
    },
    accidentDate: '2024-12-14',
    reportedDate: '2024-12-14',
    accidentDescription:
      'Side collision in parking lot. Another vehicle backed into the driver side door while parked. Witness available.',
    accidentLocation: 'Riverside Mall Parking, Seattle, WA',
    coverageType: 'Collision',
    deductible: 1000,
    photos: [
      {
        id: 'p3',
        url: SAMPLE_IMAGES.sidePanel,
        label: 'Driver side door damage',
        uploadedAt: '2024-12-14T10:15:00Z',
      },
    ],
    status: CLAIM_STATUSES.NEW,
    aiAssessment: null,
    estimate: null,
    approval: null,
    agentNotes: '',
    assignedAgent: null,
    createdAt: '2024-12-14T10:00:00Z',
  },
  {
    id: 'CLM-2024-003',
    policyNumber: 'POL-7712089',
    policyholderName: 'Emily Chen',
    policyholderEmail: 'emily.chen@email.com',
    policyholderPhone: '(555) 345-6789',
    vehicleInfo: {
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      color: 'Black',
      vin: 'WBA5R1C50KAK12345',
    },
    accidentDate: '2024-12-13',
    reportedDate: '2024-12-13',
    accidentDescription:
      'Hit a deer on Highway 26 at night. Front end damage including bumper, hood, and headlight assembly. Vehicle was towed.',
    accidentLocation: 'Highway 26, Beaverton, OR',
    coverageType: 'Comprehensive',
    deductible: 500,
    photos: [
      {
        id: 'p4',
        url: SAMPLE_IMAGES.frontBumper,
        label: 'Front end damage',
        uploadedAt: '2024-12-13T22:45:00Z',
      },
      {
        id: 'p5',
        url: SAMPLE_IMAGES.hoodDamage,
        label: 'Hood and headlight damage',
        uploadedAt: '2024-12-13T22:46:00Z',
      },
      {
        id: 'p6',
        url: SAMPLE_IMAGES.rearDamage,
        label: 'Additional angle',
        uploadedAt: '2024-12-13T22:47:00Z',
      },
    ],
    status: CLAIM_STATUSES.IN_REVIEW,
    aiAssessment: null,
    estimate: null,
    approval: null,
    agentNotes: '',
    assignedAgent: 'Agent Thompson',
    createdAt: '2024-12-13T23:00:00Z',
  },
  {
    id: 'CLM-2024-004',
    policyNumber: 'POL-3345678',
    policyholderName: 'Michael Foster',
    policyholderEmail: 'm.foster@email.com',
    policyholderPhone: '(555) 901-2345',
    vehicleInfo: {
      make: 'Ford',
      model: 'F-150',
      year: 2020,
      color: 'White',
      vin: '1FTEW1EP5LFA98765',
    },
    accidentDate: '2024-12-10',
    reportedDate: '2024-12-10',
    accidentDescription:
      'Minor fender bender in drive-through lane. Bumper scratches and small dent on rear quarter panel.',
    accidentLocation: 'Main St, Austin, TX',
    coverageType: 'Collision',
    deductible: 500,
    photos: [
      {
        id: 'p7',
        url: SAMPLE_IMAGES.rearDamage,
        label: 'Rear bumper scratches',
        uploadedAt: '2024-12-10T16:00:00Z',
      },
    ],
    status: CLAIM_STATUSES.APPROVED,
    aiAssessment: {
      damageAreas: [
        {
          part: 'Rear Bumper',
          type: DAMAGE_TYPES.SCRATCH,
          severity: SEVERITY_LEVELS.MINOR,
          confidence: 0.94,
          repairAction: 'Buff & Repaint',
        },
        {
          part: 'Rear Quarter Panel',
          type: DAMAGE_TYPES.DENT,
          severity: SEVERITY_LEVELS.MINOR,
          confidence: 0.88,
          repairAction: 'Paintless Dent Repair',
        },
      ],
      overallSeverity: SEVERITY_LEVELS.MINOR,
      processingTime: '1.8s',
      recommendation: 'Minor damage — standard repair authorization recommended.',
    },
    estimate: {
      lineItems: [
        { description: 'Rear Bumper — Buff & Repaint', parts: 85, labor: 220 },
        { description: 'Rear Quarter Panel — PDR', parts: 0, labor: 180 },
        { description: 'Paint Materials & Blending', parts: 120, labor: 0 },
      ],
      totalCost: 605,
      confidenceRange: { low: 520, high: 690 },
      adjustedByAgent: false,
    },
    approval: {
      decision: 'approved',
      reviewer: 'Sr. Adjuster Williams',
      comments: 'Straightforward minor damage. Approved for repair at authorized shop.',
      decidedAt: '2024-12-11T09:30:00Z',
      authorizedShop: 'AutoBody Pros — Downtown Austin',
    },
    agentNotes: 'Clear-cut minor damage case. AI assessment aligned with manual review.',
    assignedAgent: 'Agent Martinez',
    createdAt: '2024-12-10T16:30:00Z',
  },
  {
    id: 'CLM-2024-005',
    policyNumber: 'POL-9981234',
    policyholderName: 'Lisa Nakamura',
    policyholderEmail: 'l.nakamura@email.com',
    policyholderPhone: '(555) 567-8901',
    vehicleInfo: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      color: 'Red',
      vin: '5YJ3E1EA5NF234567',
    },
    accidentDate: '2024-12-12',
    reportedDate: '2024-12-12',
    accidentDescription:
      'Collision at intersection. T-boned by vehicle running red light. Significant damage to driver side. Airbags deployed.',
    accidentLocation: 'Oak Blvd & 12th St, San Francisco, CA',
    coverageType: 'Collision',
    deductible: 1000,
    photos: [
      {
        id: 'p8',
        url: SAMPLE_IMAGES.sidePanel,
        label: 'Driver side impact',
        uploadedAt: '2024-12-12T19:00:00Z',
      },
      {
        id: 'p9',
        url: SAMPLE_IMAGES.frontBumper,
        label: 'Front quarter damage',
        uploadedAt: '2024-12-12T19:01:00Z',
      },
    ],
    status: CLAIM_STATUSES.PENDING_APPROVAL,
    aiAssessment: {
      damageAreas: [
        {
          part: 'Driver Side Door',
          type: DAMAGE_TYPES.STRUCTURAL,
          severity: SEVERITY_LEVELS.SEVERE,
          confidence: 0.91,
          repairAction: 'Full Replacement',
        },
        {
          part: 'B-Pillar',
          type: DAMAGE_TYPES.STRUCTURAL,
          severity: SEVERITY_LEVELS.SEVERE,
          confidence: 0.85,
          repairAction: 'Structural Repair & Replacement',
        },
        {
          part: 'Driver Side Window',
          type: DAMAGE_TYPES.SHATTER,
          severity: SEVERITY_LEVELS.SEVERE,
          confidence: 0.97,
          repairAction: 'Full Replacement',
        },
        {
          part: 'Side Mirror Assembly',
          type: DAMAGE_TYPES.CRACK,
          severity: SEVERITY_LEVELS.MODERATE,
          confidence: 0.89,
          repairAction: 'Replace',
        },
        {
          part: 'Front Quarter Panel',
          type: DAMAGE_TYPES.DENT,
          severity: SEVERITY_LEVELS.MODERATE,
          confidence: 0.82,
          repairAction: 'Repair & Repaint',
        },
      ],
      overallSeverity: SEVERITY_LEVELS.SEVERE,
      processingTime: '3.1s',
      recommendation:
        'Significant structural damage detected. Recommend detailed structural inspection before repair authorization. Potential total loss evaluation needed.',
    },
    estimate: {
      lineItems: [
        { description: 'Driver Side Door — Full Replacement', parts: 2800, labor: 650 },
        { description: 'B-Pillar — Structural Repair', parts: 1200, labor: 1800 },
        { description: 'Driver Window — Replacement', parts: 450, labor: 180 },
        { description: 'Side Mirror Assembly — Replace', parts: 380, labor: 120 },
        { description: 'Front Quarter Panel — Repair & Repaint', parts: 350, labor: 480 },
        { description: 'Airbag Replacement (Driver)', parts: 1100, labor: 400 },
        { description: 'Paint & Finishing', parts: 280, labor: 350 },
        { description: 'Structural Alignment Check', parts: 0, labor: 250 },
      ],
      totalCost: 10790,
      confidenceRange: { low: 9200, high: 12400 },
      adjustedByAgent: true,
    },
    approval: null,
    agentNotes:
      'High-value claim. AI flagged structural damage — added airbag replacement line item manually. Recommend in-person inspection before final authorization.',
    assignedAgent: 'Agent Thompson',
    createdAt: '2024-12-12T19:30:00Z',
  },
];

// Dashboard metrics (simulated aggregate data)
export const dashboardMetrics = {
  avgProcessingTime: { value: '4.2 min', previousValue: '32 min', label: 'Avg Processing Time', improvement: '87%' },
  claimsToday: { value: 24, label: 'Claims Processed Today' },
  aiAccuracy: { value: '94.2%', label: 'AI Assessment Accuracy' },
  costSavings: { value: '$12,400', label: 'Est. Cost Savings (Monthly)' },
  pendingReview: { value: 3, label: 'Pending Review' },
};
