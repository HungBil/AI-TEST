# Exam JSON schema

Repo có hai nhóm đề:

- `src/data/exams/*.json`: bộ cũ, hiển thị công khai.
- `src/data/new-exams/*.json`: bộ mô phỏng khóa mới, chỉ đi vào giao diện sau cổng vương miện.

Cả hai thư mục đều được Vite tự load bằng `import.meta.glob`, nên thêm file JSON không cần import thủ công từng đề.

## Cấu trúc đề

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
  ],
  "questions": []
}
```

Các trường bắt buộc:

- `id`, `title`, `description`, `durationMinutes`, `totalPoints`, `disclaimer`, `questions`.
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
| B | 20 | Euclid, Python gọi API và NumPy; khuyến nghị 2 câu code |
| C | 12 | AI/RAG/triển khai; đúng 3 câu tự luận theo ràng buộc |
| D | 8 | Privacy, banking và Responsible AI |

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

## Code/tự luận

```json
{
  "id": "N26-C10",
  "module": "C",
  "type": "essay",
  "points": 12,
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
- Với bộ mới, cả 3 câu `essay` nằm ở Module C và prompt cần nêu ràng buộc để người làm lập luận, đưa ví dụ và mô tả cách triển khai.

## Kiểm tra local

```bash
npm run validate
npm run build
```
