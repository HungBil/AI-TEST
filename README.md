# AI-TEST — Bộ đề cương ôn tập AI thực chiến

![AI in Action - The nationwide AI talent network](docs/assets/ai-in-action.png)

Web app tự host để luyện đề trắc nghiệm, code tay và tự luận. App có Practice mode, Exam mode, timer, lưu tiến độ, tự chấm câu mở và thống kê theo module.

> **Lưu ý:** Đây là tài liệu ôn tập cộng đồng, không phải đề thi chính thức hoặc đề bị lộ. Bộ Crown được biên soạn bám theo phản hồi không chính thức của người thi gần đây; các biến thể chỉ xoay quanh phạm vi đó, không lấy nội dung từ dự án cá nhân của maintainer.

## Baseline dùng để biên soạn bộ Crown

Thông tin đầu vào được giữ ở phạm vi hẹp:

- 60 câu, chia 4 module.
- Module 1: thuần xác suất và đại số tuyến tính phần ma trận; không có giải tích.
- Câu toán cần giấy nháp nhưng không cần máy tính cầm tay.
- Module 2: thuật toán Euclid, Python gọi API và đọc/giải thích code NumPy.
- Module 3: có đúng 3 câu tự luận; cả ba đều yêu cầu lập luận, ví dụ và cách triển khai theo ràng buộc đề bài.
- Module 4: các tình huống cơ bản về dữ liệu nhạy cảm, banking, privacy, quyền truy cập giữa nhóm A/B và trách nhiệm khi AI trả lời sai.

Không mở rộng sang temporal graph, graph AML, KYC đa phương thức, voice bot, agent nghiên cứu, Go tutor hoặc các chủ đề lấy từ dự án riêng của người dùng.

## Quy mô

- Bộ cũ: **10 đề × 60 câu = 600 câu**.
- Bộ Crown mới: **10 đề × 60 câu = 600 câu**.
- Toàn repo: **20 đề, 1.200 câu**.
- Mỗi đề Crown có 20 câu Module A, 20 câu Module B, 12 câu Module C và 8 câu Module D.
- Mỗi đề Crown có đúng 2 câu code ở Module B và 3 câu tự luận ở Module C.

## Cấu trúc mỗi đề Crown

| Module | Số câu | Phạm vi |
|---|---:|---|
| A | 20 | 10 câu xác suất và 10 câu ma trận; số nhỏ, tính được bằng giấy nháp |
| B | 20 | Euclid, Requests/API, NumPy; gồm 2 câu code hoặc giải thích code |
| C | 12 | AI/ML cơ bản, RAG cơ bản, triển khai; gồm đúng 3 tự luận |
| D | 8 | Đạo đức AI, banking, privacy, phân quyền dữ liệu và human review |

Mười đề dùng cùng blueprint và chỉ thay đổi số liệu, cách diễn đạt và bối cảnh trung tính ở mức vừa phải. Một số khái niệm nền tảng có thể lặp lại giữa các đề để tránh tạo độ khó giả bằng cách nhồi thêm chủ đề ngoài baseline.

Xem chi tiết tại [`docs/NEW_EXAM_COVERAGE.md`](docs/NEW_EXAM_COVERAGE.md).

## Bộ sinh đề

Mười đề Crown được sinh xác định từ các file dễ đọc trong:

```text
scripts/exam-generator/
├── shared.mjs
├── module-a.mjs
├── module-b.mjs
├── module-cd.mjs
└── baseline-generator.mjs
```

Chạy:

```bash
npm run materialize:new-exams
```

để tạo:

```text
src/data/new-exams/new-2026-01.json
...
src/data/new-exams/new-2026-10.json
```

Các file JSON đầu ra nằm trong `.gitignore`. `predev`, `prevalidate` và `prebuild` tự chạy materializer.

## Chạy local

```bash
npm install
npm run dev
```

Thường mở tại:

```text
http://localhost:5173
```

## Validate và build

```bash
npm run validate
npm run test:crown-worker
npm run build
```

Validator kiểm tra:

- Đúng 10 đề Crown và 600 câu.
- Mỗi đề đúng phân bố 20/20/12/8 và tổng 100 điểm.
- Mỗi đề có đúng 2 câu code ở B và 3 câu essay ở C.
- ID đề/câu không trùng; MCQ có đủ A/B/C/D và đáp án hợp lệ.
- Tổng collection Crown có 30 câu tự luận và 20 câu code.
- Bộ cũ vẫn được kiểm tra theo schema legacy riêng.

## Truy cập Crown và bảo vệ mật khẩu

Nhấn biểu tượng vương miện ở góc dưới bên phải. Frontend gửi mật khẩu qua HTTPS tới Cloudflare Worker; mật khẩu và verifier không nằm trong bundle trình duyệt hiện tại.

Cơ chế này bảo vệ **mật khẩu**, không bảo vệ nội dung đề. Câu hỏi và đáp án vẫn public theo chủ ý của dự án, nên người có kỹ thuật có thể đọc dữ liệu hoặc sửa frontend để bỏ qua màn hình Crown. Việc đó không giúp suy ra mật khẩu mới vì xác minh diễn ra phía máy chủ.

Tài liệu triển khai:

- [`docs/CROWN_SECURITY.md`](docs/CROWN_SECURITY.md)
- [`workers/crown-auth/README.md`](workers/crown-auth/README.md)

Cần đặt các repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
CROWN_PASSWORD
CROWN_TOKEN_SECRET
```

Sau khi deploy Worker, đặt repository variable:

```text
CROWN_AUTH_URL=https://ai-test-crown-auth.<subdomain>.workers.dev
```

Không tái sử dụng mật khẩu Crown cũ từng có verifier trong lịch sử Git.

## GitHub Actions

- `validate-exams.yml`: materialize, validate 1.200 câu, test Crown Worker và build app.
- `deploy-crown-worker.yml`: deploy Worker và cấu hình secret phía máy chủ.
- `deploy-pages.yml`: build và deploy GitHub Pages.

## Đóng góp

Xem `CONTRIBUTING.md`, `docs/EXAM_SCHEMA.md` và `docs/NEW_EXAM_COVERAGE.md`. Mọi nội dung mới cần giữ đúng baseline trên, không tự nhận là đề chính thức và không suy diễn từ dự án cá nhân của maintainer.
