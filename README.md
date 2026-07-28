# AI-TEST — Bộ đề cương ôn tập AI thực chiến

![AI in Action - The nationwide AI talent network](docs/assets/ai-in-action.png)

Web app self-host/local host để luyện đề theo dạng chọn đáp án, xem đúng/sai, xem đáp án đúng, giải thích và thống kê cuối bài.

> **Disclaimer:** Đây là tài liệu ôn tập cộng đồng, không phải đề thi chính thức hoặc đề bị lộ. Bộ khóa mới chỉ tái cấu trúc nội dung từ phản hồi không chính thức của người học và các chủ đề kỹ thuật phổ biến; không cam kết giống đề thật.

## Tính năng

- Giữ nguyên 10 bài kiểm tra cũ, mỗi bài 60 câu.
- Thêm bộ mô phỏng khóa mới trong `src/data/new-exams/`.
- Bộ mới không xuất hiện trong danh sách mặc định. Nút vương miện cố định ở góc dưới màn hình mở cổng nhập mật khẩu.
- Sau khi mở khóa, bộ mới dùng nguyên cơ chế Practice mode, Exam mode, timer, localStorage, self-grade và thống kê cuối bài.
- Mỗi bài 100 điểm, thời lượng gợi ý 90 phút.
- Câu code/tự luận dùng đáp án mẫu, rubric và self-grade.
- GitHub Actions chạy validator và build khi có PR/push.

## Cấu trúc bộ cũ

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 10 | Toán học & tư duy định lượng |
| B | 22 | Python / NumPy / Pandas, gồm code tay |
| C | 20 | AI & tư duy sản phẩm AI |
| D | 8 | Logic / đạo đức / hành vi |

## Cấu trúc bộ mô phỏng khóa mới 2026

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 20 | Xác suất, Bayes, đại số tuyến tính và ma trận |
| B | 20 | Thuật toán Euclid, Python gọi API, đọc và giải thích NumPy; gồm 2 câu code |
| C | 12 | AI/ML, RAG, triển khai hệ thống; gồm đúng 3 câu tự luận theo ràng buộc |
| D | 8 | Privacy, phân quyền dữ liệu, banking và Responsible AI |

Các câu toán được thiết kế để giải bằng giấy nháp, không cần máy tính cầm tay.

## Căn cứ biên soạn bộ mới

Nội dung được đối chiếu với các tài liệu kỹ thuật và quản trị công khai:

- [Requests Quickstart](https://requests.readthedocs.io/en/stable/user/quickstart/): timeout, JSON và `raise_for_status()`.
- [NumPy User Guide](https://numpy.org/doc/stable/user/): shape, axis, broadcasting và indexing.
- [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence): quản trị rủi ro, đánh giá và giám sát AI.
- [OWASP GenAI Security Project / LLM Top 10](https://genai.owasp.org/llm-top-10/): prompt injection, sensitive information disclosure, excessive agency và rủi ro RAG.
- [Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=) và [Nghị định 356/2025/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=216387&pageid=27160): bối cảnh bảo vệ dữ liệu tại Việt Nam từ năm 2026.

Bộ câu hỏi không kiểm tra số điều luật cụ thể và không thay thế tư vấn pháp lý. Các tình huống tập trung vào nguyên tắc thiết kế an toàn như least privilege, data minimization, server-side authorization, audit, abstention và human approval.

## Chạy local

```bash
npm install
npm run dev
```

Mở URL Vite hiện trong terminal, thường là:

```txt
http://localhost:5173
```

## Kiểm tra dữ liệu đề

```bash
npm run validate
```

Validator kiểm tra:

- Mỗi đề đúng 60 câu và 100 điểm.
- Bộ cũ có phân bố A/B/C/D là 10/22/20/8.
- Bộ mới có phân bố A/B/C/D là 20/20/12/8.
- Bộ mới có đúng 2 câu code ở Module B và đúng 3 câu tự luận ở Module C.
- Từng file `module-a.json` đến `module-d.json` chỉ chứa câu của module tương ứng.
- MCQ có đủ A/B/C/D, đáp án hợp lệ và giải thích.
- Câu code/tự luận có `modelAnswer` và ít nhất 3 tiêu chí rubric.
- `moduleOverview` và `moduleLabels` hợp lệ nếu được khai báo.

## Build self-host

```bash
npm run build
npm run preview
```

Thư mục build nằm ở `dist/`.

## Cách thêm đề

### Bộ cũ

1. Copy `docs/exam-template.json` thành `src/data/exams/exam-11.json`.
2. Điền đủ 60 câu theo schema trong `docs/EXAM_SCHEMA.md`.
3. Chạy `npm run validate` và `npm run build`.

### Bộ mới

1. Tạo thư mục mới, ví dụ `src/data/new-exams/new-2026-02/`.
2. Tạo `exam.json` chỉ chứa metadata của đề, không chứa `questions`.
3. Tạo bốn file mảng câu hỏi: `module-a.json`, `module-b.json`, `module-c.json`, `module-d.json`.
4. Dùng phân bố module 20/20/12/8; đặt đúng 2 câu code ở B và đúng 3 câu tự luận ở C.
5. App tự ghép metadata với bốn module qua `src/data/new-exams/index.ts`.
6. Chạy `npm run validate` và `npm run build`.

## Về khóa bằng mật khẩu

Đây là web app tĩnh và repo công khai, nên cổng mật khẩu chỉ nhằm ẩn bộ mới khỏi luồng sử dụng thông thường. Mật khẩu được so sánh bằng SHA-256 phía trình duyệt để không lưu chuỗi rõ trong source, nhưng đây không phải cơ chế bảo mật thực sự. Muốn bảo vệ nội dung nghiêm túc cần xác thực phía server và chỉ tải file đề sau khi người dùng được cấp quyền.

## GitHub Actions / Auto-merge PR đóng góp đề

Repo có 2 workflow:

1. `.github/workflows/validate-exams.yml`
   - Chạy khi có PR/push.
   - `npm ci`, `npm run validate`, `npm run build`.

2. `.github/workflows/auto-merge-exam-pr.yml`
   - Chỉ tự bật auto-merge cho thay đổi thuộc phạm vi đóng góp đề/tài liệu được cho phép.
   - PR có thay đổi code giao diện hoặc validator vẫn cần maintainer review.

## Đóng góp

Xem `CONTRIBUTING.md` và `docs/EXAM_SCHEMA.md`.

Dự án mở miễn phí. Có thể đóng góp thêm đề, sửa đáp án, cải thiện giải thích và UI/UX.
