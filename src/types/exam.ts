export type ModuleId = 'A' | 'B' | 'C' | 'D';
export type QuestionType = 'mcq' | 'code' | 'essay';
export type QuizMode = 'practice' | 'exam';

export interface Option {
  key: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  module: ModuleId;
  type: QuestionType;
  points: number;
  prompt: string;
  tags?: string[];
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq';
  options: Option[];
  answer: string;
  explanation: string;
}

export interface OpenQuestion extends BaseQuestion {
  type: 'code' | 'essay';
  modelAnswer: string;
  rubric: string[];
}

export type Question = McqQuestion | OpenQuestion;

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalPoints: number;
  disclaimer: string;
  questions: Question[];
}

export interface AnswerState {
  selected?: string;
  text?: string;
  selfGrade?: 'pass' | 'fail';
}

export const MODULE_LABELS: Record<ModuleId, string> = {
  A: 'Toán học & tư duy định lượng',
  B: 'Python / NumPy / Pandas',
  C: 'AI & tư duy sản phẩm AI',
  D: 'Logic / đạo đức / hành vi'
};
