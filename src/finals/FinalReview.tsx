import { useState, type KeyboardEvent } from 'react';
import type { QuizMode } from '../types/exam';
import { QuizRunner } from '../components/QuizRunner';
import { RichText } from '../components/RichText';
import { loadProgress } from '../utils/storage';
import { isQuestionAnswered } from '../utils/scoring';
import { finalCatalog, publishedExam, type FinalExam, type SourceRef } from './catalog';
import { finalUnlocked, lockFinalSession } from './access';
import { loadFinalRun } from './progress';
import './finals.css';

const searchable = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd');
function SourceNotes({ refs }: { refs: SourceRef[] }) {
  return <details className="finals-source"><summary>Nguồn đối chiếu</summary>{refs.map((ref, index) => {
    const source = finalCatalog.sources.find(item => item.id === ref.sourceId);
    return <p key={index}>{source?.path ?? ref.sourceId} · {ref.locator}</p>;
  })}</details>;
}

export default function FinalReview({ onExit }: { onExit: () => void }) {
  const exams = finalCatalog.exams.filter(e => e.phase === 'phase1' && e.status === 'published');
  const sheets = finalCatalog.cheatSheets.filter(s => s.phase === 'phase1' && s.status === 'published');
  const [selectedId, setSelectedId] = useState(exams[0]?.id ?? '');
  const selected = exams.find(exam => exam.id === selectedId) ?? exams[0];
  const initialRun = selected ? loadFinalRun(selected) : null;
  const [mode, setMode] = useState<QuizMode>(initialRun?.mode ?? 'practice');
  const [timer, setTimer] = useState(initialRun?.timerEnabled ?? true);
  const [startedId, setStartedId] = useState<string | null>(null);
  const [view, setView] = useState<'exams' | 'sheets'>('exams');
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('all');
  const moveTab = (event: KeyboardEvent<HTMLElement>) => {
    const destinations: Record<string, 'exams' | 'sheets'> = { ArrowLeft: view === 'exams' ? 'sheets' : 'exams', ArrowRight: view === 'exams' ? 'sheets' : 'exams', Home: 'exams', End: 'sheets' };
    const next = destinations[event.key];
    if (!next) return;
    event.preventDefault(); setView(next); document.getElementById(`finals-${next}-tab`)?.focus();
  };
  if (!finalUnlocked()) return <main className="page-shell"><p>Nhập lại key để mở nội dung ôn tập.</p><button type="button" onClick={onExit}>Về trang chính</button></main>;
  const exam = startedId ? publishedExam(startedId) : undefined;
  if (exam) return <QuizRunner key={`${exam.id}-${mode}`} exam={exam} mode={mode} timerEnabled={timer} persistSession onHome={() => setStartedId(null)} />;
  const answers = selected ? loadProgress(selected.id) : {};
  const answered = selected?.questions.filter(q => isQuestionAnswered(q, answers[q.id])).length ?? 0;
  const run = selected ? loadFinalRun(selected) : null;
  const chooseExam = (item: FinalExam) => {
    setSelectedId(item.id);
    const previous = loadFinalRun(item);
    setMode(previous?.mode ?? 'practice'); setTimer(previous?.timerEnabled ?? true);
  };
  const results = sheets.filter(sheet => day === 'all' || String(sheet.day) === day).map(sheet => ({ ...sheet, pages: sheet.pages.map(page => ({ ...page,
    sections: page.sections.filter(section => searchable([sheet.title, page.title, section.title, ...section.keywords, section.explanation, section.example, section.commonMistake].join(' ')).includes(searchable(query.trim())))
  })).filter(page => page.sections.length) })).filter(sheet => sheet.pages.length);

  return <main className="finals-page">
    <header className="finals-header">
      <div className="finals-topline"><button type="button" className="link" onClick={onExit}>← Trang chính</button>
        <button type="button" className="secondary" onClick={() => { lockFinalSession(); onExit(); }}>Khóa khu ôn</button></div>
      <div className="finals-heading"><div><span className="eyebrow">L34 · Phase 1</span><h1>Ôn cuối kỳ AI thực chiến</h1></div><span className="finals-edition">{exams.length} đề mô phỏng</span></div>
      <p className="finals-intro">Trắc nghiệm, điền từ, sắp xếp quy trình và tình huống ứng dụng từ phản hồi người đã thi.</p>
      <nav className="finals-tabs" role="tablist" aria-label="Không gian ôn tập" onKeyDown={moveTab}>
        <button id="finals-exams-tab" type="button" role="tab" tabIndex={view === 'exams' ? 0 : -1} aria-selected={view === 'exams'} aria-controls="finals-exams-panel" onClick={() => setView('exams')}>Đề mô phỏng <span>{exams.length}</span></button>
        <button id="finals-sheets-tab" type="button" role="tab" tabIndex={view === 'sheets' ? 0 : -1} aria-selected={view === 'sheets'} aria-controls="finals-sheets-panel" onClick={() => setView('sheets')}>Sổ tay kiến thức <span>{sheets.length}</span></button>
      </nav>
    </header>

    {view === 'exams' ? <section id="finals-exams-panel" role="tabpanel" aria-labelledby="finals-exams-tab" className="finals-workspace">
      <aside className="finals-library"><div className="finals-section-heading"><h2>Chọn đề luyện</h2><small>Tiến độ lưu riêng từng đề</small></div>
        {exams.length === 0 && <p role="status">Chưa có đề đã xuất bản.</p>}
        <ol className="finals-exam-list">{exams.map((item, index) => {
          const saved = loadProgress(item.id), previous = loadFinalRun(item);
          const count = item.questions.filter(q => isQuestionAnswered(q, saved[q.id])).length;
          return <li key={item.id}><button type="button" className="finals-exam" aria-pressed={selected?.id === item.id} onClick={() => chooseExam(item)}>
            <span className="finals-number">{String(index + 1).padStart(2, '0')}</span><span className="finals-exam-copy"><strong>{item.title}</strong>
              <span>{previous?.submitted ? 'Đã nộp · Xem lại kết quả' : count ? `${count}/${item.questions.length} câu đã làm` : `${item.questions.length} câu · Chưa bắt đầu`}</span>
              {count > 0 && <progress aria-label={`Tiến độ ${item.title}`} max={item.questions.length} value={count} />}
            </span><span className="finals-exam-arrow" aria-hidden="true">↗</span>
          </button></li>;
        })}</ol>
      </aside>
      {selected && <section className="finals-preview" aria-labelledby="finals-preview-title">
        <span className="eyebrow">Đề {String(exams.indexOf(selected) + 1).padStart(2, '0')} · Mô phỏng cuối kỳ</span><h2 id="finals-preview-title">{selected.title}</h2><p>{selected.description}</p>
        <dl className="finals-format"><div><dt>Câu hỏi</dt><dd>{selected.questions.length}</dd></div><div><dt>Phút</dt><dd>{selected.durationMinutes}</dd></div><div><dt>Điểm</dt><dd>{selected.totalPoints}</dd></div></dl>
        <div className="finals-topic-list"><h3>Nội dung trong đề</h3><ul>{(selected.moduleOverview ?? Object.values(selected.moduleLabels ?? {})).map((line, index) => <li key={index}>{line}</li>)}</ul></div>
        <fieldset className="finals-mode-picker"><legend>Chọn cách làm bài</legend>
          <label className={mode === 'practice' ? 'selected' : ''}><input type="radio" name="finals-mode" value="practice" checked={mode === 'practice'} onChange={() => setMode('practice')} /><span><strong>Luyện tập</strong><small>Xem giải thích khi chọn; tự mở gợi ý câu viết.</small></span></label>
          <label className={mode === 'exam' ? 'selected' : ''}><input type="radio" name="finals-mode" value="exam" checked={mode === 'exam'} onChange={() => setMode('exam')} /><span><strong>Thi thử</strong><small>Ẩn lời giải; đối chiếu và tự chấm sau khi nộp.</small></span></label>
        </fieldset>
        <label className="finals-timer"><input type="checkbox" checked={timer} onChange={e => setTimer(e.target.checked)} /> Bấm giờ {selected.durationMinutes} phút</label>
        <button type="button" className="primary finals-start" onClick={() => setStartedId(selected.id)}>{run?.submitted ? 'Xem kết quả đã nộp' : run || answered ? 'Tiếp tục làm bài' : 'Bắt đầu làm bài'} <span aria-hidden="true">→</span></button>
        {(run || answered > 0) && <p className="finals-resume-note">Đã lưu {answered}/{selected.questions.length} câu.{run && !run.submitted ? ` Tiếp tục từ câu ${run.current + 1}.` : ''}</p>}
        <p className="finals-disclaimer">60 trắc nghiệm + 25 câu mở. Đây là đề luyện tự biên soạn, chưa phải cấu trúc thi chính thức.</p>
      </section>}
    </section> : <section id="finals-sheets-panel" role="tabpanel" aria-labelledby="finals-sheets-tab" className="finals-study">
      <div className="finals-study-heading"><div><h2>Sổ tay kiến thức</h2><p>Giải thích, ví dụ và điểm dễ nhầm theo từng ngày.</p><p className="finals-study-count">{sheets.filter(sheet => sheet.day).length} ngày học · {sheets.reduce((total, sheet) => total + sheet.pages.reduce((count, page) => count + page.sections.length, 0), 0)} chủ đề</p></div>
        <div className="finals-study-controls"><label className="finals-day-picker"><span>Chọn ngày học</span><select value={day} onChange={event => setDay(event.target.value)}><option value="all">Tất cả ngày học</option>{sheets.filter(sheet => sheet.day).map(sheet => <option value={sheet.day} key={sheet.id}>{sheet.title}</option>)}</select></label>
          <label className="finals-search"><span>Tìm trong sổ tay</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="RAG, ROI, ReAct, ngày hiệu lực…" /></label>
        </div></div>
      {results.length === 0 && <p role="status">Không tìm thấy nội dung phù hợp. Thử một từ khóa khác.</p>}
      {results.map(sheet => <details className="finals-sheet" key={`${sheet.id}-${day}`} open={query.trim() || day !== 'all' ? true : undefined}>
        <summary><span>{sheet.title}</span><small>{sheet.pages.reduce((count, page) => count + page.sections.length, 0)} chủ đề</small></summary>
        {sheet.pages.map((page, i) => <section key={`${sheet.id}-${i}`}><h3>{page.title}</h3>{page.sections.map((section, j) => <article key={`${i}-${j}`}><h4>{section.title}</h4>
          <p className="finals-keywords">{section.keywords.join(' · ')}</p><RichText text={section.explanation} /><div className="finals-example"><strong>Ví dụ</strong><RichText text={section.example} /></div>
          <div className="finals-mistake"><strong>Dễ nhầm</strong><RichText text={section.commonMistake} /></div><SourceNotes refs={section.sourceRefs} />
        </article>)}</section>)}
      </details>)}
    </section>}
  </main>;
}
