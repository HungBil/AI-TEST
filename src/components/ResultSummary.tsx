import { useState } from 'react';
import type { AnswerState, Exam } from '../types/exam';
import { isQuestionAnswered, isQuestionCorrect, summarizeExam } from '../utils/scoring';
import { ModuleStats } from './ModuleStats';
import { Disclaimer } from './Disclaimer';
import { ScoreCatPopup } from './ScoreCatPopup';

interface Props {
  exam: Exam;
  answers: Record<string, AnswerState>;
  onReview: (questionIndex: number) => void;
  onRestart: () => void;
  onHome: () => void;
  storageWarning?: boolean;
}

export function ResultSummary({ exam, answers, onReview, onRestart, onHome, storageWarning = false }: Props) {
  const summary = summarizeExam(exam, answers);
  const isFinal = exam.id.startsWith('final-');
  const [filter, setFilter] = useState<'review' | 'all' | 'open'>('review');
  const ungraded = exam.questions.filter(q => q.type !== 'mcq' && !answers[q.id]?.selfGrade);
  const review = isFinal && filter === 'all' ? exam.questions : isFinal && filter === 'open' ? ungraded : summary.review;
  const [showCatCelebration, setShowCatCelebration] = useState(() => /^new-2026-(14|15|16)$/.test(exam.id));

  return (
    <>
      {showCatCelebration && (
        <ScoreCatPopup percent={summary.percent} onClose={() => setShowCatCelebration(false)} />
      )}

      <main className={`result page-shell${isFinal ? ' final-result' : ''}`}>
        {storageWarning && <p className="score-pending" role="alert">Chưa lưu được bài làm trên thiết bị. Giữ trang này mở để tránh mất câu trả lời và điểm tự chấm.</p>}
        <section className="result-hero card">
          <div>
            <span className="eyebrow">Kết quả</span>
            <h1>{exam.title}</h1>
            <p>Đúng {summary.correct}/{summary.totalQuestions} câu · {summary.earned.toFixed(1)}/{summary.total} điểm</p>
            {isFinal && ungraded.length > 0 && <p className="score-pending">Điểm tạm tính · {ungraded.length} câu mở chờ tự chấm. Mở đáp án mẫu và đối chiếu rubric để hoàn tất.</p>}
            <Disclaimer text={exam.disclaimer} />
          </div>
          <div className="score-circle"><strong>{summary.percent}%</strong><span>{summary.earned.toFixed(1)} điểm</span></div>
        </section>

        <ModuleStats scores={summary.moduleScores} labels={exam.moduleLabels} />

        <section className="card review-panel">
          <h2>{isFinal ? 'Xem lại bài làm' : 'Câu cần ôn lại'}</h2>
          {isFinal && <div className="review-filters" role="group" aria-label="Lọc câu xem lại">
            <button type="button" aria-pressed={filter === 'review'} onClick={() => setFilter('review')}>Cần ôn lại ({summary.review.length})</button>
            <button type="button" aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>Chờ tự chấm ({ungraded.length})</button>
            <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Tất cả câu ({exam.questions.length})</button>
          </div>}
          {review.length === 0 ? <p>{isFinal ? 'Không có câu nào trong nhóm này.' : 'Bạn không có câu sai/chưa đạt.'}</p> : (
            <div className="review-list">
              {review.map((question) => {
                const idx = exam.questions.findIndex((item) => item.id === question.id);
                return <button key={question.id} onClick={() => onReview(idx)}>Câu {idx + 1} · {isFinal ? exam.moduleLabels?.[question.module] ?? `Module ${question.module}` : `Module ${question.module}`}<span>{isFinal ? !isQuestionAnswered(question, answers[question.id]) ? 'Chưa trả lời' : question.type !== 'mcq' && !answers[question.id]?.selfGrade ? 'Chờ tự chấm' : isQuestionCorrect(question, answers[question.id]) ? 'Đạt' : 'Cần ôn lại' : question.type}</span></button>;
              })}
            </div>
          )}
        </section>

        <div className="actions">
          <button className="secondary" onClick={onHome}>Về trang chọn đề</button>
          <button className="primary" onClick={onRestart}>Làm lại bài này</button>
        </div>
      </main>
    </>
  );
}
