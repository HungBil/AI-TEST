import { useState } from 'react';
import type { QuizMode } from '../types/exam';
import { QuizRunner } from '../components/QuizRunner';
import { finalCatalog, finalPlan, finalSlots, publishedExam, trackTitle, type FinalPhase, type FinalTrack, type SourceRef } from './catalog';
import { lockFinalSession } from './access';
import './finals.css';

function SourceNotes({ refs }: { refs: SourceRef[] }) {
  return <small className="finals-source">{refs.map(ref => {
    const source = finalCatalog.sources.find(item => item.id === ref.sourceId);
    return `${source?.path ?? ref.sourceId} · ${ref.locator}`;
  }).join(' | ')}</small>;
}

export default function FinalReview({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<FinalPhase>('phase1');
  const [track, setTrack] = useState<FinalTrack>('track-1');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [timer, setTimer] = useState(true);
  const [startedId, setStartedId] = useState<string | null>(null);
  const exam = startedId ? publishedExam(startedId) : undefined;
  if (exam) return <QuizRunner key={`${exam.id}-${mode}`} exam={exam} mode={mode} timerEnabled={timer} onHome={() => setStartedId(null)} />;
  const slots = finalSlots.filter(s => s.phase === phase && (phase === 'phase1' || s.trackId === track));
  const sheets = finalCatalog.cheatSheets.filter(s => s.status === 'published' && s.phase === phase && (phase === 'phase1' || s.trackId === track));
  const ready = finalCatalog.exams.filter(e => e.status === 'published').length;

  return <main className="page-shell finals-page">
    <header className="card finals-hero">
      <div className="finals-topline">
        <button type="button" className="link" onClick={onExit}>← Trang chính</button>
        <button type="button" className="secondary" onClick={() => { lockFinalSession(); onExit(); }}>Khóa khu này</button>
      </div>
      <span className="eyebrow">Không gian cuối kỳ · độc lập với Crown đầu vào</span>
      <h1>Ôn cuối kỳ AI thực chiến</h1>
      <p>Phase 1 và bốn track Phase 2 có đề, tài liệu ôn và tiến độ riêng. Chỉ mở làm bài sau khi câu hỏi đã được đối chiếu tài liệu nguồn.</p>
      <div className="finals-stats"><span><b>{ready}/20</b> đề sẵn sàng</span><span><b>10 + 10</b> suất đề dự kiến</span><span><b>Không code tay</b> theo phản hồi học viên</span></div>
      <aside className="finals-notice"><strong>Cấu trúc mô phỏng tạm thời: 90 phút · 85 câu · 60 trắc nghiệm + 25 câu mở.</strong><br />{finalPlan.format.note}</aside>
      {finalCatalog.sources.length === 0 && <p role="status" className="finals-pending">Chưa đọc được tài liệu AI20k-data trong phiên chuẩn bị này. Khung trang đã sẵn sàng; chưa có đề hoặc cheat sheet kiến thức được xuất bản. Các thẻ bên dưới là kế hoạch, không phải đề đã hoàn thành.</p>}
    </header>

    <section className="card finals-panel" aria-label="Chọn phase và track">
      <div className="finals-segments" role="group" aria-label="Phase ôn tập">
        <button type="button" aria-pressed={phase === 'phase1'} onClick={() => setPhase('phase1')}>Phase 1 · 10 đề</button>
        <button type="button" aria-pressed={phase === 'phase2'} onClick={() => setPhase('phase2')}>Phase 2 · 10 đề / 4 track</button>
      </div>
      {phase === 'phase2' && <>
        <div className="finals-tracks" role="group" aria-label="Bốn track Phase 2">{finalPlan.trackSlots.map(t =>
          <button key={t.id} type="button" aria-pressed={track === t.id} onClick={() => setTrack(t.id as FinalTrack)}>{trackTitle(t.id)}<small>{t.examCount} suất đề dự kiến</small></button>
        )}</div><p className="finals-muted">{finalPlan.allocationNote}</p>
      </>}
      <div className="finals-options">
        <label>Chế độ <select aria-label="Chế độ ôn cuối kỳ" value={mode} onChange={e => setMode(e.target.value as QuizMode)}><option value="practice">Luyện tập</option><option value="exam">Thi thử</option></select></label>
        <label><input type="checkbox" checked={timer} onChange={e => setTimer(e.target.checked)} /> Bấm giờ 90 phút</label>
      </div>
    </section>

    <section className="card finals-panel" aria-labelledby="finals-exams-title">
      <h2 id="finals-exams-title">{phase === 'phase1' ? 'Đề Phase 1' : trackTitle(track)}</h2>
      <div className="finals-grid">{slots.map(slot => {
        const item = publishedExam(slot.id);
        return <article className="finals-exam" key={slot.id}>
          <span className="finals-label">{item ? 'Đã xuất bản' : 'Chờ biên soạn'}</span>
          <h3>{item?.title ?? `Đề ${String(slot.number).padStart(2, '0')}`}</h3>
          <p>{item?.description ?? 'Chưa có nội dung được kiểm tra với slide. Không dùng câu hỏi đầu vào để lấp chỗ trống.'}</p>
          <button type="button" className="primary" disabled={!item} onClick={() => setStartedId(slot.id)}>{item ? 'Bắt đầu làm bài' : 'Chưa có đề để làm'}</button>
        </article>;
      })}</div>
    </section>

    <section className="card finals-panel" aria-labelledby="finals-sheets-title">
      <h2 id="finals-sheets-title">Cheat sheet riêng · {phase === 'phase1' ? 'Phase 1' : trackTitle(track)}</h2>
      {sheets.length === 0 ? <p className="finals-muted">Chờ đọc slide để lập bảng: từ khóa → ý nghĩa → khái niệm dễ nhầm → ví dụ. Không dùng cheat sheet đầu vào thay cho kiến thức cuối kỳ.</p> : sheets.map(sheet =>
        <details className="finals-sheet" key={sheet.id}>
          <summary>{sheet.title} · {sheet.pages.length} trang nội dung</summary>
          {sheet.pages.map((page, i) => <section key={`${sheet.id}-${i}`}><h3>Trang {i + 1} · {page.title}</h3>
            {page.sections.map((section, j) => <article key={`${i}-${j}`}><h4>{section.title}</h4>
              <p><strong>Từ khóa:</strong> {section.keywords.join(' · ')}</p><p>{section.explanation}</p>
              <p><strong>Ví dụ:</strong> {section.example}</p><p><strong>Dễ nhầm:</strong> {section.commonMistake}</p><SourceNotes refs={section.sourceRefs} />
            </article>)}
          </section>)}
        </details>
      )}
    </section>

    <details className="card finals-panel finals-method">
      <summary>Cách luyện câu mở — hướng dẫn làm bài, không phải nội dung slide</summary>
      <p><strong>Phân bổ thử cho 90 phút:</strong> 25 phút cho lượt trắc nghiệm đầu, 55 phút cho câu mở và 10 phút rà soát. Điều chỉnh sau khi làm đề thử; đây là gợi ý, không phải quy định thi.</p>
      <p><strong>Viết ngắn theo bốn bước:</strong> Chọn cách làm → giải thích vì sao phù hợp ràng buộc → cho ví dụ đầu vào/đầu ra → nói cách kiểm tra kết quả và xử lý khi sai.</p>
      <p><strong>Khi được hỏi system prompt:</strong> nêu vai trò, nhiệm vụ, dữ liệu được dùng, điều không được làm, định dạng đầu ra, cách xử lý thiếu thông tin và một ví dụ. Viết chỉ dẫn bằng ngôn ngữ tự nhiên, không phải code tay.</p>
      <p><strong>Khi ôn trắc nghiệm:</strong> tự giải thích mỗi từ khóa trong một câu; so với một khái niệm dễ nhầm; thử một tình huống nhỏ thay vì chỉ thuộc chữ cái đáp án.</p>
    </details>
  </main>;
}
