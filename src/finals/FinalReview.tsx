import { useState } from 'react';
import type { QuizMode } from '../types/exam';
import { QuizRunner } from '../components/QuizRunner';
import { finalCatalog, publishedExam, type SourceRef } from './catalog';
import { finalUnlocked, lockFinalSession } from './access';
import './finals.css';

function SourceNotes({ refs }: { refs: SourceRef[] }) {
  return <small className="finals-source">{refs.map(ref => {
    const source = finalCatalog.sources.find(item => item.id === ref.sourceId);
    return `${source?.path ?? ref.sourceId} · ${ref.locator}`;
  }).join(' | ')}</small>;
}

export default function FinalReview({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<QuizMode>('practice');
  const [timer, setTimer] = useState(true);
  const [startedId, setStartedId] = useState<string | null>(null);
  if (!finalUnlocked()) return <main className="page-shell"><p>Nhập lại key để mở nội dung ôn tập.</p><button type="button" onClick={onExit}>Về trang chính</button></main>;
  const exam = startedId ? publishedExam(startedId) : undefined;
  if (exam) return <QuizRunner key={`${exam.id}-${mode}`} exam={exam} mode={mode} timerEnabled={timer} onHome={() => setStartedId(null)} />;
  const exams = finalCatalog.exams.filter(e => e.phase === 'phase1' && e.status === 'published');
  const sheets = finalCatalog.cheatSheets.filter(s => s.phase === 'phase1' && s.status === 'published');

  return <main className="page-shell finals-page">
    <header className="card finals-hero">
      <div className="finals-topline">
        <button type="button" className="link" onClick={onExit}>← Trang chính</button>
        <button type="button" className="secondary" onClick={() => { lockFinalSession(); onExit(); }}>Khóa khu này</button>
      </div>
      <span className="eyebrow">L34 · Phase 1 · Ngày 01–15</span>
      <h1>Ôn cuối kỳ AI thực chiến</h1>
      <p>Chọn luyện tập để mở gợi ý khi cần, hoặc thi thử để xem lời giải sau khi nộp bài.</p>
      <p className="finals-count"><strong>{exams.length} đề</strong> · <strong>{sheets.length} cheat sheet</strong> · Tiến độ riêng với Crown</p>
      <aside className="finals-notice"><strong>Đề luyện mô phỏng: 90 phút · 85 câu · 60 trắc nghiệm + 25 câu mở.</strong><br />
        Biên soạn từ tài liệu Phase 1 và phản hồi học viên; chưa phải cấu trúc thi chính thức. Câu mở gồm trả lời ngắn, điền từ, sắp xếp quy trình, prompt và tình huống.
      </aside>
    </header>

    <section className="card finals-panel" aria-labelledby="finals-exams-title">
      <h2 id="finals-exams-title">Làm đề Phase 1</h2>
      <div className="finals-options">
        <label>Chế độ <select aria-label="Chế độ ôn cuối kỳ" value={mode} onChange={e => setMode(e.target.value as QuizMode)}><option value="practice">Luyện tập</option><option value="exam">Thi thử</option></select></label>
        <label><input type="checkbox" checked={timer} onChange={e => setTimer(e.target.checked)} /> Bấm giờ 90 phút</label>
      </div>
      {exams.length === 0 && <p role="status">Chưa có đề đã xuất bản.</p>}
      <div className="finals-grid">{exams.map(item => <article className="finals-exam" key={item.id}>
        <span className="finals-label">{item.questions.length} câu · {item.totalPoints} điểm</span>
        <h3>{item.title}</h3><p>{item.description}</p>
        <button type="button" className="primary" onClick={() => setStartedId(item.id)}>Bắt đầu làm bài</button>
      </article>)}</div>
    </section>

    <section className="card finals-panel" aria-labelledby="finals-sheets-title">
      <h2 id="finals-sheets-title">Cheat sheet Phase 1</h2>
      {sheets.length === 0 && <p>Chưa có cheat sheet đã xuất bản.</p>}
      {sheets.map(sheet => <details className="finals-sheet" key={sheet.id}>
        <summary>{sheet.title} · {sheet.pages.length} phần</summary>
        {sheet.pages.map((page, i) => <section key={`${sheet.id}-${i}`}><h3>{page.title}</h3>
          {page.sections.map((section, j) => <article key={`${i}-${j}`}><h4>{section.title}</h4>
            <p><strong>Từ khóa:</strong> {section.keywords.join(' · ')}</p><p>{section.explanation}</p>
            <p><strong>Ví dụ:</strong> {section.example}</p><p><strong>Dễ nhầm:</strong> {section.commonMistake}</p><SourceNotes refs={section.sourceRefs} />
          </article>)}
        </section>)}
      </details>)}
    </section>

    <details className="card finals-panel finals-method">
      <summary>Cách luyện câu mở</summary>
      <p>Viết ngắn: chọn cách làm → giải thích vì sao → cho ví dụ → nêu cách kiểm tra. Câu tự chấm dùng rubric, không chấm tự động bằng AI.</p>
      <p>Gợi ý và đáp án mẫu chỉ mở khi bấm nút. Trong chế độ thi thử, các nút này xuất hiện khi xem lại bài đã nộp.</p>
      <p>Nội dung đã mở chỉ giữ trong bộ nhớ trang. Tải lại trang sẽ cần nhập key; câu trả lời được lưu trên thiết bị để tiếp tục luyện.</p>
    </details>
  </main>;
}
