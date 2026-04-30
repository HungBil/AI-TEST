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
  const isMcq = question.type === 'mcq';
  const hasAnswer = isMcq ? Boolean(answer?.selected) : Boolean(answer?.text?.trim());
  const reveal = submitted || (mode === 'practice' && hasAnswer);

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
            const correct = reveal && option.key === question.answer;
            const wrong = reveal && selected && option.key !== question.answer;
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
        </div>
      )}

      {reveal && isMcq && answer?.selected && (
        <section className="feedback">
          <strong>{answer.selected === question.answer ? 'Đúng' : `Sai. Đáp án đúng là ${question.answer}.`}</strong>
          <p>{question.explanation}</p>
        </section>
      )}

      {reveal && !isMcq && (
        <section className="feedback">
          <strong>Đáp án mẫu / rubric tự chấm</strong>
          <pre><code>{question.modelAnswer}</code></pre>
          <ul>{question.rubric.map((item) => <li key={item}>{item}</li>)}</ul>
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
