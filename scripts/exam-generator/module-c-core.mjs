import { mcq, formatNumber, neutralContexts } from './shared.mjs';

const CONFUSION = [
  { tp: 36, fp: 4, fn: 9, tn: 51 },
  { tp: 30, fp: 10, fn: 5, tn: 55 },
  { tp: 24, fp: 6, fn: 8, tn: 42 },
  { tp: 40, fp: 10, fn: 20, tn: 30 },
  { tp: 18, fp: 2, fn: 6, tn: 24 }
];

function metrics(data) {
  const total = data.tp + data.fp + data.fn + data.tn;
  const accuracy = (data.tp + data.tn) / total;
  const precision = data.tp / (data.tp + data.fp);
  const recall = data.tp / (data.tp + data.fn);
  const f1 = 2 * precision * recall / (precision + recall);
  return { total, accuracy, precision, recall, f1 };
}

function pct(value) {
  return `${formatNumber(value * 100, 1)}%`;
}

export const cFactories = {
  supervised(examNo, id) {
    const context = neutralContexts[examNo - 1];
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Có dữ liệu đã gắn nhãn để ${context.classifier}. Loại bài toán phù hợp nhất là:`,
      correct: 'Học có giám sát cho bài toán phân loại',
      distractors: ['Phân cụm không giám sát', 'Giảm chiều mà không dự đoán nhãn', 'Chỉ dùng LLM viết mô tả'],
      explanation: 'Dữ liệu có nhãn mục tiêu nên đây là bài toán phân loại có giám sát.',
      tags: ['machine-learning', 'classification'], skillId: 'ml.supervised.classification'
    });
  },
  validationRole(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Vai trò chính của tập validation trong quá trình huấn luyện mô hình là:',
      correct: 'Chọn siêu tham số/ngưỡng và so sánh phiên bản trước khi đánh giá cuối trên test',
      distractors: ['Dùng để huấn luyện thay cho train', 'Dùng để xóa dữ liệu sai', 'Dùng để thay thế hoàn toàn tập test'],
      explanation: 'Validation hỗ trợ lựa chọn mô hình; test nên được giữ riêng cho đánh giá cuối.',
      tags: ['machine-learning', 'validation'], skillId: 'ml.evaluation.validation-role'
    });
  },
  trainValTest(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Cách sử dụng train/validation/test phù hợp nhất là:',
      correct: 'Train để học tham số, validation để chọn mô hình, test để đánh giá cuối',
      distractors: ['Dùng test để điều chỉnh mô hình mỗi ngày', 'Trộn cả ba tập trước khi đánh giá', 'Chỉ cần train nếu accuracy cao'],
      explanation: 'Ba tập có vai trò khác nhau; giữ test độc lập giúp đánh giá khách quan hơn.',
      tags: ['machine-learning', 'evaluation'], skillId: 'ml.evaluation.train-validation-test'
    });
  },
  overfit(examNo, id) {
    const train = 96 + (examNo % 3);
    const validation = 68 + examNo * 2;
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Mô hình đạt ${train}% trên train nhưng chỉ ${validation}% trên validation. Dấu hiệu hợp lý nhất là:`,
      correct: 'Mô hình có thể đang overfit',
      distractors: ['Mô hình chắc chắn hoàn hảo', 'Không cần tập validation', 'Cần tăng số lớp ngay lập tức'],
      explanation: 'Khoảng cách lớn giữa train và validation thường là dấu hiệu overfitting.',
      tags: ['machine-learning', 'overfitting'], skillId: 'ml.generalization.detect-overfit'
    });
  },
  recallWhen(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Nếu bỏ sót trường hợp dương tính gây hậu quả nghiêm trọng, chỉ số nào thường cần được chú ý đặc biệt?',
      correct: 'Recall của lớp dương tính',
      distractors: ['Chỉ accuracy', 'Số epoch', 'Kích thước file model'],
      explanation: 'Recall đo tỷ lệ trường hợp dương tính thật được phát hiện.',
      tags: ['machine-learning', 'metrics'], skillId: 'ml.metrics.choose-recall'
    });
  },
  confusionIdentify(examNo, id) {
    const data = CONFUSION[examNo - 1];
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Một confusion matrix có TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn}. Số trường hợp dương tính thật bị mô hình bỏ sót là:`,
      correct: String(data.fn),
      distractors: [String(data.tp), String(data.fp), String(data.tn)],
      explanation: 'Dương tính thật nhưng dự đoán âm tính là false negative (FN).',
      tags: ['machine-learning', 'confusion-matrix'], skillId: 'ml.metrics.identify-false-negative'
    });
  },
  confusionAccuracy(examNo, id) {
    const data = CONFUSION[examNo - 1];
    const m = metrics(data);
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Cho TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn}. Accuracy bằng:`,
      correct: pct(m.accuracy),
      distractors: [pct(m.precision), pct(m.recall), pct((data.fp + data.fn) / m.total)],
      explanation: `Accuracy=(TP+TN)/tổng=(${data.tp}+${data.tn})/${m.total}=${pct(m.accuracy)}.`,
      tags: ['machine-learning', 'confusion-matrix', 'accuracy'], skillId: 'ml.metrics.compute-accuracy'
    });
  },
  confusionPrecision(examNo, id) {
    const data = CONFUSION[examNo - 1];
    const m = metrics(data);
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Cho TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn}. Precision của lớp dương tính bằng:`,
      correct: pct(m.precision),
      distractors: [pct(m.accuracy), pct(m.recall), pct(data.fp / (data.fp + data.tn))],
      explanation: `Precision=TP/(TP+FP)=${data.tp}/${data.tp + data.fp}=${pct(m.precision)}.`,
      tags: ['machine-learning', 'confusion-matrix', 'precision'], skillId: 'ml.metrics.compute-precision'
    });
  },
  confusionRecall(examNo, id) {
    const data = CONFUSION[examNo - 1];
    const m = metrics(data);
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Cho TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn}. Recall của lớp dương tính bằng:`,
      correct: pct(m.recall),
      distractors: [pct(m.accuracy), pct(m.precision), pct(data.fn / (data.fn + data.tn))],
      explanation: `Recall=TP/(TP+FN)=${data.tp}/${data.tp + data.fn}=${pct(m.recall)}.`,
      tags: ['machine-learning', 'confusion-matrix', 'recall'], skillId: 'ml.metrics.compute-recall'
    });
  },
  confusionF1(examNo, id) {
    const data = CONFUSION[examNo - 1];
    const m = metrics(data);
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Cho precision=${pct(m.precision)} và recall=${pct(m.recall)}. F1-score gần nhất là:`,
      correct: pct(m.f1),
      distractors: [pct((m.precision + m.recall) / 2), pct(m.accuracy), pct(Math.abs(m.precision - m.recall))],
      explanation: `F1=2PR/(P+R)≈${pct(m.f1)}.`,
      tags: ['machine-learning', 'f1'], skillId: 'ml.metrics.compute-f1'
    });
  },
  svmPurpose(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Mục tiêu cơ bản của SVM tuyến tính trong bài toán phân loại hai lớp là:',
      correct: 'Tìm siêu phẳng phân tách có biên lớn giữa hai lớp',
      distractors: ['Tạo ngẫu nhiên nhiều nhãn', 'Tính trung bình mọi đặc trưng', 'Thay thế dữ liệu bằng văn bản'],
      explanation: 'SVM tìm ranh giới phân loại và tối đa hóa margin trong trường hợp tuyến tính.',
      tags: ['machine-learning', 'svm'], skillId: 'ml.svm.maximum-margin'
    });
  },
  svmSupportVectors(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Trong SVM, support vectors là:',
      correct: 'Các điểm dữ liệu nằm gần ranh giới và quyết định vị trí của biên',
      distractors: ['Mọi điểm dữ liệu đều có vai trò giống nhau', 'Các điểm bị xóa trước khi train', 'Các trọng số của neural network'],
      explanation: 'Các điểm gần margin ảnh hưởng trực tiếp đến siêu phẳng tối ưu.',
      tags: ['machine-learning', 'svm'], skillId: 'ml.svm.support-vectors'
    });
  },
  svmMargin(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Nếu hai siêu phẳng đều phân loại đúng tập train, SVM thường ưu tiên phương án nào?',
      correct: 'Siêu phẳng có margin lớn hơn',
      distractors: ['Siêu phẳng đi qua nhiều điểm nhất', 'Siêu phẳng có hệ số lớn nhất bất kể dữ liệu', 'Chọn ngẫu nhiên'],
      explanation: 'Margin lớn thường giúp ranh giới ổn định hơn với dữ liệu mới.',
      tags: ['machine-learning', 'svm'], skillId: 'ml.svm.compare-margins'
    });
  },
  svmDecision(examNo, id) {
    const x1 = examNo;
    const x2 = 2;
    const score = x1 - x2 + 1;
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Một SVM tuyến tính dùng hàm quyết định f(x)=x₁-x₂+1. Với x=(${x1},${x2}), f(x)=${score}. Nếu f(x)>=0 thì dự đoán lớp +1. Dự đoán là:`,
      correct: score >= 0 ? '+1' : '-1',
      distractors: [score >= 0 ? '-1' : '+1', '0', 'Không thể tính'],
      explanation: `Thay x vào f(x) được ${score}; dấu của f(x) quyết định lớp.`,
      tags: ['machine-learning', 'svm'], skillId: 'ml.svm.linear-decision-function'
    });
  },
  backpropPurpose(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Vai trò chính của backpropagation khi huấn luyện neural network là:',
      correct: 'Tính gradient của loss theo các trọng số để cập nhật mô hình',
      distractors: ['Tự gắn nhãn cho mọi dữ liệu', 'Chỉ tăng số lớp của mạng', 'Mã hóa API key'],
      explanation: 'Backpropagation dùng quy tắc dây chuyền để truyền gradient từ output về các tham số.',
      tags: ['machine-learning', 'backpropagation'], skillId: 'ml.backprop.purpose'
    });
  },
  backpropGradient(examNo, id) {
    const x = [2, 1, 3, 2, 1][examNo - 1];
    const w = [0.5, 1, 1, 0.5, 2][examNo - 1];
    const y = [2, 0, 2, 3, 1][examNo - 1];
    const yhat = w * x;
    const grad = (yhat - y) * x;
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Một nơ-ron tuyến tính có ŷ=wx, loss L=1/2(ŷ-y)^2. Cho x=${x}, w=${w}, y=${y}. Gradient dL/dw bằng:`,
      correct: formatNumber(grad, 2),
      distractors: [formatNumber(yhat - y, 2), formatNumber((yhat - y) ** 2, 2), formatNumber(x * w, 2)],
      explanation: `dL/dw=(ŷ-y)x=(${formatNumber(yhat)}-${y})×${x}=${formatNumber(grad, 2)}.`,
      tags: ['machine-learning', 'backpropagation', 'gradient'], skillId: 'ml.backprop.single-neuron-gradient'
    });
  },
  weightUpdate(examNo, id) {
    const w = [0.5, 1, 0.4, 0.8, 1.2][examNo - 1];
    const grad = [-2, 1, -1.5, 2, -0.5][examNo - 1];
    const lr = [0.1, 0.2, 0.1, 0.05, 0.2][examNo - 1];
    const updated = w - lr * grad;
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Gradient descent cập nhật w_new=w-η×gradient. Cho w=${w}, η=${lr}, gradient=${grad}. w_new bằng:`,
      correct: formatNumber(updated, 2),
      distractors: [formatNumber(w + lr * grad, 2), formatNumber(lr * grad, 2), formatNumber(w - grad, 2)],
      explanation: `w_new=${w}-${lr}×(${grad})=${formatNumber(updated, 2)}.`,
      tags: ['machine-learning', 'gradient-descent'], skillId: 'ml.backprop.weight-update'
    });
  },
  reluDerivative(examNo, id) {
    const z = [-2, 3, -1, 4, 2][examNo - 1];
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Với ReLU(z)=max(0,z), đạo hàm tại z=${z} (không xét z=0) bằng:`,
      correct: z > 0 ? '1' : '0',
      distractors: [z > 0 ? '0' : '1', String(z), String(Math.abs(z))],
      explanation: 'ReLU có đạo hàm 1 khi z>0 và 0 khi z<0.',
      tags: ['machine-learning', 'backpropagation', 'relu'], skillId: 'ml.backprop.relu-derivative'
    });
  },
  ragRetrieval(examNo, id) {
    const context = neutralContexts[examNo - 1];
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Trong pipeline RAG cho ${context.docs}, bước retrieval có nhiệm vụ chính là:`,
      correct: 'Tìm các đoạn tài liệu liên quan để đưa vào ngữ cảnh cho mô hình trả lời',
      distractors: ['Tự thay đổi trọng số LLM sau mỗi câu hỏi', 'Tự xác nhận mọi câu trả lời là đúng', 'Gửi toàn bộ kho tài liệu vào một prompt'],
      explanation: 'Retrieval lấy bằng chứng liên quan; generation dùng bằng chứng đó để tạo câu trả lời.',
      tags: ['rag', 'retrieval'], skillId: 'rag.retrieval.role'
    });
  },
  ragEmbedding(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Embedding trong một hệ thống RAG thường được dùng để:',
      correct: 'Biểu diễn đoạn văn thành vector để so sánh mức độ liên quan',
      distractors: ['Mã hóa mật khẩu người dùng', 'Tự cấp quyền truy cập tài liệu', 'Thay thế hoàn toàn dữ liệu gốc'],
      explanation: 'Embedding hỗ trợ tìm kiếm ngữ nghĩa bằng khoảng cách giữa các vector.',
      tags: ['rag', 'embedding'], skillId: 'rag.embedding.semantic-search'
    });
  },
  ragNoEvidence(examNo, id) {
    const context = neutralContexts[examNo - 1];
    return mcq({
      id, module: 'C', points: 2,
      prompt: `Khi câu hỏi không có đủ bằng chứng trong ${context.docs}, trợ lý RAG nên:`,
      correct: 'Nói rằng chưa đủ thông tin, nêu nguồn đã kiểm tra và chuyển người khi cần',
      distractors: ['Tự bịa câu trả lời cho trôi chảy', 'Ẩn việc thiếu nguồn', 'Luôn trả lời chắc chắn'],
      explanation: 'Khi bằng chứng thiếu, từ chối hoặc chuyển người an toàn hơn việc suy đoán.',
      tags: ['rag', 'groundedness'], skillId: 'rag.answer.abstain-without-evidence'
    });
  },
  humanReview(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Với hành động có ảnh hưởng lớn đến quyền lợi người dùng, vai trò phù hợp của AI là:',
      correct: 'Đưa ra gợi ý và bằng chứng; người có thẩm quyền kiểm tra và quyết định cuối',
      distractors: ['Tự quyết định mọi trường hợp', 'Xóa log để tránh tranh chấp', 'Công khai dữ liệu để cộng đồng bình chọn'],
      explanation: 'Human review cần thiết với quyết định rủi ro cao hoặc có hậu quả pháp lý/tài chính.',
      tags: ['responsible-ai', 'human-in-the-loop'], skillId: 'ai-responsibility.human-review'
    });
  },
  monitoring(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Sau khi triển khai một mô hình AI, nhóm nên theo dõi tối thiểu:',
      correct: 'Chất lượng đầu ra, lỗi, độ trễ, chi phí và phản hồi người dùng',
      distractors: ['Chỉ số dòng code', 'Chỉ lượt tải trang chủ', 'Không cần theo dõi nếu demo chạy được'],
      explanation: 'Monitoring giúp phát hiện giảm chất lượng, lỗi vận hành và chi phí vượt dự kiến.',
      tags: ['deployment', 'monitoring'], skillId: 'ml.deployment.basic-monitoring'
    });
  }
};
