# Exam JSON schema

Repo có hai collection:

- `src/data/exams/*.json`: 10 đề cũ.
- `src/data/new-exams/`: 10 đề Crown 2026.

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
  "moduleOverview": ["...", "...", "...", "..."],
  "questions": []
}
```

`moduleLabels` và `moduleOverview` là tùy chọn. Nếu có, `moduleLabels` phải đủ A/B/C/D và `moduleOverview` phải có đúng bốn dòng.

## Hai layout của collection Crown

### Layout module hóa

Đề 01 dùng:

```text
src/data/new-exams/new-2026-01/
├── exam.json
├── module-a.json
├── module-b.json
├── module-c.json
└── module-d.json
```

`exam.json` chỉ chứa metadata. Mỗi file module là một mảng câu hỏi và chỉ được chứa module tương ứng.

### Layout file hoàn chỉnh

Đề 02 đến Đề 10 được materialize thành:

```text
src/data/new-exams/new-2026-02.json
...
src/data/new-exams/new-2026-10.json
```

Các file này được sinh xác định bởi `scripts/materialize-new-exams.mjs` từ bộ sinh trong `scripts/exam-generator/`. File đầu ra nằm trong `.gitignore`, không chỉnh tay.

```bash
npm run materialize:new-exams
```

## Số lượng câu

Mỗi đề có đúng 60 câu và 100 điểm.

| Collection | A | B | C | D |
|---|---:|---:|---:|---:|
| Bộ cũ | 10 | 22 | 20 | 8 |
| Crown 2026 | 20 | 20 | 12 | 8 |

Mỗi đề Crown còn phải có:

- Đúng 2 câu `code`, đều ở Module B.
- Đúng 3 câu `essay`, đều ở Module C.
- ID câu hỏi không trùng trong toàn repo.
- Prompt không trùng nguyên văn giữa các đề Crown.
- Tổng collection đúng 10 đề, 600 câu, 20 câu code và 30 câu tự luận.

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

MCQ Crown phải có đúng A/B/C/D, không trùng nội dung lựa chọn, đáp án hợp lệ và giải thích đủ rõ. Validator không áp quy tắc lựa chọn không trùng hồi tố lên bộ cũ để tránh thay đổi dữ liệu legacy.

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

Câu mở phải có `modelAnswer` và ít nhất ba tiêu chí rubric không rỗng. Ba câu tự luận Module C cần buộc người làm nêu lập luận, ví dụ end-to-end, cách triển khai, đánh giá, giám sát, bảo mật, human gate và rollback khi phù hợp.

## Kiểm tra local

```bash
npm run validate
npm run test:crown-worker
npm run build
```
