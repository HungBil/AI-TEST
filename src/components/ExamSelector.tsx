import type { ChangeEvent } from 'react';
import type { Exam, QuizMode } from '../types/exam';
import { Disclaimer } from './Disclaimer';

const COMMUNITY_URL = 'https://www.facebook.com/groups/1450219003271674';

interface Props {
  exams: Exam[];
  selectedExamId: string;
  mode: QuizMode;
  timerEnabled: boolean;
  collection?: 'legacy' | 'new';
  onExamChange: (id: string) => void;
  onModeChange: (mode: QuizMode) => void;
  onTimerChange: (enabled: boolean) => void;
  onStart: () => void;
  onExitNewCollection?: () => void;
}

const LEGACY_OVERVIEW = [
  'A: 10 câu toán & định lượng',
  'B: 22 câu Python/NumPy/Pandas, gồm 2 câu code tay',
  'C: 20 câu AI/product AI, gồm 2 tự luận',
  'D: 8 câu logic/đạo đức, gồm 1 tự luận tình huống'
];

export function ExamSelector({
  exams,
  selectedExamId,
  mode,
  timerEnabled,
  collection = 'legacy',
  onExamChange,
  onModeChange,
  onTimerChange,
  onStart,
  onExitNewCollection
}: Props) {
  const selected = exams.find((exam) => exam.id === selectedExamId) ?? exams[0];
  const isNewCollection = collection === 'new';
  const overview = selected.moduleOverview ?? LEGACY_OVERVIEW;

  return (
    <main className={`home page-shell ${isNewCollection ? 'new-collection' : ''}`}>
      <section className="hero card">
        {isNewCollection && (
          <button className="link collection-back" type="button" onClick={onExitNewCollection}>
            ← Quay về bộ đề cũ
          </button>
        )}
        <span className="eyebrow">{isNewCollection ? 'AI TEST · bộ khóa mới' : 'AI TEST · open source'}</span>
        <h1>{isNewCollection ? 'Bộ mô phỏng khóa mới 2026' : 'Bộ đề cương ôn tập AI thực chiến'}</h1>
        <p>
          {isNewCollection
            ? `${exams.length} đề mô phỏng, mỗi đề 60 câu và dùng nguyên cơ chế Practice/Exam, timer, tự chấm tự luận và thống kê cuối bài.`
            : `Local/self-host web app với ${exams.length} bài kiểm tra. Mỗi bài 60 câu, có Practice mode, Exam mode, tự luận self-grade và thống kê cuối bài.`}
        </p>
        {!isNewCollection && (
          <a className="community-cta" href={COMMUNITY_URL} target="_blank" rel="noreferrer">
            <span aria-hidden="true">-&gt;</span>
            Đây là nhóm thảo luận AI THỰC CHIẾN - AI startup in Vietnam
          </a>
        )}
        <Disclaimer text={selected.disclaimer} />
      </section>

      <section className="setup card">
        <label>
          <span>Chọn bài kiểm tra</span>
          <select value={selectedExamId} onChange={(event: ChangeEvent<HTMLSelectElement>) => onExamChange(event.target.value)}>
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
          <input type="checkbox" checked={timerEnabled} onChange={(event: ChangeEvent<HTMLInputElement>) => onTimerChange(event.target.checked)} />
          Bật timer {selected.durationMinutes} phút
        </label>

        <div className="overview">
          <strong>{selected.title}</strong>
          <span>{selected.description}</span>
          <ul>
            {overview.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <button className="primary" onClick={onStart}>Bắt đầu làm bài</button>
      </section>
    </main>
  );
}
