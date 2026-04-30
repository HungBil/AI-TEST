import type { Exam, QuizMode } from '../types/exam';
import { Disclaimer } from './Disclaimer';

const COMMUNITY_URL = 'https://www.facebook.com/groups/1450219003271674';

interface Props {
  exams: Exam[];
  selectedExamId: string;
  mode: QuizMode;
  timerEnabled: boolean;
  onExamChange: (id: string) => void;
  onModeChange: (mode: QuizMode) => void;
  onTimerChange: (enabled: boolean) => void;
  onStart: () => void;
}

export function ExamSelector({ exams, selectedExamId, mode, timerEnabled, onExamChange, onModeChange, onTimerChange, onStart }: Props) {
  const selected = exams.find((exam) => exam.id === selectedExamId) ?? exams[0];

  return (
    <main className="home page-shell">
      <section className="hero card">
        <span className="eyebrow">AI TEST · open source</span>
        <h1>Bộ đề cương ôn tập AI thực chiến</h1>
        <p>Local/self-host web app với {exams.length} bài kiểm tra. Mỗi bài 60 câu, có Practice mode, Exam mode, tự luận self-grade và thống kê cuối bài.</p>
        <a className="community-cta" href={COMMUNITY_URL} target="_blank" rel="noreferrer">
          <span aria-hidden="true">-&gt;</span>
          Đây là nhóm thảo luận AI THỰC CHIẾN - AI startup in Vietnam
        </a>
        <Disclaimer />
      </section>

      <section className="setup card">
        <label>
          <span>Chọn bài kiểm tra</span>
          <select value={selectedExamId} onChange={(event) => onExamChange(event.target.value)}>
            {exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
          </select>
        </label>

        <div className="mode-grid">
          <button className={mode === 'practice' ? 'active mode-card' : 'mode-card'} onClick={() => onModeChange('practice')}>
            Practice mode
            <span>Chọn xong hiện đúng/sai, đáp án và giải thích.</span>
          </button>
          <button className={mode === 'exam' ? 'active mode-card' : 'mode-card'} onClick={() => onModeChange('exam')}>
            Exam mode
            <span>Làm xong mới hiện đáp án, giống tự bấm giờ.</span>
          </button>
        </div>

        <label className="checkbox-row">
          <input type="checkbox" checked={timerEnabled} onChange={(event) => onTimerChange(event.target.checked)} />
          Bật timer {selected.durationMinutes} phút
        </label>

        <div className="overview">
          <strong>{selected.title}</strong>
          <span>{selected.description}</span>
          <ul>
            <li>A: 10 câu toán & định lượng</li>
            <li>B: 22 câu Python/NumPy/Pandas, gồm 2 câu code tay</li>
            <li>C: 20 câu AI/product AI, gồm 2 tự luận</li>
            <li>D: 8 câu logic/đạo đức, gồm 1 tự luận tình huống</li>
          </ul>
        </div>

        <button className="primary" onClick={onStart}>Bắt đầu làm bài</button>
      </section>
    </main>
  );
}
