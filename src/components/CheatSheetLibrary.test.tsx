// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CheatSheetLibrary } from './CheatSheetLibrary';

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

describe('CheatSheetLibrary', () => {
  it('shows the special Exam 14-16 collection with Module A open by default', async () => {
    await act(async () => root.render(<CheatSheetLibrary />));

    const special = container.querySelector<HTMLElement>('[data-cheat-collection="day-one-special"]')!;
    expect(special.textContent).toContain('4 cheat sheet đặc biệt cho Đề 14–16');
    expect(special.textContent).toContain('Định thức — chọn đường tính ngắn nhất');
    expect(special.textContent).toContain('ĐỀ 14–16 · ÔN CẤP TỐC');

    const pageThree = [...special.querySelectorAll<HTMLButtonElement>('.cheat-page-tabs button')]
      .find((button) => button.textContent === 'Trang 3')!;
    await act(async () => pageThree.click());

    expect(special.querySelector<HTMLHeadingElement>('.cheat-page-heading h3')?.textContent)
      .toContain('Update bias');
    expect(special.textContent).toContain('b_new = b_old - learning_rate × db');
  });

  it('opens special Module B and switches to the broadcasting page', async () => {
    await act(async () => root.render(<CheatSheetLibrary />));

    const special = container.querySelector<HTMLElement>('[data-cheat-collection="day-one-special"]')!;
    const moduleB = [...special.querySelectorAll<HTMLButtonElement>('.cheat-sheet-summary')]
      .find((button) => button.textContent?.includes('Module B'))!;
    await act(async () => moduleB.click());

    expect(special.querySelector<HTMLHeadingElement>('.cheat-page-heading h3')?.textContent)
      .toContain('Toán tử NumPy');

    const pageTwo = [...special.querySelectorAll<HTMLButtonElement>('.cheat-page-tabs button')]
      .find((button) => button.textContent === 'Trang 2')!;
    await act(async () => pageTwo.click());

    expect(special.querySelector<HTMLHeadingElement>('.cheat-page-heading h3')?.textContent)
      .toContain('Broadcasting');
    expect(special.textContent).toContain('(2,1,3) + (1,4,1) → (2,4,3)');
  });

  it('keeps the foundation collection and its Module B command reference', async () => {
    await act(async () => root.render(<CheatSheetLibrary />));

    const foundation = container.querySelector<HTMLElement>('[data-cheat-collection="foundation"]')!;
    expect(foundation.textContent).toContain('4 cheat sheet đầy đủ theo module');
    expect(foundation.textContent).toContain('Euclid & Python core');
    expect(foundation.textContent).toContain('dict.get(k, default)');
    expect(foundation.textContent).toContain('Requests/HTTP/JSON');
  });
});
