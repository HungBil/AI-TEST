import { qid } from './shared.mjs';
import { cFactories } from './module-c-core.mjs';
import { essayQuestion } from './module-c-essays.mjs';
export { buildModuleD } from './module-d.mjs';

const EXTRA_HINTS = {
  apiPreprocessingDebug: [
    'So sánh schema, kiểu dữ liệu và thứ tự feature giữa notebook với API.',
    'Kiểm tra bước điền thiếu, mã hóa và scaling có dùng cùng quy tắc không.',
    'Nêu một input cụ thể bị sai và cách log tối thiểu để tìm lỗi.'
  ],
  classifierMetrics: [
    'Bắt đầu bằng một baseline dễ hiểu như logistic regression hoặc cây nhỏ.',
    'Viết công thức accuracy, precision, recall và F1 từ TP, FP, FN, TN.',
    'Chọn metric theo hậu quả thực tế của bỏ sót hoặc cảnh báo nhầm.'
  ],
  deployModelApi: [
    'Nêu flow JSON input → validation → preprocessing → model → response.',
    'Response nên có label, score và model_version.',
    'Đừng quên test, latency, log an toàn và cách quay lại bản cũ.'
  ],
  ragEvaluation: [
    'Tách hai câu hỏi: hệ thống có tìm đúng đoạn không, và có trả đúng theo đoạn đó không.',
    'Chuẩn bị một bộ câu hỏi mẫu cùng nguồn đúng để đối chiếu.',
    'Nêu metric đơn giản cho retrieval, citation và câu trả lời.'
  ],
  ragInternal: [
    'Nhớ chuỗi ingestion → chunking → embedding → retrieval → generation.',
    'Lọc quyền trước khi đoạn tài liệu được đưa vào prompt.',
    'Cho một ví dụ hỏi–đáp có citation và trường hợp thiếu nguồn.'
  ],
  improveValidation: [
    'Train cao nhưng validation thấp thường gợi ý overfit, leakage hoặc split chưa đúng.',
    'Giữ test riêng; chỉ thử thay đổi trên train/validation.',
    'Đề xuất một thay đổi nhỏ rồi nêu cách so với baseline.'
  ],
  neuralBackprop: [
    'Giải thích bằng bốn bước: forward → loss → gradient → cập nhật trọng số.',
    'Dùng một nơ-ron và con số nhỏ, không cần đạo hàm ma trận.',
    'Nêu cách theo dõi train loss và validation loss để phát hiện overfit.'
  ]
};

const EXTRA_EXAMPLES = {
  apiPreprocessingDebug: 'Ví dụ dễ hiểu: notebook dùng thứ tự [tuổi, thu nhập] nhưng API gửi [thu nhập, tuổi], nên cùng một người nhận dự đoán khác.',
  classifierMetrics: 'Ví dụ dễ hiểu: nếu bỏ sót ca dương tính gây hậu quả lớn, ưu tiên recall thay vì chỉ nhìn accuracy chung.',
  deployModelApi: 'Ví dụ dễ hiểu: request {"age": 25} được kiểm tra kiểu dữ liệu, biến đổi giống lúc train rồi trả {"label": "A", "score": 0.82, "model_version": "1.2"}.',
  ragEvaluation: 'Ví dụ dễ hiểu: câu hỏi về hạn nộp hồ sơ phải lấy đúng đoạn ghi ngày 30/9; nếu đoạn không vào top-k là lỗi retrieval, còn có đoạn đúng nhưng trả sai là lỗi generation.',
  ragInternal: 'Ví dụ dễ hiểu: người thuộc nhóm A hỏi quy trình A thì chỉ tài liệu A được retrieval và câu trả lời kèm tên nguồn; tài liệu riêng của nhóm B không được đưa vào prompt.',
  improveValidation: 'Ví dụ dễ hiểu: giảm độ sâu cây hoặc tăng regularization rồi so validation recall/F1 với baseline, thay vì đổi mô hình liên tục mà không đo.',
  neuralBackprop: 'Ví dụ dễ hiểu: dự đoán 6 nhưng nhãn thật 8; gradient cho biết nên tăng hay giảm trọng số, sau đó cập nhật một bước bằng learning rate nhỏ.'
};

export function buildModuleC(dataExamNo, blueprint, essayExamNo = dataExamNo) {
  const questions = blueprint.cMcq.map((skill, index) => {
    const factory = cFactories[skill];
    if (!factory) throw new Error(`Không có factory Module C: ${skill}`);
    return factory(dataExamNo, qid(dataExamNo, 'C', index + 1));
  });
  blueprint.cEssays.forEach((skill, index) => {
    const question = essayQuestion(skill, essayExamNo, qid(dataExamNo, 'C', 10 + index));
    if (essayExamNo >= 11) {
      question.hint = EXTRA_HINTS[skill] ?? question.rubric.slice(0, 3);
      const example = EXTRA_EXAMPLES[skill];
      if (example && !question.modelAnswer.includes('Ví dụ')) question.modelAnswer += `\n\n${example}`;
    }
    questions.push(question);
  });
  return questions;
}
