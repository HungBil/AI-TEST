import { MODULE_LABELS } from '../types/exam';
import type { ModuleScore } from '../utils/scoring';

export function ModuleStats({ scores }: { scores: ModuleScore[] }) {
  return (
    <section className="module-stats">
      {scores.map((score) => {
        const pct = score.total ? Math.round((score.earned / score.total) * 100) : 0;
        return (
          <div className="module-stat card" key={score.module}>
            <div><strong>Module {score.module}</strong><span>{pct}%</span></div>
            <h3>{MODULE_LABELS[score.module]}</h3>
            <p>{score.correct}/{score.totalQuestions} câu · {score.earned.toFixed(1)}/{score.total.toFixed(1)} điểm</p>
            <div className="bar"><span style={{ width: `${pct}%` }} /></div>
          </div>
        );
      })}
    </section>
  );
}
