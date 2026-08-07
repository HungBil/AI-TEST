import { openQuestion, neutralContexts } from './shared.mjs';

export function essayQuestion(skill, examNo, id) {
  const context = neutralContexts[examNo - 1];
  const sampleCount = 3500 + examNo * 500;
  if (skill === 'ragInternal') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Thiết kế một trợ lý RAG cho ${context.users} tra cứu khoảng ${sampleCount} ${context.docs}.\n\nRàng buộc:\n- Dữ liệu của ${context.teamA} không được hiển thị cho người chỉ thuộc ${context.teamB}, và ngược lại.\n- Câu trả lời phải ghi nguồn.\n- Có 4 tuần để làm bản thử nghiệm.\n\nHãy trình bày: (1) lý do chọn RAG và các bước chính; (2) một ví dụ hỏi–đáp; (3) cách triển khai và đánh giá.`,
      modelAnswer: `Pipeline cơ bản: làm sạch tài liệu, chia đoạn, gắn nguồn và quyền ${context.teamA}/${context.teamB}, tạo embedding, lưu index. Khi có câu hỏi, backend xác thực người dùng và lọc quyền trước retrieval; chỉ đoạn được phép mới vào prompt. Mô hình trả lời dựa trên bằng chứng và ghi nguồn.\n\nVí dụ: người thuộc ${context.teamA} hỏi một quy trình; hệ thống lấy tài liệu thuộc quyền A, trả lời kèm citation và không truy xuất tài liệu riêng của B.\n\nKế hoạch 4 tuần: chuẩn hóa dữ liệu và bộ câu hỏi; làm retrieval; thêm phân quyền/citation; kiểm thử và pilot. Đánh giá khả năng tìm đúng tài liệu, bám nguồn, không rò rỉ A/B, độ trễ và phản hồi.`,
      rubric: ['Giải thích đúng vai trò RAG.', 'Có ingestion/chunking/embedding/retrieval/generation.', 'Lọc quyền trước khi đưa tài liệu vào prompt.', 'Có ví dụ và citation.', 'Có kế hoạch triển khai và đánh giá.'],
      tags: ['rag', 'essay'], skillId: 'essay.rag.internal-access-controlled', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'faqPrivacy') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Thiết kế ${context.faq} dùng mô hình ngôn ngữ.\n\nRàng buộc:\n- Không gửi dữ liệu nhạy cảm thô cho dịch vụ bên ngoài.\n- FAQ được trả lời tự động; thay đổi thông tin tài khoản, hoàn tiền hoặc quyết định ảnh hưởng lớn phải chuyển người.\n- Phản hồi cần nhanh và có giới hạn chi phí.\n\nHãy nêu: (1) cách phân luồng; (2) một ví dụ hội thoại; (3) triển khai, kiểm thử và giám sát.`,
      modelAnswer: `Dùng router phân loại FAQ và yêu cầu nhạy cảm. FAQ dùng tài liệu đã duyệt. Dữ liệu nhạy cảm được loại bỏ hoặc thay mã trước khi gọi dịch vụ ngoài. Hành động ảnh hưởng lớn chỉ tạo phiếu và chuyển người có thẩm quyền.\n\nVí dụ: hỏi giờ làm việc thì hệ thống trả từ FAQ; yêu cầu đổi số điện thoại thì chuyển luồng xác minh của nhân viên.\n\nKiểm thử độ đúng, tình huống chứa dữ liệu nhạy cảm, yêu cầu vượt quyền, độ trễ và chi phí. Theo dõi tỷ lệ chuyển người, lỗi và phản hồi.`,
      rubric: ['Có phân luồng FAQ và yêu cầu nhạy cảm.', 'Không gửi dữ liệu nhạy cảm thô.', 'Có human handoff.', 'Có ví dụ hội thoại.', 'Có kiểm thử và monitoring.'],
      tags: ['llm', 'privacy', 'essay'], skillId: 'essay.llm.faq-privacy-handoff', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'classifierMetrics') {
    const data = CONFUSION[examNo - 1];
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Xây dựng mô hình để ${context.classifier}.\n\nRàng buộc:\n- Có khoảng ${sampleCount} mẫu đã gắn nhãn, hai lớp hơi lệch.\n- Baseline phải dễ giải thích.\n- Khi thử nghiệm, confusion matrix dự kiến được dùng để tính accuracy, precision, recall và F1.\n- Cần đóng gói thành API đơn giản.\n\nHãy trình bày: (1) lựa chọn baseline và cách chia dữ liệu; (2) ví dụ input/output; (3) cách đánh giá và triển khai. Dùng TP=${data.tp}, FP=${data.fp}, FN=${data.fn}, TN=${data.tn} để minh họa cách đọc chỉ số.`,
      modelAnswer: `Có thể bắt đầu với logistic regression, cây quyết định nhỏ hoặc SVM tuyến tính tùy loại đặc trưng. Chia train/validation/test; xử lý dữ liệu thiếu và mã hóa đặc trưng. Với confusion matrix đã cho, tính accuracy=(TP+TN)/tổng, precision=TP/(TP+FP), recall=TP/(TP+FN), F1 là trung bình điều hòa precision/recall. Chọn chỉ số theo hậu quả của FP/FN.\n\nVí dụ: input là đặc trưng của một yêu cầu; output gồm nhãn và score. Đóng gói preprocessing và model thành API /predict, kiểm tra schema, version model và log tối thiểu. Theo dõi chỉ số trên dữ liệu mới và phản hồi người dùng.`,
      rubric: ['Chọn baseline hợp lý và giải thích.', 'Chia dữ liệu đúng.', 'Đọc đúng confusion matrix và metric.', 'Có ví dụ input/output.', 'Có API, versioning và monitoring cơ bản.'],
      tags: ['classification', 'confusion-matrix', 'essay'], skillId: 'essay.ml.classifier-confusion-matrix', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'deployModelApi') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Bạn đã có một mô hình phân loại đạt kết quả chấp nhận được trên test. Hãy thiết kế cách đưa mô hình thành API thử nghiệm.\n\nRàng buộc:\n- Input là JSON có vài trường bắt buộc.\n- Phản hồi cần dưới 2 giây.\n- Không log dữ liệu nhạy cảm thô.\n- Phải có cách quay lại phiên bản cũ nếu chất lượng giảm.\n\nTrình bày: (1) các thành phần; (2) một ví dụ request/response; (3) kiểm thử và giám sát.`,
      modelAnswer: `Đóng gói cùng preprocessing và model version trong một service /predict. Validate schema, xử lý lỗi rõ, đo latency và chỉ log trace/metadata tối thiểu. Ví dụ request chứa các đặc trưng đã cho phép; response gồm label, score và model_version. Kiểm thử unit cho preprocessing, integration cho API, tập mẫu vàng cho chất lượng và load test nhẹ. Deploy phạm vi nhỏ, theo dõi latency, error rate, phân phối score và metric khi có nhãn; giữ phiên bản trước để rollback.`,
      rubric: ['Có preprocessing + model + API.', 'Có schema validation và ví dụ request/response.', 'Không log dữ liệu nhạy cảm thô.', 'Có test chất lượng và latency.', 'Có version và rollback.'],
      tags: ['deployment', 'api', 'essay'], skillId: 'essay.ml.deploy-model-api', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'svmPipeline') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Xây dựng một mô hình SVM tuyến tính để ${context.classifier}.\n\nRàng buộc:\n- Có ${sampleCount} mẫu đã gắn nhãn và số đặc trưng không quá lớn.\n- Cần so sánh với một baseline đơn giản.\n- Người dùng cần biết ví dụ nào làm mô hình khó phân loại.\n\nHãy trình bày: (1) vì sao SVM có thể phù hợp hoặc không phù hợp; (2) một ví dụ input/output; (3) cách huấn luyện, đánh giá và triển khai thử.`,
      modelAnswer: `SVM tuyến tính phù hợp khi dữ liệu có thể phân tách tương đối bằng ranh giới tuyến tính và số mẫu vừa phải. Chuẩn hóa đặc trưng nếu thang đo khác nhau; chia train/validation/test; chọn C trên validation và so sánh với logistic regression. Support vectors là các mẫu gần ranh giới, có thể dùng để kiểm tra trường hợp khó. Đánh giá confusion matrix, precision, recall và F1. Đóng gói cùng preprocessing thành API, version model và theo dõi chất lượng.`,
      rubric: ['Giải thích margin/support vectors ở mức đúng.', 'Có baseline so sánh.', 'Có chia dữ liệu và đánh giá metric.', 'Có ví dụ input/output.', 'Có API và monitoring cơ bản.'],
      tags: ['svm', 'essay'], skillId: 'essay.ml.svm-pipeline', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'neuralBackprop') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Thiết kế quá trình huấn luyện một neural network nhỏ cho bài toán phân loại.\n\nRàng buộc:\n- Dữ liệu vài nghìn mẫu, không dùng mạng quá sâu.\n- Cần giải thích forward pass, loss, backpropagation và cập nhật trọng số bằng ngôn ngữ dễ hiểu.\n- Phải phát hiện overfit và triển khai bản thử nghiệm.\n\nHãy trình bày: (1) kiến trúc/baseline; (2) một ví dụ một bước cập nhật; (3) đánh giá và triển khai.`,
      modelAnswer: `Bắt đầu bằng mạng nhỏ và so sánh với logistic regression. Forward pass tạo dự đoán; loss đo sai lệch; backprop dùng quy tắc dây chuyền để tính gradient; optimizer cập nhật w_new=w-ηgrad. Minh họa với một nơ-ron và số nhỏ. Chia train/validation/test, theo dõi train và validation loss, dùng early stopping khi cần. Đánh giá confusion matrix và metric phù hợp. Đóng gói preprocessing + model thành API, version và theo dõi lỗi/latency/chất lượng.`,
      rubric: ['Giải thích forward/loss/backprop/update đúng.', 'Có baseline đơn giản.', 'Có ví dụ cập nhật số nhỏ.', 'Có cách phát hiện overfit.', 'Có đánh giá và triển khai API cơ bản.'],
      tags: ['backpropagation', 'neural-network', 'essay'], skillId: 'essay.ml.neural-backprop-pipeline', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'modelSelection') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Bạn cần chọn giữa logistic regression, SVM tuyến tính và neural network nhỏ cho một bài toán phân loại có ${sampleCount} mẫu.\n\nRàng buộc:\n- Cần giải thích được kết quả cho nhóm vận hành.\n- Thời gian làm MVP là 3 tuần.\n- Dữ liệu có 20 đặc trưng và hơi lệch lớp.\n\nHãy: (1) lập luận chọn baseline và phương án thử tiếp theo; (2) nêu một ví dụ input/output; (3) lập kế hoạch huấn luyện, đánh giá và triển khai.`,
      modelAnswer: `Chọn logistic regression làm baseline vì nhanh, dễ giải thích; thử SVM tuyến tính nếu ranh giới phù hợp; chỉ dùng neural network nhỏ khi baseline không đủ và có bằng chứng. Chia train/validation/test, chuẩn hóa khi cần, dùng confusion matrix, precision, recall, F1 và thời gian suy luận. MVP 3 tuần gồm dữ liệu/baseline, so sánh mô hình, API/pilot. Ví dụ response có label, score, model_version. Quyết định cuối dựa trên metric và ràng buộc vận hành, không dựa trên độ phức tạp.`,
      rubric: ['Lập luận theo dữ liệu và ràng buộc.', 'Có baseline và phương án so sánh.', 'Có metric cho lệch lớp.', 'Có ví dụ input/output.', 'Có kế hoạch 3 tuần và triển khai.'],
      tags: ['model-selection', 'essay'], skillId: 'essay.ml.select-model-under-constraints', sfiaBand: 'L3-L4'
    });
  }
  if (skill === 'improveValidation') {
    return openQuestion({
      id, module: 'C', type: 'essay', points: 8,
      prompt: `Một mô hình có train accuracy 97% nhưng validation accuracy 74%; recall lớp dương tính chỉ 58%.\n\nRàng buộc:\n- Không được thu thập thêm dữ liệu trong 2 tuần đầu.\n- Cần giữ một baseline để so sánh.\n- Sau 3 tuần phải có API thử nghiệm.\n\nHãy trình bày: (1) các giả thuyết nguyên nhân; (2) một ví dụ kiểm tra; (3) kế hoạch cải thiện, đánh giá và triển khai.`,
      modelAnswer: `Khả năng gồm overfit, chia dữ liệu chưa đúng, đặc trưng gây leakage, lớp lệch hoặc ngưỡng chưa phù hợp. Kiểm tra trùng lặp train/validation, phân phối lớp, confusion matrix và learning curve. Giữ baseline, thử regularization/mô hình đơn giản hơn, class weight hoặc điều chỉnh threshold trên validation. Không dùng test để điều chỉnh. Sau khi chọn mô hình, đóng gói preprocessing và API, theo dõi recall/precision, latency và lỗi; giữ phiên bản baseline để rollback.`,
      rubric: ['Nêu được overfit/leakage/lệch lớp.', 'Có kiểm tra cụ thể.', 'Không dùng test để tune.', 'Có biện pháp cải thiện vừa phải.', 'Có API, monitoring và rollback.'],
      tags: ['overfitting', 'evaluation', 'essay'], skillId: 'essay.ml.diagnose-validation-gap', sfiaBand: 'L3-L4'
    });
  }
  throw new Error(`Không có essay Module C: ${skill}`);
}
