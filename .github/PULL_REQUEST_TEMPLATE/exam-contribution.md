## Mục đích PR

- [ ] Thêm đề mới trong `src/data/exams/*.json`
- [ ] Sửa lỗi câu hỏi/đáp án/giải thích
- [ ] Cải thiện tài liệu đóng góp

## Checklist

- [ ] Mỗi file đề có đúng 60 câu và 100 điểm.
- [ ] Module A/B/C/D lần lượt có 10/22/20/8 câu.
- [ ] MCQ có đủ 4 đáp án A/B/C/D và có `answer` hợp lệ.
- [ ] Câu code/tự luận có `modelAnswer` và `rubric`.
- [ ] Nội dung là đề cương ôn tập, không claim đây là đề thật VinUni.

Bot sẽ tự chạy validate/build. PR chỉ thay đổi file đề JSON sẽ được bật auto-merge sau khi checks pass, trừ khi maintainer gắn label `needs-review` hoặc `do-not-merge`.
