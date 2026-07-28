# Exam JSON schema

Repo có hai collection:

- `src/data/exams/*.json`: bộ cũ, hiển thị công khai.
- `src/data/new-exams/`: bộ mô phỏng khóa mới, mở qua cổng vương miện.

## Cấu trúc bắt buộc

Mỗi đề phải có:

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
  "moduleOverview": ["...", "...", "...", "..."],
  "questions": []
}
```

`moduleLabels` và `moduleOverview` là tùy chọn, nhưng nếu khai báo phải đủ bốn module.

## Hai layout của bộ mới

### Một file hoàn chỉnh

```txt
src/data/new-exams/new-2026-02.json
```

File chứa metadata và toàn bộ `questions`. Đề 02–10 được materialize từ bundle nén bằng `npm run materialize:new-exams`; các file tạo ra nằm trong `.gitignore`, không chỉnh tay. Nguồn đóng gói nằm tại `src/data/new-exams/bundle/`.

### Module hóa

```txt
src/data/new-exams/new-2026-01/
├── exam.json
├── module-a.json
├── module-b.json
├── module-c.json
└── module-d.json
```

`exam.json` chỉ chứa metadata, không chứa `questions`; bốn file còn lại là các mảng câu hỏi và chỉ được chứa đúng module tương ứng.

## Số lượng câu

Mỗi đề đúng 60 câu và 100 điểm.

| Collection | A | B | C | D |
|---|---:|---:|---:|---:|
| Bộ cũ | 10 | 22 | 20 | 8 |
| Bộ mới | 20 | 20 | 12 | 8 |

Với bộ mới:

- Đúng 2 câu `code`, đều ở Module B.
- Đúng 3 câu `essay`, đều ở Module C.
- Không trùng `question.id` trong toàn repo.
- Không trùng nguyên văn prompt giữa các đề mới.

## MCQ

```json
{
  "id": "N26E02-A01",
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

MCQ phải có đúng A/B/C/D, không trùng nội dung lựa chọn, đáp án hợp lệ và giải thích đủ rõ.

## Code và tự luận

```json
{
  "id": "N26E02-C10",
  "module": "C",
  "type": "essay",
  "points": 8,
  "prompt": "...",
  "modelAnswer": "...",
  "rubric": ["Ý 1", "Ý 2", "Ý 3"],
  "tags": ["rag"]
}
```

Câu mở phải có đáp án mẫu và ít nhất ba tiêu chí rubric không rỗng. Ba câu tự luận Module C nên bắt buộc người làm nêu lập luận, ví dụ end-to-end, cách triển khai, đánh giá, giám sát, bảo mật và rollback.

## Kiểm tra local

```bash
npm run validate
npm run build
```
