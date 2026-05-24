import type { InterviewPrepResult } from '@/types/interview';
import type { gradients } from '@/constants/theme';

export type ResultSectionKey =
  | 'technicalQuestions'
  | 'hrQuestions'
  | 'dsaTopics'
  | 'resumeImprovements'
  | 'projectSuggestions';

export type SectionAccent = keyof typeof gradients;

export type ResultSectionConfig = {
  key: ResultSectionKey;
  title: string;
  description: string;
  badge: string;
  icon: string;
  accent: SectionAccent;
  glowColor: string;
};

export const RESULT_SECTIONS: ResultSectionConfig[] = [
  {
    key: 'technicalQuestions',
    title: 'Technical Questions',
    description: 'Practice explaining your reasoning out loud.',
    badge: 'Tech',
    icon: 'flash',
    accent: 'violet',
    glowColor: '#A855F7',
  },
  {
    key: 'hrQuestions',
    title: 'HR Questions',
    description: 'Use the STAR method for structured answers.',
    badge: 'HR',
    icon: 'chatbubbles',
    accent: 'pink',
    glowColor: '#EC4899',
  },
  {
    key: 'dsaTopics',
    title: 'DSA Topics',
    description: 'Review these before timed coding rounds.',
    badge: 'DSA',
    icon: 'code-slash',
    accent: 'orange',
    glowColor: '#F97316',
  },
  {
    key: 'resumeImprovements',
    title: 'Resume Tips',
    description: 'Actionable edits tailored to this posting.',
    badge: 'CV',
    icon: 'document-text',
    accent: 'primary',
    glowColor: '#6366F1',
  },
  {
    key: 'projectSuggestions',
    title: 'Project Ideas',
    description: 'Portfolio builds that align with the role.',
    badge: 'Build',
    icon: 'rocket',
    accent: 'green',
    glowColor: '#22C55E',
  },
];

export function getTotalItemCount(result: InterviewPrepResult): number {
  return RESULT_SECTIONS.reduce((sum, section) => sum + result[section.key].length, 0);
}
