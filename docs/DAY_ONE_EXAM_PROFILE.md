# Hồ sơ ôn tập theo phản hồi ngày thi đầu tiên

Tài liệu nội bộ này mô tả phạm vi của Đề Crown 14–16. Đây là đề ôn tập được biên soạn từ phản hồi người thi, không phải bản sao hoặc đề thi chính thức.

## Dữ liệu được bóc tách

- 60 câu, vẫn chia 4 module.
- Khoảng 10 câu điền/code/tự luận, nên yêu cầu quản lý thời gian và trình bày ngắn có cấu trúc.
- Module A: định thức, rank của ma trận, update bias theo gradient descent.
- Module B: đọc code Python; NumPy nhân từng phần tử, nhân ma trận, cộng và xác định shape sau broadcasting.
- Module C: nhiệm vụ của LLM; các tác vụ thường gặp của ChatGPT/Claude; bài toán sàng lọc ung thư có accuracy cao nhưng precision/recall thấp; lựa chọn metric; RAG so với fine-tune LLM mã nguồn mở; kiến trúc RAG cho chatbot nội bộ.
- Module D: cách góp ý chuyên nghiệp khi senior đề xuất một hướng sai hoặc rủi ro.

## Cấu trúc Đề 14–16

| Module | Tổng câu | Câu điền/code/tự luận | Trọng tâm |
|---|---:|---:|---|
| A | 20 | 2 | det/rank và cập nhật bias |
| B | 20 | 3 | broadcasting, `*` so với `@`, shape và trace Python |
| C | 12 | 4 | LLM, metrics ung thư, RAG/fine-tune, kiến trúc RAG |
| D | 8 | 1 | challenge/escalate hướng sai của senior |
| **Tổng** | **60** | **10** | **100 điểm, 90 phút** |

Ba đề giữ cùng phạm vi nhưng đổi ma trận, gradient, code trace, confusion matrix và ràng buộc tổ chức để người học hiểu cách làm thay vì học thuộc đáp án.

## Nguyên tắc chấm câu mở

- Chấp nhận cách diễn đạt khác đáp án mẫu nếu đúng ý và có lập luận.
- Câu tính toán cần công thức, thay số và kết quả.
- Câu code cần output/shape chính xác cùng giải thích state hoặc broadcasting.
- Câu kiến trúc cần flow end-to-end, quyền truy cập, citation, đánh giá và hành vi khi thiếu bằng chứng.
- Câu đạo đức cần tôn trọng, nêu rủi ro bằng chứng, đề xuất phương án thay thế và escalation khi cần.
