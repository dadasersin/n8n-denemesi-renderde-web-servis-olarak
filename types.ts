
export interface AnalysisResult {
  diagnosis: string;
  probableCauses: string[];
  suggestedFixes: {
    title: string;
    description: string;
    code?: string;
  }[];
}

export enum DiagnosticStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
