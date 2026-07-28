import type { Exam } from '../../types/exam';

const modules = import.meta.glob('./new-*.json', { eager: true, import: 'default' }) as Record<string, Exam>;

export const newExams: Exam[] = Object.values(modules).sort((a, b) => a.id.localeCompare(b.id));
