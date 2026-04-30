import type { Exam } from '../../types/exam';

const modules = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, Exam>;

export const exams: Exam[] = Object.values(modules).sort((a, b) => a.id.localeCompare(b.id));
