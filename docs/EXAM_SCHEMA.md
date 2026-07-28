# Exam JSON schema

Repo có hai collection:

- `src/data/exams/*.json`: 10 đề legacy.
- `src/data/new-exams/new-2026-01.json` đến `new-2026-10.json`: 10 đề Crown được sinh tự động.

## Cấu trúc đề

```json
{
  "id": "new-2026-01",
  "title": "Bộ mô phỏng khóa mới 2026 · Đề 01",
  "description": "...",
  "durationMinutes": 90,
  "totalPoints": 100,
  "disclaimer": "...",
  "moduleLabels": {
    "A": "Xác suất & đại số tuyến tính phần ma trận",
    "B": "Euclid, Python gọi API & NumPy",
    "C": "AI cơ bản, RAG & triển khai",
    "D": "Đạo đức AI, banking & privacy"
  },
  "moduleOverview": ["...", "...", "...", "..."],
  "questions": []
}
```

`moduleLabels` và `moduleOverview` là tùy chọn. Nếu khai báo, `moduleLabels` phải đủ A/B/C/D và `moduleOverview` phải có đúng bốn dòng.

## Cách tạo bộ Crown

Nguồn dễ đọc nằm trong:

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

để sinh 10 file JSON. Không chỉnh tay các file đầu ra vì chúng nằm trong `.gitignore` và sẽ bị materializer ghi lại.

## Số lượng câu

Mỗi đề có đúng 60 câu và 100 điểm.

| Collection | A | B | C | D |
|---|---:|---:|---:|---:|
| Legacy | 10 | 22 | 20 | 8 |
| Crown | 20 | 20 | 12 | 8 |

Mỗi đề Crown phải có:

- Đúng 2 câu `code`, đều ở Module B.
- Đúng 3 câu `essay`, đều ở Module C.
- Tổng 10 đề Crown là 600 câu, 20 câu code và 30 câu tự luận.
- ID câu hỏi không trùng trong toàn repo.

Không bắt buộc prompt giữa các đề Crown phải khác tuyệt đối. Các câu nền tảng có thể lặp cấu trúc và thay số liệu/bối cảnh vừa phải để bám baseline.

## MCQ

```json
{
  "id": "N26E01-A01",
  "module": "A",
  "type": "mcq",
  "points": 1,
  "prompt": "...",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." },
    { "key": "C", "text": "..." },
    { "key": "D", "text": "..." }
  ],
  "answer": "B",
  "explanation": "...",
  "tags": ["probability"]
}
```

MCQ Crown phải có đúng A/B/C/D, nội dung lựa chọn không trùng, đáp án hợp lệ và giải thích đủ rõ.

## Code và tự luận

```json
{
  "id": "N26E01-C10",
  "module": "C",
  "type": "essay",
  "points": 8,
  "prompt": "...",
  "modelAnswer": "...",
  "rubric": ["Ý 1", "Ý 2", "Ý 3"],
  "tags": ["rag"]
}
```

Câu mở phải có `modelAnswer` và ít nhất ba tiêu chí rubric. Ba câu tự luận Module C phải yêu cầu:

1. Lập luận lựa chọn giải pháp.
2. Một ví dụ cụ thể hoặc flow end-to-end.
3. Cách triển khai và đánh giá theo các ràng buộc được cho.

Độ khó và phạm vi phải theo [`NEW_EXAM_COVERAGE.md`](NEW_EXAM_COVERAGE.md). Không thêm chủ đề chỉ vì chúng xuất hiện trong dự án cá nhân của maintainer.

## Kiểm tra local

```bash
npm run generate:crown-lock
npm run validate
npm run build
```
