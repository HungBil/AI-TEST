# AI-TEST — Bộ đề cương ôn tập AI thực chiến

![AI in Action - The nationwide AI talent network](docs/assets/ai-in-action.png)

Web app tự host để luyện đề trắc nghiệm, code tay và tự luận. App có Practice mode, Exam mode, timer, lưu tiến độ, tự chấm câu mở và thống kê theo module.

> **Lưu ý:** Đây là tài liệu ôn tập cộng đồng, không phải đề thi chính thức hoặc đề bị lộ. Bộ Crown được biên soạn bám theo phản hồi không chính thức của người thi các khóa gần đây và chỉ mở rộng nhẹ quanh các chủ đề đã được ghi nhận.

## Baseline dùng để biên soạn bộ Crown

- 60 câu, chia 4 module.
- Module 1: xác suất, xác suất có điều kiện/phụ thuộc và đại số tuyến tính phần ma trận; có nhân ma trận và inverse matrix; không có giải tích.
- Câu toán cần giấy nháp nhưng không cần máy tính cầm tay.
- Module 2: thuật toán Euclid, Python gọi API và đọc/giải thích code NumPy.
- Module 3: confusion matrix, accuracy, precision, recall, F1, SVM và backpropagation cơ bản.
- Module 3 có đúng 3 câu tự luận; cả ba yêu cầu lập luận, ví dụ và cách triển khai theo ràng buộc.
- Module 4: dữ liệu nhạy cảm, banking, privacy, quyền truy cập giữa nhóm A/B và trách nhiệm khi AI trả lời sai.

Không mở rộng sang graph AML, temporal graph, KYC đa phương thức, voice agent, research agent hoặc các chủ đề lấy từ dự án cá nhân của maintainer.

## Quy mô

- Bộ cũ: **10 đề × 60 câu = 600 câu**.
- Bộ Crown: **10 đề × 60 câu = 600 câu**.
- Toàn repo: **20 đề, 1.200 câu**.
- Mỗi đề Crown có 20 câu Module A, 20 câu Module B, 12 câu Module C và 8 câu Module D.
- Mỗi đề Crown có đúng 2 câu code ở B và 3 câu tự luận ở C.

## Mức độ khác nhau giữa các đề

Mười đề không phải mười syllabus độc lập. Chúng dùng chung một lõi kiến thức để phù hợp với người học có năng lực đầu vào khác nhau.

- Phần lớn câu hỏi vẫn kiểm tra cùng nhóm nền tảng.
- Mỗi đề thay đổi vừa phải ở dữ kiện, cách hỏi và khoảng 4–8 câu trắc nghiệm.
- Khác biệt rõ hơn nằm ở ba câu tự luận của Module C.
- SVM và backpropagation chỉ ở mức trực quan, phép tính nhỏ và ứng dụng cơ bản.
- Không tạo độ khó giả bằng cách đưa thêm kiến thức ngoài baseline.

Định hướng năng lực là **Level 3 Apply → Level 4 Enable**. Mỗi đề giữ 55 câu ở mức `L3`; 2 câu code và 3 câu tự luận được gắn `L3-L4`. Đây không phải bài đánh giá SFIA chính thức.

Xem chi tiết tại [`docs/NEW_EXAM_COVERAGE.md`](docs/NEW_EXAM_COVERAGE.md).

## Cấu trúc mỗi đề Crown

| Module | Số câu | Điểm | Phạm vi |
|---|---:|---:|---|
| A | 20 | 20 | 10 xác suất và 10 ma trận; số nhỏ, tính bằng giấy nháp |
| B | 20 | 28 | Euclid, Requests/API, NumPy; gồm 2 câu code |
| C | 12 | 42 | ML/RAG cơ bản, confusion matrix, SVM/backprop nhẹ; gồm 3 tự luận |
| D | 8 | 10 | Đạo đức AI, banking, privacy, phân quyền và human review |

## Bộ sinh đề

Mười đề Crown được sinh xác định từ:

```text
scripts/exam-generator/
├── shared.mjs
├── module-a.mjs
├── module-b.mjs
├── module-c-core.mjs
├── module-c-essays.mjs
├── module-cd.mjs
├── module-d.mjs
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

Trước khi chạy `dev`, đặt `CROWN_PASSWORD` trong biến môi trường của shell hiện tại. Generator Crown lock không có mật khẩu mặc định và sẽ dừng nếu biến này trống.

Thường mở tại:

```text
http://localhost:5173
```

## Validate và build

```bash
npm run generate:crown-lock
npm run validate
npm run build
```

Validator kiểm tra:

- đúng 10 đề Crown và 600 câu;
- mỗi đề đúng 20/20/12/8 và tổng 100 điểm;
- mỗi đề có đúng 2 câu code ở B và 3 câu tự luận ở C;
- mỗi đề có đúng 55 câu `L3` và 5 câu `L3-L4`;
- Đề 03–10 có ít nhất 2 câu confusion matrix/SVM/backprop;
- bộ ba tự luận không trùng hoàn toàn giữa hai đề;
- ID đề/câu không trùng, MCQ có đủ A/B/C/D và đáp án hợp lệ;
- skill overlap không vượt 90% và prompt trùng nguyên văn không vượt 30/60;
- bộ cũ vẫn được kiểm tra theo schema legacy riêng.

## Truy cập Crown và bảo vệ mật khẩu

Nhấn biểu tượng vương miện ở góc dưới bên phải. Crown là **client-side access gate** chỉ chạy trên GitHub Pages, không phải authentication. Mật khẩu không được commit; workflow build đọc `CROWN_PASSWORD`, tạo verifier PBKDF2 + AES-GCM ngẫu nhiên rồi đưa verifier vào bundle.

Cơ chế này chỉ tăng độ khó vừa phải cho việc đoán mật khẩu. Câu hỏi và đáp án vẫn public; người có kỹ thuật có thể đọc dữ liệu, sửa frontend để bỏ qua cổng, thay đổi `sessionStorage` hoặc brute-force offline.

Chi tiết và giới hạn: [`docs/CROWN_SECURITY.md`](docs/CROWN_SECURITY.md).

Mọi mật khẩu Crown từng xuất hiện trong lịch sử repo phải được coi là đã lộ. Maintainer cần tạo passphrase mới rồi thêm repository secret tên `CROWN_PASSWORD` tại `Settings → Secrets and variables → Actions`.

## GitHub Actions

- `validate-exams.yml`: materialize, sinh verifier bằng password test, validate 1.200 câu, test Crown và build app.
- `deploy-pages.yml`: sinh verifier từ repository secret, build và deploy duy nhất thư mục `dist/` lên GitHub Pages.

## Đóng góp

Xem `CONTRIBUTING.md`, `docs/EXAM_SCHEMA.md` và `docs/NEW_EXAM_COVERAGE.md`. Nội dung mới phải giữ đúng baseline, không tự nhận là đề chính thức và không suy diễn từ dự án cá nhân của maintainer.
