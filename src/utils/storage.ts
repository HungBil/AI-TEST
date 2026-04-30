import type { AnswerState } from '../types/exam';

const key = (examId: string) => `ai-test-progress:${examId}`;

export function saveProgress(examId: string, answers: Record<string, AnswerState>) {
  localStorage.setItem(key(examId), JSON.stringify({ answers, savedAt: new Date().toISOString() }));
}

export function loadProgress(examId: string): Record<string, AnswerState> {
  const raw = localStorage.getItem(key(examId));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed.answers ?? {};
  } catch {
    return {};
  }
}

export function clearProgress(examId: string) {
  localStorage.removeItem(key(examId));
}
