import { mcq } from './shared.mjs';

export const dataFactories = {
  dataLeakageConcept(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Data leakage xảy ra rõ nhất khi:',
      correct: 'Feature chứa thông tin chỉ có sau thời điểm kết quả cần dự đoán',
      distractors: ['Train có nhiều mẫu hơn validation', 'Dùng NumPy để tính mean', 'Đổi tên cột trước khi train'],
      explanation: 'Thông tin hậu nghiệm làm mô hình nhìn thấy đáp án gián tiếp và tạo kết quả đánh giá ảo.',
      tags: ['machine-learning', 'data-leakage'], skillId: 'ml.data-preparation.detect-leakage'
    });
  },
  missingValuesStrategy(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Với một cột số có vài giá trị thiếu, cách làm baseline hợp lý là:',
      correct: 'Học giá trị điền từ tập train rồi áp dụng cùng quy tắc cho validation/test',
      distractors: ['Tính median từ toàn bộ train+validation+test', 'Luôn thay mọi giá trị thiếu bằng 0', 'Xóa toàn bộ bộ dữ liệu'],
      explanation: 'Quy tắc preprocessing phải được học từ train để tránh leakage.',
      tags: ['machine-learning', 'missing-values'], skillId: 'ml.data-preparation.impute-from-train'
    });
  },
  featureScalingWhen(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Feature scaling đặc biệt hữu ích với mô hình nào dưới đây?',
      correct: 'k-NN hoặc SVM vì khoảng cách hoặc margin chịu ảnh hưởng bởi thang đo',
      distractors: ['Một luật if/else viết tay không dùng số', 'Chỉ một bảng tra cứu', 'Một endpoint chỉ trả chuỗi cố định'],
      explanation: 'Feature có thang rất lớn có thể lấn át feature khác trong k-NN hoặc SVM.',
      tags: ['machine-learning', 'feature-scaling'], skillId: 'ml.data-preparation.feature-scaling'
    });
  },
  knnNeighborVote(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Với k-NN, k=3 và ba láng giềng gần nhất có nhãn (+, +, -), dự đoán theo majority vote là:',
      correct: '+',
      distractors: ['-', 'Không thể dự đoán', '0'],
      explanation: 'Hai trong ba láng giềng mang nhãn + nên lớp + chiếm đa số.',
      tags: ['machine-learning', 'knn'], skillId: 'ml.knn.majority-vote'
    });
  },
  logisticThreshold(examNo, id) {
    return mcq({
      id, module: 'C', points: 2,
      prompt: 'Classifier trả score=0,68 và threshold=0,70; quy ước score >= threshold là lớp dương. Dự đoán là:',
      correct: 'Lớp âm vì 0,68 nhỏ hơn 0,70',
      distractors: ['Lớp dương vì 0,68 lớn hơn 0,5', 'Luôn là lớp dương', 'Không liên quan đến threshold'],
      explanation: 'Phải so score với threshold đang dùng, không mặc định threshold luôn bằng 0,5.',
      tags: ['machine-learning', 'threshold'], skillId: 'ml.classification.apply-threshold'
    });
  }
};
