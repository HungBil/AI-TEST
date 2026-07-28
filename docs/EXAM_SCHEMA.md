# Exam JSON schema

Repo có hai nhóm đề:

- `src/data/exams/*.json`: bộ cũ, hiển thị công khai.
- `src/data/new-exams/<exam-id>/`: bộ mô phỏng khóa mới, chỉ đi vào giao diện sau cổng vương miện.

Cả hai nhóm được Vite tự load bằng `import.meta.glob`, nên không cần import thủ công từng đề.

## 1. Bộ cũ: một file cho toàn bộ đề

Mỗi đề cũ là một file JSON hoàn chỉnh, ví dụ `src/data/exams/exam-11.json`:

```json
{
  "id": "exam-11",
  "title": "Bài kiểm tra ôn tập AI thực chiến #11",
  "description": "...",
  "durationMinutes": 90,
  "totalPoints": 100,
  "disclaimer": "...",
  "questions": []
}
```

## 2. Bộ mới: một manifest và bốn file module

Ví dụ cấu trúc:

```txt
src/data/new-exams/new-2026-02/
├── exam.json
├── module-a.json
├── module-b.json
├── module-c.json
└── module-d.json
```

`exam.json` chỉ chứa metadata, không chứa `questions`:

```json
{
  "id": "new-2026-02",
  "title": "Bộ mô phỏng khóa mới 2026 · Đề 02",
  "description": "...",
  "durationMinutes": 90,
  "totalPoints": 100,
  "disclaimer": "...",
  "moduleLabels": {
    "A": "Xác suất & đại số tuyến tính",
    "B": "Euclid, Python API & NumPy",
    "C": "AI, RAG & thiết kế hệ thống",
    "D": "Privacy, banking & Responsible AI"
  },
  "moduleOverview": [
    "Module 1 · A: ...",
    "Module 2 · B: ...",
    "Module 3 · C: ...",
    "Module 4 · D: ..."
  ]
}
```

Mỗi `module-*.json` là một mảng câu hỏi. App ghép metadata với bốn mảng theo thứ tự A → B → C → D.

Các trường bắt buộc của đề:

- `id`, `title`, `description`, `durationMinutes`, `totalPoints`, `disclaimer`.
- Bộ cũ cần thêm `questions`.
- `moduleLabels` và `moduleOverview` là tùy chọn. Nếu có, `moduleLabels` phải đủ A/B/C/D; `moduleOverview` phải có đúng 4 dòng.

## Số lượng câu

Mỗi đề cần đúng 60 câu và 100 điểm.

### Bộ cũ

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 10 | Toán học & tư duy định lượng |
| B | 22 | Python / NumPy / Pandas, gồm 2 câu code tay |
| C | 20 | AI & tư duy sản phẩm AI, gồm 2 tự luận |
| D | 8 | Logic / đạo đức / hành vi, gồm 1 tự luận tình huống |

### Bộ mô phỏng khóa mới

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 20 | Xác suất và đại số tuyến tính, trọng tâm ma trận |
| B | 20 | Euclid, Python gọi API và NumPy; đúng 2 câu code |
| C | 12 | AI/RAG/triển khai; đúng 3 câu tự luận theo ràng buộc |
| D | 8 | Privacy, banking và Responsible AI |

Mỗi file module chỉ được chứa câu có trường `module` tương ứng với tên file.

## MCQ

```json
{
  "id": "N26-A01",
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

Yêu cầu:

- Đúng 4 lựa chọn theo thứ tự A/B/C/D.
- `answer` phải trỏ tới một lựa chọn tồn tại.
- `explanation` giải thích được vì sao đáp án đúng, không chỉ lặp lại đáp án.
- `points` là số dương, có thể là số thập phân.

## Code/tự luận

```json
{
  "id": "N26-C10",
  "module": "C",
  "type": "essay",
  "points": 8,
  "prompt": "...",
  "modelAnswer": "...",
  "rubric": ["Ý 1", "Ý 2", "Ý 3"],
  "tags": ["rag"]
}
```

Yêu cầu:

- `type` là `code` hoặc `essay`.
- Có `modelAnswer`.
- Có ít nhất 3 tiêu chí trong `rubric`.
- Với bộ mới, cả 3 câu `essay` nằm ở Module C. Prompt cần nêu ràng buộc và yêu cầu người làm lập luận, đưa ví dụ, mô tả cách triển khai/đánh giá/giám sát.
- Với bộ mới, cả 2 câu `code` nằm ở Module B.

## Kiểm tra local

```bash
npm run validate
npm run build
```
