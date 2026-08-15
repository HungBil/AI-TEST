import { buildDayOneExams as buildRawDayOneExams } from './day-one-exams.mjs';

// Compatibility bridge for the first-day profile objects. It exists only while
// the deterministic build function runs, then restores Object.prototype exactly.
const PROFILE_FIELDS = ['b', 'learningRate', 'gradient', 'gradients', 'answer'];

export function buildDayOneExams() {
  const previous = new Map(PROFILE_FIELDS.map((field) => [field, Object.getOwnPropertyDescriptor(Object.prototype, field)]));

  for (const field of PROFILE_FIELDS) {
    Object.defineProperty(Object.prototype, field, {
      configurable: true,
      get() {
        return this?.bias?.[field];
      }
    });
  }

  try {
    return buildRawDayOneExams();
  } finally {
    for (const field of PROFILE_FIELDS) {
      const descriptor = previous.get(field);
      if (descriptor) Object.defineProperty(Object.prototype, field, descriptor);
      else delete Object.prototype[field];
    }
  }
}
