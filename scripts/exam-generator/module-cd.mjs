import { mcq, openQuestion, qid, neutralContexts } from './shared.mjs';

export function buildModuleC(examNo) {
  const context = neutralContexts[examNo - 1];
  const questions = [];
  questions.push(mcq({
    id: qid(examNo, 'C', 1), module: 'C', points: 2,
    prompt: `Có dữ liệu đã gắn nhãn để ${context.classifier}. Loại bài toán phù hợp nhất là:`,
    correct: 'Học có giám sát cho bài toán phân loại',
    distractors: ['Phân cụm không giám sát', 'Giảm chiều mà không dự đoán nhãn', 'Chỉ dùng LLM viết mô tả'],
    explanation: 'Dữ liệu đã có nhãn mục tiêu, nên đây là bài toán phân loại có giám sát.', tags: ['machine-learning', 'classification']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 2), module: 'C', points: 2,
    prompt: `Vai trò chính của tập validation trong quá trình huấn luyện mô hình là:`,
    correct: 'Chọn siêu tham số/ngưỡng và so sánh phiên bản trước khi đánh giá cuối trên test',
    distractors: ['Dùng để huấn luyện thay cho train', 'Dùng để xóa dữ liệu sai', 'Dùng để thay thế hoàn toàn tập test'],
    explanation: 'Validation hỗ trợ lựa chọn mô hình; test nên được giữ riêng cho đánh giá cuối.', tags: ['validation', 'evaluation']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 3), module: 'C', points: 2,
    prompt: `Mô hình đạt 99% trên train nhưng chỉ 70% trên validation. Dấu hiệu hợp lý nhất là:`,
    correct: 'Mô hình có thể đang overfit', distractors: ['Mô hình chắc chắn hoàn hảo', 'Dữ liệu không cần chia tập', 'Cần xóa tập validation'],
    explanation: 'Khoảng cách lớn giữa train và validation thường là dấu hiệu overfitting.', tags: ['overfitting']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 4), module: 'C', points: 2,
    prompt: `Nếu bỏ sót trường hợp dương tính là hậu quả nghiêm trọng, chỉ số nào thường cần được chú ý đặc biệt?`,
    correct: 'Recall của lớp dương tính', distractors: ['Chỉ accuracy', 'Số epoch', 'Kích thước file model'],
    explanation: 'Recall đo tỷ lệ trường hợp dương tính thật được phát hiện.', tags: ['recall', 'metrics']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 5), module: 'C', points: 2,
    prompt: `Trong pipeline RAG cho ${context.docs}, bước retrieval có nhiệm vụ chính là:`,
    correct: 'Tìm các đoạn tài liệu liên quan để đưa vào ngữ cảnh cho mô hình trả lời',
    distractors: ['Tự thay đổi trọng số LLM sau mỗi câu hỏi', 'Tự xác nhận mọi câu trả lời là đúng', 'Gửi toàn bộ kho tài liệu vào một prompt'],
    explanation: 'Retrieval lấy bằng chứng liên quan; generation dùng bằng chứng đó để tạo câu trả lời.', tags: ['rag', 'retrieval']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 6), module: 'C', points: 2,
    prompt: `Embedding trong một hệ thống RAG thường được dùng để:`,
    correct: 'Biểu diễn đoạn văn thành vector để so sánh mức độ liên quan',
    distractors: ['Mã hóa mật khẩu người dùng', 'Tự cấp quyền truy cập tài liệu', 'Thay thế hoàn toàn dữ liệu gốc'],
    explanation: 'Embedding hỗ trợ tìm kiếm ngữ nghĩa bằng khoảng cách giữa các vector.', tags: ['rag', 'embedding']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 7), module: 'C', points: 2,
    prompt: `Khi câu hỏi không có đủ bằng chứng trong ${context.docs}, trợ lý RAG nên:`,
    correct: 'Nói rằng chưa đủ thông tin, trích dẫn phần có liên quan và đề nghị nguồn/người hỗ trợ phù hợp',
    distractors: ['Tự bịa câu trả lời cho trôi chảy', 'Ẩn việc thiếu nguồn', 'Luôn trả lời chắc chắn'],
    explanation: 'Khi bằng chứng thiếu, từ chối hoặc chuyển người an toàn hơn việc suy đoán.', tags: ['rag', 'groundedness']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 8), module: 'C', points: 2,
    prompt: `Với hành động có ảnh hưởng lớn đến quyền lợi người dùng, vai trò phù hợp của AI là:`,
    correct: 'Đưa ra gợi ý và bằng chứng; người có thẩm quyền kiểm tra và quyết định cuối',
    distractors: ['Tự quyết định mọi trường hợp', 'Xóa log để tránh tranh chấp', 'Công khai dữ liệu để cộng đồng bình chọn'],
    explanation: 'Human review cần thiết với quyết định rủi ro cao hoặc có hậu quả pháp lý/tài chính.', tags: ['human-in-the-loop', 'responsible-ai']
  }));
  questions.push(mcq({
    id: qid(examNo, 'C', 9), module: 'C', points: 2,
    prompt: `Sau khi triển khai một hệ thống AI, nhóm nên theo dõi tối thiểu:`,
    correct: 'Chất lượng đầu ra, lỗi, độ trễ, chi phí và phản hồi người dùng',
    distractors: ['Chỉ số dòng code', 'Chỉ số lượt tải trang chủ', 'Không cần theo dõi nếu demo chạy được'],
    explanation: 'Monitoring giúp phát hiện giảm chất lượng, lỗi vận hành và chi phí vượt dự kiến.', tags: ['deployment', 'monitoring']
  }));

  const docCount = 3000 + examNo * 500;
  questions.push(openQuestion({
    id: qid(examNo, 'C', 10), module: 'C', type: 'essay', points: 8,
    prompt: `Thiết kế một trợ lý RAG cho ${context.users} tra cứu khoảng ${docCount} ${context.docs}.\n\nRàng buộc:\n- Dữ liệu của ${context.teamA} không được hiển thị cho người chỉ thuộc ${context.teamB}, và ngược lại.\n- Câu trả lời phải ghi nguồn tài liệu.\n- Có 4 tuần để làm bản thử nghiệm.\n\nHãy trình bày: (1) vì sao chọn RAG và kiến trúc chính; (2) một ví dụ hỏi–đáp end-to-end; (3) cách triển khai và đánh giá. Không cần nêu công nghệ quá chuyên sâu.`,
    modelAnswer: `Có thể xây pipeline đơn giản gồm: đọc và làm sạch tài liệu; chia thành các đoạn vừa phải; gắn metadata nguồn, phiên bản và quyền ${context.teamA}/${context.teamB}; tạo embedding và lưu vào kho tìm kiếm. Khi người dùng hỏi, backend xác thực người dùng rồi lọc quyền trước khi retrieval. Chỉ các đoạn được phép mới được đưa vào prompt. Mô hình trả lời dựa trên các đoạn đó và ghi tên/link nguồn.\n\nVí dụ: một người thuộc ${context.teamA} hỏi một quy trình. Hệ thống lấy các đoạn thuộc quyền A, xếp hạng, tạo câu trả lời có citation; tài liệu riêng của B không được lấy ra.\n\nKế hoạch 4 tuần: tuần 1 chuẩn hóa dữ liệu và tạo bộ câu hỏi mẫu; tuần 2 làm retrieval; tuần 3 làm giao diện, phân quyền và citation; tuần 4 kiểm thử rồi pilot nhỏ. Đánh giá gồm tìm đúng tài liệu, câu trả lời bám nguồn, không rò rỉ giữa A/B, thời gian phản hồi và phản hồi người dùng. Khi thiếu bằng chứng, hệ thống nói chưa đủ thông tin.`,
    rubric: ['Giải thích đúng vai trò của RAG.', 'Có ingestion/chunking/embedding/retrieval/generation ở mức cơ bản.', `Phân quyền ${context.teamA}/${context.teamB} được thực thi trước khi đưa tài liệu vào prompt.`, 'Có ví dụ end-to-end và citation.', 'Có kế hoạch 4 tuần cùng cách đánh giá.'],
    tags: ['rag', 'access-control', 'essay']
  }));

  questions.push(openQuestion({
    id: qid(examNo, 'C', 11), module: 'C', type: 'essay', points: 8,
    prompt: `Thiết kế ${context.faq} dùng mô hình ngôn ngữ.\n\nRàng buộc:\n- Không gửi dữ liệu nhạy cảm thô cho dịch vụ bên ngoài.\n- Câu hỏi FAQ có thể trả lời tự động; thay đổi thông tin tài khoản, hoàn tiền hoặc quyết định có ảnh hưởng lớn phải chuyển người có thẩm quyền.\n- Phản hồi FAQ cần nhanh và có giới hạn chi phí.\n\nHãy trình bày: (1) cách phân luồng yêu cầu; (2) một ví dụ hội thoại; (3) cách triển khai, kiểm thử và giám sát.`,
    modelAnswer: `Gateway nhận câu hỏi, xác thực phiên và phân loại intent. Câu FAQ dùng kho tài liệu đã duyệt để trả lời. Dữ liệu nhạy cảm được loại bỏ hoặc thay bằng mã trước khi gửi ra ngoài; dữ liệu thật chỉ được xử lý trong hệ thống được phép. Những yêu cầu thay đổi tài khoản, hoàn tiền hoặc quyết định rủi ro cao không được LLM tự thực hiện mà phải tạo phiếu/chuyển nhân viên.\n\nVí dụ: người dùng hỏi giờ làm việc, hệ thống trả lời từ FAQ kèm nguồn. Nếu người dùng yêu cầu đổi số điện thoại, hệ thống giải thích cần xác minh và chuyển sang luồng người xử lý.\n\nTriển khai bằng một router đơn giản, RAG cho FAQ, bộ lọc dữ liệu nhạy cảm và cơ chế handoff. Kiểm thử bằng bộ câu hỏi thường gặp, câu chứa dữ liệu nhạy cảm và yêu cầu vượt quyền. Theo dõi độ đúng, tỷ lệ chuyển người, độ trễ, chi phí và lỗi.`,
    rubric: ['Có phân luồng FAQ và yêu cầu nhạy cảm.', 'Không gửi dữ liệu nhạy cảm thô ra ngoài.', 'Có human handoff cho hành động rủi ro cao.', 'Có ví dụ hội thoại cụ thể.', 'Có đánh giá độ đúng, latency, cost và monitoring.'],
    tags: ['llm', 'privacy', 'human-in-the-loop', 'essay']
  }));

  questions.push(openQuestion({
    id: qid(examNo, 'C', 12), module: 'C', type: 'essay', points: 8,
    prompt: `Xây dựng một mô hình đơn giản để ${context.classifier}.\n\nRàng buộc:\n- Có khoảng ${4000 + examNo * 300} mẫu đã gắn nhãn.\n- Dữ liệu có thể hơi lệch giữa các lớp.\n- Cần giải thích cách chia dữ liệu, chọn chỉ số và đưa mô hình thành API thử nghiệm.\n\nHãy trình bày: (1) lựa chọn baseline và lý do; (2) một ví dụ input/output; (3) cách triển khai, đánh giá và theo dõi sau khi đưa vào dùng thử.`,
    modelAnswer: `Bắt đầu bằng baseline dễ kiểm tra như logistic regression, cây quyết định nhỏ hoặc một mô hình phù hợp loại dữ liệu. Làm sạch dữ liệu, mã hóa đặc trưng và chia train/validation/test; nếu dữ liệu có thời gian thì chia theo thời gian để tránh dùng tương lai. Với lớp lệch, ngoài accuracy cần xem precision, recall và confusion matrix.\n\nVí dụ: một ticket mới được biến đổi thành đặc trưng, mô hình trả nhãn và xác suất. Nếu xác suất thấp, chuyển người kiểm tra thay vì tự động xử lý.\n\nĐóng gói preprocessing và model thành một API nhỏ, kiểm tra input, lưu version, chạy pilot với phạm vi hạn chế. Theo dõi chất lượng theo dữ liệu có nhãn mới, tỷ lệ lỗi, độ trễ và trường hợp người dùng sửa kết quả; có thể quay lại baseline cũ nếu chất lượng giảm.`,
    rubric: ['Chọn baseline hợp lý và giải thích được.', 'Có train/validation/test và tránh leakage ở mức cơ bản.', 'Dùng precision/recall bên cạnh accuracy khi lớp lệch.', 'Có ví dụ input/output và ngưỡng chuyển người.', 'Có API thử nghiệm, version, monitoring và rollback đơn giản.'],
    tags: ['machine-learning', 'deployment', 'essay']
  }));

  return questions;
}

export function buildModuleD(examNo) {
  const context = neutralContexts[examNo - 1];
  return [
    mcq({ id: qid(examNo,'D',1), module:'D', points:1.25,
      prompt:'Một trợ lý AI của ngân hàng chỉ cần kiểm tra trạng thái hồ sơ nhưng được cấp quyền đọc toàn bộ dữ liệu khách hàng. Nguyên tắc phù hợp nhất là:',
      correct:'Chỉ cấp đúng dữ liệu và thao tác cần cho nhiệm vụ',
      distractors:['Cấp toàn quyền để tránh lỗi thiếu dữ liệu','Đưa mật khẩu vào prompt','Tắt audit log'],
      explanation:'Quyền truy cập nên được giới hạn theo nhiệm vụ để giảm rủi ro lộ dữ liệu.', tags:['least-privilege','banking'] }),
    mcq({ id: qid(examNo,'D',2), module:'D', points:1.25,
      prompt:`Dữ liệu của ${context.teamA} bị hạn chế đối với ${context.teamB}. Cách bảo vệ đúng nhất là:`,
      correct:'Kiểm tra quyền ở server hoặc lớp dữ liệu và chỉ trả bản ghi được phép xem',
      distractors:['Tải toàn bộ về trình duyệt rồi ẩn bằng CSS','Chỉ nhắc LLM không được tiết lộ','Đổi tên cột dữ liệu'],
      explanation:'Phân quyền phải được thực thi trước khi dữ liệu rời lớp tin cậy.', tags:['authorization','privacy'] }),
    mcq({ id: qid(examNo,'D',3), module:'D', points:1.25,
      prompt:'Một trợ lý ngân hàng không chắc câu trả lời và trả sai có thể gây hậu quả pháp lý hoặc tài chính. Hệ thống nên:',
      correct:'Nêu rằng chưa chắc chắn và chuyển tới nhân viên có thẩm quyền',
      distractors:['Tự chọn câu trả lời nghe hợp lý nhất','Ẩn nguồn để người dùng không kiểm tra','Thực hiện luôn giao dịch'],
      explanation:'Trong tình huống rủi ro cao, từ chối và chuyển người an toàn hơn suy đoán.', tags:['banking','escalation'] }),
    mcq({ id: qid(examNo,'D',4), module:'D', points:1.25,
      prompt:'Nhóm muốn demo chatbot FAQ. Cách dùng dữ liệu phù hợp nhất là:',
      correct:'Dùng dữ liệu tổng hợp hoặc đã khử định danh và chỉ giữ trường cần thiết',
      distractors:['Dùng toàn bộ dữ liệu giao dịch thật','Đăng dữ liệu lên kho công khai','In dữ liệu nhạy cảm vào log'],
      explanation:'Demo FAQ thường không cần dữ liệu cá nhân thật; nên tối thiểu hóa dữ liệu.', tags:['data-minimization','privacy'] }),
    mcq({ id: qid(examNo,'D',5), module:'D', points:1.25,
      prompt:'Mô hình đề xuất từ chối một yêu cầu có ảnh hưởng lớn đến người dùng. Thiết kế phù hợp là:',
      correct:'AI đưa gợi ý và lý do; người có thẩm quyền xem xét quyết định cuối',
      distractors:['Cho AI tự quyết mọi trường hợp','Xóa log để tránh tranh chấp','Công khai dữ liệu người dùng'],
      explanation:'Quyết định có tác động lớn cần human review và trách nhiệm rõ ràng.', tags:['human-oversight','responsible-ai'] }),
    mcq({ id: qid(examNo,'D',6), module:'D', points:1.25,
      prompt:'Audit log cho một lần AI truy cập hồ sơ nên ưu tiên ghi:',
      correct:'Ai hoặc dịch vụ nào truy cập, lúc nào, tài nguyên nào, kết quả và trace ID; che dữ liệu nhạy cảm',
      distractors:['Mật khẩu và API key','Toàn bộ hồ sơ thô trong mọi log','Không ghi gì'],
      explanation:'Audit cần đủ để truy vết nhưng không nên trở thành nơi chứa secret hoặc dữ liệu thô.', tags:['audit','privacy'] }),
    mcq({ id: qid(examNo,'D',7), module:'D', points:1.25,
      prompt:'Để kiểm tra mô hình có hoạt động kém rõ rệt với một nhóm người dùng hay không, nên:',
      correct:'So sánh các chỉ số lỗi theo nhóm và kiểm tra nguyên nhân nếu có chênh lệch',
      distractors:['Chỉ xem accuracy chung','Chọn nhóm có kết quả tốt nhất để báo cáo','Mặc định mô hình luôn công bằng'],
      explanation:'Chỉ số tổng có thể che giấu khác biệt giữa các nhóm.', tags:['fairness','evaluation'] }),
    mcq({ id: qid(examNo,'D',8), module:'D', points:1.25,
      prompt:'Phát hiện chatbot đã trả nhầm dữ liệu nhạy cảm cho người không có quyền. Hành động đầu tiên phù hợp nhất là:',
      correct:'Giới hạn luồng bị ảnh hưởng, giữ log và kích hoạt quy trình xử lý sự cố',
      distractors:['Tiếp tục chạy để thu thêm ví dụ','Xóa mọi bằng chứng','Đổ lỗi cho người dùng'],
      explanation:'Cần ngăn rò rỉ tiếp diễn, giữ bằng chứng và xử lý theo quy trình sự cố.', tags:['incident-response','privacy'] })
  ];
}
