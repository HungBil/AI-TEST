import type { Exam, Question } from '../types/exam';
import plan from './plan.json';

export type FinalPhase = 'phase1' | 'phase2';
export type FinalTrack = 'track-1' | 'track-2' | 'track-3' | 'track-4';
export interface SourceRef { sourceId: string; locator: string }
export interface FinalSource {
  id: string; repo: string; path: string; revision: string;
  phase: FinalPhase; trackId?: FinalTrack; reviewed: boolean;
}
export type FinalQuestion = Question & {
  intentId: string;
  sourceRefs: SourceRef[];
  responseKind?: 'short-answer' | 'system-prompt' | 'scenario';
};
export interface FinalExam extends Exam {
  phase: FinalPhase;
  trackId?: FinalTrack;
  status: 'draft' | 'published';
  questions: FinalQuestion[];
}
export interface FinalCheatSheet {
  id: string; phase: FinalPhase; trackId?: FinalTrack;
  day?: number;
  status: 'draft' | 'published'; title: string;
  pages: Array<{ title: string; sections: Array<{
    title: string; keywords: string[]; explanation: string;
    example: string; commonMistake: string; sourceRefs: SourceRef[];
  }> }>;
}
export interface FinalCatalog {
  schemaVersion: number;
  sources: FinalSource[];
  trackDefinitions: Array<{ id: FinalTrack; title: string; sourceRefs: SourceRef[] }>;
  exams: FinalExam[];
  cheatSheets: FinalCheatSheet[];
}
export interface FinalSlot { id: string; phase: FinalPhase; trackId?: FinalTrack; number: number }
const emptyCatalog: FinalCatalog = { schemaVersion: 1, sources: [], trackDefinitions: [], exams: [], cheatSheets: [] };
export let finalCatalog = emptyCatalog;
export function setFinalCatalog(catalog: FinalCatalog | null): void {
  finalCatalog = catalog ?? emptyCatalog;
}
export function hasFinalCatalog(): boolean {
  return finalCatalog !== emptyCatalog;
}
export const finalPlan = plan;
export const finalSlots: FinalSlot[] = [
  ...Array.from({ length: plan.phase1Count }, (_, i) => ({
    id: `final-p1-${String(i + 1).padStart(2, '0')}`,
    phase: 'phase1' as const, number: i + 1
  })),
  ...plan.trackSlots.flatMap((track, t) => Array.from({ length: track.examCount }, (_, i) => ({
    id: `final-p2-t${t + 1}-${String(i + 1).padStart(2, '0')}`,
    phase: 'phase2' as const, trackId: track.id as FinalTrack, number: i + 1
  })))
];
export function trackTitle(id: string): string {
  return finalCatalog.trackDefinitions.find((t) => t.id === id)?.title
    ?? plan.trackSlots.find((t) => t.id === id)?.label ?? id;
}
export function publishedExam(id: string): FinalExam | undefined {
  return finalCatalog.exams.find((exam) => exam.id === id && exam.status === 'published');
}
