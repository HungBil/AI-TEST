import {
  DISCLAIMER,
  EXAM_BLUEPRINTS,
  mcq,
  openQuestion,
  qid,
  matrixToText
} from './shared.mjs';
import { buildModuleA } from './module-a.mjs';
import { buildModuleB } from './module-b.mjs';
import { buildModuleD } from './module-cd.mjs';

const PROFILES = [
  {
    no: 14,
    dataExamNo: 1,
    title: 'Ma trận, NumPy broadcasting và LLM cơ bản',
    description: 'Mô phỏng sát phản hồi ngày thi đầu: định thức, rank, cập nhật bias, code NumPy về nhân/cộng ma trận và broadcasting, nhiệm vụ LLM, metric ung thư và RAG nội bộ.',
    determinant: { matrix: [[2, 1], [3, 4]], answer: 5, method: '2×4 - 1×3 = 5' },
    rank: { matrix: [[1, 2], [2, 4]], answer: 1, method: 'hàng 2 = 2 × hàng 1' },
    bias: { b: 0.5, learningRate: 0.1, gradient: -0.4, answer: 0.54 },
    confusion: { tp: 40, fp: 10, fn: 20, tn: 930 },
    seniorDirection: 'bỏ bước validation để kịp deadline và đưa thẳng mô hình lên dùng thử'
  },
  {
    no: 15,
    dataExamNo: 2,
    title: 'Rank, cập nhật bias, metric sàng lọc và lựa chọn RAG',
    description: 'Giữ cùng độ khó nhưng đổi dữ kiện: định thức 3×3 tam giác, rank từ hàng phụ thuộc, broadcasting nhiều chiều, precision/recall và lựa chọn RAG hay fine-tune mô hình mã nguồn mở.',
    determinant: { matrix: [[2, 1, 0], [0, 3, 1], [0, 0, 4]], answer: 24, method: 'ma trận tam giác nên det = 2×3×4 = 24' },
    rank: { matrix: [[1, 0, 1], [0, 1, 1], [1, 1, 2]], answer: 2, method: 'hàng 3 = hàng 1 + hàng 2' },
    bias: { b: -0.2, learningRate: 0.05, gradient: 0.6, answer: -0.23 },
    confusion: { tp: 30, fp: 20, fn: 30, tn: 920 },
    seniorDirection: 'gửi toàn bộ dữ liệu nhạy cảm dạng thô cho một dịch vụ LLM bên ngoài để làm nhanh'
  },
  {
    no: 16,
    dataExamNo: 3,
    title: 'Đề tổng hợp cấu trúc ngày đầu: ma trận, code, LLM và RAG',
    description: 'Đề tổng hợp vừa sức: định thức/rank, cập nhật bias theo gradient trung bình, NumPy matmul/transpose/broadcasting, LLM, metric lệch lớp, RAG so với fine-tune và giao tiếp khi senior đưa hướng chưa phù hợp.',
    determinant: { matrix: [[1, 2, 0], [0, 3, 1], [2, 4, 5]], answer: 15, method: 'khai triển hàng đầu: 1×(15-4) - 2×(0-2) = 15' },
    rank: { matrix: [[1, 2, 3], [0, 1, 1], [1, 3, 4]], answer: 2, method: 'hàng 3 = hàng 1 + hàng 2' },
    bias: { b: 0.1, learningRate: 0.1, gradients: [0.2, -0.1, 0.5], answer: 0.08 },
    confusion: { tp: 36, fp: 24, fn: 24, tn: 916 },
    seniorDirection: 'làm chatbot RAG nhưng bỏ phân quyền tài liệu và citation vì cho rằng người dùng nội bộ đều đáng tin'
  }
];

function withHint(question, hint) {
  return { ...question, hint };
}

function pct(value) {
  return `${Number((value * 100).toFixed(1)).toString().replace('.', ',')}%`;
}

function replaceAt(items, index, value) {
  const next = [...items];
  next[index] = value;
  return next;
}

function renumberQuestions(questions, examNo) {
  const counters = { A: 0, B: 0, C: 0, D: 0 };
  return questions.map((question) => {
    counters[question.module] += 1;
    return { ...question, id: qid(examNo, question.module, counters[question.module]) };
  });
}

function determinantQuestion(profile) {
  return withHint(openQuestion({
    id: 'tmp', module: 'A', type: 'essay', points: 1,
    prompt: `Tính định thức của ma trận A=${matrixToText(profile.determinant.matrix)}. Ghi phép tính chính, không chỉ ghi đáp số.`,
    modelAnswer: `det(A) = ${profile.determinant.method}. Vậy det(A)=${profile.determinant.answer}.\n\nVí dụ kiểm tra: nếu đổi chỗ hai hàng thì định thức phải đổi dấu.`,
    rubric: ['Ghi đúng công thức/phép khai triển.', `Kết quả bằng ${profile.determinant.answer}.`, 'Có ít nhất một dòng giải thích.'],
    tags: ['matrix', 'determinant', 'short-answer'], skillId: 'matrix.determinant.written-calculation', sfiaBand: 'L3-L4'
  }), [
    'Ma trận 2×2 dùng ad-bc; ma trận tam giác dùng tích đường chéo.',
    'Nếu là 3×3, chọn hàng/cột có nhiều số 0 để khai triển.',
    'Kiểm tra dấu trước khi chốt đáp số.'
  ]);
}

function rankQuestion(profile) {
  return withHint(openQuestion({
    id: 'tmp', module: 'A', type: 'essay', points: 1,
    prompt: `Tính rank của ma trận A=${matrixToText(profile.rank.matrix)}. Chỉ ra quan hệ giữa các hàng hoặc các bước biến đổi hàng.`,
    modelAnswer: `${profile.rank.method}, nên có ${profile.rank.answer} hàng độc lập tuyến tính. Vì vậy rank(A)=${profile.rank.answer}.\n\nVí dụ nhớ nhanh: hàng là bội/tổng của các hàng trước thì không làm rank tăng.`,
    rubric: ['Nhận ra hàng phụ thuộc.', `Kết luận rank=${profile.rank.answer}.`, 'Giải thích bằng quan hệ hàng hoặc row reduction.'],
    tags: ['matrix', 'rank', 'short-answer'], skillId: 'matrix.rank.written-row-dependence', sfiaBand: 'L3-L4'
  }), [
    'Tìm hàng nào là bội hoặc tổng của hàng khác.',
    'Đếm số hàng khác 0 sau biến đổi sơ cấp.',
    'Rank không thể lớn hơn số hàng hoặc số cột.'
  ]);
}

function biasUpdateQuestion(profile) {
  const gradient = profile.gradients
    ? profile.gradients.reduce((sum, value) => sum + value, 0) / profile.gradients.length
    : profile.gradient;
  const gradientText = profile.gradients
    ? `gradient bias của ba mẫu là [${profile.gradients.join(', ')}], dùng gradient trung bình`
    : `gradient theo bias là ${profile.gradient}`;
  return withHint(openQuestion({
    id: 'tmp', module: 'A', type: 'essay', points: 1,
    prompt: `Một mô hình cập nhật bias theo b_new = b - learning_rate × db. Cho b=${profile.b}, learning_rate=${profile.learningRate}; ${gradientText}. Tính b_new và giải thích dấu cập nhật.`,
    modelAnswer: `${profile.gradients ? `db_trung_bình=(${profile.gradients.join('+')})/${profile.gradients.length}=${Number(gradient.toFixed(3))}. ` : ''}b_new=${profile.b}-${profile.learningRate}×(${Number(gradient.toFixed(3))})=${profile.answer}.\n\nVí dụ nhớ dấu: gradient dương làm b giảm; gradient âm làm b tăng.`,
    rubric: ['Dùng đúng b_new=b-ηdb.', 'Tính đúng gradient dùng để cập nhật.', `Kết quả b_new=${profile.answer}.`],
    tags: ['gradient-descent', 'bias-update', 'short-answer'], skillId: 'ml.optimization.update-bias-one-step', sfiaBand: 'L3-L4'
  }), [
    'Nếu có nhiều gradient, tính trung bình trước.',
    'Luôn là giá trị cũ trừ learning rate nhân gradient.',
    'Đặt gradient trong ngoặc để không nhầm dấu âm.'
  ]);
}

function broadcastShortQuestion(profile) {
  if (profile.no === 14) {
    return withHint(openQuestion({
      id: 'tmp', module: 'B', type: 'code', points: 1,
      prompt: `Không chạy code, cho:\n\`\`\`python\nx=np.array([[1,2,3],[4,5,6]])\nv=np.array([10,20,30])\ny=x+v\n\`\`\`\nHãy ghi y và y.shape.`,
      modelAnswer: `v shape (3,) được cộng vào từng hàng.\ny=[[11,22,33],[14,25,36]], y.shape=(2,3).\n\nVí dụ: phần tử đầu hàng 2 là 4+10=14.`,
      rubric: ['Đúng quy tắc broadcast theo hàng.', 'Đúng toàn bộ giá trị y.', 'Đúng shape (2,3).'],
      tags: ['numpy', 'broadcasting', 'short-code'], skillId: 'numpy.broadcast.compute-row-vector', sfiaBand: 'L3-L4'
    }), ['So shape từ chiều cuối: (2,3) với (3,).', 'Vector v được lặp logic cho từng hàng.', 'Shape kết quả là shape lớn hơn sau broadcast.']);
  }
  if (profile.no === 15) {
    return withHint(openQuestion({
      id: 'tmp', module: 'B', type: 'code', points: 1,
      prompt: `Không chạy code, cho:\n\`\`\`python\nx=np.ones((2,1,3))\ny=np.arange(4).reshape(1,4,1)\nz=x+y\n\`\`\`\nHãy ghi z.shape và giá trị z[0,2,:].`,
      modelAnswer: `So từ phải sang trái: (2,1,3) và (1,4,1) broadcast thành (2,4,3). y[0,2,0]=2 nên z[0,2,:]=[3,3,3].\n\nVí dụ: số 1 từ x cộng số 2 từ y ở mọi phần tử của lát đó.`,
      rubric: ['Đúng shape (2,4,3).', 'Đúng z[0,2,:]=[3,3,3].', 'Giải thích so chiều từ phải sang trái.'],
      tags: ['numpy', 'broadcasting', 'shape'], skillId: 'numpy.broadcast.multi-dimensional-shape', sfiaBand: 'L3-L4'
    }), ['Viết hai shape thẳng cột và so từ bên phải.', 'Hai chiều tương thích nếu bằng nhau hoặc một chiều bằng 1.', 'z[0,2,:] lấy y=2 cộng với ba số 1.']);
  }
  return withHint(openQuestion({
    id: 'tmp', module: 'B', type: 'code', points: 1,
    prompt: `Không chạy code, cho:\n\`\`\`python\nA=np.arange(6).reshape(2,3)\nb=np.array([[10],[20]])\nC=A+b\n\`\`\`\nHãy ghi C và C.shape.`,
    modelAnswer: `A=[[0,1,2],[3,4,5]], b shape (2,1) được broadcast theo các cột. C=[[10,11,12],[23,24,25]], shape (2,3).\n\nVí dụ: hàng 2 cộng 20 vào từng phần tử.`,
    rubric: ['Viết đúng A.', 'Broadcast b theo từng hàng đúng.', 'Đúng C và shape (2,3).'],
    tags: ['numpy', 'broadcasting', 'shape'], skillId: 'numpy.broadcast.column-vector', sfiaBand: 'L3-L4'
  }), ['A có shape (2,3), b có shape (2,1).', 'Chiều cuối 1 của b có thể kéo thành 3.', 'Mỗi hàng nhận một giá trị b khác nhau.']);
}

function numpyMatrixQuestion(profile) {
  if (profile.no === 14) {
    return withHint(openQuestion({
      id: 'tmp', module: 'B', type: 'code', points: 5,
      prompt: `Không chạy code, tính cả hai kết quả và giải thích khác nhau:\n\`\`\`python\nA=np.array([[1,2],[3,4]])\nB=np.array([[2,0],[1,2]])\nX=A@B\nY=A*B\n\`\`\``,
      modelAnswer: `A@B là nhân ma trận: X=[[4,4],[10,8]]. A*B là nhân từng phần tử: Y=[[2,0],[3,8]]. Cả hai shape (2,2).\n\nVí dụ: X[0,0]=1×2+2×1=4, còn Y[0,0]=1×2=2.`,
      rubric: ['Phân biệt @ và *.', 'Tính đúng X.', 'Tính đúng Y.', 'Ghi đúng shape.', 'Có một phép tính minh họa.'],
      tags: ['numpy', 'matrix-multiplication', 'code'], skillId: 'numpy.code.matmul-vs-elementwise', sfiaBand: 'L3-L4'
    }), ['@ lấy hàng nhân cột.', '* nhân các ô cùng vị trí.', 'Tính từng ô, đừng nhảy thẳng đến đáp số.']);
  }
  if (profile.no === 15) {
    return withHint(openQuestion({
      id: 'tmp', module: 'B', type: 'code', points: 5,
      prompt: `Không chạy code, tính C và shape:\n\`\`\`python\nA=np.array([[1,2,3],[4,5,6]])\nB=np.array([[1],[2],[1]])\nv=np.array([10,20])\nC=(A@B).reshape(2)+v\n\`\`\``,
      modelAnswer: `A@B=[[8],[20]], reshape(2) thành [8,20], rồi cộng v=[10,20] được C=[18,40], shape (2,).\n\nVí dụ: hàng đầu 1×1+2×2+3×1=8.`,
      rubric: ['Tính đúng A@B.', 'Hiểu reshape thành vector.', 'Broadcast/cộng v đúng.', 'Đúng shape (2,).'],
      tags: ['numpy', 'matmul', 'reshape', 'code'], skillId: 'numpy.code.matmul-reshape-add', sfiaBand: 'L3-L4'
    }), ['A shape (2,3), B shape (3,1) nên A@B shape (2,1).', 'reshape(2) bỏ chiều cột 1.', 'Sau đó cộng từng phần tử với v.']);
  }
  return withHint(openQuestion({
    id: 'tmp', module: 'B', type: 'code', points: 5,
    prompt: `Không chạy code, tính z và z.shape:\n\`\`\`python\nx=np.arange(6).reshape(2,3)\nz=x.T @ x\n\`\`\``,
    modelAnswer: `x=[[0,1,2],[3,4,5]], x.T shape (3,2), nên z shape (3,3).\nz=[[9,12,15],[12,17,22],[15,22,29]].\n\nVí dụ: z[0,1]=0×1+3×4=12.`,
    rubric: ['Viết đúng x và x.T.', 'Đúng shape (3,3).', 'Tính đúng z.', 'Có một ô được giải thích.'],
    tags: ['numpy', 'transpose', 'matmul', 'code'], skillId: 'numpy.code.transpose-matmul', sfiaBand: 'L3-L4'
  }), ['x.T đổi shape (2,3) thành (3,2).', '(3,2)@(2,3) cho kết quả (3,3).', 'Mỗi ô là tích vô hướng một cột của x với một cột khác.']);
}

function pythonTraceQuestion(profile) {
  if (profile.no === 14) {
    return withHint(openQuestion({
      id: 'tmp', module: 'B', type: 'code', points: 5,
      prompt: `Không chạy code, cho biết kết quả và giải thích:\n\`\`\`python\nvalues=[1,2,3,4,5]\nresult={}\nfor x in values:\n    if x % 2 == 0:\n        continue\n    result[x]=x*x\nprint(sum(result.values()))\n\`\`\``,
      modelAnswer: `Các số chẵn 2 và 4 bị continue. result={1:1,3:9,5:25}; tổng là 35.\n\nVí dụ: continue bỏ toàn bộ phần còn lại của vòng hiện tại.`,
      rubric: ['Theo dõi đúng continue.', 'Viết đúng dictionary.', 'Kết quả cuối 35.', 'Giải thích result.values().'],
      tags: ['python', 'dict', 'loop', 'code'], skillId: 'python.code.trace-continue-dict', sfiaBand: 'L3-L4'
    }), ['Liệt kê x từng vòng.', 'Chỉ số lẻ đi đến dòng gán dictionary.', 'sum(result.values()) cộng 1, 9 và 25.']);
  }
  if (profile.no === 15) {
    return withHint(openQuestion({
      id: 'tmp', module: 'B', type: 'code', points: 5,
      prompt: `Không chạy code, cho biết kết quả và giải thích:\n\`\`\`python\nwords=['AI','rag','AI','llm']\ncounts={}\nfor word in words:\n    key=word.lower()\n    counts[key]=counts.get(key,0)+1\nprint(sorted(counts.items()))\n\`\`\``,
      modelAnswer: `Sau lower và đếm: counts={'ai':2,'rag':1,'llm':1}. sorted(counts.items()) in ra [('ai', 2), ('llm', 1), ('rag', 1)].\n\nVí dụ: dict.get('ai',0) lần đầu là 0, lần sau là 1.`,
      rubric: ['Hiểu lower().', 'Hiểu dict.get default.', 'Đếm đúng.', 'Sắp xếp đúng theo key.'],
      tags: ['python', 'dict', 'sorting', 'code'], skillId: 'python.code.word-count-sorted-items', sfiaBand: 'L3-L4'
    }), ['Đổi mọi từ về chữ thường trước.', 'Theo dõi dictionary sau từng từ.', 'sorted trên list cặp sẽ so phần tử đầu tiên trước.']);
  }
  return withHint(openQuestion({
    id: 'tmp', module: 'B', type: 'code', points: 5,
    prompt: `Không chạy code, cho biết kết quả và giải thích:\n\`\`\`python\nnums=[1,2,3,4,5]\nout=[x*2 for x in nums if x % 2 == 1]\nprint(out[1:])\n\`\`\``,
    modelAnswer: `Lọc số lẻ 1,3,5 rồi nhân 2 được out=[2,6,10]. Slice out[1:] bỏ phần tử đầu, nên in [6,10].\n\nVí dụ: điều kiện if trong list comprehension được xét trước khi đưa x*2 vào list.`,
    rubric: ['Lọc đúng số lẻ.', 'Nhân đôi đúng.', 'Hiểu slice [1:].', 'Kết quả [6,10].'],
    tags: ['python', 'list-comprehension', 'slicing', 'code'], skillId: 'python.code.list-comprehension-slice', sfiaBand: 'L3-L4'
  }), ['Tách bài thành hai bước: tạo out rồi mới slice.', 'Điều kiện giữ x lẻ.', 'stop bị bỏ trống nghĩa là lấy đến hết.']);
}

function buildCmcq(profile) {
  const { tp, fp, fn, tn } = profile.confusion;
  const total = tp + fp + fn + tn;
  const accuracy = pct((tp + tn) / total);
  const precision = pct(tp / (tp + fp));
  const recall = pct(tp / (tp + fn));

  return [
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Nhiệm vụ nền tảng của một large language model (LLM) gần đúng nhất là:',
      correct: 'Dự đoán/sinh token tiếp theo theo ngữ cảnh để tạo hoặc biến đổi ngôn ngữ',
      distractors: ['Lưu mọi câu trả lời như một database tuyệt đối đúng', 'Tự động biết mọi dữ liệu nội bộ chưa được cung cấp', 'Chỉ thực hiện phép nhân ma trận, không xử lý văn bản'],
      explanation: 'LLM học mẫu trong dữ liệu để sinh/biến đổi chuỗi token; ứng dụng có thể dùng khả năng đó cho hỏi đáp, tóm tắt, viết và code.',
      tags: ['llm', 'fundamentals'], skillId: 'llm.foundation.next-token-generation'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Claude và ChatGPT thường được dùng phù hợp nhất cho nhóm tác vụ nào?',
      correct: 'Hỏi đáp, giải thích, tóm tắt, soạn thảo, phân tích và hỗ trợ code theo prompt/ngữ cảnh',
      distractors: ['Bảo đảm mọi câu trả lời luôn đúng mà không cần kiểm chứng', 'Tự đọc được database riêng dù chưa kết nối', 'Thay người chịu trách nhiệm trong mọi quyết định pháp lý'],
      explanation: 'Đây là các trợ lý LLM đa dụng. Chất lượng phụ thuộc prompt, context, công cụ và bước kiểm chứng.',
      tags: ['llm', 'chat-assistant'], skillId: 'llm.application.common-assistant-tasks'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Khi chatbot cần trả lời theo tài liệu nội bộ nhưng model chưa được cung cấp tài liệu, nhận xét đúng nhất là:',
      correct: 'Cần đưa context qua RAG/file/tool phù hợp và kiểm soát quyền; model không tự biết tài liệu riêng',
      distractors: ['Chỉ tăng temperature là model biết dữ liệu nội bộ', 'Đổi tên model sẽ tự kết nối hệ thống', 'Cho model đoán rồi coi là nguồn chính thức'],
      explanation: 'Kiến thức riêng cần được cung cấp qua context/retrieval hoặc công cụ được cấp quyền.',
      tags: ['llm', 'private-data', 'rag'], skillId: 'llm.context.private-knowledge-requires-retrieval'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: `Bộ dữ liệu sàng lọc có rất nhiều ca âm. Một model đạt accuracy ${accuracy} nhưng precision=${precision}, recall=${recall}. Kết luận phù hợp nhất là:`,
      correct: 'Accuracy cao có thể do lớp âm chiếm đa số; phải xem confusion matrix và metric lớp dương',
      distractors: ['Model chắc chắn tốt vì accuracy cao', 'Precision và recall không liên quan', 'Cần bỏ toàn bộ mẫu âm khỏi dữ liệu'],
      explanation: 'Dữ liệu lệch lớp khiến dự đoán phần lớn là âm vẫn có accuracy cao, trong khi bỏ sót hoặc cảnh báo nhầm còn nhiều.',
      tags: ['metrics', 'class-imbalance'], skillId: 'ml.metrics.accuracy-misleading-imbalance'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Precision của lớp ung thư trả lời câu hỏi nào?',
      correct: 'Trong các ca model cảnh báo ung thư, bao nhiêu ca thực sự ung thư',
      distractors: ['Trong mọi ca ung thư thật, model bắt được bao nhiêu', 'Tổng số dự đoán đúng chia tổng mẫu', 'Model chạy nhanh bao nhiêu request/giây'],
      explanation: 'Precision=TP/(TP+FP), tập trung vào độ chính xác của các cảnh báo dương.',
      tags: ['metrics', 'precision'], skillId: 'ml.metrics.precision-interpretation'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Recall của lớp ung thư trả lời câu hỏi nào?',
      correct: 'Trong các ca ung thư thật, model phát hiện được bao nhiêu',
      distractors: ['Trong các cảnh báo dương, bao nhiêu cảnh báo đúng', 'Tỷ lệ mọi dự đoán đúng', 'Độ tự tin trung bình của model'],
      explanation: 'Recall=TP/(TP+FN); FN là ca ung thư bị bỏ sót.',
      tags: ['metrics', 'recall'], skillId: 'ml.metrics.recall-interpretation'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Nếu bỏ sót ca ung thư nguy hiểm hơn việc gọi thêm một số người đi kiểm tra, hướng ưu tiên hợp lý nhất là:',
      correct: 'Tăng recall, đồng thời theo dõi precision/F1 và chi phí cảnh báo nhầm',
      distractors: ['Chỉ tối đa hóa accuracy', 'Giảm recall để ít cảnh báo', 'Không cần threshold hay human review'],
      explanation: 'Giảm FN giúp bắt nhiều ca thật hơn; vẫn phải kiểm soát FP để hệ thống vận hành được.',
      tags: ['metrics', 'threshold', 'healthcare-example'], skillId: 'ml.metrics.prioritize-recall-costly-false-negative'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Chatbot cần dùng quy định nội bộ thay đổi hàng tuần, trả lời có citation và không có nhiều GPU. Lựa chọn đầu tiên phù hợp nhất là:',
      correct: 'RAG trên một LLM phù hợp; cập nhật kho tài liệu thay vì fine-tune lại mỗi lần nội dung đổi',
      distractors: ['Fine-tune để model ghi nhớ toàn bộ tài liệu mới mỗi ngày', 'Không dùng tài liệu nguồn', 'Chỉ tăng số tham số model'],
      explanation: 'RAG phù hợp với tri thức thay đổi và yêu cầu citation; fine-tuning thường hợp hơn để điều chỉnh hành vi, format hoặc mẫu tác vụ.',
      tags: ['rag', 'fine-tuning'], skillId: 'rag.choice.changing-knowledge-vs-finetune'
    }),
    mcq({
      id: 'tmp', module: 'C', points: 2,
      prompt: 'Thứ tự xử lý phù hợp cho chatbot RAG nội bộ là:',
      correct: 'Xác thực → lọc quyền → retrieval đoạn liên quan → tạo prompt → LLM trả lời kèm nguồn',
      distractors: ['LLM trả lời trước rồi mới kiểm tra quyền', 'Đưa toàn bộ kho tài liệu vào prompt cho mọi người', 'Fine-tune mỗi câu hỏi rồi bỏ retrieval'],
      explanation: 'Quyền phải được kiểm tra trước khi tài liệu được retrieval và đưa vào context.',
      tags: ['rag', 'architecture', 'access-control'], skillId: 'rag.architecture.internal-chatbot-order'
    })
  ];
}

function cancerMetricsEssay(profile) {
  const { tp, fp, fn, tn } = profile.confusion;
  const total = tp + fp + fn + tn;
  const accuracy = (tp + tn) / total;
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1 = 2 * precision * recall / (precision + recall);
  return withHint(openQuestion({
    id: 'tmp', module: 'C', type: 'essay', points: 8,
    prompt: `Một model sàng lọc ung thư có TP=${tp}, FP=${fp}, FN=${fn}, TN=${tn}.\n\nHãy: (1) tính accuracy, precision, recall, F1; (2) giải thích vì sao accuracy vẫn cao nhưng precision/recall thấp hơn; (3) nếu bỏ sót nguy hiểm hơn cảnh báo nhầm thì nên cố cải thiện metric nào và làm gì ở mức cơ bản.`,
    modelAnswer: `Accuracy=(${tp}+${tn})/${total}=${pct(accuracy)}. Precision=${tp}/(${tp}+${fp})=${pct(precision)}. Recall=${tp}/(${tp}+${fn})=${pct(recall)}. F1≈${pct(f1)}. Accuracy cao vì TN rất nhiều; nó che việc còn ${fn} ca dương bị bỏ sót và ${fp} cảnh báo nhầm. Nếu hậu quả FN lớn, ưu tiên recall: thử hạ threshold trên validation, cải thiện dữ liệu/feature cho lớp dương và theo dõi precision/F1 để không tạo quá nhiều FP.\n\nVí dụ dễ hiểu: thà gọi thêm một số người đi kiểm tra hơn là bỏ sót người thật sự mắc bệnh, nhưng không thể hạ threshold vô hạn.`,
    rubric: ['Tính đúng hoặc gần đúng bốn metric.', 'Giải thích class imbalance/TN nhiều.', 'Ưu tiên recall theo hậu quả FN.', 'Nêu trade-off precision-threshold.', 'Có cách đánh giá trên validation/test.'],
    tags: ['metrics', 'cancer-screening', 'essay'], skillId: `essay.ml.cancer-metrics-${profile.no}`, sfiaBand: 'L3-L4'
  }), [
    'Viết TP, FP, FN, TN vào đúng công thức trước.',
    'So số TN với số ca dương để thấy vì sao accuracy cao.',
    'Hỏi: lỗi nào nguy hiểm hơn, FP hay FN?',
    'Nêu trade-off khi thay threshold, không chỉ nói “tăng recall”.'
  ]);
}

function ragVsFineTuneEssay(profile) {
  const scenario = profile.no === 14
    ? 'quy trình nội bộ thay đổi hàng tuần, cần nguồn trích dẫn và nhóm chỉ có một GPU nhỏ'
    : profile.no === 15
      ? 'sổ tay nghiệp vụ cập nhật thường xuyên, dữ liệu không được đưa vào bộ trọng số và cần thay tài liệu trong ngày'
      : 'chatbot cần vừa trả lời kiến thức thay đổi vừa giữ giọng văn/format trả lời thống nhất';
  return withHint(openQuestion({
    id: 'tmp', module: 'C', type: 'essay', points: 8,
    prompt: `Bạn có một LLM mã nguồn mở và cần làm chatbot với ràng buộc: ${scenario}. Hãy chọn RAG, fine-tune hoặc kết hợp; giải thích vì sao, nêu một ví dụ và kế hoạch thử nghiệm đơn giản.`,
    modelAnswer: `Nên bắt đầu bằng RAG vì tri thức thay đổi và cần citation: tài liệu được chunk, embedding, index rồi retrieval khi hỏi; cập nhật tài liệu không cần train lại model. Fine-tune không phải lựa chọn tốt để model “nhớ” các quy định thay đổi, nhưng có thể dùng sau để điều chỉnh format, giọng văn hoặc một mẫu tác vụ ổn định. Nếu cần cả hai, dùng RAG cho kiến thức và fine-tune nhẹ cho hành vi.\n\nVí dụ: khi quy định nghỉ phép đổi, chỉ cập nhật tài liệu/index; câu trả lời trỏ đúng phiên bản mới. Thử nghiệm bằng bộ câu hỏi có nguồn chuẩn, so độ đúng retrieval, citation, câu trả lời và chi phí/latency.`,
    rubric: ['Chọn RAG/hybrid phù hợp ràng buộc.', 'Phân biệt tri thức thay đổi và hành vi/format.', 'Có ví dụ cập nhật tài liệu.', 'Có citation và kiểm soát quyền.', 'Có kế hoạch đánh giá đơn giản.'],
    tags: ['rag', 'fine-tuning', 'open-source-llm', 'essay'], skillId: `essay.rag-vs-finetune-${profile.no}`, sfiaBand: 'L3-L4'
  }), [
    'Hỏi kiến thức thay đổi nhanh hay nhiệm vụ/format ổn định?',
    'RAG cập nhật bằng tài liệu; fine-tune cập nhật trọng số.',
    'Citation và quyền truy cập là tín hiệu mạnh nghiêng về RAG.',
    'Có thể chọn hybrid, nhưng phải nói rõ mỗi phần giải quyết việc gì.'
  ]);
}

function internalRagArchitectureEssay(profile) {
  const docCount = 5000 + (profile.no - 14) * 2500;
  return withHint(openQuestion({
    id: 'tmp', module: 'C', type: 'essay', points: 8,
    prompt: `Thiết kế kiến trúc RAG đơn giản cho chatbot nội bộ có khoảng ${docCount} tài liệu. Nhóm A/B có quyền khác nhau, câu trả lời phải có nguồn và thiếu bằng chứng thì không được tự bịa. Hãy mô tả kiến trúc, một flow hỏi–đáp và cách kiểm thử.`,
    modelAnswer: `Offline: lấy tài liệu → làm sạch/chia chunk → gắn metadata nguồn, phiên bản và quyền → tạo embedding → lưu vector index. Online: người dùng đăng nhập → kiểm tra role → tạo embedding câu hỏi → retrieval chỉ trong tài liệu được phép → đưa top-k chunk cùng chỉ dẫn vào LLM → trả câu trả lời + citation; không đủ nguồn thì nói chưa đủ và handoff.\n\nVí dụ người nhóm A hỏi quy trình A: filter quyền A chạy trước retrieval, model nhận hai đoạn liên quan và trả lời kèm tên tài liệu/phiên bản; tài liệu B không bao giờ vào prompt. Kiểm thử retrieval, citation, câu không có đáp án, phân quyền chéo A/B, prompt injection, latency và log an toàn.`,
    rubric: ['Có ingestion/chunking/embedding/index.', 'Có auth và lọc quyền trước retrieval.', 'Có generation kèm citation/abstain.', 'Có ví dụ end-to-end.', 'Có test quyền, chất lượng và vận hành.'],
    tags: ['rag', 'architecture', 'internal-chatbot', 'essay'], skillId: `essay.rag.internal-architecture-${profile.no}`, sfiaBand: 'L3-L4'
  }), [
    'Tách pipeline offline (chuẩn bị tài liệu) và online (trả lời).',
    'Quyền phải lọc trước khi chunk được đưa vào prompt.',
    'Nêu rõ citation và hành vi khi không có bằng chứng.',
    'Kiểm thử cả chất lượng, quyền A/B và prompt injection.'
  ]);
}

function seniorFeedbackEssay(profile) {
  return withHint(openQuestion({
    id: 'tmp', module: 'D', type: 'essay', points: 1.25,
    prompt: `Senior đề xuất: “${profile.seniorDirection}”. Bạn cho rằng hướng này có rủi ro. Bạn sẽ góp ý như thế nào để vừa tôn trọng senior vừa bảo vệ chất lượng/an toàn dự án?`,
    modelAnswer: `Trao đổi bằng mục tiêu và bằng chứng, không công kích cá nhân. Có thể nói: “Em hiểu mục tiêu là kịp tiến độ. Em lo rủi ro X vì Y; em đề xuất thử một phương án nhỏ trong 1–2 giờ/ngày, đo bằng metric Z rồi cùng quyết định.” Đưa ví dụ hoặc test tái hiện, nêu phương án thay thế và hỏi senior xem còn ràng buộc nào chưa biết. Nếu liên quan dữ liệu nhạy cảm, pháp lý hoặc gây hại nghiêm trọng mà vẫn không được xử lý, ghi nhận bằng văn bản và dùng kênh escalation phù hợp.\n\nVí dụ: đề xuất pilot với dữ liệu giả/khử định danh hoặc giữ validation tối thiểu thay vì phản đối chung chung.`,
    rubric: ['Tôn trọng và hỏi lại mục tiêu/ràng buộc.', 'Nêu rủi ro bằng bằng chứng cụ thể.', 'Đề xuất thử nghiệm/phương án thay thế.', 'Nêu khi nào cần ghi nhận hoặc escalation.'],
    tags: ['ethics', 'professional-communication', 'essay'], skillId: `essay.ethics.feedback-to-senior-${profile.no}`, sfiaBand: 'L3-L4'
  }), [
    'Tách con người khỏi vấn đề: góp ý vào hướng làm, không phán xét senior.',
    'Nêu rủi ro cụ thể và bằng chứng/test nhỏ.',
    'Đề xuất phương án thay thế có chi phí và thời gian rõ.',
    'Chỉ escalation khi rủi ro nghiêm trọng hoặc không thể xử lý trong nhóm.'
  ]);
}

function buildDayOneExam(profile) {
  const base = EXAM_BLUEPRINTS[profile.dataExamNo - 1];
  let moduleA = buildModuleA(profile.dataExamNo, base);
  let moduleB = buildModuleB(profile.dataExamNo, base);
  let moduleD = buildModuleD(profile.dataExamNo, base);

  moduleA = replaceAt(moduleA, 17, determinantQuestion(profile));
  moduleA = replaceAt(moduleA, 18, rankQuestion(profile));
  moduleA = replaceAt(moduleA, 19, biasUpdateQuestion(profile));

  moduleB = replaceAt(moduleB, 17, broadcastShortQuestion(profile));
  moduleB = replaceAt(moduleB, 18, numpyMatrixQuestion(profile));
  moduleB = replaceAt(moduleB, 19, pythonTraceQuestion(profile));

  const moduleC = [
    ...buildCmcq(profile),
    cancerMetricsEssay(profile),
    ragVsFineTuneEssay(profile),
    internalRagArchitectureEssay(profile)
  ];

  moduleD = replaceAt(moduleD, 7, seniorFeedbackEssay(profile));

  const questions = renumberQuestions([...moduleA, ...moduleB, ...moduleC, ...moduleD], profile.no);

  return {
    id: `new-2026-${profile.no}`,
    title: `Bộ mô phỏng cấu trúc ngày thi đầu · Đề ${profile.no}`,
    description: profile.description,
    durationMinutes: 90,
    totalPoints: 100,
    disclaimer: `${DISCLAIMER} Ba đề 14–16 còn dựa trên phản hồi ẩn danh từ ngày thi đầu; đây không phải đề ngày sau bị lộ.`,
    moduleLabels: {
      A: 'Ma trận, định thức, rank & cập nhật bias',
      B: 'Python code & NumPy broadcasting',
      C: 'LLM, metrics & RAG',
      D: 'Đạo đức AI & giao tiếp chuyên môn'
    },
    moduleOverview: [
      'Module A: 20 câu, gồm 3 câu điền/tự luận ngắn về determinant, rank và update bias.',
      'Module B: 20 câu, gồm 3 câu code/điền về matrix operations, broadcasting, shape và Python trace.',
      'Module C: 12 câu, gồm 3 tự luận về metric ung thư, RAG vs fine-tune và kiến trúc RAG nội bộ.',
      'Module D: 8 câu, gồm 1 tự luận về cách góp ý khi senior đưa hướng có rủi ro.'
    ],
    coverageProfile: {
      title: profile.title,
      source: 'Anonymous first-day learner report, transformed into practice questions',
      structure: '60 questions / 4 modules / 10 open responses / 90 minutes',
      sfiaOrientation: 'Level 3 Apply là trọng tâm; phần giải thích và kiến trúc đơn giản quan sát mức sẵn sàng lên Level 4',
      variationPolicy: 'Ba đề cùng coverage nhưng đổi số liệu, code trace và ràng buộc thực tế'
    },
    dayOneStructure: true,
    openResponseCount: 10,
    catCelebration: true,
    questions
  };
}

export function buildDayOneExams() {
  return PROFILES.map(buildDayOneExam);
}
