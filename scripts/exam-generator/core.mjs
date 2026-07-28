export const MODULE_LABELS = {
  A: 'Xác suất & đại số tuyến tính',
  B: 'Euclid, Python API & NumPy',
  C: 'AI, RAG & thiết kế hệ thống',
  D: 'Privacy, banking & Responsible AI'
};

export const EXAM_THEMES = [
  {
    no: 2,
    title: 'Xác suất có điều kiện, API bền vững và RAG phân quyền',
    focus: 'Bayes theo bảng đếm, ma trận, lỗi API, ACL tài liệu và đánh giá hệ thống AI'
  },
  {
    no: 3,
    title: 'Tổ hợp, vector và AI đa ngôn ngữ',
    focus: 'tổ hợp, kỳ vọng, vector, NumPy, chatbot đa ngôn ngữ, computer vision và gia sư ảo'
  },
  {
    no: 4,
    title: 'Ma trận, bảo mật API và AI ngân hàng',
    focus: 'hệ tuyến tính, ma trận, API security, cảnh báo lừa đảo, OCR và tác tử IT'
  },
  {
    no: 5,
    title: 'Lấy mẫu, idempotency và MLOps',
    focus: 'lấy mẫu, xác suất, idempotency, multi-tenant RAG, giám sát mô hình và rollback'
  },
  {
    no: 6,
    title: 'Rủi ro kỳ vọng, voice bot và graph AML',
    focus: 'rủi ro kỳ vọng, đại số tuyến tính, voice AI, fairness tín dụng và đồ thị chống rửa tiền'
  },
  {
    no: 7,
    title: 'Trị riêng, agent sandbox và adaptive tutor',
    focus: 'trị riêng, vector, sandbox công cụ, đánh giá agent và gia sư thích nghi'
  },
  {
    no: 8,
    title: 'Bayesian table, cursor API và multimodal KYC',
    focus: 'Bayes bằng bảng, phân trang cursor, KYC đa phương thức, legal assistant và bảo trì dự báo'
  },
  {
    no: 9,
    title: 'Markov, temporal graph và research agent',
    focus: 'chuỗi Markov cơ bản, đồ thị theo thời gian, dự báo, tác tử nghiên cứu và provenance'
  },
  {
    no: 10,
    title: 'Đề tổng hợp khó và pilot AI sáu tuần',
    focus: 'tổng hợp xác suất, ma trận, API, privacy RAG, incident response và thiết kế pilot sáu tuần'
  }
];

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export function fraction(numerator, denominator) {
  const sign = denominator < 0 ? -1 : 1;
  const g = gcd(numerator, denominator);
  return `${sign * numerator / g}/${Math.abs(denominator) / g}`;
}

export function choose(n, k) {
  if (k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let value = 1;
  for (let i = 1; i <= r; i += 1) value = value * (n - r + i) / i;
  return value;
}

export function hash(text) {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function distinct(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = String(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function mcq({ id, module, points, prompt, correct, distractors, explanation, tags = [] }) {
  const candidates = distinct([String(correct), ...distractors.map(String)]);
  if (candidates.length < 4) throw new Error(`${id}: options must be distinct`);
  const correctPosition = hash(id) % 4;
  const wrong = candidates.slice(1, 4);
  const ordered = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    ordered.push(index === correctPosition ? candidates[0] : wrong[wrongIndex++]);
  }
  const keys = ['A', 'B', 'C', 'D'];
  return {
    id,
    module,
    type: 'mcq',
    points,
    prompt,
    options: ordered.map((text, index) => ({ key: keys[index], text })),
    answer: keys[correctPosition],
    explanation,
    tags
  };
}

export function openQuestion({ id, module, type, points, prompt, modelAnswer, rubric, tags = [] }) {
  return { id, module, type, points, prompt, modelAnswer, rubric, tags };
}

export function questionId(examNo, module, index) {
  return `N26-${String(examNo).padStart(2, '0')}-${module}${String(index).padStart(2, '0')}`;
}

export function percent(value, digits = 1) {
  const rendered = Number(value.toFixed(digits));
  return `${String(rendered).replace('.', ',')}%`;
}

export function examMetadata(theme) {
  return {
    id: `new-2026-${String(theme.no).padStart(2, '0')}`,
    title: `Bộ mô phỏng khóa mới 2026 · Đề ${String(theme.no).padStart(2, '0')}`,
    description: `60 câu theo chủ đề ${theme.title.toLowerCase()}: ${theme.focus}.`,
    durationMinutes: 90,
    totalPoints: 100,
    disclaimer: 'Đây là đề mô phỏng ôn tập được biên soạn từ phản hồi không chính thức của người học, phạm vi công khai của chương trình và các chủ đề kỹ thuật phổ biến. Đây không phải đề thi chính thức hoặc đề bị lộ. Các câu toán được thiết kế để giải bằng giấy nháp, không cần máy tính cầm tay.',
    moduleLabels: MODULE_LABELS,
    moduleOverview: [
      'Module 1 · A: 20 câu xác suất và đại số tuyến tính, trọng tâm Bayes và ma trận.',
      'Module 2 · B: 20 câu Euclid, Python gọi API và NumPy; gồm đúng 2 câu code.',
      'Module 3 · C: 12 câu AI/RAG/triển khai; gồm đúng 3 câu tự luận có ràng buộc.',
      'Module 4 · D: 8 câu privacy, banking, phân quyền và Responsible AI.'
    ]
  };
}
