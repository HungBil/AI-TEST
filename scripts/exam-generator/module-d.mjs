import { mcq, qid, neutralContexts } from './shared.mjs';

const dFactories = {
  leastPrivilege(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Một trợ lý AI chỉ cần kiểm tra trạng thái hồ sơ nhưng được cấp quyền đọc toàn bộ hệ thống ngân hàng. Nguyên tắc bị vi phạm rõ nhất là:',
      correct: 'Chỉ cấp quyền tối thiểu cần cho nhiệm vụ',
      distractors: ['Tăng số epoch', 'Data augmentation', 'Batch normalization'],
      explanation: 'Quyền truy cập phải giới hạn theo nhiệm vụ và phạm vi dữ liệu.',
      tags: ['privacy', 'banking'], skillId: 'privacy.least-privilege'
    });
  },
  groupAccess(examNo, id) {
    const context = neutralContexts[examNo - 1];
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: `Dữ liệu của ${context.teamA} bị hạn chế đối với ${context.teamB}. Cách bảo vệ đúng nhất là:`,
      correct: 'Kiểm tra quyền ở server/data layer và chỉ trả dữ liệu người dùng được phép xem',
      distractors: ['Tải toàn bộ về frontend rồi ẩn bằng CSS', 'Nhắc LLM không được đọc bằng prompt', 'Đổi tên cột để khó hiểu'],
      explanation: 'Authorization phải được thực thi trước khi dữ liệu rời lớp tin cậy.',
      tags: ['privacy', 'authorization'], skillId: 'privacy.access-control.group-isolation'
    });
  },
  dataMinimization(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Nhóm muốn demo chatbot FAQ nhưng định dùng bản sao đầy đủ dữ liệu thật gồm tên và số tài khoản. Lựa chọn phù hợp nhất là:',
      correct: 'Dùng dữ liệu tổng hợp hoặc đã khử định danh và chỉ giữ trường cần thiết',
      distractors: ['Dùng toàn bộ vì chỉ là demo', 'Đăng dữ liệu lên kho công khai', 'Đổi màu giao diện rồi giữ nguyên dữ liệu'],
      explanation: 'FAQ không cần dữ liệu giao dịch thật; data minimization giảm rủi ro.',
      tags: ['privacy', 'data-minimization'], skillId: 'privacy.data-minimization.demo-data'
    });
  },
  highRiskEscalate(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Trợ lý không chắc chắn về câu trả lời có thể ảnh hưởng đến quyết định pháp lý hoặc tài chính. Hệ thống nên:',
      correct: 'Nêu giới hạn, không bịa và chuyển người có thẩm quyền',
      distractors: ['Trả lời thật tự tin', 'Thực hiện giao dịch ngay', 'Ẩn nguồn để người dùng không biết'],
      explanation: 'Tình huống rủi ro cao và thiếu bằng chứng cần abstention và escalation.',
      tags: ['responsible-ai', 'escalation'], skillId: 'ai-responsibility.escalate-high-risk'
    });
  },
  humanApproval(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Mô hình đánh dấu một hồ sơ là rủi ro cao và đề xuất hành động ảnh hưởng lớn. Thiết kế phù hợp nhất là:',
      correct: 'AI đưa bằng chứng/đề xuất; người có thẩm quyền kiểm tra và phê duyệt',
      distractors: ['Cho AI tự thực hiện ngay', 'Xóa log để tránh tranh chấp', 'Công khai dữ liệu để cộng đồng bình chọn'],
      explanation: 'Score không phải quyết định cuối; hành động ảnh hưởng lớn cần human approval.',
      tags: ['responsible-ai', 'human-in-the-loop'], skillId: 'ai-responsibility.human-approval'
    });
  },
  auditLog(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Audit log cho một lần AI truy cập hồ sơ nên ưu tiên ghi:',
      correct: 'Ai/dịch vụ nào truy cập, thời gian, phạm vi, hành động, kết quả và trace ID; che dữ liệu nhạy cảm',
      distractors: ['Mật khẩu và API key', 'Toàn bộ hồ sơ thô', 'Không ghi gì'],
      explanation: 'Audit phải đủ truy vết nhưng không trở thành kho chứa secret hoặc PII thô.',
      tags: ['privacy', 'audit'], skillId: 'privacy.audit-log.minimal-traceability'
    });
  },
  fairnessCheck(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Để kiểm tra mô hình có hoạt động khác nhau giữa các nhóm người dùng, nhóm phát triển nên:',
      correct: 'So sánh precision/recall hoặc lỗi theo nhóm và kiểm tra cỡ mẫu',
      distractors: ['Chỉ xem accuracy chung', 'Chọn nhóm có kết quả tốt nhất để báo cáo', 'Xóa mọi thuộc tính và mặc định mô hình công bằng'],
      explanation: 'Chỉ số tổng có thể che giấu chênh lệch theo nhóm.',
      tags: ['responsible-ai', 'fairness'], skillId: 'ai-responsibility.evaluate-by-group'
    });
  },
  incidentResponse(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Phát hiện chatbot đã trả nhầm dữ liệu nhạy cảm cho người không có quyền. Hành động đầu tiên phù hợp nhất là:',
      correct: 'Dừng hoặc giới hạn luồng bị ảnh hưởng, giữ log và kích hoạt xử lý sự cố',
      distractors: ['Tiếp tục chạy để thu thêm ví dụ', 'Xóa bằng chứng rồi sửa âm thầm', 'Đổ lỗi cho người dùng'],
      explanation: 'Ưu tiên ngăn rò rỉ tiếp diễn và bảo toàn bằng chứng phục vụ điều tra.',
      tags: ['privacy', 'incident-response'], skillId: 'privacy.incident-response.initial-action'
    });
  },
  purposeLimitation(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Dữ liệu được thu thập để xử lý hỗ trợ kỹ thuật nhưng nhóm muốn dùng ngay cho quảng cáo cá nhân hóa. Việc cần làm trước tiên là:',
      correct: 'Kiểm tra mục đích, cơ sở cho phép và chỉ dùng dữ liệu trong phạm vi đã thông báo/được chấp thuận',
      distractors: ['Dùng ngay vì dữ liệu đã có', 'Ẩn tên cột rồi dùng', 'Đưa dữ liệu cho mọi nhóm'],
      explanation: 'Dữ liệu không nên bị dùng sang mục đích mới nếu chưa có cơ sở và thông báo phù hợp.',
      tags: ['privacy', 'purpose-limitation'], skillId: 'privacy.purpose-limitation'
    });
  },
  consent(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Một ứng dụng muốn thu thêm dữ liệu không cần thiết cho chức năng chính. Cách phù hợp nhất là:',
      correct: 'Giải thích rõ mục đích, cho người dùng lựa chọn phù hợp và không thu nếu không cần',
      distractors: ['Thu âm thầm vì người dùng đã cài app', 'Bắt buộc đồng ý mọi thứ', 'Đưa dữ liệu vào log công khai'],
      explanation: 'Thu thập phải minh bạch, có mục đích và giới hạn dữ liệu cần thiết.',
      tags: ['privacy', 'consent'], skillId: 'privacy.consent-and-transparency'
    });
  },
  sourceCitation(examNo, id) {
    return mcq({
      id, module: 'D', points: 1.25,
      prompt: 'Trợ lý AI trả lời một quy định nội bộ. Cách giúp người dùng kiểm chứng tốt nhất là:',
      correct: 'Kèm nguồn tài liệu và phiên bản hoặc ngày hiệu lực',
      distractors: ['Chỉ tăng độ tự tin của câu trả lời', 'Ẩn tài liệu nguồn', 'Dùng câu trả lời dài hơn'],
      explanation: 'Citation và phiên bản giúp người dùng đối chiếu thông tin.',
      tags: ['responsible-ai', 'citation'], skillId: 'ai-responsibility.source-citation'
    });
  }
};

export function buildModuleD(examNo, blueprint) {
  return blueprint.dSkills.map((skill, index) => {
    const factory = dFactories[skill];
    if (!factory) throw new Error(`Không có factory Module D: ${skill}`);
    return factory(examNo, qid(examNo, 'D', index + 1));
  });
}
