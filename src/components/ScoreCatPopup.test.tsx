// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScoreCatPopup } from './ScoreCatPopup';

let container: HTMLDivElement;
let root: Root;

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

async function render(percent: number) {
  const onClose = vi.fn();
  await act(async () => root.render(<ScoreCatPopup percent={percent} onClose={onClose} />));
  return onClose;
}

describe('ScoreCatPopup', () => {
  it('uses the high-score message and generated high cat asset at 70%', async () => {
    const onClose = await render(70);
    expect(container.textContent).toContain('Giỏi hơn anh Hưng rồi');
    expect(container.querySelector('img')?.getAttribute('src')).toContain('cats/cat-high.webp');
    await act(async () => container.querySelector<HTMLButtonElement>('.score-cat-close')!.click());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('uses the middle message from 50% to below 70%', async () => {
    await render(50);
    expect(container.textContent).toContain('Giỏi ha');
    expect(container.querySelector('img')?.getAttribute('src')).toContain('cats/cat-mid.webp');
  });

  it('uses the encouragement message below 50%', async () => {
    await render(49);
    expect(container.textContent).toContain('Cố lên nhé');
    expect(container.querySelector('img')?.getAttribute('src')).toContain('cats/cat-low.webp');
  });
});
