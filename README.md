![Uploading image.png…]()

# AI-TEST — Bộ đề cương ôn tập AI thực chiến

Web app self-host/local host để luyện đề theo dạng chọn đáp án, xem đúng/sai, xem đáp án đúng, giải thích và thống kê cuối bài.

> **Disclaimer:** Đây chỉ là đề cương ôn tập cộng đồng, không phải đề thi chính thức của VinUni, không cố gắng mô phỏng đề thi thật, không cam kết giống đề thật. Người học cần tự research thêm, tự học thêm và tự phát triển thêm.

## Tính năng

- 10 bài kiểm tra mặc định, mỗi bài 60 câu, tổng 600 câu.
- Mỗi bài 100 điểm, thời lượng gợi ý 90 phút.
- Module A: Toán học & tư duy định lượng.
- Module B: Python / NumPy / Pandas, gồm code tay/pseudo-code.
- Module C: AI & tư duy sản phẩm AI, gồm tự luận pipeline/RAG/product AI.
- Module D: Logic / đạo đức / hành vi, gồm tình huống Responsible AI.
- Practice mode: chọn xong hiện đáp án và giải thích.
- Exam mode: cuối bài mới hiện kết quả.
- Câu code/tự luận dùng rubric + self-grade.
- Lưu tiến độ bằng localStorage.
- Tự load thêm mọi file đề JSON trong `src/data/exams/*.json`.
- GitHub Actions validate PR và bật auto-merge cho PR chỉ thêm/sửa đề JSON.

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

- Mỗi đề đúng 60 câu.
- Module A/B/C/D có 10/22/20/8 câu.
- Tổng điểm mỗi đề là 100.
- MCQ có đủ A/B/C/D, answer hợp lệ, explanation.
- Câu code/tự luận có modelAnswer và rubric.

## Build self-host

```bash
npm run build
npm run preview
```

Thư mục build nằm ở `dist/`.

## Cách thêm đề mới

1. Copy `docs/exam-template.json` thành `src/data/exams/exam-11.json`.
2. Điền đủ 60 câu theo schema trong `docs/EXAM_SCHEMA.md`.
3. Chạy:

```bash
npm run validate
npm run build
```

App tự load mọi file `*.json` trong `src/data/exams`, nên không cần sửa `index.ts`.

## GitHub Actions / Auto-merge PR đóng góp đề

Repo có 2 workflow:

1. `.github/workflows/validate-exams.yml`
   - Chạy khi có PR/push.
   - `npm ci`, `npm run validate`, `npm run build`.

2. `.github/workflows/auto-merge-exam-pr.yml`
   - Chạy bằng `pull_request_target` nhưng **chỉ checkout base branch**, không chạy code từ PR trong workflow có quyền ghi.
   - Kiểm tra danh sách file thay đổi.
   - PR chỉ đổi `src/data/exams/*.json` hoặc tài liệu đóng góp được gắn label `exam-contribution`.
   - Tự bật auto-merge bằng `gh pr merge --auto --squash --delete-branch`.
   - Maintainer chặn được bằng label `needs-review` hoặc `do-not-merge`.

### Cấu hình khuyến nghị cho repo `HungBil/AI-TEST`

Trong GitHub repo:

1. **Settings → General → Pull Requests**
   - Bật **Allow auto-merge**.
   - Bật **Allow squash merging**.

2. **Settings → Actions → General → Workflow permissions**
   - Chọn **Read and write permissions**.

3. **Settings → Branches → Add branch protection rule** cho `main`
   - Bật **Require status checks to pass before merging**.
   - Chọn check `Validate exam data and app build / Validate schema and build` sau khi workflow chạy lần đầu.
   - Không bắt buộc required review nếu muốn cộng đồng đóng góp thoáng hơn.

Cơ chế này đủ thoáng cho PR thêm đề, nhưng vẫn có kiểm soát: chỉ auto-merge nội dung đề/tài liệu được phép và phải pass validate/build.

## Push lần đầu lên GitHub

```bash
git init
git branch -M main
git remote add origin https://github.com/HungBil/AI-TEST.git
git add .
git commit -m "init AI practice tests"
git push -u origin main
```

## Đóng góp

Xem `CONTRIBUTING.md` và `docs/EXAM_SCHEMA.md`.

Dự án mở miễn phí, rất hoan nghênh mọi người đóng góp thêm đề, sửa lỗi đáp án, cải thiện giải thích và UI/UX.
