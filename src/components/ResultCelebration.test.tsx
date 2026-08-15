// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getCelebrationTier, ResultCelebration } from './ResultCelebration';

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

describe('ResultCelebration', () => {
  it('maps score thresholds to the three generated cat images', () => {
    expect(getCelebrationTier(70)).toMatchObject({ key: 'high', image: 'result-cats/cats-70.webp' });
    expect(getCelebrationTier(69)).toMatchObject({ key: 'mid', image: 'result-cats/cats-50.webp' });
    expect(getCelebrationTier(50)).toMatchObject({ key: 'mid' });
    expect(getCelebrationTier(49)).toMatchObject({ key: 'low', image: 'result-cats/cats-under-50.webp' });
  });

  it('opens as a dialog and can be closed', async () => {
    await act(async () => root.render(<ResultCelebration percent={72} examTitle="Đề 14" />));

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(container.textContent).toContain('Giỏi hơn anh Hưng rồi!');
    expect(container.querySelector<HTMLImageElement>('img')?.getAttribute('src')).toContain('result-cats/cats-70.webp');

    const close = container.querySelector<HTMLButtonElement>('[aria-label="Đóng lời chúc"]')!;
    await act(async () => close.click());
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
