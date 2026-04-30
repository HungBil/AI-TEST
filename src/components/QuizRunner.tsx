import { useEffect, useMemo, useState } from 'react';
import type { AnswerState, Exam, QuizMode } from '../types/exam';
import { saveProgress, loadProgress, clearProgress } from '../utils/storage';
import { QuestionCard } from './QuestionCard';
import { ResultSummary } from './ResultSummary';
import { Disclaimer } from './Disclaimer';

interface Props {
  exam: Exam;
  mode: QuizMode;
  timerEnabled: boolean;
  onHome: () => void;
}

export function QuizRunner({ exam, mode, timerEnabled, onHome }: Props) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => loadProgress(exam.id));
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);

  const answeredCount = useMemo(() => exam.questions.filter((q) => {
    const a = answers[q.id];
    return q.type === 'mcq' ? Boolean(a?.selected) : Boolean(a?.text || a?.selfGrade);
  }).length, [answers, exam.questions]);

  useEffect(() => {
    saveProgress(exam.id, answers);
  }, [answers, exam.id]);

  useEffect(() => {
    if (!timerEnabled || submitted) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timerEnabled, submitted]);

  useEffect(() => {
    if (timerEnabled && secondsLeft === 0) setSubmitted(true);
  }, [timerEnabled, secondsLeft]);

  const currentQuestion = exam.questions[current];
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const updateAnswer = (answer: AnswerState) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  if (submitted) {
    return <ResultSummary exam={exam} answers={answers} onReview={(idx) => { setSubmitted(false); setCurrent(idx); }} onRestart={() => { clearProgress(exam.id); setAnswers({}); setCurrent(0); setSecondsLeft(exam.durationMinutes * 60); setSubmitted(false); }} onHome={onHome} />;
  }

  return (
    <main className="quiz-layout">
      <aside className="quiz-sidebar card">
        <button className="link" onClick={onHome}>← Đổi đề</button>
        <h1>{exam.title}</h1>
        <p>{mode === 'practice' ? 'Practice mode' : 'Exam mode'} · {answeredCount}/{exam.questions.length} câu đã làm</p>
        {timerEnabled && <div className="timer">{minutes}:{seconds}</div>}
        <div className="question-nav">
          {exam.questions.map((question, idx) => <button key={question.id} className={`${idx === current ? 'active' : ''} ${answers[question.id] ? 'answered' : ''}`} onClick={() => setCurrent(idx)}>{idx + 1}</button>)}
        </div>
        <Disclaimer />
      </aside>

      <section className="quiz-main">
        <QuestionCard question={currentQuestion} index={current} total={exam.questions.length} answer={answers[currentQuestion.id]} mode={mode} submitted={submitted} onAnswer={updateAnswer} />
        <div className="actions">
          <button className="secondary" disabled={current === 0} onClick={() => setCurrent((x) => Math.max(0, x - 1))}>Câu trước</button>
          <button className="secondary" disabled={current === exam.questions.length - 1} onClick={() => setCurrent((x) => Math.min(exam.questions.length - 1, x + 1))}>Câu sau</button>
          <button className="primary" onClick={() => setSubmitted(true)}>Nộp bài</button>
        </div>
      </section>
    </main>
  );
}
