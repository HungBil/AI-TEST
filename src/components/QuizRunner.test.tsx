// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Exam } from '../types/exam';
import { loadProgress } from '../utils/storage';
import { QuizRunner } from './QuizRunner';

const questions: Exam['questions'] = [{
  id: 'MCQ', module: 'A', type: 'mcq', points: 1,
  prompt: 'Chọn đáp án đúng.',
  options: [{ key: 'A', text: 'Đáp án A' }, { key: 'B', text: 'Đáp án B' }],
  answer: 'A', explanation: 'Giải thích đáp án trắc nghiệm.'
}, {
  id: 'ESSAY', module: 'C', type: 'essay', points: 1,
  prompt: 'Giải thích cách làm.', modelAnswer: 'Đáp án mẫu tự luận.',
  rubric: ['Tiêu chí tự chấm.'], hint: ['Gợi ý tự luận.']
}];

let container: HTMLDivElement;
let root: Root;

function button(text: string) {
  const match = [...container.querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent === text);
  if (!match) throw new Error(`Missing button: ${text}`);
  return match;
}

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  vi.useFakeTimers();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
});

describe('QuizRunner submitted review', () => {
  it.each(['final-p1-01', 'exam-01', 'new-2026-17'])('keeps exam review submitted for %s', async (id) => {
    const exam: Exam = {
      id, title: 'Đề kiểm tra', description: 'Test', durationMinutes: 1,
      totalPoints: 2, disclaimer: 'Ôn tập', questions,
      moduleLabels: id.startsWith('final-') ? { A: 'Nền tảng AI' } : undefined
    };
    await act(async () => root.render(<QuizRunner exam={exam} mode="exam" timerEnabled onHome={vi.fn()} />));

    expect(container.querySelector('.eyebrow')?.textContent).toBe(
      `Câu 1/2 · Module A${exam.moduleLabels ? ' · Nền tảng AI' : ''}`
    );
    await act(async () => container.querySelectorAll<HTMLButtonElement>('.option')[1].click());
    expect(container.textContent).not.toContain('Giải thích đáp án trắc nghiệm.');
    await act(async () => vi.advanceTimersByTime(5000));
    await act(async () => button('Nộp bài').click());
    await act(async () => container.querySelector<HTMLButtonElement>('.review-list button')!.click());

    expect(container.textContent).toContain('Sai. Đáp án đúng là A.');
    expect(container.textContent).toContain('Giải thích đáp án trắc nghiệm.');
    expect([...container.querySelectorAll<HTMLButtonElement>('.option')].every(item => item.disabled)).toBe(true);
    await act(async () => container.querySelector<HTMLButtonElement>('.option')!.click());
    expect(loadProgress(id).MCQ.selected).toBe('B');
    await act(async () => vi.advanceTimersByTime(10000));
    expect(container.querySelector('.timer')?.textContent).toBe('00:55');

    await act(async () => button('Câu sau').click());
    expect(container.querySelector('textarea')?.readOnly).toBe(true);
    expect(container.textContent).not.toContain('Đáp án mẫu tự luận.');
    expect(container.textContent).not.toContain('Gợi ý tự luận.');
    await act(async () => button('Gợi ý').click());
    expect(container.textContent).toContain('Gợi ý tự luận.');
    expect(container.textContent).not.toContain('Đáp án mẫu tự luận.');
    await act(async () => button('Xem đáp án mẫu').click());
    expect(container.textContent).toContain('Đáp án mẫu tự luận.');
    await act(async () => button('Đạt').click());
    await act(async () => button('Về kết quả').click());
    expect(container.textContent).toContain('Đúng 1/2 câu');

    await act(async () => button('Làm lại bài này').click());
    expect(container.querySelector<HTMLButtonElement>('.option')?.disabled).toBe(false);
    expect(container.querySelector('.timer')?.textContent).toBe('01:00');
    expect(loadProgress(id)).toEqual({});
    expect(container.textContent).not.toContain('Giải thích đáp án trắc nghiệm.');
  });

  it('explains unanswered MCQs after submission', async () => {
    const exam: Exam = {
      id: 'unanswered', title: 'Đề chưa làm', description: 'Test', durationMinutes: 1,
      totalPoints: 2, disclaimer: 'Ôn tập', questions
    };
    await act(async () => root.render(<QuizRunner exam={exam} mode="exam" timerEnabled={false} onHome={vi.fn()} />));
    await act(async () => button('Nộp bài').click());
    await act(async () => container.querySelector<HTMLButtonElement>('.review-list button')!.click());
    expect(container.textContent).toContain('Đáp án đúng là A.');
    expect(container.textContent).toContain('Giải thích đáp án trắc nghiệm.');
  });
});
