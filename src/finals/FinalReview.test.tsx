// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FinalReview from './FinalReview';
import { FinalGate } from './FinalGate';
import { FINAL_SESSION_KEY, FINAL_ATTEMPTS_KEY, lockFinalSession, verifyFinalPassword } from './access';
vi.mock('../components/QuizRunner', () => ({ QuizRunner: () => <div>Test runner</div> }));
vi.mock('./access', async importOriginal => ({
  ...await importOriginal<typeof import('./access')>(), verifyFinalPassword: vi.fn(async () => false)
}));
let container: HTMLDivElement, root: Root;
beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear(); vi.clearAllMocks();
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
const button = (text: string) => [...container.querySelectorAll<HTMLButtonElement>('button')].find(b => b.textContent?.includes(text))!;
async function renderPage() { await act(async () => root.render(<FinalReview onExit={() => {}} />)); }
async function enterKey(value: string) {
  const input = container.querySelector<HTMLInputElement>('#finals-key')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
describe('Final review workspace', () => {
  it('does not pretend planned slots are published exams', async () => {
    await renderPage();
    expect(container.textContent).toContain('0/20');
    expect(container.querySelectorAll('.finals-exam')).toHaveLength(10);
    expect([...container.querySelectorAll<HTMLButtonElement>('.finals-exam button')].every(b => b.disabled)).toBe(true);
    expect(container.textContent).toContain('Giả định biên soạn');
  });
  it('splits Phase 2 into four pending tracks with 3/3/2/2 slots', async () => {
    await renderPage();
    await act(async () => button('Phase 2 ·').click());
    expect(container.querySelectorAll('.finals-tracks button')).toHaveLength(4);
    expect(container.querySelectorAll('.finals-exam')).toHaveLength(3);
    await act(async () => button('Track 4').click());
    expect(container.querySelectorAll('.finals-exam')).toHaveLength(2);
    expect(container.textContent).toContain('chờ đối chiếu tên trong nguồn');
  });
  it('locking finals does not log out Crown', () => {
    sessionStorage.setItem(FINAL_SESSION_KEY, 'true');
    sessionStorage.setItem('ai-test:crown-unlocked', 'true');
    lockFinalSession();
    expect(sessionStorage.getItem(FINAL_SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem('ai-test:crown-unlocked')).toBe('true');
  });
});
describe('Independent final gate', () => {
  it('a Crown session does not open the final workspace', async () => {
    const onUnlock = vi.fn();
    sessionStorage.setItem('ai-test:crown-unlocked', 'true');
    await act(async () => root.render(<FinalGate onUnlock={onUnlock} />));
    await act(async () => container.querySelector<HTMLButtonElement>('.finals-access')!.click());
    expect(onUnlock).not.toHaveBeenCalled();
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  });
  it('stores only the final-session flag after successful verification', async () => {
    vi.mocked(verifyFinalPassword).mockResolvedValueOnce(true);
    const onUnlock = vi.fn();
    await act(async () => root.render(<FinalGate onUnlock={onUnlock} />));
    await act(async () => container.querySelector<HTMLButtonElement>('.finals-access')!.click());
    await enterKey('test-only-input');
    await act(async () => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(onUnlock).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(FINAL_SESSION_KEY)).toBe('true');
    expect(sessionStorage.getItem('ai-test:crown-unlocked')).toBeNull();
    expect(JSON.stringify(sessionStorage)).not.toContain('test-only-input');
  });
  it('locks after five failed attempts without changing Crown attempts', async () => {
    vi.mocked(verifyFinalPassword).mockResolvedValue(false);
    await act(async () => root.render(<FinalGate onUnlock={() => {}} />));
    await act(async () => container.querySelector<HTMLButtonElement>('.finals-access')!.click());
    for (let i = 0; i < 5; i++) {
      await enterKey('wrong');
      await act(async () => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    }
    expect(button('Tạm khóa 60 giây').disabled).toBe(true);
    expect(JSON.parse(sessionStorage.getItem(FINAL_ATTEMPTS_KEY)!).failures).toBe(5);
    expect(sessionStorage.getItem('ai-test:crown-attempts')).toBeNull();
  });
});
