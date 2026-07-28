# Ma trận phủ nội dung bộ Crown 2026

## Nguồn baseline

Bộ đề chỉ bám quanh các thông tin được phản hồi từ người thi gần đây:

1. 60 câu, chia 4 module.
2. Module 1 là xác suất và đại số tuyến tính phần ma trận, không có giải tích.
3. Cần dùng giấy nháp nhưng không cần máy tính cầm tay.
4. Module 2 có thuật toán Euclid, Python gọi API và giải thích code NumPy.
5. Module 3 có đúng 3 câu tự luận; cả ba yêu cầu lập luận, ví dụ và cách triển khai theo các ràng buộc được cho.
6. Có tình huống banking/privacy: truy cập dữ liệu nhạy cảm bị giới hạn, trả lời sai có thể gây hậu quả pháp lý, nhóm A không được truy cập dữ liệu riêng của nhóm B.

Các đề không sử dụng thông tin từ các dự án cá nhân của maintainer để suy đoán nội dung thi.

## Blueprint cố định của mỗi đề

| Module | Số câu | Nội dung |
|---|---:|---|
| A | 20 | 10 xác suất + 10 ma trận |
| B | 20 | 4 Euclid + API Python + NumPy + 2 câu code |
| C | 12 | 9 MCQ AI/RAG cơ bản + 3 tự luận |
| D | 8 | Privacy, banking, phân quyền và trách nhiệm AI |

## Module A: giới hạn độ khó

### Xác suất

Các dạng được phép xoay quanh:

- Bayes với xét nghiệm một hoặc hai lần dương tính.
- Xác suất có điều kiện từ bảng đếm hoặc nhóm người.
- Xác suất toàn phần với hai nguồn/máy.
- Rút bi không hoàn lại.
- Xúc xắc, đồng xu, tổ hợp nhỏ.
- Hợp/giao hai biến cố, độc lập cơ bản.
- Kỳ vọng của biến ngẫu nhiên rời rạc nhỏ.

### Ma trận

Các dạng được phép xoay quanh:

- Kích thước tích ma trận.
- Cộng ma trận và nhân vô hướng.
- Tính một phần tử của tích hai ma trận 2×2.
- Định thức 2×2.
- Ma trận nghịch đảo 2×2 với số nhỏ.
- Chuyển vị.
- Hệ hai phương trình tuyến tính.
- Rank của ma trận có hai hàng tỷ lệ.
- Nhân ma trận chéo với vector.

Không đưa giải tích, tối ưu, SVD, PCA, chuỗi Markov, đồ thị thời gian hoặc phép toán cần máy tính cầm tay.

## Module B: giới hạn phạm vi

- Tính GCD bằng thuật toán Euclid.
- Theo dõi một vòng lặp hoặc hàm đệ quy Euclid.
- Độ phức tạp cơ bản của Euclid.
- `requests.get`, `requests.post`, `params`, `json`, `timeout`.
- `raise_for_status`, `response.json`, lỗi `RequestException` và một số HTTP status phổ biến.
- Quản lý API key cơ bản.
- NumPy: `shape`, `ndim`, scalar broadcasting, `axis`, slicing, boolean indexing, `reshape`.
- Một câu viết code Euclid.
- Một câu gọi API đơn giản hoặc giải thích code NumPy.

Không yêu cầu thiết kế retry phức tạp, distributed system, streaming, agent tool protocol hoặc hạ tầng production chuyên sâu.

## Module C: ba nhóm tự luận cố định

Mỗi đề dùng ba nhóm bài sau với bối cảnh và số liệu thay đổi vừa phải:

1. **RAG nội bộ**
   - Khoảng vài nghìn tài liệu.
   - Nhóm A/B có quyền truy cập khác nhau.
   - Câu trả lời có nguồn.
   - Làm MVP trong vài tuần.
   - Trình bày lý do chọn RAG, pipeline, ví dụ và cách đánh giá.

2. **Trợ lý FAQ dùng LLM**
   - Không gửi dữ liệu nhạy cảm thô ra ngoài.
   - FAQ được tự động.
   - Hành động ảnh hưởng lớn phải chuyển người.
   - Có yêu cầu về tốc độ và chi phí.
   - Trình bày phân luồng, ví dụ hội thoại, triển khai và giám sát.

3. **Mô hình phân loại đơn giản**
   - Vài nghìn mẫu có nhãn.
   - Có thể hơi lệch lớp.
   - Chia train/validation/test.
   - Dùng accuracy cùng precision/recall khi phù hợp.
   - Đóng gói thành API thử nghiệm và theo dõi chất lượng.

Không mở rộng sang graph AML, temporal GNN, multimodal KYC, voice agent, legal agent, research agent, adaptive Go tutor hoặc các tình huống gắn với dự án cá nhân của người dùng.

## Module D: tình huống cơ bản

- Chỉ cấp quyền tối thiểu cho AI trong ngân hàng.
- Dữ liệu nhóm A/B phải được lọc ở server/data layer.
- Không dùng dữ liệu thật không cần thiết cho demo.
- Câu trả lời có rủi ro pháp lý/tài chính phải chuyển người.
- AI chỉ gợi ý cho quyết định có ảnh hưởng lớn.
- Audit log đủ để truy vết nhưng không chứa secret/PII thô.
- Kiểm tra chênh lệch chất lượng theo nhóm người dùng.
- Khi lộ dữ liệu: dừng/giới hạn luồng, giữ log và kích hoạt xử lý sự cố.

## Ràng buộc tự động

- Đúng 10 đề và 600 câu.
- Mỗi đề A=20, B=20, C=12, D=8.
- Mỗi đề có đúng 2 câu code ở B và 3 câu tự luận ở C.
- Tổng cộng 20 câu code và 30 câu tự luận.
- ID câu hỏi không trùng.
- MCQ có đủ A/B/C/D, lựa chọn không trùng và giải thích đáp án.

Không bắt buộc mọi prompt phải khác tuyệt đối giữa 10 đề. Các câu nền tảng được phép lặp cấu trúc, vì mục tiêu là luyện chắc baseline thay vì tạo độ khó bằng cách mở rộng phạm vi.
