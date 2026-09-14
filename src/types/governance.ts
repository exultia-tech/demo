export type RequirementLevel = 'MUST' | 'MANDATORY' | 'PROHIBITED' | 'REQUIRED' | 'COMPENSATING';

export interface ControlSpecification {
  id: string; // e.g. "AC-01", "PS-01"
  pillarCode: 'AC' | 'DG' | 'NA' | 'AU' | 'PT' | 'PS' | 'LE' | 'PR';
  title: string;
  requirementLevel: RequirementLevel;
  statement: string;
  detailedNotes?: string[];
  subClauses?: {
    label: string;
    description: string;
  }[];
  crossWalk: {
    nist: string;
    iso: string;
    cjis: string;
    statutory: string;
  };
}

export interface FrameworkPillar {
  code: 'AC' | 'DG' | 'NA' | 'AU' | 'PT' | 'PS' | 'LE' | 'PR';
  number: number;
  name: string;
  shortName: string;
  description: string;
  color: string;
  accentBg: string;
  borderColor: string;
  iconName: string;
  controlsCount: number;
}

export interface CrossWalkItem {
  controlId: string;
  controlName: string;
  pillar: string;
  nist: string;
  iso: string;
  cjis: string;
  statutory: string;
}

export interface RolloutPhase {
  phase: number;
  title: string;
  summary: string;
  timeframe: string;
  targetMilestones: string[];
  responsibleStakeholders: string[];
}

export interface GovernanceFrameworkMeta {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  version: string;
  status: 'Active Standard' | 'Incubation' | 'Draft Proposed';
  category: 'Surveillance & Sensors' | 'Autonomous Systems' | 'Computer Vision & AI' | 'Smart Infrastructure';
  executiveSummary: string;
  scope: string;
  targetAudience: string[];
  pillars: FrameworkPillar[];
  controls: ControlSpecification[];
  crossWalk: CrossWalkItem[];
  rolloutPhases: RolloutPhase[];
  markdownExport: string;
}
