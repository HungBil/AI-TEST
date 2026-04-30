import type { AnswerState, Exam } from '../types/exam';
import { summarizeExam } from '../utils/scoring';
import { ModuleStats } from './ModuleStats';
import { Disclaimer } from './Disclaimer';

interface Props {
  exam: Exam;
  answers: Record<string, AnswerState>;
  onReview: (questionIndex: number) => void;
  onRestart: () => void;
  onHome: () => void;
}

export function ResultSummary({ exam, answers, onReview, onRestart, onHome }: Props) {
  const summary = summarizeExam(exam, answers);
  return (
    <main className="result page-shell">
      <section className="result-hero card">
        <div>
          <span className="eyebrow">Kết quả</span>
          <h1>{exam.title}</h1>
          <p>Đúng {summary.correct}/{summary.totalQuestions} câu · {summary.earned.toFixed(1)}/{summary.total} điểm</p>
          <Disclaimer />
        </div>
        <div className="score-circle"><strong>{summary.percent}%</strong><span>{summary.earned.toFixed(1)} điểm</span></div>
      </section>

      <ModuleStats scores={summary.moduleScores} />

      <section className="card review-panel">
        <h2>Câu cần ôn lại</h2>
        {summary.review.length === 0 ? <p>Bạn không có câu sai/chưa đạt.</p> : (
          <div className="review-list">
            {summary.review.map((question) => {
              const idx = exam.questions.findIndex((item) => item.id === question.id);
              return <button key={question.id} onClick={() => onReview(idx)}>Câu {idx + 1} · Module {question.module}<span>{question.type}</span></button>;
            })}
          </div>
        )}
      </section>

      <div className="actions">
        <button className="secondary" onClick={onHome}>Về trang chọn đề</button>
        <button className="primary" onClick={onRestart}>Làm lại bài này</button>
      </div>
    </main>
  );
}
