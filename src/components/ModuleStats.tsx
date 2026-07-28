import { MODULE_LABELS } from '../types/exam';
import type { ModuleId } from '../types/exam';
import type { ModuleScore } from '../utils/scoring';

interface Props {
  scores: ModuleScore[];
  labels?: Partial<Record<ModuleId, string>>;
}

export function ModuleStats({ scores, labels }: Props) {
  return (
    <section className="module-stats">
      {scores.map((score) => {
        const pct = score.total ? Math.round((score.earned / score.total) * 100) : 0;
        const label = labels?.[score.module] ?? MODULE_LABELS[score.module];
        return (
          <div className="module-stat card" key={score.module}>
            <div><strong>Module {score.module}</strong><span>{pct}%</span></div>
            <h3>{label}</h3>
            <p>{score.correct}/{score.totalQuestions} câu · {score.earned.toFixed(1)}/{score.total.toFixed(1)} điểm</p>
            <div className="bar"><span style={{ width: `${pct}%` }} /></div>
          </div>
        );
      })}
    </section>
  );
}
