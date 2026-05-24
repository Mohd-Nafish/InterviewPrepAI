import type { InterviewPrepRequest, InterviewPrepResult } from '@/types/interview';

/**
 * Local mock generator for development — no Gemini API usage.
 */
export async function generateMockInterviewPrep(
  request: InterviewPrepRequest,
): Promise<InterviewPrepResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const jobTitle = extractJobTitle(request.jobDescription);

  return {
    jobTitle,
    role: request.role,
    technicalQuestions: [
      `How would you design a scalable ${request.role} feature for this role?`,
      'Walk through debugging a production issue end to end.',
      'Explain trade-offs between performance, maintainability, and delivery speed.',
      'How do you test critical paths before release?',
      'Describe a system/component you would refactor from this job description.',
    ],
    hrQuestions: [
      'Tell me about a time you handled conflicting priorities.',
      'Describe a failure, what you learned, and what changed afterward.',
      'Why are you interested in this role and company?',
      'How do you collaborate with cross-functional partners?',
      'Share an example of receiving difficult feedback.',
    ],
    dsaTopics: [
      'Arrays & hash maps',
      'Trees and graphs',
      'Sorting and searching',
      'Dynamic programming basics',
      'System design fundamentals',
    ],
    resumeImprovements: [
      'Add measurable impact metrics to your top 3 bullets.',
      'Mirror keywords from the job description in your skills section.',
      'Highlight one project that matches the posting’s core stack.',
      'Move your strongest relevant experience above less relevant roles.',
      'Add a short summary tailored to this role’s seniority level.',
    ],
    projectSuggestions: [
      'Build a role-specific portfolio app with tests and CI.',
      'Create a mini service with API docs and monitoring dashboards.',
      'Contribute a focused PR to an open-source tool used in this stack.',
      'Ship a performance case study with before/after metrics.',
      'Add a README that explains architecture decisions clearly.',
    ],
  };
}

function extractJobTitle(jobDescription: string): string {
  const firstLine = jobDescription.trim().split('\n')[0]?.trim();
  if (!firstLine) return 'Interview Prep (Mock)';
  return firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
}
