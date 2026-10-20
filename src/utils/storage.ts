import type { AnswerState } from '../types/exam';

const key = (examId: string) => `ai-test-progress:${examId}`;

export function saveProgress(examId: string, answers: Record<string, AnswerState>) {
  try {
    localStorage.setItem(key(examId), JSON.stringify({ answers, savedAt: new Date().toISOString() }));
    return true;
  } catch { return false; }
}

export function loadProgress(examId: string): Record<string, AnswerState> {
  try {
    const raw = localStorage.getItem(key(examId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed?.answers || typeof parsed.answers !== 'object' || Array.isArray(parsed.answers)) return {};
    return Object.fromEntries(Object.entries(parsed.answers)
      .filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value))
      .map(([id, value]) => {
        const answer = value as AnswerState;
        return [id, {
          ...(typeof answer.selected === 'string' ? { selected: answer.selected } : {}),
          ...(typeof answer.text === 'string' ? { text: answer.text } : {}),
          ...(['pass', 'fail'].includes(answer.selfGrade ?? '') ? { selfGrade: answer.selfGrade } : {})
        }];
      }));
  } catch {
    return {};
  }
}

export function clearProgress(examId: string) {
  try { localStorage.removeItem(key(examId)); } catch { /* Current answers can still be reset. */ }
}
