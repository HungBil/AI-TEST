// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyMock } = vi.hoisted(() => ({ verifyMock: vi.fn() }));
vi.mock('../utils/crownLock', () => ({ verifyCrownPassword: verifyMock }));

import { CrownGate } from './CrownGate';

let container: HTMLDivElement;
let root: Root;

function enterPassword(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

async function renderGate(onUnlock = vi.fn()) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<CrownGate onUnlock={onUnlock} />));
  await act(async () => {
    container.querySelector<HTMLButtonElement>('.crown-access')?.click();
  });
  const input = container.querySelector<HTMLInputElement>('input[type="password"]')!;
  await act(async () => {
    enterPassword(input, 'candidate');
  });
  return { input, form: container.querySelector<HTMLFormElement>('form')!, onUnlock };
}

async function submit(form: HTMLFormElement) {
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear();
  verifyMock.mockReset();
});

afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
});

describe('CrownGate', () => {
  it('blocks a double submit while verification is pending', async () => {
    let finish!: (value: boolean) => void;
    verifyMock.mockReturnValue(new Promise<boolean>((resolve) => {
      finish = resolve;
    }));
    const { form } = await renderGate();

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);

    await act(async () => finish(false));
  });

  it('locks the form for 60 seconds after five failures', async () => {
    verifyMock.mockResolvedValue(false);
    const { form } = await renderGate();

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await submit(form);
      expect(verifyMock).toHaveBeenCalledTimes(attempt);
    }

    const stored = JSON.parse(sessionStorage.getItem('ai-test:crown-attempts') ?? '{}');
    expect(stored.failures).toBe(5);
    expect(stored.lockedUntil).toBeGreaterThan(Date.now());
    expect(container.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
    expect(container.textContent).toContain('Mật khẩu không đúng.');
  });

  it('unlocks once and remembers success only in the current tab session', async () => {
    verifyMock.mockResolvedValue(true);
    const onUnlock = vi.fn();
    const { form } = await renderGate(onUnlock);

    await submit(form);
    expect(onUnlock).toHaveBeenCalledOnce();
    expect(sessionStorage.getItem('ai-test:crown-unlocked')).toBe('true');
    expect(localStorage.length).toBe(0);
  });
});
