export const MODULE_LABELS = {
  A: 'Xác suất & đại số tuyến tính phần ma trận',
  B: 'Euclid, Python gọi API & NumPy',
  C: 'AI cơ bản, RAG & triển khai',
  D: 'Đạo đức AI, banking & privacy'
};

export const DISCLAIMER = 'Đây là bộ câu hỏi ôn tập cộng đồng, được biên soạn bám theo phản hồi không chính thức của người thi gần đây. Đây không phải đề thi chính thức hoặc đề bị lộ. Phạm vi được giữ quanh xác suất, ma trận, Euclid, Python API, NumPy, ba câu tự luận AI và các tình huống privacy/banking cơ bản.';

const LETTERS = ['A', 'B', 'C', 'D'];

function hash(text) {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function distinct(values) {
  return [...new Set(values.map((value) => String(value)))];
}

export function mcq({ id, module, points, prompt, correct, distractors, explanation, tags = [] }) {
  const values = distinct([correct, ...distractors]);
  for (const filler of ['0', '1', 'Không đủ dữ kiện', 'Không thực hiện được phép tính']) {
    if (values.length >= 4) break;
    if (!values.includes(filler)) values.push(filler);
  }
  if (values.length < 4) throw new Error(`${id}: cần 4 lựa chọn khác nhau`);
  const answerIndex = hash(id) % 4;
  const wrong = values.filter((value) => value !== String(correct)).slice(0, 3);
  const ordered = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    ordered.push(index === answerIndex ? String(correct) : wrong[wrongIndex++]);
  }
  return {
    id,
    module,
    type: 'mcq',
    points,
    prompt,
    options: ordered.map((text, index) => ({ key: LETTERS[index], text })),
    answer: LETTERS[answerIndex],
    explanation,
    tags
  };
}

export function openQuestion({ id, module, type, points, prompt, modelAnswer, rubric, tags = [] }) {
  return { id, module, type, points, prompt, modelAnswer, rubric, tags };
}

export function qid(examNo, module, index) {
  return `N26E${String(examNo).padStart(2, '0')}-${module}${String(index).padStart(2, '0')}`;
}

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

export function choose(n, k) {
  if (k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= r; i += 1) result = result * (n - r + i) / i;
  return result;
}

export function frac(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

export const bayesSets = [
  { p: [1, 5], s: [3, 4], f: [1, 4], answer: '9/13' },
  { p: [1, 10], s: [4, 5], f: [1, 5], answer: '16/25' },
  { p: [1, 4], s: [2, 3], f: [1, 3], answer: '4/7' },
  { p: [1, 5], s: [4, 5], f: [1, 5], answer: '4/5' },
  { p: [1, 10], s: [3, 4], f: [1, 4], answer: '1/2' },
  { p: [1, 6], s: [3, 4], f: [1, 4], answer: '9/14' },
  { p: [1, 6], s: [2, 3], f: [1, 3], answer: '4/9' },
  { p: [2, 5], s: [3, 4], f: [1, 4], answer: '6/7' },
  { p: [1, 4], s: [3, 4], f: [1, 4], answer: '3/4' },
  { p: [1, 2], s: [2, 3], f: [1, 3], answer: '4/5' }
];

export const machineSets = [
  { share: 60, errA: 2, errB: 5 },
  { share: 70, errA: 1, errB: 4 },
  { share: 50, errA: 2, errB: 6 },
  { share: 80, errA: 1, errB: 5 },
  { share: 40, errA: 3, errB: 2 },
  { share: 75, errA: 2, errB: 6 },
  { share: 30, errA: 4, errB: 1 },
  { share: 65, errA: 2, errB: 4 },
  { share: 55, errA: 1, errB: 3 },
  { share: 90, errA: 1, errB: 7 }
];

export const matrixInverseSets = [
  { a: 2, b: 1, c: 1, d: 1 },
  { a: 1, b: 1, c: 1, d: 2 },
  { a: 3, b: 1, c: 2, d: 1 },
  { a: 1, b: 2, c: 1, d: 3 },
  { a: 2, b: 3, c: 1, d: 2 },
  { a: 4, b: 1, c: 3, d: 1 },
  { a: 1, b: 3, c: 1, d: 4 },
  { a: 3, b: 2, c: 1, d: 1 },
  { a: 2, b: 1, c: 3, d: 2 },
  { a: 5, b: 2, c: 2, d: 1 }
];

export const neutralContexts = [
  { docs: 'tài liệu hướng dẫn học tập', users: 'sinh viên', teamA: 'khoa A', teamB: 'khoa B', faq: 'trợ lý hỏi đáp của trường', classifier: 'phân loại phản hồi sinh viên cần hỗ trợ sớm' },
  { docs: 'quy trình nội bộ công ty', users: 'nhân viên', teamA: 'phòng A', teamB: 'phòng B', faq: 'trợ lý FAQ cho nhân viên', classifier: 'phân loại ticket hỗ trợ khẩn cấp hay thông thường' },
  { docs: 'tài liệu thư viện', users: 'bạn đọc', teamA: 'nhóm nghiên cứu A', teamB: 'nhóm nghiên cứu B', faq: 'trợ lý tra cứu thư viện', classifier: 'phân loại câu hỏi theo chủ đề' },
  { docs: 'quy định và biểu mẫu hành chính', users: 'người dùng nội bộ', teamA: 'đơn vị A', teamB: 'đơn vị B', faq: 'trợ lý hướng dẫn thủ tục', classifier: 'phân loại yêu cầu cần xử lý ngay hay có thể chờ' },
  { docs: 'chính sách nhân sự', users: 'nhân viên', teamA: 'chi nhánh A', teamB: 'chi nhánh B', faq: 'trợ lý nhân sự', classifier: 'phân loại email theo nhóm chính sách' },
  { docs: 'hướng dẫn sử dụng sản phẩm', users: 'khách hàng', teamA: 'đội sản phẩm A', teamB: 'đội sản phẩm B', faq: 'trợ lý hỗ trợ sản phẩm', classifier: 'phân loại phản hồi lỗi hay câu hỏi sử dụng' },
  { docs: 'quy trình dịch vụ công', users: 'cán bộ', teamA: 'bộ phận A', teamB: 'bộ phận B', faq: 'trợ lý tra cứu quy trình', classifier: 'phân loại hồ sơ đủ hay thiếu thông tin' },
  { docs: 'tài liệu đào tạo nội bộ', users: 'học viên', teamA: 'lớp A', teamB: 'lớp B', faq: 'trợ lý học tập', classifier: 'phân loại câu hỏi cơ bản hay nâng cao' },
  { docs: 'câu hỏi thường gặp của dịch vụ', users: 'khách hàng', teamA: 'nhóm dịch vụ A', teamB: 'nhóm dịch vụ B', faq: 'trợ lý chăm sóc khách hàng', classifier: 'phân loại phản hồi tích cực hay tiêu cực' },
  { docs: 'tài liệu kỹ thuật nội bộ', users: 'kỹ sư', teamA: 'nhóm kỹ thuật A', teamB: 'nhóm kỹ thuật B', faq: 'trợ lý tra cứu kỹ thuật', classifier: 'phân loại lỗi phần mềm theo mức độ ưu tiên' }
];
