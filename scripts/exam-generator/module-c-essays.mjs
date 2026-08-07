import { openQuestion, neutralContexts } from './shared.mjs';

const CONFUSION = [
  { tp: 36, fp: 4, fn: 9, tn: 51 },
  { tp: 30, fp: 10, fn: 5, tn: 55 },
  { tp: 24, fp: 6, fn: 8, tn: 42 },
  { tp: 40, fp: 10, fn: 20, tn: 30 },
  { tp: 18, fp: 2, fn: 6, tn: 24 }
];

const VALIDATION_CASES = [
  { train: 97, validation: 74, recall: 58 },
  { train: 96, validation: 76, recall: 61 },
  { train: 98, validation: 79, recall: 63 },
  { train: 95, validation: 72, recall: 55 },
  { train: 97, validation: 77, recall: 60 }
];

// Mỗi cặp đề chỉ được dùng chung tối đa 1/3 họ tự luận.
// Các họ bài vẫn nằm trong phạm vi kiến thức cơ bản và thường gặp.
export const ESSAY_PLAN = {
  1: ['ragInternal', 'faqPrivacy', 'classifierMetrics'],
  2: ['deployModelApi', 'svmPipeline', 'dataSplitLeakage'],
  3: ['neuralBackprop', 'modelSelection', 'ragEvaluation'],
  4: ['improveValidation', 'thresholdMetrics', 'apiPreprocessingDebug'],
  5: ['ragInternal', 'deployModelApi', 'modelSelection'],
  6: ['faqPrivacy', 'svmPipeline', 'improveValidation'],
  7: ['classifierMetrics', 'neuralBackprop', 'dataSplitLeakage'],
  8: ['ragInternal', 'svmPipeline', 'thresholdMetrics'],
  9: ['faqPrivacy', 'neuralBackprop', 'apiPreprocessingDebug'],
  10: ['classifierMetrics', 'modelSelection', 'ragEvaluation']
};

function getContext(examNo) {
  return neutralContexts[(examNo - 1) % neutralContexts.length];
}

function getConfusion(examNo) {
  return CONFUSION[(examNo - 1) % CONFUSION.length];
}

function getValidationCase(examNo) {
  return VALIDATION_CASES[(examNo - 1) % VALIDATION_CASES.length];
}

export function essayQuestion(skill, examNo, id) {
  const context = getContext(examNo);
  const sampleCount = 3500 + ((examNo - 1) % 5 + 1) * 500;

  if (skill === 'ragInternal') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Thiết kế một trợ lý RAG cho ${context.users} tra cứu ${context.docs}.\n\nRàng buộc:\n- Khoảng ${sampleCount} tài liệu/đoạn tài liệu.\n- ${context.teamA} và ${context.teamB} có quyền xem khác nhau.\n- Câu trả lời phải có nguồn.\n- Có 4 tuần làm bản thử nghiệm.\n\nHãy nêu: (1) pipeline chính; (2) một ví dụ hỏi–đáp; (3) cách kiểm thử trước khi cho dùng thử.`,
      modelAnswer: `Pipeline cơ bản gồm làm sạch tài liệu, chia đoạn, gắn metadata nguồn/quyền, tạo embedding, lập chỉ mục và retrieval. Khi có câu hỏi, hệ thống xác thực người dùng, lọc quyền trước retrieval rồi mới đưa đoạn phù hợp vào prompt. Câu trả lời phải bám nguồn và nói chưa đủ thông tin khi không có bằng chứng. Ví dụ người thuộc ${context.teamA} chỉ nhận tài liệu của A. Kiểm thử bằng câu hỏi mẫu, kiểm tra citation, quyền A/B, độ đúng retrieval và thời gian phản hồi.`,
      rubric: ['Có ingestion/chunking/embedding/retrieval/generation.', 'Lọc quyền trước retrieval.', 'Có ví dụ end-to-end.', 'Có citation/abstain khi thiếu nguồn.', 'Có kế hoạch kiểm thử cơ bản.'],
      tags: ['rag', 'access-control', 'essay'], skillId: 'essay.rag.internal-access-controlled', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'faqPrivacy') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Thiết kế ${context.faq} dùng mô hình ngôn ngữ.\n\nRàng buộc:\n- FAQ thông thường được trả lời tự động.\n- Không gửi dữ liệu nhạy cảm thô cho dịch vụ ngoài.\n- Yêu cầu thay đổi thông tin, hoàn tiền hoặc quyết định ảnh hưởng lớn phải chuyển người.\n\nHãy trình bày: (1) cách phân luồng; (2) một ví dụ hội thoại; (3) cách kiểm thử và giám sát.`,
      modelAnswer: `Dùng một bước phân loại yêu cầu: FAQ có thể trả tự động từ tài liệu đã duyệt, còn yêu cầu nhạy cảm hoặc có hành động ảnh hưởng lớn phải handoff cho người có thẩm quyền. Dữ liệu nhạy cảm được loại bỏ hoặc thay mã trước khi gửi ra ngoài. Ví dụ hỏi giờ làm việc thì trả trực tiếp; yêu cầu đổi thông tin tài khoản thì chuyển người. Kiểm thử cả câu bình thường, câu chứa PII và câu vượt quyền; theo dõi lỗi, độ trễ và tỷ lệ handoff.`,
      rubric: ['Phân biệt FAQ và yêu cầu rủi ro.', 'Không gửi dữ liệu nhạy cảm thô.', 'Có human handoff.', 'Có ví dụ hội thoại.', 'Có kiểm thử/monitoring cơ bản.'],
      tags: ['llm', 'privacy', 'human-in-the-loop', 'essay'], skillId: 'essay.llm.faq-privacy-handoff', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'classifierMetrics') {
    const data = getConfusion(examNo);
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Xây dựng một mô hình phân loại để ${context.classifier}.\n\nRàng buộc:\n- Có khoảng ${sampleCount} mẫu đã gắn nhãn.\n- Hai lớp hơi lệch.\n- Kết quả thử nghiệm có TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn}.\n\nHãy: (1) chọn một baseline dễ hiểu; (2) giải thích accuracy, precision, recall, F1 và metric nên ưu tiên; (3) nêu cách đưa mô hình vào thử nghiệm.`,
      modelAnswer: `Có thể bắt đầu bằng logistic regression hoặc cây quyết định nhỏ. Chia train/validation/test và giữ test cho đánh giá cuối. Từ confusion matrix tính accuracy, precision=TP/(TP+FP), recall=TP/(TP+FN), F1 là trung bình điều hòa precision/recall. Nếu bỏ sót lớp dương tính nguy hiểm thì ưu tiên recall hơn accuracy. Khi thử nghiệm, đóng gói preprocessing + model thành API đơn giản và theo dõi metric trên dữ liệu mới.`,
      rubric: ['Chọn baseline hợp lý.', 'Chia dữ liệu đúng.', 'Giải thích đúng bốn metric.', 'Chọn metric theo hậu quả FP/FN.', 'Có cách triển khai thử cơ bản.'],
      tags: ['classification', 'confusion-matrix', 'essay'], skillId: 'essay.ml.classifier-confusion-matrix', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'deployModelApi') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Một mô hình dùng để ${context.classifier} đã đạt kết quả chấp nhận được trên test. Hãy đưa nó thành API thử nghiệm cho ${context.users}.\n\nRàng buộc:\n- Input JSON có vài trường bắt buộc.\n- Phản hồi cần dưới 2 giây.\n- Không log dữ liệu nhạy cảm thô.\n- Nếu phiên bản mới kém hơn phải quay lại bản cũ.\n\nHãy nêu: (1) flow request → prediction; (2) ví dụ request/response; (3) các kiểm tra trước và sau deploy.`,
      modelAnswer: `API nhận JSON, validate schema, chạy đúng preprocessing rồi gọi model và trả label/score/model_version. Ví dụ request chứa các đặc trưng cho phép, response có label và score. Trước deploy cần test preprocessing, schema, mẫu dự đoán chuẩn và latency. Sau deploy theo dõi error rate, latency và chất lượng khi có nhãn; giữ model version cũ để rollback. Không ghi raw PII vào log.`,
      rubric: ['Có schema validation.', 'Preprocessing nhất quán với lúc train.', 'Có ví dụ request/response.', 'Có test latency/chất lượng.', 'Có version và rollback.'],
      tags: ['deployment', 'api', 'essay'], skillId: 'essay.ml.deploy-model-api', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'svmPipeline') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Xây dựng SVM tuyến tính cho bài toán ${context.classifier}.\n\nRàng buộc:\n- Có khoảng ${sampleCount} mẫu đã gắn nhãn và số đặc trưng không lớn.\n- Cần so sánh với logistic regression.\n- Không yêu cầu kernel nâng cao.\n\nHãy trình bày: (1) ý nghĩa margin và support vectors; (2) các bước train/evaluate; (3) khi nào giữ SVM hoặc quay về baseline.`,
      modelAnswer: `SVM tuyến tính tìm ranh giới có margin lớn; support vectors là các mẫu gần biên và ảnh hưởng mạnh đến ranh giới. Chuẩn hóa đặc trưng khi cần, chia train/validation/test, thử C ở mức cơ bản trên validation rồi đánh giá confusion matrix, precision, recall và F1 trên test. So sánh với logistic regression về chất lượng, tốc độ và khả năng giải thích; chỉ giữ SVM nếu có lợi ích rõ.`,
      rubric: ['Giải thích margin đúng.', 'Giải thích support vectors đúng.', 'Có train/validation/test.', 'Có metric phù hợp.', 'Có so sánh với baseline.'],
      tags: ['svm', 'classification', 'essay'], skillId: 'essay.ml.svm-pipeline', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'neuralBackprop') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Giải thích cách huấn luyện một neural network nhỏ để ${context.classifier} với khoảng ${sampleCount} mẫu.\n\nRàng buộc:\n- Không dùng mạng sâu.\n- Cần giải thích forward pass, loss, backpropagation và cập nhật trọng số bằng ví dụ số nhỏ.\n\nHãy trình bày: (1) flow huấn luyện; (2) một ví dụ cập nhật một trọng số; (3) cách phát hiện overfit.`,
      modelAnswer: `Forward pass tạo dự đoán, loss đo sai số, backprop dùng chain rule để tính gradient, sau đó gradient descent cập nhật w_new=w-η×grad. Có thể minh họa với một nơ-ron tuyến tính và số nhỏ. Chia train/validation/test, theo dõi train loss và validation loss; nếu train tiếp tục tốt lên nhưng validation xấu đi thì có dấu hiệu overfit. So sánh với baseline đơn giản trước khi chọn mạng.`,
      rubric: ['Giải thích đúng forward/loss/backprop/update.', 'Có ví dụ cập nhật số nhỏ.', 'Có train/validation/test.', 'Nhận biết overfit.', 'Có baseline để so sánh.'],
      tags: ['backpropagation', 'neural-network', 'essay'], skillId: 'essay.ml.neural-backprop-pipeline', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'modelSelection') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Bạn có ${sampleCount} mẫu để ${context.classifier} và cần chọn giữa logistic regression, SVM tuyến tính và neural network nhỏ.\n\nRàng buộc:\n- MVP trong 3 tuần.\n- Kết quả cần tương đối dễ giải thích.\n- Hai lớp hơi lệch.\n\nHãy nêu: (1) baseline nên thử trước; (2) thứ tự thử các mô hình tiếp theo; (3) tiêu chí để quyết định.`,
      modelAnswer: `Nên bắt đầu logistic regression vì nhanh và dễ giải thích. Có thể thử SVM tuyến tính tiếp nếu dữ liệu phù hợp; neural network nhỏ chỉ nên thử khi baseline chưa đạt và có lý do rõ. Dùng train/validation/test, confusion matrix, precision, recall, F1, latency và độ đơn giản để so sánh. Chọn mô hình theo ràng buộc chứ không mặc định mô hình phức tạp hơn là tốt hơn.`,
      rubric: ['Có baseline hợp lý.', 'Có thứ tự thử mô hình.', 'Có metric cho lệch lớp.', 'Có xét latency/độ phức tạp.', 'Lập luận theo ràng buộc.'],
      tags: ['model-selection', 'essay'], skillId: 'essay.ml.select-model-under-constraints', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'improveValidation') {
    const scenario = getValidationCase(examNo);
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Mô hình dùng để ${context.classifier} đạt train accuracy ${scenario.train}% nhưng validation accuracy ${scenario.validation}%; recall lớp dương tính chỉ ${scenario.recall}%.\n\nRàng buộc:\n- Chưa thể thu thêm dữ liệu trong 2 tuần.\n- Phải giữ baseline để so sánh.\n\nHãy: (1) nêu các nguyên nhân có thể; (2) nêu ba kiểm tra nên làm; (3) đề xuất vài cách cải thiện đơn giản mà không dùng test để tune.`,
      modelAnswer: `Có thể do overfit, leakage, chia tập không phù hợp, lớp lệch hoặc threshold chưa hợp lý. Kiểm tra trùng lặp/leakage giữa train-validation, phân phối lớp và confusion matrix/learning curve. Có thể thử regularization, mô hình đơn giản hơn, class weight hoặc điều chỉnh threshold trên validation. Test chỉ dùng đánh giá cuối và baseline phải được giữ để so sánh.`,
      rubric: ['Nêu được overfit/leakage/lệch lớp.', 'Có kiểm tra cụ thể.', 'Không dùng test để tune.', 'Có biện pháp cải thiện đơn giản.', 'Giữ baseline để so sánh.'],
      tags: ['overfitting', 'evaluation', 'essay'], skillId: 'essay.ml.diagnose-validation-gap', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'dataSplitLeakage') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Bạn nhận một bộ dữ liệu ${sampleCount} mẫu đã gắn nhãn để ${context.classifier}.\n\nRàng buộc:\n- Có một số bản ghi gần trùng nhau.\n- Một vài cột được tạo sau khi kết quả thực tế đã xảy ra.\n- Cần báo cáo kết quả đáng tin cậy.\n\nHãy nêu: (1) cách chia train/validation/test; (2) data leakage có thể xuất hiện ở đâu; (3) cách kiểm tra pipeline trước khi train.`,
      modelAnswer: `Loại hoặc gom các bản ghi gần trùng để không rơi vào nhiều tập khác nhau. Các cột chỉ xuất hiện sau thời điểm dự đoán phải bị loại khỏi feature vì gây leakage. Fit preprocessing chỉ trên train rồi áp dụng cho validation/test. Dùng validation để chọn mô hình và giữ test cho đánh giá cuối. Kiểm tra schema, missing values, tỷ lệ lớp và một vài mẫu bằng tay trước khi train.`,
      rubric: ['Chia train/validation/test đúng vai trò.', 'Nhận ra leakage từ cột hậu nghiệm.', 'Xử lý bản ghi trùng hợp lý.', 'Fit preprocessing trên train.', 'Có kiểm tra dữ liệu cơ bản.'],
      tags: ['data-preparation', 'leakage', 'essay'], skillId: 'essay.ml.data-split-and-leakage', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'thresholdMetrics') {
    const data = getConfusion(examNo);
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Một classifier dùng để ${context.classifier} hiện có TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn}. Nhóm cân nhắc hạ threshold để bắt được nhiều ca dương tính hơn.\n\nRàng buộc:\n- Bỏ sót dương tính gây hậu quả lớn hơn một cảnh báo nhầm.\n- Không được chỉ nhìn accuracy.\n\nHãy giải thích: (1) precision và recall sẽ thường thay đổi theo hướng nào; (2) metric nên ưu tiên; (3) cách chọn threshold bằng validation.`,
      modelAnswer: `Khi hạ threshold, thường có nhiều dự đoán dương hơn: recall có xu hướng tăng nhưng precision có thể giảm vì FP tăng. Vì FN gây hậu quả lớn hơn, recall nên được ưu tiên, nhưng vẫn theo dõi precision/F1 để tránh quá nhiều cảnh báo nhầm. Thử một số threshold trên validation và chọn theo tiêu chí đã thống nhất; test chỉ dùng đánh giá cuối.`,
      rubric: ['Hiểu trade-off precision/recall.', 'Chọn metric theo hậu quả FN.', 'Không chỉ dùng accuracy.', 'Chọn threshold trên validation.', 'Giữ test cho đánh giá cuối.'],
      tags: ['confusion-matrix', 'threshold', 'essay'], skillId: 'essay.ml.threshold-precision-recall-tradeoff', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'ragEvaluation') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Một hệ thống RAG dùng ${context.docs} trả lời trôi chảy nhưng đôi lúc lấy sai đoạn hoặc ghi sai nguồn.\n\nRàng buộc:\n- Kho chỉ khoảng ${sampleCount} đoạn/tài liệu.\n- Chưa cần tối ưu hạ tầng phức tạp.\n\nHãy nêu: (1) cách tách lỗi retrieval và lỗi generation; (2) một bộ test nhỏ nên có gì; (3) ba chỉ số/tiêu chí chất lượng nên theo dõi.`,
      modelAnswer: `Tạo bộ câu hỏi có tài liệu đúng đã biết. Trước tiên kiểm tra retrieval có đưa đúng đoạn vào top-k hay không; nếu retrieval đúng mà câu trả lời vẫn sai thì lỗi nằm nhiều hơn ở generation/prompt. Bộ test nên có câu dễ, câu không có đáp án và câu cần citation. Có thể theo dõi retrieval hit-rate, mức bám nguồn/correctness, citation đúng, tỷ lệ abstain đúng và latency.`,
      rubric: ['Tách được retrieval và generation.', 'Có bộ câu hỏi chuẩn nhỏ.', 'Có kiểm tra câu không đủ nguồn.', 'Có tiêu chí citation/groundedness.', 'Có metric retrieval cơ bản.'],
      tags: ['rag', 'evaluation', 'essay'], skillId: 'essay.rag.evaluate-retrieval-and-answer', sfiaBand: 'L3-L4'
    });
  }

  if (skill === 'apiPreprocessingDebug') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Mô hình để ${context.classifier} chạy đúng trong notebook nhưng khi gọi API thì nhiều dự đoán sai bất thường.\n\nRàng buộc:\n- API vẫn trả HTTP 200.\n- Một số trường JSON có kiểu dữ liệu khác lúc train.\n- Có khả năng preprocessing ở API không giống notebook.\n\nHãy nêu: (1) thứ tự debug; (2) một ví dụ lỗi preprocessing/schema; (3) cách ngăn lỗi tương tự khi deploy lại.`,
      modelAnswer: `So sánh cùng một input qua notebook và API, kiểm tra schema/kiểu dữ liệu, thứ tự feature, missing value, chuẩn hóa và version model. Ví dụ lúc train tuổi là số nhưng API nhận chuỗi, hoặc scaler không được dùng giống lúc train. Đóng gói preprocessing cùng model, validate schema, viết test với các input cố định và trả model_version để đối chiếu.`,
      rubric: ['Debug từ input/schema đến preprocessing/model.', 'Có ví dụ lỗi cụ thể.', 'Kiểm tra feature order/type.', 'Đóng gói preprocessing nhất quán.', 'Có regression test/model version.'],
      tags: ['api', 'debugging', 'preprocessing', 'essay'], skillId: 'essay.ml.debug-api-preprocessing', sfiaBand: 'L3-L4'
    });
  }

  throw new Error(`Không có essay Module C: ${skill}`);
}
