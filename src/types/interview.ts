export type InterviewRole =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'mobile'
  | 'data'
  | 'product';

export type InterviewPrepResult = {
  jobTitle: string;
  role: InterviewRole;
  technicalQuestions: string[];
  hrQuestions: string[];
  dsaTopics: string[];
  resumeImprovements: string[];
  projectSuggestions: string[];
};

export type InterviewPrepRequest = {
  jobDescription: string;
  role: InterviewRole;
};
