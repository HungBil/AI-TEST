// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FinalReview from './FinalReview';
import { FinalGate } from './FinalGate';
import { FINAL_SESSION_KEY, FINAL_ATTEMPTS_KEY, decryptFinalCatalog, finalUnlocked } from './access';
import { finalCatalog, setFinalCatalog, type FinalCatalog, type FinalExam } from './catalog';
import type { QuizMode } from '../types/exam';
vi.mock('../components/QuizRunner', () => ({ QuizRunner: ({ exam, mode, timerEnabled }: { exam: FinalExam; mode: QuizMode; timerEnabled: boolean }) =>
  <div data-testid="test-runner">{exam.title} · {exam.questions.length} câu · {mode} · timer:{String(timerEnabled)}</div> }));
vi.mock('./access', async importOriginal => ({
  ...await importOriginal<typeof import('./access')>(), decryptFinalCatalog: vi.fn(async () => null)
}));
function fixture(): FinalCatalog {
  const sourceRefs = [{ sourceId: 'synthetic-source', locator: 'Synthetic heading' }];
  const published: FinalExam = {
    id: 'final-p1-01', phase: 'phase1', status: 'published', title: 'Published Phase 1 fixture',
    description: 'Synthetic fixture only', disclaimer: 'Synthetic fixture, not course material', durationMinutes: 90, totalPoints: 100,
    questions: Array.from({ length: 85 }, (_, i) => {
      const common = { id: `final-p1-01-${i + 1}`, module: 'A' as const, points: i < 80 ? 1 : 4, prompt: `Synthetic prompt ${i}`, intentId: `synthetic.${i}`, sourceRefs };
      return i < 60 ? { ...common, type: 'mcq' as const, options: ['A','B','C','D'].map(key => ({ key, text: `Synthetic choice ${key}` })), answer: 'A', explanation: 'SYNTHETIC_PRIVATE_EXPLANATION_ONLY' }
        : { ...common, type: 'essay' as const, responseKind: 'short-answer' as const, hint: ['Synthetic hint'], rubric: ['Synthetic rubric'], modelAnswer: 'Synthetic model answer only' };
    })
  };
  const sheet = {
    id: 'sheet-p1', phase: 'phase1' as const, status: 'published' as const, title: 'Published Phase 1 sheet',
    pages: [{ title: 'Synthetic page', sections: [{ title: 'Synthetic section', keywords: ['synthetic'], explanation: 'Synthetic explanation', example: 'Synthetic example', commonMistake: 'Synthetic mistake', sourceRefs }] }]
  };
  return {
    schemaVersion: 1,
    sources: [{ id: 'synthetic-source', repo: 'test-only', path: 'synthetic-source.md', revision: 'a'.repeat(40), phase: 'phase1', reviewed: true }],
    trackDefinitions: [],
    exams: [published, { ...published, id: 'final-p1-02', status: 'draft', title: 'Hidden draft fixture' }, { ...published, id: 'final-p2-t1-01', phase: 'phase2', title: 'Hidden Phase 2 fixture' }],
    cheatSheets: [sheet, { ...sheet, id: 'sheet-draft', status: 'draft', title: 'Hidden draft sheet' }, { ...sheet, id: 'sheet-p2', phase: 'phase2', title: 'Hidden Phase 2 sheet' }]
  };
}
let container: HTMLDivElement, root: Root;
beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear(); localStorage.clear(); vi.clearAllMocks(); setFinalCatalog(null);
  vi.mocked(decryptFinalCatalog).mockResolvedValue(null);
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); setFinalCatalog(null); });
const button = (text: string) => [...container.querySelectorAll<HTMLButtonElement>('button')].find(b => b.textContent?.includes(text))!;
async function renderPage(onExit = vi.fn()) {
  setFinalCatalog(fixture());
  await act(async () => root.render(<FinalReview onExit={onExit} />));
  return onExit;
}
async function enterKey(value: string) {
  const input = container.querySelector<HTMLInputElement>('#finals-key')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
describe('Final review workspace', () => {
  it('blocks direct access without a decrypted catalog', async () => {
    await act(async () => root.render(<FinalReview onExit={() => {}} />));
    expect(container.textContent).toContain('Nhập lại key');
    expect(container.querySelector('.finals-exam')).toBeNull();
  });
  it('shows only published Phase 1 exams and cheat sheets', async () => {
    await renderPage();
    expect(container.querySelectorAll('.finals-exam')).toHaveLength(1);
    expect(container.querySelectorAll('.finals-sheet')).toHaveLength(1);
    expect(container.textContent).toContain('Published Phase 1 fixture');
    expect(container.textContent).toContain('Published Phase 1 sheet');
    expect(container.textContent).toContain('synthetic-source.md');
    expect(container.textContent).not.toContain('Hidden');
    expect(container.querySelectorAll('.finals-tracks')).toHaveLength(0);
  });
  it('starts a published 85-question exam with the selected mode and timer', async () => {
    await renderPage();
    await act(async () => {
      const select = container.querySelector<HTMLSelectElement>('select')!;
      select.value = 'exam'; select.dispatchEvent(new Event('change', { bubbles: true }));
      container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    });
    await act(async () => button('Bắt đầu làm bài').click());
    expect(container.querySelector('[data-testid="test-runner"]')?.textContent).toBe('Published Phase 1 fixture · 85 câu · exam · timer:false');
  });
  it('locking clears the catalog without logging out Crown', async () => {
    sessionStorage.setItem(FINAL_SESSION_KEY, 'true');
    sessionStorage.setItem('ai-test:crown-unlocked', 'true');
    const onExit = await renderPage();
    await act(async () => button('Khóa khu này').click());
    expect(onExit).toHaveBeenCalledOnce();
    expect(finalUnlocked()).toBe(false);
    expect(finalCatalog.exams).toEqual([]);
    expect(finalCatalog.cheatSheets).toEqual([]);
    expect(sessionStorage.getItem(FINAL_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem('ai-test:crown-unlocked')).toBe('true');
  });
});
describe('Independent final gate', () => {
  it('does not accept Crown or a forged final-session flag', async () => {
    const onUnlock = vi.fn();
    sessionStorage.setItem('ai-test:crown-unlocked', 'true');
    sessionStorage.setItem(FINAL_SESSION_KEY, 'true');
    await act(async () => root.render(<FinalGate onUnlock={onUnlock} />));
    await act(async () => container.querySelector<HTMLButtonElement>('.finals-access')!.click());
    expect(onUnlock).not.toHaveBeenCalled();
    expect(finalUnlocked()).toBe(false);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });
  it('loads the decrypted catalog without storing the key or catalog', async () => {
    const catalog = fixture();
    vi.mocked(decryptFinalCatalog).mockResolvedValueOnce(catalog);
    const onUnlock = vi.fn();
    await act(async () => root.render(<FinalGate onUnlock={onUnlock} />));
    await act(async () => container.querySelector<HTMLButtonElement>('.finals-access')!.click());
    await enterKey('test-only-input');
    await act(async () => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(onUnlock).toHaveBeenCalledTimes(1);
    expect(decryptFinalCatalog).toHaveBeenCalledExactlyOnceWith('test-only-input');
    expect(finalCatalog).toBe(catalog);
    expect(finalUnlocked()).toBe(true);
    expect(sessionStorage.getItem(FINAL_SESSION_KEY)).toBe('true');
    expect(sessionStorage.getItem('ai-test:crown-unlocked')).toBeNull();
    expect(JSON.stringify(sessionStorage)).not.toContain('test-only-input');
    expect(JSON.stringify(sessionStorage)).not.toContain('SYNTHETIC_PRIVATE_EXPLANATION_ONLY');
    expect(Object.keys(sessionStorage).sort()).toEqual([FINAL_ATTEMPTS_KEY, FINAL_SESSION_KEY].sort());
    expect(localStorage.length).toBe(0);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
  it('locks after five failed attempts without changing Crown attempts', async () => {
    sessionStorage.setItem('ai-test:crown-attempts', 'preserved');
    const onUnlock = vi.fn();
    await act(async () => root.render(<FinalGate onUnlock={onUnlock} />));
    await act(async () => container.querySelector<HTMLButtonElement>('.finals-access')!.click());
    for (let i = 0; i < 5; i++) {
      await enterKey('wrong');
      await act(async () => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    }
    expect(button('Tạm khóa 60 giây').disabled).toBe(true);
    expect(JSON.parse(sessionStorage.getItem(FINAL_ATTEMPTS_KEY)!).failures).toBe(5);
    expect(sessionStorage.getItem('ai-test:crown-attempts')).toBe('preserved');
    expect(decryptFinalCatalog).toHaveBeenCalledTimes(5);
    expect(onUnlock).not.toHaveBeenCalled();
    expect(finalUnlocked()).toBe(false);
  });
});
