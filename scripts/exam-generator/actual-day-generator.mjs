import {
  DISCLAIMER,
  EXAM_BLUEPRINTS,
  MODULE_LABELS,
  formatNumber,
  matrixToText,
  mcq,
  openQuestion,
  qid
} from './shared.mjs';
import { buildModuleA } from './module-a.mjs';
import { buildModuleB } from './module-b.mjs';
import { buildModuleC, buildModuleD } from './module-cd.mjs';

const ACTUAL_DAY_CONFIGS = [
  {
    no: 14,
    dataExamNo: 1,
    baseIndex: 0,
    title: 'Mô phỏng ngày thi đầu tiên · Đề 14',
    description: 'Bám sát phản hồi ngày thi: định thức, rank, cập nhật bias, NumPy nhân/cộng/broadcasting, code Python cần trace, nhiệm vụ LLM, metric ung thư, RAG hay fine-tune, kiến trúc chatbot nội bộ và góp ý senior.',
    detMatrix: [[2, 1], [3, 2]],
    rankMatrix: [[1, 2, 3], [2, 4, 6], [0, 1, 1]],
    rankReason: 'hàng 2 = 2 × hàng 1, còn hàng 3 độc lập với hàng 1',
    triangularMatrix: [[2, 1, 0], [0, 3, 2], [0, 0, 1]],
    bias: { value: 0.5, learningRate: 0.1, gradient: -2 },
    productShape: { left: [2, 3], right: [3, 2], result: [2, 2] },
    matrixA: [[1, 2], [3, 4]],
    matrixB: [[2, 0], [1, 2]],
    broadcastX: [[1, 2, 3], [4, 5, 6]],
    broadcastV: [10, 20, 30],
    columnVector: [1, 2],
    pythonTrace: {
      prompt: [
        'rows = [[0, 0]] * 3',
        'for i in range(3):',
        '    rows[i][0] = i',
        'print(rows)'
      ],
      answer: '[[2, 0], [2, 0], [2, 0]]',
      explanation: 'Ba phần tử của rows cùng trỏ tới một list con, nên lần gán cuối cùng làm cả ba hàng có phần tử đầu bằng 2.'
    },
    cancer: { tp: 10, fp: 20, fn: 30, tn: 940 },
    ragScenario: {
      organisation: 'công ty có 8.000 tài liệu quy trình nội bộ',
      access: 'nhân viên nhóm A không được xem tài liệu riêng của nhóm B',
      update: 'tài liệu thay đổi hằng tuần',
      exampleQuestion: 'Quy trình hoàn ứng mới nhất của phòng A là gì?'
    },
    seniorScenario: 'Senior đề nghị dùng đi dùng lại tập test để chỉnh tham số cho đến khi điểm đẹp rồi công bố đó là kết quả cuối.'
  },
  {
    no: 15,
    dataExamNo: 2,
    baseIndex: 1,
    title: 'Mô phỏng ngày thi đầu tiên · Đề 15',
    description: 'Biến thể vừa sức của cấu trúc ngày thi: số liệu ma trận khác, forward X@W+b, broadcasting nhiều chiều, code Python dictionary, sàng lọc bệnh hiếm và RAG nội bộ có yêu cầu chạy riêng tư.',
    detMatrix: [[3, 1], [2, 1]],
    rankMatrix: [[1, 0, 2], [0, 1, 1], [1, 1, 3]],
    rankReason: 'hàng 3 = hàng 1 + hàng 2, còn hai hàng đầu độc lập',
    triangularMatrix: [[1, 2, 1], [0, 4, 3], [0, 0, 2]],
    bias: { value: -0.2, learningRate: 0.05, gradient: 4 },
    productShape: { left: [3, 2], right: [2, 4], result: [3, 4] },
    matrixA: [[2, 1], [0, 3]],
    matrixB: [[1, 2], [2, 1]],
    broadcastX: [[2, 0, 1], [1, 3, 2]],
    broadcastV: [1, 10, 100],
    columnVector: [2, 4, 6],
    pythonTrace: {
      prompt: [
        'result = {}',
        'for i, x in enumerate([2, 1, 2]):',
        '    result[x] = result.get(x, 0) + i',
        'print(result)'
      ],
      answer: '{2: 2, 1: 1}',
      explanation: 'Với x=2, chỉ số 0 rồi 2 được cộng thành 2; với x=1, chỉ số 1 được lưu.'
    },
    cancer: { tp: 12, fp: 18, fn: 28, tn: 942 },
    ragScenario: {
      organisation: 'bệnh viện có 4.000 hướng dẫn nghiệp vụ và quy trình nội bộ',
      access: 'mỗi khoa chỉ được retrieval tài liệu thuộc phạm vi được cấp',
      update: 'quy trình có phiên bản và cập nhật hằng tháng',
      exampleQuestion: 'Quy trình chuyển khoa áp dụng trong tháng này gồm những bước nào?'
    },
    seniorScenario: 'Senior muốn gửi nguyên văn hồ sơ có dữ liệu nhạy cảm lên một dịch vụ LLM công khai để làm demo cho nhanh, dù chưa có phê duyệt.'
  },
  {
    no: 16,
    dataExamNo: 3,
    baseIndex: 2,
    title: 'Mô phỏng ngày thi đầu tiên · Đề 16',
    description: 'Đề tổng hợp sát cấu trúc thật: rank bằng phụ thuộc hàng, cập nhật bias, broadcasting hợp lệ/không hợp lệ, code Python khó vừa phải, giới hạn của LLM, threshold cho sàng lọc ung thư và thiết kế RAG có citation.',
    detMatrix: [[4, 2], [1, 1]],
    rankMatrix: [[1, 0, 1], [0, 1, 1], [1, 1, 2]],
    rankReason: 'hàng 3 = hàng 1 + hàng 2, còn hai hàng đầu độc lập',
    triangularMatrix: [[3, 1, 2], [0, 2, 1], [0, 0, 2]],
    bias: { value: 1, learningRate: 0.2, gradient: 1.5 },
    productShape: { left: [2, 4], right: [4, 1], result: [2, 1] },
    matrixA: [[1, -1], [2, 1]],
    matrixB: [[3, 1], [0, 2]],
    broadcastX: [[0, 1, 2], [3, 4, 5]],
    broadcastV: [-1, 0, 1],
    columnVector: [3, 5],
    pythonTrace: {
      prompt: [
        'values = [1, 2, 3, 4]',
        'picked = [x * x for x in values if x % 2 == 0]',
        'total = sum(v // 4 for v in picked)',
        'print(picked, total)'
      ],
      answer: '[4, 16] 5',
      explanation: 'Chỉ 2 và 4 được bình phương thành 4 và 16; phép chia nguyên cho 4 cho 1 và 4, tổng bằng 5.'
    },
    cancer: { tp: 16, fp: 24, fn: 24, tn: 936 },
    ragScenario: {
      organisation: 'trường học có 6.000 tài liệu dành cho giáo viên, học sinh và quản trị viên',
      access: 'vai trò khác nhau phải được lọc quyền trước retrieval',
      update: 'tài liệu mới cần có hiệu lực và phiên bản rõ ràng',
      exampleQuestion: 'Quy định đăng ký phòng học hiện hành dành cho giáo viên là gì?'
    },
    seniorScenario: 'Senior muốn phát hành mô hình sàng lọc dù recall của một nhóm người dùng thấp rõ rệt, đồng thời đề nghị không nêu hạn chế này trong báo cáo.'
  }
];

function withHint(question, hint) {
  return { ...question, hint };
}

function replaceMany(questions, replacements) {
  const output = [...questions];
  for (const [position, question] of replacements) output[position - 1] = question;
  return output;
}

function renumberQuestions(questions, examNo) {
  const counters = { A: 0, B: 0, C: 0, D: 0 };
  return questions.map((question) => {
    counters[question.module] += 1;
    return { ...question, id: qid(examNo, question.module, counters[question.module]) };
  });
}

function det2(matrix) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function multiply2(left, right) {
  return [
    [left[0][0] * right[0][0] + left[0][1] * right[1][0], left[0][0] * right[0][1] + left[0][1] * right[1][1]],
    [left[1][0] * right[0][0] + left[1][1] * right[1][0], left[1][0] * right[0][1] + left[1][1] * right[1][1]]
  ];
}

function elementwise2(left, right) {
  return left.map((row, rowIndex) => row.map((value, columnIndex) => value * right[rowIndex][columnIndex]));
}

function addRowVector(matrix, vector) {
  return matrix.map((row) => row.map((value, index) => value + vector[index]));
}

function addColumnAndRow(column, row) {
  return column.map((value) => row.map((item) => value + item));
}

function codeFence(lines) {
  return `\`\`\`python\n${lines.join('\n')}\n\`\`\``;
}

function percent(value, digits = 1) {
  return `${formatNumber(value * 100, digits)}%`;
}

function metrics(data) {
  const total = data.tp + data.fp + data.fn + data.tn;
  const accuracy = (data.tp + data.tn) / total;
  const precision = data.tp / (data.tp + data.fp);
  const recall = data.tp / (data.tp + data.fn);
  const f1 = 2 * precision * recall / (precision + recall);
  return { total, accuracy, precision, recall, f1 };
}

function rankThreeMcq(config, id) {
  return mcq({
    id, module: 'A', points: 1,
    prompt: `Hạng của ma trận ${matrixToText(config.rankMatrix)} bằng:`,
    correct: '2',
    distractors: ['0', '1', '3'],
    explanation: `${config.rankReason}, nên có đúng hai hàng độc lập và rank bằng 2.`,
    tags: ['linear-algebra', 'rank'], skillId: 'matrix.rank.three-by-three-row-dependency'
  });
}

function triangularDeterminantMcq(config, id) {
  const diagonal = [config.triangularMatrix[0][0], config.triangularMatrix[1][1], config.triangularMatrix[2][2]];
  const answer = diagonal.reduce((product, value) => product * value, 1);
  return mcq({
    id, module: 'A', points: 1,
    prompt: `Định thức của ma trận tam giác ${matrixToText(config.triangularMatrix)} bằng:`,
    correct: String(answer),
    distractors: [String(diagonal.reduce((sum, value) => sum + value, 0)), String(-answer), '0'],
    explanation: `Định thức ma trận tam giác bằng tích đường chéo: ${diagonal.join(' × ')} = ${answer}.`,
    tags: ['linear-algebra', 'determinant'], skillId: 'matrix.determinant.triangular-three-by-three'
  });
}

function biasUpdateMcq(config, id) {
  const next = config.bias.value - config.bias.learningRate * config.bias.gradient;
  return mcq({
    id, module: 'A', points: 1,
    prompt: `Gradient descent cập nhật bias theo b_new = b - learning_rate × db. Cho b=${config.bias.value}, learning_rate=${config.bias.learningRate}, db=${config.bias.gradient}. b_new bằng:`,
    correct: formatNumber(next, 3),
    distractors: [formatNumber(config.bias.value + config.bias.learningRate * config.bias.gradient, 3), formatNumber(config.bias.gradient, 3), formatNumber(config.bias.value, 3)],
    explanation: `Thay số: b_new=${config.bias.value}-${config.bias.learningRate}×(${config.bias.gradient})=${formatNumber(next, 3)}.`,
    tags: ['gradient-descent', 'bias-update'], skillId: 'ml.optimization.bias-update.numeric'
  });
}

function productShapeMcq(config, id) {
  const { left, right, result } = config.productShape;
  return mcq({
    id, module: 'A', points: 1,
    prompt: `Nếu A có shape (${left.join(',')}) và B có shape (${right.join(',')}), shape của phép nhân ma trận A@B là:`,
    correct: `(${result.join(',')})`,
    distractors: [`(${left[1]},${right[0]})`, `(${left[0]},${right[0]})`, 'Không thực hiện được'],
    explanation: `Hai chiều ở giữa ${left[1]} và ${right[0]} khớp; giữ chiều ngoài nên kết quả có shape (${result.join(',')}).`,
    tags: ['linear-algebra', 'shape'], skillId: 'matrix.multiplication.output-shape'
  });
}

function determinantRankFill(config, id) {
  const determinant = det2(config.detMatrix);
  return withHint(openQuestion({
    id, module: 'A', type: 'essay', points: 1,
    prompt: `Điền kết quả và trình bày ngắn: (1) det(A) với A=${matrixToText(config.detMatrix)}; (2) rank(B) với B=${matrixToText(config.rankMatrix)}.`,
    modelAnswer: `det(A)=ad-bc=${config.detMatrix[0][0]}×${config.detMatrix[1][1]}-${config.detMatrix[0][1]}×${config.detMatrix[1][0]}=${determinant}.\nRank(B)=2 vì ${config.rankReason}.\n\nVí dụ kiểm tra: nếu rank bằng 3 thì ba hàng phải độc lập; ở đây một hàng được tạo từ hàng khác nên không thể là 3.`,
    rubric: ['Tính đúng định thức.', 'Nhận ra quan hệ phụ thuộc giữa các hàng.', 'Kết luận rank=2 và giải thích.'],
    tags: ['linear-algebra', 'determinant', 'rank'], skillId: 'matrix.open.determinant-and-rank', sfiaBand: 'L3', difficulty: 'paper-calculation'
  }), [
    'Với ma trận 2×2 [[a,b],[c,d]], dùng ad-bc.',
    'Tìm xem một hàng có phải tổ hợp hoặc bội của hàng khác không.',
    'Rank là số hàng độc lập, không phải số hàng khác 0 ban đầu.'
  ]);
}

function biasUpdateFill(config, id) {
  const next = config.bias.value - config.bias.learningRate * config.bias.gradient;
  return withHint(openQuestion({
    id, module: 'A', type: 'essay', points: 1,
    prompt: `Một mô hình cập nhật bias theo b_new=b-learning_rate×db. Cho b=${config.bias.value}, learning_rate=${config.bias.learningRate}, db=${config.bias.gradient}. Điền b_new và nói bias tăng hay giảm.`,
    modelAnswer: `b_new=${config.bias.value}-${config.bias.learningRate}×(${config.bias.gradient})=${formatNumber(next, 3)}. Bias ${next > config.bias.value ? 'tăng' : next < config.bias.value ? 'giảm' : 'không đổi'}.\n\nVí dụ nhớ dấu: nếu gradient âm, phép “trừ số âm” làm bias tăng.`,
    rubric: ['Viết đúng công thức cập nhật.', 'Thay số đúng.', 'Kết luận đúng chiều tăng/giảm.'],
    tags: ['gradient-descent', 'bias-update'], skillId: 'ml.optimization.open-bias-update', sfiaBand: 'L3', difficulty: 'paper-calculation'
  }), [
    'Viết nguyên công thức b_new=b-ηdb rồi mới thay số.',
    'Đặt ngoặc quanh gradient âm.',
    'So sánh b_new với b để kết luận tăng hay giảm.'
  ]);
}

function numpyElementwiseMcq(config, id) {
  const answer = matrixToText(elementwise2(config.matrixA, config.matrixB));
  return mcq({
    id, module: 'B', points: 1,
    prompt: `Cho A=np.array(${matrixToText(config.matrixA)}) và B=np.array(${matrixToText(config.matrixB)}). Kết quả A*B là:`,
    correct: answer,
    distractors: [matrixToText(multiply2(config.matrixA, config.matrixB)), matrixToText(config.matrixA), matrixToText(config.matrixB)],
    explanation: '`*` nhân từng phần tử cùng vị trí; đây không phải phép nhân ma trận.',
    tags: ['numpy', 'matrix'], skillId: 'numpy.matrix.elementwise-multiplication'
  });
}

function numpyMatmulMcq(config, id) {
  const answer = matrixToText(multiply2(config.matrixA, config.matrixB));
  return mcq({
    id, module: 'B', points: 1,
    prompt: `Với A=np.array(${matrixToText(config.matrixA)}) và B=np.array(${matrixToText(config.matrixB)}), kết quả A@B là:`,
    correct: answer,
    distractors: [matrixToText(elementwise2(config.matrixA, config.matrixB)), matrixToText(multiply2(config.matrixB, config.matrixA)), matrixToText(config.matrixA)],
    explanation: '`@` lấy hàng của A nhân cột của B để tạo từng ô kết quả.',
    tags: ['numpy', 'matrix-multiplication'], skillId: 'numpy.matrix.matmul-two-by-two'
  });
}

function numpyBroadcastValuesMcq(config, id) {
  const answer = matrixToText(addRowVector(config.broadcastX, config.broadcastV));
  return mcq({
    id, module: 'B', points: 1,
    prompt: `Cho X=np.array(${matrixToText(config.broadcastX)}) shape (2,3) và v=np.array([${config.broadcastV.join(',')}]) shape (3,). Giá trị X+v là:`,
    correct: answer,
    distractors: ['Lỗi broadcasting', matrixToText(config.broadcastX), matrixToText(config.broadcastX.map((row) => row.map((value) => value + config.broadcastV[0])))],
    explanation: 'Vector shape (3,) được cộng vào từng hàng của X shape (2,3).',
    tags: ['numpy', 'broadcasting'], skillId: 'numpy.broadcast.add-row-vector-values'
  });
}

function numpyBroadcastOuterMcq(config, id) {
  const row = config.broadcastV;
  const output = addColumnAndRow(config.columnVector, row);
  return mcq({
    id, module: 'B', points: 1,
    prompt: `Cho c=np.array(${matrixToText(config.columnVector.map((value) => [value]))}) shape (${config.columnVector.length},1) và v=np.array([${row.join(',')}]) shape (${row.length},). Shape của c+v là:`,
    correct: `(${config.columnVector.length}, ${row.length})`,
    distractors: [`(${row.length}, ${config.columnVector.length})`, `(${config.columnVector.length}, 1)`, 'Lỗi broadcasting'],
    explanation: `Chiều 1 của c mở rộng theo ${row.length} cột và v mở rộng theo ${config.columnVector.length} hàng; ví dụ kết quả là ${matrixToText(output)}.`,
    tags: ['numpy', 'broadcasting', 'shape'], skillId: 'numpy.broadcast.column-plus-row-shape'
  });
}

function numpyInvalidBroadcastMcq(config, id) {
  return mcq({
    id, module: 'B', points: 1,
    prompt: 'Cho X shape (2,3) và v shape (2,). Khi thực hiện X+v trong NumPy, điều gì xảy ra?',
    correct: 'ValueError vì chiều cuối 3 và 2 không bằng nhau và không chiều nào bằng 1',
    distractors: ['Kết quả shape (2,3)', 'Kết quả shape (2,2)', 'NumPy tự cắt cột cuối của X'],
    explanation: 'Broadcasting so từ phải sang trái; 3 không tương thích với 2.',
    tags: ['numpy', 'broadcasting'], skillId: 'numpy.broadcast.incompatible-shapes'
  });
}

function numpyForwardShapeMcq(config, id) {
  return mcq({
    id, module: 'B', points: 1,
    prompt: 'Trong code `Y = X @ W + b`, X shape (4,3), W shape (3,2), b shape (2,). Shape của Y là:',
    correct: '(4, 2)',
    distractors: ['(3, 2)', '(4, 3)', 'Lỗi vì b không phải ma trận 2D'],
    explanation: 'X@W có shape (4,2); b shape (2,) được broadcast trên 4 hàng.',
    tags: ['numpy', 'matmul', 'broadcasting'], skillId: 'numpy.forward.matmul-plus-bias-shape'
  });
}

function numpyTransposeShapeMcq(config, id) {
  return mcq({
    id, module: 'B', points: 1,
    prompt: 'Cho `x=np.arange(12).reshape(3,4)` và `y=x.T + np.array([10,20,30])`. Shape của y là:',
    correct: '(4, 3)',
    distractors: ['(3, 4)', '(3, 3)', 'Lỗi broadcasting'],
    explanation: 'x.T có shape (4,3); vector (3,) được cộng vào từng hàng.',
    tags: ['numpy', 'transpose', 'broadcasting'], skillId: 'numpy.transpose.broadcast-output-shape'
  });
}

function pythonAliasMcq(config, id) {
  return mcq({
    id, module: 'B', points: 1,
    prompt: `Đoạn code sau in gì?\n${codeFence(['rows = [[0]] * 3', 'rows[0][0] = 7', 'print(rows)'])}`,
    correct: '[[7], [7], [7]]',
    distractors: ['[[7], [0], [0]]', '[[0], [0], [0]]', 'Lỗi IndexError'],
    explanation: 'Phép nhân list lặp lại cùng tham chiếu tới list con, không tạo ba list con độc lập.',
    tags: ['python', 'aliasing'], skillId: 'python.list.nested-aliasing'
  });
}

function pythonTraceMcq(config, id) {
  return mcq({
    id, module: 'B', points: 1,
    prompt: `Kết quả của code là gì?\n${codeFence(config.pythonTrace.prompt)}`,
    correct: config.pythonTrace.answer,
    distractors: ['Không đủ dữ kiện', 'Lỗi cú pháp', '0'],
    explanation: config.pythonTrace.explanation,
    tags: ['python', 'code-trace'], skillId: `python.trace.actual-day-${config.no}`
  });
}

function shortBroadcastCode(config, id) {
  const answer = addRowVector(config.broadcastX, config.broadcastV);
  return withHint(openQuestion({
    id, module: 'B', type: 'code', points: 1,
    prompt: `Không chạy máy, điền giá trị và shape của y:\n${codeFence([
      'import numpy as np',
      `X = np.array(${matrixToText(config.broadcastX)})`,
      `v = np.array([${config.broadcastV.join(', ')}])`,
      'y = X + v'
    ])}`,
    modelAnswer: `y=${matrixToText(answer)}, shape (2,3). Vector v shape (3,) được cộng vào từng hàng.\n\nVí dụ nhớ nhanh: phần tử y[1,2]=${config.broadcastX[1][2]}+${config.broadcastV[2]}=${answer[1][2]}.`,
    rubric: ['Đúng giá trị y.', 'Đúng shape (2,3).', 'Giải thích v được broadcast theo hàng.'],
    tags: ['numpy', 'broadcasting', 'code'], skillId: 'numpy.code.short-broadcast-output', sfiaBand: 'L3', difficulty: 'code-trace'
  }), [
    'Viết shape của X và v trước.',
    'So chiều từ phải sang trái: 3 khớp với 3.',
    'Cộng cùng vector v vào cả hai hàng.'
  ]);
}

function matrixOpsCode(config, id) {
  const elementwise = elementwise2(config.matrixA, config.matrixB);
  const matmul = multiply2(config.matrixA, config.matrixB);
  return withHint(openQuestion({
    id, module: 'B', type: 'code', points: 5,
    prompt: `Không chạy máy, tính ` + '`A*B`' + ` và ` + '`A@B`' + `, nêu shape và giải thích khác nhau:\n${codeFence([
      'import numpy as np',
      `A = np.array(${matrixToText(config.matrixA)})`,
      `B = np.array(${matrixToText(config.matrixB)})`,
      'elementwise = A * B',
      'matmul = A @ B'
    ])}`,
    modelAnswer: `A*B=${matrixToText(elementwise)}, shape (2,2), vì nhân từng ô cùng vị trí.\nA@B=${matrixToText(matmul)}, shape (2,2), vì lấy hàng của A nhân cột của B.\n\nVí dụ: ô (1,1) của A@B là ${config.matrixA[0][0]}×${config.matrixB[0][0]}+${config.matrixA[0][1]}×${config.matrixB[1][0]}=${matmul[0][0]}.`,
    rubric: ['Tính đúng A*B.', 'Tính đúng A@B.', 'Nêu đúng shape.', 'Phân biệt elementwise với matrix multiplication.'],
    tags: ['numpy', 'matrix', 'code'], skillId: 'numpy.code.elementwise-vs-matmul'
  }), [
    '`*` không cộng tích; chỉ nhân các ô cùng vị trí.',
    '`@` dùng hàng nhân cột.',
    'Tính từng ô và ghi shape sau cùng.'
  ]);
}

function pythonTraceOpen(config, id) {
  return withHint(openQuestion({
    id, module: 'B', type: 'code', points: 5,
    prompt: `Không chạy máy, hãy ghi output chính xác và giải thích từng bước:\n${codeFence(config.pythonTrace.prompt)}`,
    modelAnswer: `Output: ${config.pythonTrace.answer}. ${config.pythonTrace.explanation}\n\nVí dụ cách trình bày: lập một bảng nhỏ gồm chỉ số vòng lặp, giá trị biến trước và sau mỗi dòng thay đổi state.`,
    rubric: ['Output chính xác.', 'Theo dõi đúng state từng vòng.', 'Giải thích điểm gây nhầm.', 'Trình bày đủ để người khác kiểm tra.'],
    tags: ['python', 'code-trace'], skillId: `python.code.actual-day-trace-${config.no}`
  }), [
    'Đừng tính trong đầu toàn bộ; lập bảng state theo từng vòng.',
    'Kiểm tra có alias, slice copy, enumerate hoặc chia nguyên không.',
    'Viết output đúng cả dấu ngoặc, thứ tự và kiểu list/dict.'
  ]);
}

function llmTaskMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: 'Mô tả đúng nhất về nhiệm vụ nền tảng của một Large Language Model là:',
    correct: 'Mô hình hóa chuỗi ngôn ngữ để dự đoán/sinh token tiếp theo theo ngữ cảnh, từ đó hỗ trợ nhiều tác vụ văn bản',
    distractors: ['Tự động truy cập mọi database mà không cần tích hợp', 'Luôn trả sự thật đã kiểm chứng', 'Chỉ thực hiện phép nhân ma trận và không xử lý ngôn ngữ'],
    explanation: 'Nhiệm vụ học cốt lõi là mô hình hóa ngôn ngữ; các ứng dụng như hỏi đáp, tóm tắt và viết code được xây trên khả năng đó.',
    tags: ['llm', 'fundamentals'], skillId: 'llm.fundamentals.language-model-task'
  });
}

function assistantTasksMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: 'ChatGPT và Claude thường được sử dụng phù hợp nhất cho nhóm tác vụ nào?',
    correct: 'Hội thoại hỏi đáp, tóm tắt, viết lại, dịch, hỗ trợ lập trình và phân tích nội dung với sự kiểm tra của người dùng',
    distractors: ['Thay thế tuyệt đối mọi chuyên gia và chịu trách nhiệm pháp lý cuối cùng', 'Tự biết dữ liệu riêng của tổ chức dù chưa được cung cấp', 'Luôn thực thi hành động ngoài đời mà không cần tool hoặc quyền'],
    explanation: 'Đây là các trợ lý hội thoại dựa trên LLM; khả năng truy cập dữ liệu hay hành động phụ thuộc vào tích hợp, quyền và kiểm soát.',
    tags: ['llm', 'assistants'], skillId: 'llm.assistant.common-tasks'
  });
}

function llmToolBoundaryMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: 'Một LLM cơ sở không được nối tool hoặc retrieval sẽ không tự động:',
    correct: 'Đọc dữ liệu nội bộ mới nhất, gọi API thật hoặc thực hiện hành động bên ngoài chỉ vì người dùng yêu cầu',
    distractors: ['Sinh một đoạn văn', 'Tóm tắt văn bản đã được đưa vào context', 'Đề xuất mã Python'],
    explanation: 'Dữ liệu mới, hệ thống nội bộ và hành động cần retrieval/tool/API cùng kiểm tra quyền.',
    tags: ['llm', 'tools'], skillId: 'llm.boundary.requires-tools-and-retrieval'
  });
}

function hallucinationMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: 'Trong hệ thống LLM, “hallucination” gần nghĩa nhất với:',
    correct: 'Câu trả lời nghe hợp lý nhưng không được bằng chứng hỗ trợ hoặc chứa chi tiết sai',
    distractors: ['Mô hình chạy chậm vì thiếu GPU', 'Người dùng nhập sai mật khẩu', 'Vector có quá nhiều chiều'],
    explanation: 'LLM tối ưu sinh chuỗi phù hợp, không tự bảo đảm mọi câu là sự thật; cần grounding, citation và kiểm tra.',
    tags: ['llm', 'hallucination'], skillId: 'llm.risk.hallucination-definition'
  });
}

function cancerRecallMcq(config, id) {
  const m = metrics(config.cancer);
  return mcq({
    id, module: 'C', points: 2,
    prompt: `Mô hình sàng lọc ung thư có TP=${config.cancer.tp}, FP=${config.cancer.fp}, FN=${config.cancer.fn}, TN=${config.cancer.tn}. Accuracy khoảng ${percent(m.accuracy)} nhưng precision và recall thấp. Nếu bỏ sót ca ung thư nguy hiểm hơn cảnh báo nhầm, nên ưu tiên cải thiện metric nào trước?`,
    correct: 'Recall (sensitivity), vì cần giảm false negative và bắt được nhiều ca bệnh thật hơn',
    distractors: ['Chỉ accuracy, vì accuracy đã bao quát mọi hậu quả', 'Specificity bằng mọi giá dù bỏ sót tăng', 'Số lượng true negative vì lớp âm đã rất lớn'],
    explanation: `Recall=TP/(TP+FN)=${percent(m.recall)}; số FN=${config.cancer.fn} cho thấy nhiều ca thật bị bỏ sót.`,
    tags: ['machine-learning', 'metrics', 'healthcare'], skillId: 'ml.metrics.cancer-screening-prioritize-recall'
  });
}

function thresholdRecallMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: 'Trong mô hình phân loại nhị phân, khi hạ threshold dự đoán dương từ 0.7 xuống 0.4, xu hướng thường gặp là:',
    correct: 'Recall tăng vì nhiều mẫu được gắn dương hơn; precision có thể giảm do false positive tăng',
    distractors: ['Recall luôn giảm và precision luôn tăng', 'Accuracy chắc chắn đạt 100%', 'Không metric nào thay đổi'],
    explanation: 'Threshold thấp làm hệ thống dễ dự đoán dương hơn: bỏ sót giảm nhưng cảnh báo nhầm có thể tăng.',
    tags: ['machine-learning', 'threshold', 'metrics'], skillId: 'ml.metrics.threshold-precision-recall-tradeoff'
  });
}

function ragChoiceMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: `Một chatbot cần trả lời theo tài liệu nội bộ thay đổi thường xuyên, có citation và phân quyền. Lựa chọn khởi đầu phù hợp nhất là:`,
    correct: 'RAG: giữ kiến thức trong kho tài liệu, retrieval theo quyền rồi đưa nguồn liên quan vào context',
    distractors: ['Chỉ fine-tune để nhét toàn bộ tài liệu vào trọng số mỗi tuần', 'Chỉ tăng temperature', 'Bỏ retrieval và yêu cầu model tự nhớ'],
    explanation: 'RAG cập nhật tài liệu nhanh, hỗ trợ citation và ACL; fine-tune không phải cách tốt để duy trì kho sự kiện thay đổi liên tục.',
    tags: ['rag', 'fine-tuning'], skillId: 'rag.choose-for-changing-private-knowledge'
  });
}

function fineTunePurposeMcq(config, id) {
  return mcq({
    id, module: 'C', points: 2,
    prompt: 'Fine-tuning LLM thường phù hợp hơn RAG khi mục tiêu chính là:',
    correct: 'Điều chỉnh hành vi, phong cách, định dạng hoặc một tác vụ ổn định bằng nhiều ví dụ huấn luyện chất lượng',
    distractors: ['Cập nhật chính sách thay đổi mỗi ngày và cần citation chính xác', 'Cấp quyền nhóm A/B cho từng đoạn tài liệu', 'Đọc một tài liệu vừa tải lên mà không huấn luyện lại'],
    explanation: 'Fine-tuning thay đổi cách model phản hồi; RAG phù hợp hơn để cung cấp kiến thức cập nhật và nguồn kiểm chứng.',
    tags: ['llm', 'fine-tuning'], skillId: 'llm.fine-tuning.behaviour-and-format'
  });
}

function llmCapabilitiesFill(config, id) {
  return withHint(openQuestion({
    id, module: 'C', type: 'essay', points: 2,
    prompt: 'Điền ngắn: nêu 3 nhiệm vụ thường gặp của LLM/ChatGPT/Claude và 2 giới hạn cần nhớ khi dùng trong sản phẩm.',
    modelAnswer: 'Ba nhiệm vụ có thể nêu: hỏi đáp/hội thoại; tóm tắt hoặc viết lại; dịch; sinh nội dung; hỗ trợ code; phân loại văn bản. Hai giới hạn: có thể hallucinate; kiến thức/context có giới hạn; không tự truy cập dữ liệu mới hay thực hiện hành động nếu chưa nối tool; kết quả cần được kiểm tra.\n\nVí dụ: Claude hoặc ChatGPT có thể tóm tắt tài liệu được cung cấp, nhưng không tự biết phiên bản chính sách nội bộ mới nhất nếu hệ thống chưa retrieval tài liệu đó.',
    rubric: ['Nêu đủ ít nhất 3 tác vụ hợp lý.', 'Nêu đủ ít nhất 2 giới hạn.', 'Có ví dụ phân biệt năng lực ngôn ngữ với dữ liệu/tool bên ngoài.'],
    tags: ['llm', 'assistants'], skillId: 'llm.open.capabilities-and-limitations', difficulty: 'short-reasoning'
  }), [
    'Tác vụ: hỏi đáp, tóm tắt, viết, dịch, code, phân loại.',
    'Giới hạn: hallucination, context, dữ liệu không cập nhật, thiếu tool/quyền.',
    'Cho một ví dụ “làm được” và một ví dụ “không tự làm được”.'
  ]);
}

function cancerMetricsEssay(config, id) {
  const m = metrics(config.cancer);
  return withHint(openQuestion({
    id, module: 'C', type: 'essay', points: 8,
    prompt: `Bài toán sàng lọc ung thư có TP=${config.cancer.tp}, FP=${config.cancer.fp}, FN=${config.cancer.fn}, TN=${config.cancer.tn}. Hãy tính accuracy, precision, recall, F1; giải thích vì sao accuracy cao vẫn nguy hiểm; chọn metric ưu tiên và đề xuất cách cải thiện có kiểm soát.`,
    modelAnswer: `Accuracy=(${config.cancer.tp}+${config.cancer.tn})/${m.total}=${percent(m.accuracy)}. Precision=${config.cancer.tp}/(${config.cancer.tp}+${config.cancer.fp})=${percent(m.precision)}. Recall=${config.cancer.tp}/(${config.cancer.tp}+${config.cancer.fn})=${percent(m.recall)}. F1≈${percent(m.f1)}.\n\nAccuracy cao vì lớp không ung thư rất lớn và TN=${config.cancer.tn}, nhưng FN=${config.cancer.fn} nghĩa là nhiều ca bệnh thật bị bỏ sót. Với sàng lọc, ưu tiên recall/sensitivity để giảm FN; vẫn theo dõi precision để số cảnh báo nhầm không quá lớn. Có thể thử hạ threshold trên validation, tăng dữ liệu lớp dương, class weight/resampling, cải thiện feature và dùng bác sĩ/kiểm tra tiếp theo để xác nhận. Đánh giá cuối trên test riêng và theo từng nhóm.\n\nVí dụ: nếu hạ threshold giúp recall từ ${percent(m.recall)} lên 80% nhưng precision giảm nhẹ, nhóm y khoa có thể chấp nhận nếu mọi ca dương đều được kiểm tra xác nhận và khối lượng review vẫn xử lý được.`,
    rubric: ['Tính đúng hoặc gần đúng 4 metric.', 'Giải thích class imbalance và false negative.', 'Chọn recall theo hậu quả sàng lọc.', 'Nêu biện pháp cải thiện và trade-off precision.', 'Có validation/test và human review.'],
    tags: ['machine-learning', 'metrics', 'healthcare'], skillId: 'ml.essay.cancer-metrics-and-threshold'
  }), [
    'Viết TP, FP, FN, TN vào đúng công thức trước khi chia.',
    'Hỏi: lỗi nào nguy hiểm hơn trong sàng lọc - bỏ sót hay cảnh báo nhầm?',
    'Đề xuất thay threshold trên validation, không chỉnh bằng test.',
    'Nêu cách kiểm soát precision và human confirmation.'
  ]);
}

function ragVsFineTuneEssay(config, id) {
  return withHint(openQuestion({
    id, module: 'C', type: 'essay', points: 8,
    prompt: `Với ${config.ragScenario.organisation}, ${config.ragScenario.update}, cần trích nguồn và ${config.ragScenario.access}. Hãy chọn RAG, fine-tune một LLM mã nguồn mở, hay kết hợp; giải thích theo kiến thức cập nhật, privacy/quyền, citation, chi phí và đánh giá.`,
    modelAnswer: `Nên khởi đầu bằng RAG. Tài liệu thay đổi nên cần cập nhật index thay vì huấn luyện lại; retrieval có thể lọc ACL trước khi đưa context vào LLM; citation trỏ về tài liệu/phiên bản giúp kiểm chứng. Fine-tune một LLM mã nguồn mở có thể hữu ích nếu cần chạy on-premise hoặc muốn model theo đúng phong cách/định dạng, nhưng fine-tune không tự giải quyết dữ liệu thay đổi, citation hay phân quyền và cần dữ liệu/compute/vận hành.\n\nPhương án kết hợp hợp lý: model phù hợp về kích thước và privacy + RAG cho kiến thức; chỉ fine-tune sau khi có bộ ví dụ ổn định chứng minh prompt/RAG chưa đủ. Đánh giá retrieval top-k, citation, độ đúng câu trả lời, leakage quyền, latency và chi phí.\n\nVí dụ: khi người dùng hỏi “${config.ragScenario.exampleQuestion}”, hệ thống phải retrieval đúng tài liệu đang hiệu lực, kiểm tra quyền, trả lời kèm nguồn; không nên kỳ vọng model fine-tuned nhớ chính xác bản cập nhật tuần này.`,
    rubric: ['Chọn RAG hoặc hybrid có lý do phù hợp.', 'Phân biệt kiến thức với hành vi/style.', 'Nêu privacy, ACL và citation.', 'So sánh chi phí/cập nhật của fine-tune.', 'Có kế hoạch đánh giá và ví dụ.'],
    tags: ['rag', 'fine-tuning', 'architecture'], skillId: 'rag.essay.rag-vs-open-model-finetune'
  }), [
    'Kiến thức có đổi thường xuyên không? Có cần nguồn không?',
    'Fine-tune phù hợp hơn cho hành vi/định dạng; RAG cho dữ kiện cập nhật.',
    'LLM mã nguồn mở giúp kiểm soát triển khai nhưng vẫn cần ACL và retrieval.',
    'Nêu ít nhất một tiêu chí đánh giá chất lượng và một tiêu chí vận hành.'
  ]);
}

function internalRagArchitectureEssay(config, id) {
  return withHint(openQuestion({
    id, module: 'C', type: 'essay', points: 8,
    prompt: `Thiết kế kiến trúc RAG đơn giản cho ${config.ragScenario.organisation}. Ràng buộc: ${config.ragScenario.access}; ${config.ragScenario.update}; câu trả lời phải có citation và khi thiếu bằng chứng phải từ chối/chuyển người. Trình bày pipeline, ví dụ và cách đánh giá.`,
    modelAnswer: `Pipeline offline: nguồn tài liệu → parse/OCR → làm sạch → chunk có overlap vừa đủ → gắn metadata (nguồn, phiên bản, ngày hiệu lực, nhóm quyền) → embedding → vector index.\n\nPipeline online: xác thực người dùng → lấy role/scope → lọc ACL trước retrieval → embedding câu hỏi → vector/hybrid retrieval top-k → có thể rerank → tạo prompt chỉ với context được phép → LLM sinh câu trả lời → kiểm tra citation/grounding → trả lời hoặc abstain/handoff → log trace tối thiểu. Không đưa tài liệu nhóm khác vào prompt rồi mới yêu cầu model “đừng tiết lộ”.\n\nĐánh giá: bộ câu hỏi mẫu có nguồn đúng; retrieval hit/recall@k, độ đúng câu trả lời, citation, từ chối khi thiếu nguồn, kiểm thử quyền A/B, latency và chi phí. Cập nhật index theo phiên bản và giữ rollback.\n\nVí dụ: câu “${config.ragScenario.exampleQuestion}” chỉ lấy tài liệu người hỏi được phép xem, trả tên nguồn và ngày hiệu lực; nếu không có tài liệu phù hợp thì nói chưa đủ bằng chứng và chuyển bộ phận phụ trách.`,
    rubric: ['Đủ ingestion/chunk/embedding/index.', 'Có authentication và ACL trước retrieval.', 'Có retrieval, prompt, LLM, citation và abstain.', 'Có ví dụ end-to-end.', 'Có đánh giá, monitoring và cập nhật phiên bản.'],
    tags: ['rag', 'architecture', 'access-control'], skillId: 'rag.essay.internal-chatbot-architecture'
  }), [
    'Tách pipeline offline xử lý tài liệu và pipeline online trả lời.',
    'Đặt authentication/ACL trước retrieval và trước prompt.',
    'Nhớ citation, abstain/handoff và version của tài liệu.',
    'Đánh giá riêng retrieval, generation và kiểm thử quyền.'
  ]);
}

function seniorFeedbackEssay(config, id) {
  return withHint(openQuestion({
    id, module: 'D', type: 'essay', points: 1.25,
    prompt: `${config.seniorScenario} Bạn nhận thấy hướng này sai hoặc rủi ro. Bạn sẽ góp ý như thế nào để vừa chuyên nghiệp vừa bảo vệ chất lượng/đạo đức dự án?`,
    modelAnswer: `Trước hết xác nhận mục tiêu của senior và hỏi lại giả định để tránh hiểu sai. Sau đó góp ý riêng, bình tĩnh và dựa trên bằng chứng: mô tả rủi ro, người bị ảnh hưởng, quy định/quy trình liên quan và tác động tới kết quả. Đề xuất phương án thay thế có thể thực hiện, ví dụ dùng validation riêng, khử định danh dữ liệu, bổ sung review hoặc hoãn release để sửa metric. Ghi lại quyết định và đầu việc. Nếu rủi ro nghiêm trọng, trái quy định hoặc vẫn không được xử lý, sử dụng kênh escalation phù hợp thay vì im lặng hoặc công kích cá nhân.\n\nVí dụ cách nói: “Em hiểu mục tiêu là kịp demo. Tuy nhiên cách này có thể làm kết quả sai lệch hoặc lộ dữ liệu. Em đề xuất phương án X trong hôm nay, kèm kiểm tra Y. Nếu anh đồng ý em sẽ ghi lại kết quả và báo lại trước khi release.”`,
    rubric: ['Trao đổi tôn trọng và làm rõ mục tiêu.', 'Nêu rủi ro bằng bằng chứng, không công kích cá nhân.', 'Đề xuất giải pháp thay thế cụ thể.', 'Có document/escalate khi rủi ro cao.'],
    tags: ['responsible-ai', 'professional-communication'], skillId: 'responsible-ai.essay.challenge-senior-direction'
  }), [
    'Tách con người khỏi vấn đề: góp ý vào quyết định/rủi ro, không phán xét senior.',
    'Nêu bằng chứng và hậu quả cụ thể.',
    'Đưa ra một phương án thay thế khả thi.',
    'Nếu rủi ro nghiêm trọng và không được xử lý, dùng kênh escalation chính thức.'
  ]);
}

function buildActualDayExam(config) {
  const base = EXAM_BLUEPRINTS[config.baseIndex];
  let moduleA = buildModuleA(config.dataExamNo, base);
  let moduleB = buildModuleB(config.dataExamNo, base);
  let moduleC = buildModuleC(config.dataExamNo, base, config.dataExamNo);
  let moduleD = buildModuleD(config.dataExamNo, base);

  moduleA = replaceMany(moduleA, [
    [7, rankThreeMcq(config, qid(config.no, 'A', 7))],
    [8, triangularDeterminantMcq(config, qid(config.no, 'A', 8))],
    [9, biasUpdateMcq(config, qid(config.no, 'A', 9))],
    [10, productShapeMcq(config, qid(config.no, 'A', 10))],
    [19, determinantRankFill(config, qid(config.no, 'A', 19))],
    [20, biasUpdateFill(config, qid(config.no, 'A', 20))]
  ]);

  moduleB = replaceMany(moduleB, [
    [7, numpyElementwiseMcq(config, qid(config.no, 'B', 7))],
    [8, numpyMatmulMcq(config, qid(config.no, 'B', 8))],
    [9, numpyBroadcastValuesMcq(config, qid(config.no, 'B', 9))],
    [10, numpyBroadcastOuterMcq(config, qid(config.no, 'B', 10))],
    [11, numpyInvalidBroadcastMcq(config, qid(config.no, 'B', 11))],
    [12, numpyForwardShapeMcq(config, qid(config.no, 'B', 12))],
    [13, numpyTransposeShapeMcq(config, qid(config.no, 'B', 13))],
    [14, pythonAliasMcq(config, qid(config.no, 'B', 14))],
    [15, pythonTraceMcq(config, qid(config.no, 'B', 15))],
    [18, shortBroadcastCode(config, qid(config.no, 'B', 18))],
    [19, matrixOpsCode(config, qid(config.no, 'B', 19))],
    [20, pythonTraceOpen(config, qid(config.no, 'B', 20))]
  ]);

  moduleC = replaceMany(moduleC, [
    [1, llmTaskMcq(config, qid(config.no, 'C', 1))],
    [2, assistantTasksMcq(config, qid(config.no, 'C', 2))],
    [3, llmToolBoundaryMcq(config, qid(config.no, 'C', 3))],
    [4, hallucinationMcq(config, qid(config.no, 'C', 4))],
    [5, cancerRecallMcq(config, qid(config.no, 'C', 5))],
    [6, thresholdRecallMcq(config, qid(config.no, 'C', 6))],
    [7, ragChoiceMcq(config, qid(config.no, 'C', 7))],
    [8, fineTunePurposeMcq(config, qid(config.no, 'C', 8))],
    [9, llmCapabilitiesFill(config, qid(config.no, 'C', 9))],
    [10, cancerMetricsEssay(config, qid(config.no, 'C', 10))],
    [11, ragVsFineTuneEssay(config, qid(config.no, 'C', 11))],
    [12, internalRagArchitectureEssay(config, qid(config.no, 'C', 12))]
  ]);

  moduleD = replaceMany(moduleD, [
    [8, seniorFeedbackEssay(config, qid(config.no, 'D', 8))]
  ]);

  const questions = renumberQuestions([...moduleA, ...moduleB, ...moduleC, ...moduleD], config.no);

  return {
    id: `new-2026-${String(config.no).padStart(2, '0')}`,
    title: config.title,
    description: config.description,
    durationMinutes: 90,
    totalPoints: 100,
    disclaimer: `${DISCLAIMER} Ba đề 14-16 ưu tiên cấu trúc được người thi báo lại sau ngày thi đầu tiên; đây vẫn là đề ôn tập, không phải bản sao đề thi.`,
    moduleLabels: MODULE_LABELS,
    moduleOverview: [
      'Module 1 · A: 20 câu; trọng tâm định thức, rank, ma trận và cập nhật bias; có 2 câu điền ngắn.',
      'Module 2 · B: 20 câu code/Python/NumPy; nhân, cộng, @, broadcasting và shape; có 3 câu code điền/tự luận.',
      'Module 3 · C: 12 câu về LLM, ChatGPT/Claude, metric ung thư và RAG; có 4 câu điền/tự luận.',
      'Module 4 · D: 8 câu; có 1 câu tự luận về cách góp ý khi senior đưa hướng sai.'
    ],
    coverageProfile: {
      title: 'Cấu trúc ngày thi đầu tiên - 10 câu điền/tự luận',
      sfiaOrientation: 'Tính toán và code trace ở Level 3; lập luận lựa chọn/kiến trúc/giao tiếp ở Level 3→4',
      variationPolicy: 'Ba đề dùng cùng trọng tâm thực tế nhưng thay số liệu, code và ràng buộc để tránh học thuộc đáp án',
      source: 'Phản hồi trực tiếp của người thi sau ngày thi đầu tiên'
    },
    actualDayProfile: true,
    openQuestionCount: 10,
    resultCelebration: true,
    questions
  };
}

export function buildActualDayExams() {
  return ACTUAL_DAY_CONFIGS.map(buildActualDayExam);
}
