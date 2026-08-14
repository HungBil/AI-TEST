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
  it('shows Module B expanded by default with test-aligned command references', async () => {
    await act(async () => root.render(<CheatSheetLibrary />));

    expect(container.textContent).toContain('Euclid & Python core');
    expect(container.textContent).toContain('dict.get(k, default)');
    expect(container.textContent).toContain('Requests/HTTP/JSON');
    expect(container.textContent).toContain('Nội dung chuẩn để học trên web');
  });

  it('expands another module and switches between its three pages', async () => {
    await act(async () => root.render(<CheatSheetLibrary />));

    const moduleA = [...container.querySelectorAll<HTMLButtonElement>('.cheat-sheet-summary')]
      .find((button) => button.textContent?.includes('Module A'))!;
    await act(async () => moduleA.click());

    const activeHeading = () => container.querySelector<HTMLHeadingElement>('.cheat-page-heading h3')?.textContent;
    expect(activeHeading()).toContain('Xác suất - nhận dạng từ khóa trước khi tính');

    const pageTwo = [...container.querySelectorAll<HTMLButtonElement>('.cheat-page-tabs button')]
      .find((button) => button.textContent === 'Trang 2')!;
    await act(async () => pageTwo.click());

    expect(activeHeading()).toContain('Bayes - cập nhật niềm tin bằng bằng chứng');
    expect(container.textContent).toContain('Cách làm bảng 1.000 người');
  });
});
