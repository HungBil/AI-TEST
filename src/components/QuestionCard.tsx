import { useEffect, useState } from 'react';
import type { AnswerState, Question } from '../types/exam';
import { RichText } from './RichText';

interface Props {
  question: Question;
  index: number;
  total: number;
  answer?: AnswerState;
  mode: 'practice' | 'exam';
  submitted: boolean;
  onAnswer: (answer: AnswerState) => void;
}

export function QuestionCard({ question, index, total, answer, mode, submitted, onAnswer }: Props) {
  const [showHint, setShowHint] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const isMcq = question.type === 'mcq';
  const hasAnswer = isMcq ? Boolean(answer?.selected) : Boolean(answer?.text?.trim());
  const revealMcq = submitted || (mode === 'practice' && hasAnswer);
  const canUseOpenHelp = !isMcq && (mode === 'practice' || submitted);

  useEffect(() => {
    setShowHint(false);
    setShowModelAnswer(false);
  }, [question.id]);

  return (
    <article className="question-card card">
      <header className="question-header">
        <div>
          <span className="eyebrow">Câu {index + 1}/{total} · Module {question.module}</span>
          <h2>{question.type === 'mcq' ? 'Trắc nghiệm' : question.type === 'code' ? 'Code tay / pseudo-code' : 'Tự luận ngắn'}</h2>
        </div>
        <strong>{question.points} điểm</strong>
      </header>

      <RichText text={question.prompt} />

      {isMcq ? (
        <div className="options">
          {question.options.map((option) => {
            const selected = answer?.selected === option.key;
            const correct = revealMcq && option.key === question.answer;
            const wrong = revealMcq && selected && option.key !== question.answer;
            return (
              <button
                key={option.key}
                className={['option', selected ? 'selected' : '', correct ? 'correct' : '', wrong ? 'wrong' : ''].join(' ')}
                onClick={() => onAnswer({ ...answer, selected: option.key })}
              >
                <span>{option.key}</span>
                {option.text}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="open-answer">
          <textarea
            placeholder="Gõ câu trả lời/code/pseudo-code của bạn..."
            value={answer?.text ?? ''}
            onChange={(event) => onAnswer({ ...answer, text: event.target.value })}
          />

          {canUseOpenHelp ? (
            <div className="open-answer-tools">
              <button
                type="button"
                className="secondary"
                aria-expanded={showHint}
                onClick={() => setShowHint((value) => !value)}
              >
                {showHint ? 'Ẩn gợi ý' : 'Gợi ý'}
              </button>
              <button
                type="button"
                className="secondary"
                aria-expanded={showModelAnswer}
                onClick={() => setShowModelAnswer((value) => !value)}
              >
                {showModelAnswer ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu'}
              </button>
            </div>
          ) : (
            <p className="open-help-note">Gợi ý và đáp án mẫu được ẩn trong Exam mode.</p>
          )}
        </div>
      )}

      {revealMcq && isMcq && answer?.selected && (
        <section className="feedback">
          <strong>{answer.selected === question.answer ? 'Đúng' : `Sai. Đáp án đúng là ${question.answer}.`}</strong>
          <p>{question.explanation}</p>
        </section>
      )}

      {canUseOpenHelp && showHint && (
        <section className="feedback hint-panel">
          <strong>Gợi ý / các ý nên có</strong>
          <ul>{question.rubric.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      {canUseOpenHelp && showModelAnswer && (
        <section className="feedback model-answer-panel">
          <strong>Đáp án mẫu</strong>
          <pre><code>{question.modelAnswer}</code></pre>
          <div className="self-grade">
            <span>Tự chấm:</span>
            <button className={answer?.selfGrade === 'pass' ? 'active' : ''} onClick={() => onAnswer({ ...answer, selfGrade: 'pass' })}>Đạt</button>
            <button className={answer?.selfGrade === 'fail' ? 'active' : ''} onClick={() => onAnswer({ ...answer, selfGrade: 'fail' })}>Chưa đạt</button>
          </div>
        </section>
      )}
    </article>
  );
}
