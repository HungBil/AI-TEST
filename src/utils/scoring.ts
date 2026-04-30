import type { AnswerState, Exam, ModuleId, Question } from '../types/exam';

export interface ModuleScore {
  module: ModuleId;
  earned: number;
  total: number;
  correct: number;
  totalQuestions: number;
}

export function isQuestionCorrect(question: Question, answer?: AnswerState): boolean {
  if (!answer) return false;
  if (question.type === 'mcq') return answer.selected === question.answer;
  return answer.selfGrade === 'pass';
}

export function scoreQuestion(question: Question, answer?: AnswerState): number {
  return isQuestionCorrect(question, answer) ? question.points : 0;
}

export function summarizeExam(exam: Exam, answers: Record<string, AnswerState>) {
  const moduleScores: Record<ModuleId, ModuleScore> = {
    A: { module: 'A', earned: 0, total: 0, correct: 0, totalQuestions: 0 },
    B: { module: 'B', earned: 0, total: 0, correct: 0, totalQuestions: 0 },
    C: { module: 'C', earned: 0, total: 0, correct: 0, totalQuestions: 0 },
    D: { module: 'D', earned: 0, total: 0, correct: 0, totalQuestions: 0 }
  };

  let earned = 0;
  let correct = 0;
  const review: Question[] = [];

  for (const question of exam.questions) {
    const answer = answers[question.id];
    const qScore = scoreQuestion(question, answer);
    const ok = isQuestionCorrect(question, answer);
    earned += qScore;
    if (ok) correct += 1;
    if (!ok) review.push(question);

    const bucket = moduleScores[question.module];
    bucket.earned += qScore;
    bucket.total += question.points;
    bucket.totalQuestions += 1;
    if (ok) bucket.correct += 1;
  }

  return {
    earned,
    total: exam.totalPoints,
    correct,
    totalQuestions: exam.questions.length,
    percent: Math.round((earned / exam.totalPoints) * 100),
    moduleScores: Object.values(moduleScores),
    review
  };
}
