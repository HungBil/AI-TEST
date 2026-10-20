// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Exam } from '../types/exam';
import { loadProgress, saveProgress } from '../utils/storage';
import { clearFinalRun, loadFinalRun, saveFinalRun, type FinalRun } from './progress';

const exam: Exam = { id: 'final-p1-test', title: 'Fixture', description: '', disclaimer: '', durationMinutes: 90, totalPoints: 1,
  questions: [{ id: 'test-q1', type: 'mcq', module: 'A', prompt: 'Synthetic only', points: 1, options: [{ key: 'A', text: 'Fixture' }], answer: 'A', explanation: 'Fixture' }] };
const run: FinalRun = { mode: 'exam', timerEnabled: true, current: 0, secondsLeft: 500, submitted: true, flagged: ['test-q1'] };
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('Final run progress', () => {
  it('roundtrips only session metadata and clears one exam independently', () => {
    expect(saveFinalRun(exam.id, run)).toBe(true);
    expect(loadFinalRun(exam)).toEqual(run);
    saveProgress(exam.id, { 'test-q1': { selected: 'A' } });
    clearFinalRun(exam.id);
    expect(loadFinalRun(exam)).toBeNull();
    expect(loadProgress(exam.id)).toEqual({ 'test-q1': { selected: 'A' } });
  });
  it('rejects corrupt or out-of-range metadata and drops obsolete flags', () => {
    for (const value of [null, {}, { ...run, current: 1 }, { ...run, secondsLeft: -1 }, { ...run, secondsLeft: 6000 }, { ...run, mode: 'other' }, { ...run, flagged: 'bad' }]) {
      localStorage.setItem(`ai-test:finals:run:${exam.id}`, JSON.stringify(value));
      expect(loadFinalRun(exam)).toBeNull();
    }
    saveFinalRun(exam.id, { ...run, flagged: ['obsolete', 'test-q1'] });
    expect(loadFinalRun(exam)?.flagged).toEqual(['test-q1']);
  });
  it('handles unavailable or full storage without crashing the active page', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    expect(saveFinalRun(exam.id, run)).toBe(false);
    expect(saveProgress(exam.id, {})).toBe(false);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Denied', 'SecurityError'); });
    expect(loadFinalRun(exam)).toBeNull(); expect(loadProgress(exam.id)).toEqual({});
  });
  it('ignores invalid answer fields and unknown metadata fields', () => {
    localStorage.setItem(`ai-test-progress:${exam.id}`, JSON.stringify({ answers: { valid: { selected: 'A', text: 'Answer' }, broken: { text: 42, selfGrade: 'maybe' }, invalid: 'bad' } }));
    expect(loadProgress(exam.id)).toEqual({ valid: { selected: 'A', text: 'Answer' }, broken: {} });
    localStorage.setItem(`ai-test:finals:run:${exam.id}`, JSON.stringify({ ...run, unrelated: 'discard' }));
    expect(loadFinalRun(exam)).toEqual(run);
  });
});
