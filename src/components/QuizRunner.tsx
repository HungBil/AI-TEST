import { useEffect, useMemo, useState } from 'react';
import type { AnswerState, Exam, QuizMode } from '../types/exam';
import { saveProgress, loadProgress, clearProgress } from '../utils/storage';
import { QuestionCard } from './QuestionCard';
import { ResultSummary } from './ResultSummary';
import { Disclaimer } from './Disclaimer';
import { isQuestionAnswered } from '../utils/scoring';
import { clearFinalRun, loadFinalRun, saveFinalRun } from '../finals/progress';

interface Props {
  exam: Exam;
  mode: QuizMode;
  timerEnabled: boolean;
  onHome: () => void;
  persistSession?: boolean;
}

export function QuizRunner({ exam, mode, timerEnabled, onHome, persistSession = false }: Props) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => loadProgress(exam.id));
  const [savedRun] = useState(() => persistSession ? loadFinalRun(exam) : null);
  const [current, setCurrent] = useState(savedRun?.current ?? 0);
  const [submitted, setSubmitted] = useState(savedRun?.submitted ?? false);
  const [reviewing, setReviewing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(savedRun?.secondsLeft ?? exam.durationMinutes * 60);
  const [flagged, setFlagged] = useState<string[]>(savedRun?.flagged ?? []);
  const [mapOpen, setMapOpen] = useState(false);
  const [answersSaved, setAnswersSaved] = useState(true);
  const [runSaved, setRunSaved] = useState(true);
  const hasUnsavedChanges = !answersSaved || !runSaved;

  const answeredCount = useMemo(() => exam.questions.filter(q => isQuestionAnswered(q, answers[q.id])).length, [answers, exam.questions]);

  useEffect(() => {
    setAnswersSaved(saveProgress(exam.id, answers));
  }, [answers, exam.id]);

  useEffect(() => {
    if (persistSession) setRunSaved(saveFinalRun(exam.id, { mode, timerEnabled, current, secondsLeft, submitted, flagged }));
  }, [exam.id, persistSession, mode, timerEnabled, current, secondsLeft, submitted, flagged]);

  useEffect(() => {
    if (!timerEnabled || submitted) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timerEnabled, submitted]);

  useEffect(() => {
    if (timerEnabled && secondsLeft === 0) setSubmitted(true);
  }, [timerEnabled, secondsLeft]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  const leave = () => {
    if (!hasUnsavedChanges || window.confirm('Bài làm chưa lưu được trên thiết bị. Rời trang có thể mất dữ liệu vừa nhập. Vẫn rời trang?')) onHome();
  };

  const currentQuestion = exam.questions[current];
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const updateAnswer = (answer: AnswerState) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  if (submitted && !reviewing) {
    return <ResultSummary exam={exam} answers={answers} storageWarning={hasUnsavedChanges} onReview={(idx) => { setReviewing(true); setCurrent(idx); }} onRestart={() => { clearProgress(exam.id); clearFinalRun(exam.id); setAnswers({}); setFlagged([]); setCurrent(0); setSecondsLeft(exam.durationMinutes * 60); setSubmitted(false); setReviewing(false); }} onHome={leave} />;
  }

  return (
    <main className={`quiz-layout${persistSession ? ' final-quiz' : ''}`}>
      <aside className="quiz-sidebar card">
        <button className="link" onClick={leave}>← Đổi đề</button>
        <h1>{exam.title}</h1>
        <p>{mode === 'practice' ? 'Luyện tập' : 'Thi thử'} · {answeredCount}/{exam.questions.length} câu đã làm</p>
        {timerEnabled && <div className="timer">{minutes}:{seconds}</div>}
        {persistSession && <progress className="quiz-progress" aria-label="Tiến độ trả lời" max={exam.questions.length} value={answeredCount} />}
        <div className={`question-map${mapOpen ? ' map-open' : ''}`}>
          {persistSession && <button className="question-map-toggle secondary" type="button" aria-expanded={mapOpen} onClick={() => setMapOpen(value => !value)}>Bảng {exam.questions.length} câu {mapOpen ? '−' : '+'}</button>}
          <div className="question-nav" role="group" aria-label="Điều hướng câu hỏi">
            {exam.questions.map((question, idx) => <button key={question.id} type="button" aria-current={idx === current ? 'step' : undefined}
              aria-label={`Câu ${idx + 1}${isQuestionAnswered(question, answers[question.id]) ? ', đã trả lời' : ', chưa trả lời'}${flagged.includes(question.id) ? ', đánh dấu' : ''}`}
              className={`${idx === current ? 'active' : ''} ${isQuestionAnswered(question, answers[question.id]) ? 'answered' : ''} ${flagged.includes(question.id) ? 'flagged' : ''}`}
              onClick={() => { setCurrent(idx); setMapOpen(false); }}>{idx + 1}</button>)}
          </div>
        </div>
        {persistSession ? <details className="quiz-notes"><summary>Lưu ý khi làm bài</summary><Disclaimer text={exam.disclaimer} /><p>Rời đề sẽ tạm dừng đồng hồ. Nhập lại key sau khi tải lại trang để tiếp tục phiên đã lưu.</p></details> : <Disclaimer text={exam.disclaimer} />}
      </aside>

      <section className="quiz-main">
        {persistSession && <div className="quiz-tools"><span role="status">{answersSaved && runSaved ? 'Đã lưu trên thiết bị' : 'Chưa lưu được. Giữ trang này mở để tránh mất bài.'}</span>
          <button className="secondary" type="button" aria-pressed={flagged.includes(currentQuestion.id)} onClick={() => setFlagged(previous => previous.includes(currentQuestion.id) ? previous.filter(id => id !== currentQuestion.id) : [...previous, currentQuestion.id])}>{flagged.includes(currentQuestion.id) ? '★ Đã đánh dấu' : '☆ Đánh dấu câu này'}</button>
        </div>}
        {!persistSession && hasUnsavedChanges && <p role="alert">Chưa lưu được. Giữ trang này mở để tránh mất bài.</p>}
        <QuestionCard question={currentQuestion} index={current} total={exam.questions.length} answer={answers[currentQuestion.id]} mode={mode} submitted={submitted} moduleLabel={exam.moduleLabels?.[currentQuestion.module]} onAnswer={updateAnswer} />
        <div className="actions">
          <button className="secondary" disabled={current === 0} onClick={() => setCurrent((x) => Math.max(0, x - 1))}>Câu trước</button>
          <button className="secondary" disabled={current === exam.questions.length - 1} onClick={() => setCurrent((x) => Math.min(exam.questions.length - 1, x + 1))}>Câu sau</button>
          <button className="primary" onClick={() => { setSubmitted(true); setReviewing(false); }}>{submitted ? 'Về kết quả' : 'Nộp bài'}</button>
        </div>
      </section>
    </main>
  );
}
