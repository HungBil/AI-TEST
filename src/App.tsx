import { useState } from 'react';
import { exams } from './data/exams';
import { newExams } from './data/new-exams';
import type { QuizMode } from './types/exam';
import { ExamSelector } from './components/ExamSelector';
import { QuizRunner } from './components/QuizRunner';
import { CrownGate } from './components/CrownGate';
import './styles/global.css';

type ExamCollection = 'legacy' | 'new';

export default function App() {
  const [collection, setCollection] = useState<ExamCollection>('legacy');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id ?? '');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [started, setStarted] = useState(false);

  const activeExams = collection === 'new' ? newExams : exams;
  const exam = activeExams.find((item) => item.id === selectedExamId) ?? activeExams[0];

  const enterNewCollection = () => {
    if (!newExams.length) {
      window.alert('Chưa có bộ đề khóa mới.');
      return;
    }
    setCollection('new');
    setSelectedExamId(newExams[0].id);
    setStarted(false);
  };

  const exitNewCollection = () => {
    setCollection('legacy');
    setSelectedExamId(exams[0]?.id ?? '');
    setStarted(false);
  };

  if (!exam) return <main className="page-shell"><h1>Chưa có đề nào</h1></main>;

  if (!started) {
    return (
      <>
        <ExamSelector
          exams={activeExams}
          selectedExamId={selectedExamId}
          mode={mode}
          timerEnabled={timerEnabled}
          collection={collection}
          onExamChange={setSelectedExamId}
          onModeChange={setMode}
          onTimerChange={setTimerEnabled}
          onStart={() => setStarted(true)}
          onExitNewCollection={exitNewCollection}
        />
        {collection === 'legacy' && <CrownGate onUnlock={enterNewCollection} />}
      </>
    );
  }

  return <QuizRunner exam={exam} mode={mode} timerEnabled={timerEnabled} onHome={() => setStarted(false)} />;
}
