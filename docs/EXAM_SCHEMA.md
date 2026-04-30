# Exam JSON schema

Mỗi đề nằm trong `src/data/exams/*.json`. App tự load tất cả file JSON trong thư mục này, nên contributor có thể thêm `exam-11.json`, `exam-12.json`, ... mà không cần sửa code TypeScript.

## Cấu trúc bắt buộc

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

## Số lượng câu

Mỗi đề cần đúng 60 câu:

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 10 | Toán học & tư duy định lượng |
| B | 22 | Python / NumPy / Pandas, gồm 2 câu code tay |
| C | 20 | AI & tư duy sản phẩm AI, gồm 2 tự luận |
| D | 8 | Logic / đạo đức / hành vi, gồm 1 tự luận tình huống |

Tổng điểm phải là 100.

## MCQ

```json
{
  "id": "E11-B01",
  "module": "B",
  "type": "mcq",
  "points": 1.5,
  "prompt": "...",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." },
    { "key": "C", "text": "..." },
    { "key": "D", "text": "..." }
  ],
  "answer": "B",
  "explanation": "...",
  "tags": ["python"]
}
```

## Code/tự luận

```json
{
  "id": "E11-C19",
  "module": "C",
  "type": "essay",
  "points": 4,
  "prompt": "...",
  "modelAnswer": "...",
  "rubric": ["Ý 1", "Ý 2", "Ý 3"],
  "tags": ["rag"]
}
```

Kiểm tra local:

```bash
npm run validate
```
