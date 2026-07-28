# AI-TEST - Bộ đề cương ôn tập AI thực chiến

![AI in Action - The nationwide AI talent network](docs/assets/ai-in-action.png)

Web app tự host để luyện đề theo dạng trắc nghiệm, code tay và tự luận. App hỗ trợ Practice mode, Exam mode, timer, lưu tiến độ, tự chấm câu mở và thống kê theo module.

> **Lưu ý:** Đây là tài liệu ôn tập cộng đồng, không phải đề thi chính thức hoặc đề bị lộ. Bộ khóa mới được xây dựng từ phản hồi không chính thức của người học, thông tin công khai và các chủ đề kỹ thuật phổ biến. Không cam kết giống đề thật.

## Quy mô

- Bộ cũ: **10 đề × 60 câu = 600 câu**, giữ nguyên collection công khai.
- Bộ Crown 2026: **10 đề × 60 câu = 600 câu**.
- Toàn repo: **20 đề, 1.200 câu**.
- Mỗi đề 100 điểm, thời lượng gợi ý 90 phút.
- Bộ Crown có tổng cộng **30 câu tự luận** và **20 câu code**.

Xem ma trận phủ nội dung tại [`docs/NEW_EXAM_COVERAGE.md`](docs/NEW_EXAM_COVERAGE.md).

## Truy cập bộ Crown

Ở collection mặc định, nhấn biểu tượng vương miện ở góc dưới bên phải. Frontend gửi mật khẩu qua HTTPS tới Cloudflare Worker. Mật khẩu và hash dùng để kiểm tra không nằm trong repo hoặc bundle trình duyệt.

Cơ chế này bảo vệ **mật khẩu** khỏi việc đọc source và dò offline. Câu hỏi, đáp án và code frontend vẫn là dữ liệu public theo chủ ý của dự án, nên người có kỹ thuật có thể sửa giao diện để bỏ qua màn hình Crown. Việc đó không làm lộ mật khẩu vì xác minh diễn ra phía máy chủ.

Tài liệu triển khai chi tiết:

- [`docs/CROWN_SECURITY.md`](docs/CROWN_SECURITY.md)
- [`workers/crown-auth/README.md`](workers/crown-auth/README.md)

## Cấu trúc mỗi đề Crown 2026

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 20 | Xác suất, Bayes, đại số tuyến tính và ma trận |
| B | 20 | 18 MCQ Euclid, Python API, NumPy và 2 câu code |
| C | 12 | 9 MCQ AI, RAG, MLOps và đúng 3 câu tự luận |
| D | 8 | Privacy, phân quyền, banking và Responsible AI |

Các câu toán dùng số nhỏ, phân số gọn hoặc ma trận đơn giản để có thể giải bằng giấy nháp, không cần máy tính cầm tay.

## Phạm vi 10 đề Crown

| Đề | Trọng tâm |
|---:|---|
| 01 | Bayes, ma trận, Requests, NumPy, RAG ngân hàng và fraud |
| 02 | Xác suất điều kiện, API bền vững, RAG phân quyền, risk ranking và OCR |
| 03 | Tổ hợp, vector, chatbot đa ngôn ngữ, computer vision và virtual tutor |
| 04 | Hệ tuyến tính, API security, chống lừa đảo và IT operations agent |
| 05 | Sampling, idempotency, RAG đa tenant, clinical AI và rollback |
| 06 | Expected risk, NumPy linalg, voice bot, credit fairness và graph AML |
| 07 | Trị riêng, polling, agent sandbox, Go tutor và personalization |
| 08 | Bayesian table, cursor API, KYC multimodal, legal assistant và maintenance |
| 09 | Markov, temporal graph, forecasting, provenance và research agent |
| 10 | Đề tổng hợp khó, pilot 6 tuần, privacy-preserving RAG và incident response |

## Dữ liệu đề và bộ sinh

Đề 01 dùng layout module hóa:

```text
src/data/new-exams/new-2026-01/
├── exam.json
├── module-a.json
├── module-b.json
├── module-c.json
└── module-d.json
```

Đề 02 đến Đề 10 được sinh xác định từ bộ sinh trong:

```text
scripts/exam-generator/generator.mjs.gz.b64.part-00
scripts/exam-generator/generator.mjs.gz.b64.part-01
...
scripts/materialize-new-exams.mjs
```

Chạy:

```bash
npm run materialize:new-exams
```

để tạo `src/data/new-exams/new-2026-02.json` đến `new-2026-10.json`. Các file đầu ra được đưa vào `.gitignore`. `predev`, `prevalidate` và `prebuild` tự chạy materializer, nên người dùng bình thường không cần gọi riêng.

Loader tại `src/data/new-exams/index.ts` hỗ trợ đồng thời layout module hóa và file JSON hoàn chỉnh.

## Chạy local

```bash
npm install
npm run dev
```

Mặc định Vite thường chạy tại:

```text
http://localhost:5173
```

Để thử Crown Worker local:

```bash
cd workers/crown-auth
cp .dev.vars.example .dev.vars
npx wrangler dev
```

Ở terminal khác:

```bash
VITE_CROWN_AUTH_URL=http://localhost:8787 npm run dev
```

## Validate và build

```bash
npm run validate
npm run test:crown-worker
npm run build
```

Validator kiểm tra:

- Đúng 10 đề cũ, 10 đề Crown và tổng cộng 1.200 câu.
- Collection Crown có đúng 600 câu, 30 essay và 20 câu code.
- Mỗi đề Crown có phân bố A/B/C/D là 20/20/12/8.
- Mỗi đề Crown có đúng 2 câu code ở B và 3 câu tự luận ở C.
- Không trùng `exam.id`, `question.id` hoặc nguyên văn prompt giữa các đề Crown.
- MCQ Crown có đủ A/B/C/D, lựa chọn không trùng, đáp án và giải thích hợp lệ.
- Câu code và tự luận có đáp án mẫu cùng rubric tối thiểu 3 ý.
- Bộ cũ vẫn được kiểm tra theo schema cũ mà không ép các quy tắc mới hồi tố.

## Kích hoạt bảo mật Crown trên production

Tạo GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CROWN_PASSWORD`
- `CROWN_TOKEN_SECRET`, tối thiểu 32 ký tự ngẫu nhiên

Chạy workflow **Deploy Crown authentication Worker**. Sau khi có URL Worker, tạo repository variable:

```text
CROWN_AUTH_URL=https://ai-test-crown-auth.<subdomain>.workers.dev
```

Sau đó chạy lại workflow GitHub Pages. Không đưa mật khẩu hoặc token signing secret vào biến `VITE_*`, source code, `.env` đã commit hoặc log CI.

## GitHub Actions

- `.github/workflows/validate-exams.yml`: materialize, validate 1.200 câu, test Crown Worker và build app trên pull request.
- `.github/workflows/deploy-crown-worker.yml`: deploy Worker và upload hai secret phía máy chủ.
- `.github/workflows/deploy-pages.yml`: build và deploy GitHub Pages. Nếu chưa có `CROWN_AUTH_URL`, app vẫn deploy nhưng Crown báo chưa được cấu hình.

## Căn cứ biên soạn

- [VinUni - Thông tin tuyển sinh Chương trình Đào tạo Nhân tài AI Thực chiến](https://vinuni.edu.vn/vi/thong-tin-tuyen-sinh-chuong-trinh-dao-tao-nhan-tai-ai-thuc-chien-khoa-co-ban/)
- [Requests Quickstart](https://requests.readthedocs.io/en/stable/user/quickstart/)
- [NumPy User Guide](https://numpy.org/doc/stable/user/)
- [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OWASP GenAI Security Project](https://genai.owasp.org/llm-top-10/)
- [Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=)

Bộ câu hỏi không thay thế tư vấn pháp lý. Các tình huống tập trung vào least privilege, data minimization, server-side authorization, audit, abstention, human approval và rollback.

## Đóng góp

Xem `CONTRIBUTING.md`, `docs/EXAM_SCHEMA.md` và `docs/NEW_EXAM_COVERAGE.md`. Mọi nội dung nên giữ disclaimer rõ ràng và không tự nhận là đề chính thức.
