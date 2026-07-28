# Ma trận phủ nội dung bộ khóa mới 2026

Bộ Crown gồm 10 đề, mỗi đề 60 câu, tổng 600 câu. Mỗi đề giữ cùng cấu trúc 20/20/12/8 nhưng thay đổi dữ kiện, cách hỏi, tình huống triển khai và miền ứng dụng để tránh học thuộc một mẫu duy nhất.

| Đề | Module A: xác suất & đại số tuyến tính | Module B: thuật toán, API & NumPy | Module C: AI và 3 tự luận | Module D: privacy & Responsible AI |
|---:|---|---|---|---|
| 01 | Bayes xét nghiệm, xác suất cơ bản, ma trận 2×2 | Euclid, Requests, schema JSON, broadcasting | RAG ngân hàng, fraud ranking, banking assistant | ACL, dữ liệu nhạy cảm, audit, human approval |
| 02 | Bảng đếm Bayes, biến cố phụ thuộc, định thức | Retry/backoff, timeout, authorization, NumPy axis | RAG phân quyền, OCR pipeline, risk queue | Multi-tenant isolation, retention, incident handling |
| 03 | Tổ hợp, kỳ vọng, vector và trực giao | Đệ quy Euclid, batching, slicing, boolean mask | Chatbot đa ngôn ngữ, computer vision, virtual tutor | Consent, fairness theo nhóm, quyền truy cập học sinh |
| 04 | Hệ tuyến tính, nghịch đảo, rank | API security, validation, secret handling, matrix ops | Cảnh báo lừa đảo, OCR tài liệu, IT operations agent | Least privilege, escalation, audit hành động agent |
| 05 | Sampling, xác suất toàn phần, ma trận chuyển đổi | Idempotency, pagination, caching, NumPy aggregation | Multi-tenant RAG, trợ lý lâm sàng, MLOps rollback | Purpose limitation, versioning, quyền xóa dữ liệu |
| 06 | Expected loss, covariance cơ bản, linear transform | Voice API, error recovery, NumPy linalg | Voice bot, credit fairness, graph AML | Bias tín dụng, PII trong audio, human review |
| 07 | Trị riêng, vector riêng, cosine/dot product | Polling, async workflow, sandbox và shape | Agent sandbox, Go tutor, personalization | Tool permission, child/student data, safe fallback |
| 08 | Bayesian table, tổ hợp nhiều bước, matrix product | Cursor pagination, file API, multimodal tensors | Multimodal KYC, legal assistant, predictive maintenance | Biometric data, legal impact, explainability |
| 09 | Markov cơ bản, temporal transition, graph matrix | Streaming API, rate limit, time-series arrays | Forecasting, temporal graph, research agent | Provenance, hallucination, source licensing, rollback |
| 10 | Đề tổng hợp khó, Bayes nhiều bước, hệ ma trận | API end-to-end, defensive Python, NumPy tổng hợp | Pilot AI 6 tuần, privacy-preserving RAG, incident response | Governance, red-team, kill switch, phê duyệt cuối |

## Ràng buộc được kiểm tra tự động

- Đúng 10 đề và 600 câu.
- Mỗi đề: A=20, B=20, C=12, D=8.
- Mỗi đề có đúng 2 câu code ở B và đúng 3 câu tự luận ở C.
- Tổng cộng 20 câu code và 30 câu tự luận.
- Không trùng `question.id` toàn collection.
- Không trùng nguyên văn prompt giữa các đề mới.
- Mỗi MCQ có đủ A/B/C/D, lựa chọn không trùng và giải thích đáp án.

Các câu tự luận bắt buộc người làm lập luận theo ràng buộc, đưa ví dụ end-to-end và nêu cách triển khai, đánh giá, giám sát, bảo mật, human gate hoặc rollback phù hợp.
