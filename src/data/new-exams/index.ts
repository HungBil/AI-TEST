import type { Exam, Question } from '../../types/exam';

type ExamMetadata = Omit<Exam, 'questions'>;

const manifests = import.meta.glob('./*/exam.json', { eager: true, import: 'default' }) as Record<string, ExamMetadata>;
const questionModules = import.meta.glob('./*/module-*.json', { eager: true, import: 'default' }) as Record<string, Question[]>;

export const newExams: Exam[] = Object.entries(manifests)
  .map(([manifestPath, metadata]) => {
    const directory = manifestPath.slice(0, manifestPath.lastIndexOf('/'));
    const questions = Object.entries(questionModules)
      .filter(([questionPath]) => questionPath.startsWith(`${directory}/module-`))
      .sort(([left], [right]) => left.localeCompare(right))
      .flatMap(([, moduleQuestions]) => moduleQuestions);

    return { ...metadata, questions };
  })
  .sort((a, b) => a.id.localeCompare(b.id));
