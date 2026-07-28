# AI-TEST — Bộ đề cương ôn tập AI thực chiến

![AI in Action - The nationwide AI talent network](docs/assets/ai-in-action.png)

Web app self-host/local host để luyện đề theo dạng chọn đáp án, xem đúng/sai, xem đáp án đúng, giải thích và thống kê cuối bài.

> **Disclaimer:** Đây là tài liệu ôn tập cộng đồng, không phải đề thi chính thức hoặc đề bị lộ. Bộ khóa mới tái cấu trúc nội dung từ phản hồi không chính thức của người học, thông tin tuyển sinh công khai và các chủ đề kỹ thuật phổ biến; không cam kết giống đề thật.

## Quy mô hiện tại

- **10 đề cũ × 60 câu = 600 câu**, giữ nguyên collection công khai.
- **10 đề mô phỏng khóa mới × 60 câu = 600 câu**, nằm sau cổng vương miện.
- Tổng cộng **20 đề, 1.200 câu**.
- Đề 02–10 được đóng gói trong bundle nén/base64 và materialize tự động trước khi dev, validate hoặc build.
- Mỗi đề 100 điểm, thời lượng gợi ý 90 phút.
- Practice mode, Exam mode, timer, localStorage, self-grade và thống kê cuối bài.
- Xem ma trận phủ nội dung chi tiết tại [`docs/NEW_EXAM_COVERAGE.md`](docs/NEW_EXAM_COVERAGE.md).

## Truy cập bộ khóa mới

Bộ mới không xuất hiện trong danh sách mặc định. Nhấn biểu tượng **vương miện ở góc dưới bên phải**, nhập mật khẩu được cấp, sau đó chọn một trong 10 đề mới. Bộ cũ vẫn giữ nguyên và có nút quay lại.

Cổng này chỉ là lớp ẩn khỏi luồng sử dụng thông thường. Vì ứng dụng và repo đều công khai, đây không phải access control thực sự. Muốn bảo vệ nội dung nghiêm túc cần xác thực phía server và chỉ tải đề sau khi được cấp quyền.

## Cấu trúc bộ cũ

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 10 | Toán học & tư duy định lượng |
| B | 22 | Python / NumPy / Pandas, gồm code tay |
| C | 20 | AI & tư duy sản phẩm AI |
| D | 8 | Logic / đạo đức / hành vi |

## Cấu trúc mỗi đề khóa mới 2026

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 20 | Xác suất, Bayes, đại số tuyến tính và ma trận |
| B | 20 | 18 MCQ Euclid/Python API/NumPy + 2 câu code/giải thích |
| C | 12 | 9 MCQ AI/RAG/MLOps + đúng 3 câu tự luận theo ràng buộc |
| D | 8 | Privacy, phân quyền dữ liệu, banking và Responsible AI |

Các câu toán dùng số nhỏ, phân số gọn hoặc ma trận đơn giản để có thể giải bằng giấy nháp, không cần máy tính cầm tay.

## 10 đề mới được phân vai

| Đề | Trọng tâm |
|---:|---|
| 01 | Nền tảng Bayes, ma trận, Requests, NumPy, RAG và banking AI |
| 02 | Xác suất điều kiện, API bền vững, RAG phân quyền, risk ranking và OCR |
| 03 | Tổ hợp, vector, chatbot đa ngôn ngữ, computer vision và virtual tutor |
| 04 | Ma trận/hệ tuyến tính, API security, chống lừa đảo và IT agent |
| 05 | Sampling, idempotency, RAG đa tenant, trợ lý lâm sàng và versioning |
| 06 | Expected risk, NumPy linalg, voice bot, credit fairness và graph AML |
| 07 | Eigen/vector, polling, agent sandbox, Go tutor và personalization |
| 08 | Bayesian tables, cursor API, KYC multimodal, legal chatbot và maintenance |
| 09 | Markov/temporal graph, forecasting, ScamGraph và research agents |
| 10 | Đề tổng hợp khó: pilot 6 tuần, privacy-preserving RAG và incident rollback |

## Căn cứ biên soạn

Thông tin công khai của VinUni mô tả vòng đánh giá năng lực đầu vào gồm tư duy logic, lập trình và dữ liệu cơ bản, cùng xử lý tình huống thực tiễn. Blueprint chi tiết 4 module trong collection mới dựa thêm trên phản hồi không chính thức của người thi gần đây, nên chỉ được dùng như một phạm vi ôn tập linh hoạt.

Nội dung kỹ thuật và quản trị được đối chiếu với:

- [VinUni — Thông tin tuyển sinh Chương trình Đào tạo Nhân tài AI Thực chiến, khóa cơ bản](https://vinuni.edu.vn/vi/thong-tin-tuyen-sinh-chuong-trinh-dao-tao-nhan-tai-ai-thuc-chien-khoa-co-ban/)
- [Requests Quickstart](https://requests.readthedocs.io/en/stable/user/quickstart/)
- [NumPy User Guide](https://numpy.org/doc/stable/user/)
- [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OWASP GenAI Security Project / LLM Top 10](https://genai.owasp.org/llm-top-10/)
- [Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=) và [Nghị định 356/2025/NĐ-CP](https://vanban.chinhphu.vn/?classid=1&docid=216387&pageid=27160)

Bộ câu hỏi không kiểm tra số điều luật cụ thể và không thay thế tư vấn pháp lý. Các tình huống tập trung vào least privilege, data minimization, server-side authorization, audit, abstention, human approval và rollback.

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
npm run build
```

Validator kiểm tra:

- Mỗi đề đúng 60 câu và 100 điểm.
- Bộ cũ có phân bố A/B/C/D là 10/22/20/8.
- Bộ mới có phân bố A/B/C/D là 20/20/12/8.
- Bộ mới có đúng 2 câu code ở Module B và đúng 3 câu tự luận ở Module C.
- Hỗ trợ cả đề module hóa và đề JSON hoàn chỉnh; đề module hóa phải giữ đúng ranh giới A/B/C/D.
- Không cho phép trùng `question.id` toàn repo hoặc trùng nguyên văn prompt giữa các đề khóa mới.
- MCQ có đủ A/B/C/D, đáp án hợp lệ và giải thích.
- Câu code/tự luận có `modelAnswer` và ít nhất 3 tiêu chí rubric.
- `moduleOverview` và `moduleLabels` hợp lệ nếu được khai báo.

## Cấu trúc dữ liệu

### Bộ cũ

Mỗi đề cũ là một file hoàn chỉnh trong:

```txt
src/data/exams/*.json
```

### Bộ khóa mới

Loader hỗ trợ hai layout để dễ bảo trì:

```txt
# Layout module hóa, đang dùng cho Đề 01
src/data/new-exams/new-2026-01/
├── exam.json
├── module-a.json
├── module-b.json
├── module-c.json
└── module-d.json

# Đề 02–10 được materialize tự động từ bundle nén/base64
src/data/new-exams/bundle/
├── exams-02-10.json.gz.b64.part-00
├── exams-02-10.json.gz.b64.part-01
├── ...
└── exams-02-10.json.gz.b64.part-13
```

Chạy `npm run materialize:new-exams` để tạo `new-2026-02.json` đến `new-2026-10.json`. Các lifecycle `predev`, `prevalidate` và `prebuild` đã tự chạy bước này, nên người dùng bình thường không cần thao tác riêng. App sau đó tải cả layout module hóa và các file hoàn chỉnh qua `src/data/new-exams/index.ts`. Validator áp dụng cùng schema 60 câu, 100 điểm và phân bố module cho mọi đề.

## Build self-host

```bash
npm run build
npm run preview
```

Thư mục build nằm ở `dist/`.

## GitHub Actions

- `.github/workflows/validate-exams.yml`: chạy `npm ci`, `npm run validate` và `npm run build` trên pull request.
- `.github/workflows/deploy-pages.yml`: build và deploy GitHub Pages khi `main` được cập nhật.
- PR có thay đổi code hoặc validator cần maintainer review; đóng góp chỉ sửa đề/tài liệu vẫn đi qua kiểm tra schema/build.

## Đóng góp

Xem `CONTRIBUTING.md`, `docs/EXAM_SCHEMA.md` và `docs/NEW_EXAM_COVERAGE.md`.

Có thể đóng góp thêm đề, sửa đáp án, cải thiện giải thích và UI/UX. Mọi nội dung nên giữ disclaimer rõ, không tự nhận là đề chính thức.
