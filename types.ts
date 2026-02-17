
export interface Step {
  id: number;
  title: string;
  description: string;
  code?: string;
  fileName?: string;
  tips?: string[];
}

export interface Variable {
  key: string;
  description: string;
  placeholder: string;
}

export interface Workflow {
  name: string;
  description: string;
  json: string;
}

export enum TabType {
  Guide = 'guide',
  Workflows = 'workflows',
  Resources = 'resources',
  Render = 'render',
  AIAssistant = 'ai-assistant'
}
