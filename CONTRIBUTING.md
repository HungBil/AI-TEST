# Đóng góp cho AI-TEST

Cảm ơn bạn muốn đóng góp cho bộ đề cương ôn tập AI thực chiến.

## Nguyên tắc nội dung

- Đây là đề cương ôn tập cộng đồng, không phải đề chính thức VinUni.
- Không claim câu hỏi giống đề thật.
- Ưu tiên câu hỏi thực dụng, rõ đáp án, có giải thích ngắn.
- Không đưa thông tin cá nhân, dữ liệu nhạy cảm, hoặc nội dung vi phạm bản quyền.
- Với câu tự luận/code tay, cần có đáp án mẫu và rubric.

## Thêm đề mới

1. Tạo file mới trong `src/data/exams/`, ví dụ `exam-11.json`.
2. Mỗi đề phải có đúng 60 câu và 100 điểm.
3. Module A/B/C/D lần lượt có 10/22/20/8 câu.
4. Chạy kiểm tra:

```bash
npm run validate
npm run build
```

## Auto-merge

PR chỉ thay đổi file đề JSON trong `src/data/exams/*.json` sẽ được bot gắn label `exam-contribution` và bật auto-merge sau khi validate/build pass.

Maintainer có thể chặn auto-merge bằng label:

- `needs-review`
- `do-not-merge`

PR thay đổi code, workflow hoặc file ngoài phạm vi đề sẽ tự chuyển sang review thủ công.

## Schema

Xem `docs/EXAM_SCHEMA.md`.
