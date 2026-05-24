import type { InterviewPrepResult } from '@/types/interview';

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  Result: {
    result: InterviewPrepResult;
    sessionId?: string;
    notice?: string;
  };
};
