export const MODULE_LABELS = {
  A: 'Xác suất & đại số tuyến tính phần ma trận',
  B: 'Euclid, Python gọi API & NumPy',
  C: 'ML cơ bản, confusion matrix, SVM, backprop & RAG',
  D: 'Đạo đức AI, banking & privacy'
};

export const DISCLAIMER = 'Đây là bộ câu hỏi ôn tập cộng đồng, được biên soạn từ phản hồi không chính thức của người thi các khóa gần đây. Đây không phải đề thi chính thức hoặc đề bị lộ. Bộ đề chỉ mở rộng vừa phải quanh xác suất, ma trận, Euclid, Python API, NumPy, confusion matrix, SVM, backpropagation cơ bản, ba câu tự luận AI và các tình huống privacy/banking.';

export const EXAM_BLUEPRINTS = [
  {
    no: 1,
    title: 'Nền tảng xác suất, ma trận, API và NumPy',
    description: 'Đề nền tảng bám sát phản hồi: Bayes, xác suất có điều kiện, ma trận 2×2, Euclid, Requests, NumPy, AI/RAG cơ bản.',
    aProbability: ['bayesTwo', 'conditionalGroup', 'totalProbability', 'withoutReplacementBoth', 'conditionalDice', 'binomialExact', 'union', 'independenceCheck', 'expectation', 'combinations'],
    aMatrix: ['matrixDimensions', 'matrixProductElement', 'matrixAddition', 'scalarMultiply', 'determinant', 'inverseEntry', 'transpose', 'solveSystem', 'rankProportional', 'diagonalVector'],
    bMcq: ['gcdValue', 'oneIteration', 'recursionOutput', 'complexity', 'getParamsTimeout', 'raiseStatus', 'responseJson', 'safeKey', 'requestException', 'statusMeaning', 'schemaValidation', 'shape', 'scalarBroadcast', 'sumAxis0', 'sliceColumn1d', 'booleanMask', 'reshapeNdim', 'meanAxis1'],
    bOpen: ['gcdLoop', 'explainNumpy'],
    cMcq: ['supervised', 'validationRole', 'overfit', 'recallWhen', 'ragRetrieval', 'ragEmbedding', 'ragNoEvidence', 'humanReview', 'monitoring'],
    cEssays: ['ragInternal', 'faqPrivacy', 'classifierMetrics'],
    dSkills: ['leastPrivilege', 'groupAccess', 'dataMinimization', 'highRiskEscalate', 'humanApproval', 'auditLog', 'fairnessCheck', 'incidentResponse']
  },
  {
    no: 2,
    title: 'Xác suất có điều kiện, inverse matrix và confusion matrix',
    description: 'Đề nhấn vào bảng xác suất, biến cố bù, ma trận nghịch đảo, API đúng cách và tính accuracy, precision, recall, F1.',
    aProbability: ['bayesOne', 'conditionalTable', 'complementAtLeastOne', 'totalProbability', 'withoutReplacementMixed', 'conditionalDice', 'binomialExact', 'union', 'independenceFromTable', 'bernoulliVariance'],
    aMatrix: ['matrixProductFull', 'determinant', 'inverseFull', 'solveAX', 'singularRecognition', 'transposeSum', 'identityProduct', 'nonCommutative', 'unknownEntry', 'rankProportional'],
    bMcq: ['gcdValue', 'traceEuclid', 'bugEuclidZero', 'complexity', 'getParamsTimeout', 'postJson', 'authHeader', 'raiseStatus', 'statusMeaning', 'schemaValidation', 'queryVsBody', 'shape', 'vectorBroadcast', 'meanAxis1', 'sliceColumn2d', 'booleanMask', 'reshapeNdim', 'sumAxis0'],
    bOpen: ['fixGcd', 'fetchAverage'],
    cMcq: ['confusionIdentify', 'confusionAccuracy', 'confusionPrecision', 'confusionRecall', 'confusionF1', 'trainValTest', 'svmPurpose', 'ragRetrieval', 'monitoring'],
    cEssays: ['classifierMetrics', 'ragInternal', 'deployModelApi'],
    dSkills: ['groupAccess', 'purposeLimitation', 'dataMinimization', 'highRiskEscalate', 'auditLog', 'humanApproval', 'fairnessCheck', 'incidentResponse']
  },
  {
    no: 3,
    title: 'Ma trận, NumPy và SVM cơ bản',
    description: 'Đề tập trung nhân/nghịch đảo ma trận, đọc code NumPy và kiến thức SVM ở mức nền tảng, không yêu cầu toán nâng cao.',
    aProbability: ['bayesTwo', 'conditionalTable', 'probabilityTree', 'withoutReplacementBoth', 'complementAtLeastOne', 'conditionalDice', 'expectation', 'combinations', 'independenceCheck', 'totalProbability'],
    aMatrix: ['matrixDimensions', 'matrixProductFull', 'inverseFull', 'determinant', 'solveSystem', 'rankProportional', 'identityProduct', 'transpose', 'singularRecognition', 'diagonalVector'],
    bMcq: ['recursionOutput', 'traceEuclid', 'negativeGcd', 'complexity', 'postJson', 'authHeader', 'responseJson', 'requestException', 'statusMeaning', 'schemaValidation', 'queryVsBody', 'shape', 'scalarBroadcast', 'vectorBroadcast', 'sumAxis0', 'sliceColumn1d', 'sliceColumn2d', 'booleanMask'],
    bOpen: ['traceGcd', 'explainNumpyShapes'],
    cMcq: ['supervised', 'svmPurpose', 'svmSupportVectors', 'svmMargin', 'svmDecision', 'confusionAccuracy', 'confusionRecall', 'ragEmbedding', 'humanReview'],
    cEssays: ['svmPipeline', 'faqPrivacy', 'ragInternal'],
    dSkills: ['leastPrivilege', 'groupAccess', 'dataMinimization', 'highRiskEscalate', 'sourceCitation', 'humanApproval', 'auditLog', 'incidentResponse']
  },
  {
    no: 4,
    title: 'Backpropagation cơ bản và triển khai mô hình',
    description: 'Đề kiểm tra backpropagation bằng phép tính một nơ-ron đơn giản, cùng kỹ năng API, NumPy và triển khai mô hình có giám sát.',
    aProbability: ['bayesOne', 'conditionalGroup', 'probabilityTree', 'withoutReplacementMixed', 'complementAtLeastOne', 'binomialExact', 'union', 'bernoulliVariance', 'expectation', 'independenceFromTable'],
    aMatrix: ['matrixProductElement', 'matrixProductFull', 'matrixAddition', 'scalarMultiply', 'determinant', 'inverseEntry', 'solveAX', 'transposeSum', 'unknownEntry', 'diagonalVector'],
    bMcq: ['gcdValue', 'oneIteration', 'bugEuclidZero', 'negativeGcd', 'getParamsTimeout', 'postJson', 'raiseStatus', 'requestException', 'statusMeaning', 'schemaValidation', 'missingField', 'shape', 'meanAxis1', 'sumAxis0', 'sliceColumn2d', 'booleanMask', 'reshapeNdim', 'vectorBroadcast'],
    bOpen: ['gcdLoop', 'debugApi'],
    cMcq: ['backpropPurpose', 'backpropGradient', 'weightUpdate', 'reluDerivative', 'trainValTest', 'overfit', 'confusionPrecision', 'confusionRecall', 'monitoring'],
    cEssays: ['neuralBackprop', 'deployModelApi', 'classifierMetrics'],
    dSkills: ['leastPrivilege', 'purposeLimitation', 'consent', 'highRiskEscalate', 'humanApproval', 'auditLog', 'fairnessCheck', 'incidentResponse']
  },
  {
    no: 5,
    title: 'Đề tổng hợp sẵn sàng chuyển từ Apply lên Enable',
    description: 'Đề tổng hợp mức Level 3 và tín hiệu sẵn sàng Level 4: tính đúng, đọc code, chọn phương pháp, giải thích quyết định và lập kế hoạch triển khai.',
    aProbability: ['bayesTwo', 'conditionalTable', 'totalProbability', 'withoutReplacementMixed', 'complementAtLeastOne', 'conditionalDice', 'union', 'independenceFromTable', 'expectation', 'bernoulliVariance'],
    aMatrix: ['matrixDimensions', 'matrixProductFull', 'determinant', 'inverseFull', 'solveAX', 'rankProportional', 'identityProduct', 'nonCommutative', 'transposeSum', 'unknownEntry'],
    bMcq: ['gcdValue', 'traceEuclid', 'bugEuclidZero', 'complexity', 'getParamsTimeout', 'postJson', 'authHeader', 'raiseStatus', 'responseJson', 'schemaValidation', 'missingField', 'shape', 'vectorBroadcast', 'meanAxis1', 'sliceColumn1d', 'sliceColumn2d', 'booleanMask', 'reshapeNdim'],
    bOpen: ['fixGcd', 'integratedApiNumpy'],
    cMcq: ['confusionIdentify', 'confusionF1', 'svmSupportVectors', 'svmDecision', 'backpropPurpose', 'weightUpdate', 'ragRetrieval', 'ragNoEvidence', 'monitoring'],
    cEssays: ['modelSelection', 'improveValidation', 'ragInternal'],
    dSkills: ['leastPrivilege', 'groupAccess', 'purposeLimitation', 'dataMinimization', 'highRiskEscalate', 'humanApproval', 'auditLog', 'incidentResponse']
  }
];

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

export function mcq({ id, module, points, prompt, correct, distractors, explanation, tags = [], skillId, sfiaBand = 'L3', difficulty = 'applied-basic' }) {
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
    tags,
    skillId,
    sfiaBand,
    difficulty
  };
}

export function openQuestion({ id, module, type, points, prompt, modelAnswer, rubric, tags = [], skillId, sfiaBand = 'L3-L4', difficulty = 'applied-reasoning' }) {
  return { id, module, type, points, prompt, modelAnswer, rubric, tags, skillId, sfiaBand, difficulty };
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
  if (denominator === 0) throw new Error('Mẫu số bằng 0');
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return `${sign * numerator / divisor}/${Math.abs(denominator) / divisor}`;
}

export function formatNumber(value, digits = 3) {
  const rounded = Number(value.toFixed(digits));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',');
}

export function matrixToText(matrix) {
  return `[[${matrix.map((row) => row.join(',')).join('],[')}]]`;
}

export const neutralContexts = [
  { docs: 'tài liệu học tập nội bộ', users: 'học viên', teamA: 'nhóm A', teamB: 'nhóm B', faq: 'trợ lý FAQ cho học viên', classifier: 'phân loại yêu cầu hỗ trợ khẩn cấp hay thông thường' },
  { docs: 'quy trình nội bộ công ty', users: 'nhân viên', teamA: 'phòng A', teamB: 'phòng B', faq: 'trợ lý FAQ cho nhân viên', classifier: 'phân loại ticket lỗi hay câu hỏi sử dụng' },
  { docs: 'tài liệu thư viện', users: 'bạn đọc', teamA: 'đội A', teamB: 'đội B', faq: 'trợ lý tra cứu thư viện', classifier: 'phân loại câu hỏi theo chủ đề' },
  { docs: 'hướng dẫn dịch vụ', users: 'người dùng', teamA: 'bộ phận A', teamB: 'bộ phận B', faq: 'trợ lý hỗ trợ dịch vụ', classifier: 'phân loại phản hồi tích cực hay tiêu cực' },
  { docs: 'tài liệu kỹ thuật cơ bản', users: 'thành viên dự án', teamA: 'nhóm A', teamB: 'nhóm B', faq: 'trợ lý hỏi đáp nội bộ', classifier: 'phân loại lỗi mức thấp hay mức cao' }
];
