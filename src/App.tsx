import { useState } from 'react';
import { exams } from './data/exams';
import type { QuizMode } from './types/exam';
import { ExamSelector } from './components/ExamSelector';
import { QuizRunner } from './components/QuizRunner';
import './styles/global.css';

export default function App() {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id ?? '');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const exam = exams.find((item) => item.id === selectedExamId) ?? exams[0];

  if (!exam) return <main className="page-shell"><h1>Chưa có đề nào</h1></main>;

  if (!started) {
    return <ExamSelector exams={exams} selectedExamId={selectedExamId} mode={mode} timerEnabled={timerEnabled} onExamChange={setSelectedExamId} onModeChange={setMode} onTimerChange={setTimerEnabled} onStart={() => setStarted(true)} />;
  }

  return <QuizRunner exam={exam} mode={mode} timerEnabled={timerEnabled} onHome={() => setStarted(false)} />;
}
