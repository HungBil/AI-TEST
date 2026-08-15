import { useState, type CSSProperties } from 'react';
import cheatSheetsRaw from '../data/cheatsheets.json';
import dayOneCheatSheetsRaw from '../data/day-one-cheatsheets.json';
import '../styles/cheatsheets.css';

type ModuleCode = 'A' | 'B' | 'C' | 'D';
type TableSection = { kind: 'table'; title: string; rows: string[][] };
type FormulaSection = { kind: 'formula'; title: string; items: string[] };
type ListSection = { kind: 'steps' | 'bullets'; title: string; items: string[] };
type CodeSection = { kind: 'code'; title: string; code: string[] };
type CalloutSection = { kind: 'callout'; title: string; text: string };
type CheatSection = TableSection | FormulaSection | ListSection | CodeSection | CalloutSection;

type CheatPage = {
  title: string;
  sections: CheatSection[];
};

type CheatSheet = {
  module: ModuleCode;
  title: string;
  subtitle: string;
  accent: string;
  dark: string;
  tint: string;
  pages: CheatPage[];
};

interface CheatSheetCollectionProps {
  id: string;
  collectionKey: string;
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  sheets: CheatSheet[];
  defaultOpen: ModuleCode;
  variant?: 'standard' | 'special';
  panelNote: string;
}

const cheatSheets = cheatSheetsRaw as CheatSheet[];
const dayOneCheatSheets = dayOneCheatSheetsRaw as CheatSheet[];
const initialPages: Record<ModuleCode, number> = { A: 0, B: 0, C: 0, D: 0 };

function stripNumber(text: string) {
  return text.replace(/^\s*\d+[).]\s*/, '');
}

function ModuleIcon({ module }: { module: ModuleCode }) {
  if (module === 'A') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="16" cy="16" r="9" />
        <circle cx="32" cy="32" r="9" />
        <path d="M22 22 27 27M31 10v12M25 16h12" />
      </svg>
    );
  }
  if (module === 'B') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="m18 12-10 12 10 12M30 12l10 12-10 12M27 8l-7 32" />
      </svg>
    );
  }
  if (module === 'C') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="12" cy="30" r="4" />
        <circle cx="24" cy="16" r="4" />
        <circle cx="36" cy="26" r="4" />
        <path d="m15 27 6-8M28 18l5 5M16 31l16-4M24 20v16" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 6 39 12v10c0 10-6 17-15 21C15 39 9 32 9 22V12Z" />
      <path d="m17 24 5 5 10-11" />
    </svg>
  );
}

function Section({ section }: { section: CheatSection }) {
  if (section.kind === 'table') {
    return (
      <section className="cheat-content-section">
        <h4>{section.title}</h4>
        <div className="cheat-table-wrap">
          <table className="cheat-table">
            <thead>
              <tr>
                <th>Thuật ngữ / tình huống</th>
                <th>Ý nghĩa / cách làm</th>
                <th>Ví dụ / nhớ nhanh</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, rowIndex) => (
                <tr key={`${row[0]}-${rowIndex}`}>
                  <td><code>{row[0]}</code></td>
                  <td>{row[1]}</td>
                  <td>{row[2] ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (section.kind === 'formula') {
    return (
      <section className="cheat-content-section">
        <h4>{section.title}</h4>
        <div className="cheat-formulas">
          {section.items.map((item) => <code key={item}>{item}</code>)}
        </div>
      </section>
    );
  }

  if (section.kind === 'code') {
    return (
      <section className="cheat-content-section">
        <h4>{section.title}</h4>
        <pre className="cheat-code"><code>{section.code.join('\n')}</code></pre>
      </section>
    );
  }

  if (section.kind === 'callout') {
    return (
      <aside className="cheat-callout">
        <strong>{section.title}</strong>
        <p>{section.text}</p>
      </aside>
    );
  }

  const ListTag = section.kind === 'steps' ? 'ol' : 'ul';
  return (
    <section className="cheat-content-section">
      <h4>{section.title}</h4>
      <ListTag className="cheat-list">
        {section.items.map((item) => <li key={item}>{stripNumber(item)}</li>)}
      </ListTag>
    </section>
  );
}

function CheatSheetCollection({
  id,
  collectionKey,
  eyebrow,
  title,
  description,
  badge,
  sheets,
  defaultOpen,
  variant = 'standard',
  panelNote
}: CheatSheetCollectionProps) {
  const [openModule, setOpenModule] = useState<ModuleCode | null>(defaultOpen);
  const [activePages, setActivePages] = useState<Record<ModuleCode, number>>(initialPages);
  const isSpecial = variant === 'special';

  return (
    <section
      id={id}
      className={`cheat-library card ${isSpecial ? 'cheat-library-special' : 'cheat-library-standard'}`}
      aria-labelledby={`${collectionKey}-title`}
      data-cheat-collection={collectionKey}
    >
      {isSpecial && <span className="cheat-special-ribbon">ĐỀ 14–16 · ÔN CẤP TỐC</span>}
      <header className="cheat-library-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id={`${collectionKey}-title`}>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="cheat-library-badge">{badge}</span>
      </header>

      <div className="cheat-sheet-list">
        {sheets.map((sheet) => {
          const isOpen = openModule === sheet.module;
          const activePage = activePages[sheet.module] ?? 0;
          const page = sheet.pages[activePage];
          const panelId = `${collectionKey}-panel-${sheet.module}`;
          const style = {
            '--cheat-accent': sheet.accent,
            '--cheat-dark': sheet.dark,
            '--cheat-tint': sheet.tint
          } as CSSProperties;

          return (
            <article className={`cheat-sheet ${isOpen ? 'open' : ''}`} style={style} key={sheet.module}>
              <button
                type="button"
                className="cheat-sheet-summary"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenModule((current) => current === sheet.module ? null : sheet.module)}
              >
                <span className="cheat-module-icon"><ModuleIcon module={sheet.module} /></span>
                <span className="cheat-summary-copy">
                  <span>{isSpecial ? 'Đề 14–16 · ' : ''}Module {sheet.module} · {sheet.pages.length} trang</span>
                  <strong>{sheet.title}</strong>
                  <small>{sheet.subtitle}</small>
                </span>
                <span className="cheat-expand-label">{isOpen ? 'Thu gọn' : 'Mở học ngay'}</span>
                <span className="cheat-chevron" aria-hidden="true">⌄</span>
              </button>

              {isOpen && (
                <div id={panelId} className="cheat-sheet-panel">
                  <div className="cheat-panel-toolbar">
                    <div className="cheat-page-tabs" role="tablist" aria-label={`Trang Module ${sheet.module}`}>
                      {sheet.pages.map((item, index) => (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={activePage === index}
                          className={activePage === index ? 'active' : ''}
                          key={item.title}
                          onClick={() => setActivePages((current) => ({ ...current, [sheet.module]: index }))}
                        >
                          Trang {index + 1}
                        </button>
                      ))}
                    </div>
                    <span className="cheat-panel-note">{panelNote}</span>
                  </div>

                  <div className="cheat-page" role="tabpanel">
                    <div className="cheat-page-heading">
                      <span className="cheat-page-module">{sheet.module}</span>
                      <div>
                        <span>Module {sheet.module} · Trang {activePage + 1}/{sheet.pages.length}</span>
                        <h3>{page.title}</h3>
                      </div>
                    </div>
                    {page.sections.map((section, index) => (
                      <Section section={section} key={`${section.kind}-${section.title}-${index}`} />
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function CheatSheetLibrary() {
  return (
    <>
      <CheatSheetCollection
        id="day-one-cheat-sheets"
        collectionKey="day-one-special"
        eyebrow="Cấp tốc theo phản hồi ngày thi đầu"
        title="4 cheat sheet đặc biệt cho Đề 14–16"
        description="Chỉ giữ các mảng vừa xuất hiện: determinant, rank, update bias; NumPy matrix/broadcasting; LLM, cancer metrics, RAG; và cách góp ý senior. Mỗi module gồm ba trang để ôn nhanh trước buổi thi tiếp theo."
        badge="12 trang · đúng 10 câu mở"
        sheets={dayOneCheatSheets}
        defaultOpen="A"
        variant="special"
        panelNote="Bám trực tiếp Đề 14–16 · có công thức, ví dụ và khung tự luận"
      />

      <CheatSheetCollection
        id="cheat-sheets"
        collectionKey="foundation"
        eyebrow="Ôn nền tảng trực tiếp trên web"
        title="4 cheat sheet đầy đủ theo module"
        description="Mỗi module gồm ba trang cô đọng. Module B có bảng thuật ngữ, câu lệnh Python, Requests/HTTP/JSON, NumPy và Pandas để tra ý nghĩa khi ôn dài hạn."
        badge="12 trang · nền tảng tổng hợp"
        sheets={cheatSheets}
        defaultOpen="B"
        panelNote="Nội dung nền tảng để học trên web · dùng cho toàn bộ bộ Crown"
      />
    </>
  );
}
