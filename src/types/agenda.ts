export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  attendance: 'required' | 'optional' | 'observer';
  avatarColor: string;
  keyObjective: string;
  prepItem?: string;
  email?: string;
}

export interface AgendaTopic {
  id: string;
  title: string;
  durationMinutes: number;
  order: number;
  phase: 'Kickoff' | 'Alignment' | 'Deep Dive' | 'Discussion & Debate' | 'Decisions' | 'Action Items & Wrap-up';
  category: 'Strategy' | 'Architecture' | 'Operations' | 'Budget' | 'Milestones' | 'Risk & Compliance' | 'Team & Culture';
  leadStakeholderId: string;
  participantStakeholderIds: string[];
  goal: 'Decision Needed' | 'Inform / Review' | 'Brainstorm / Solutioning' | 'Problem Solving' | 'Approval';
  discussionPoints: string[];
  expectedOutcome: string;
  notes?: string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'skipped';
}

export interface MeetingAgenda {
  id: string;
  title: string;
  summary: string;
  objective: string;
  date: string;
  startTime: string; // "10:00"
  targetDurationMinutes: number;
  meetingType: 'Executive Review' | 'Sprint & Architecture Sync' | 'Strategy & Planning' | 'Decision-Making Sync' | 'Cross-Functional Alignment' | 'Kickoff & Discovery';
  docContextSummary: string;
  stakeholders: Stakeholder[];
  topics: AgendaTopic[];
  keyRisks: string[];
  preparationChecklist: string[];
  decisionsNeeded: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'apply_agenda' | 'add_topic' | 'adjust_duration';
    payload?: any;
    label: string;
  };
}

export type CopilotRole = 'facilitator' | 'devils_advocate' | 'scribe' | 'prep_coach';

export interface CopilotRoleInfo {
  id: CopilotRole;
  name: string;
  shortDesc: string;
  systemInstruction: string;
  icon: string;
  starterPrompts: string[];
}
