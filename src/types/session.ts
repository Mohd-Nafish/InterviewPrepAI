import type { InterviewPrepResult } from './interview';

export type PrepSession = {
  id: string;
  createdAt: string;
  jobDescription: string;
  result: InterviewPrepResult;
};

export type CreatePrepSessionInput = {
  jobDescription: string;
  result: InterviewPrepResult;
};
