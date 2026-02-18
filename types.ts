
export interface AnalysisResult {
  explanation: string;
  solution: string;
  files: GeneratedFile[];
}

export interface GeneratedFile {
  name: string;
  language: string;
  content: string;
}

export enum Status {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
