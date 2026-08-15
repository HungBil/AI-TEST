// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Exam } from '../types/exam';
import { ResultSummary } from './ResultSummary';

let container: HTMLDivElement;
let root: Root;

const exam = {
  id: 'new-2026-14',
  title: 'Đề 14',
  description: 'Test',
  durationMinutes: 90,
  totalPoints: 100,
  disclaimer: 'Ôn tập',
  questions: [{
    id: 'N26E14-A01', module: 'A', type: 'mcq', points: 100,
    prompt: '1+1?', options: [{ key: 'A', text: '2' }, { key: 'B', text: '3' }, { key: 'C', text: '4' }, { key: 'D', text: '5' }],
    answer: 'A', explanation: '1+1=2'
  }]
} as Exam;

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('ResultSummary cat integration', () => {
  it('opens a cat popup for the first-day practice exams', async () => {
    await act(async () => root.render(
      <ResultSummary
        exam={exam}
        answers={{ 'N26E14-A01': { selected: 'A' } }}
        onReview={vi.fn()}
        onRestart={vi.fn()}
        onHome={vi.fn()}
      />
    ));

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(container.textContent).toContain('Giỏi hơn anh Hưng rồi');
  });
});
