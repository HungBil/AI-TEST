import type { Exam, QuizMode } from '../types/exam';

export interface FinalRun {
  mode: QuizMode;
  timerEnabled: boolean;
  current: number;
  secondsLeft: number;
  submitted: boolean;
  flagged: string[];
}
const key = (id: string) => `ai-test:finals:run:${id}`;

export function loadFinalRun(exam: Exam): FinalRun | null {
  try {
    const value = JSON.parse(localStorage.getItem(key(exam.id)) ?? 'null');
    if (!value || !['practice', 'exam'].includes(value.mode) || typeof value.timerEnabled !== 'boolean'
      || !Number.isInteger(value.current) || value.current < 0 || value.current >= exam.questions.length
      || !Number.isInteger(value.secondsLeft) || value.secondsLeft < 0 || value.secondsLeft > exam.durationMinutes * 60
      || typeof value.submitted !== 'boolean' || !Array.isArray(value.flagged)) return null;
    return { mode: value.mode, timerEnabled: value.timerEnabled, current: value.current, secondsLeft: value.secondsLeft,
      submitted: value.submitted, flagged: value.flagged.filter((id: unknown) => typeof id === 'string' && exam.questions.some(q => q.id === id)) };
  } catch { return null; }
}

export function saveFinalRun(id: string, run: FinalRun): boolean {
  try { localStorage.setItem(key(id), JSON.stringify(run)); return true; } catch { return false; }
}

export function clearFinalRun(id: string): void {
  try { localStorage.removeItem(key(id)); } catch { /* The current run can still restart. */ }
}
