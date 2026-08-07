# Ma trận phủ nội dung bộ Crown 2026

## 1. Dữ liệu đầu vào đã bóc tách

Bộ đề dùng hai nhóm phản hồi không chính thức từ người thi các khóa gần đây.

### Nhóm dữ liệu đã có trước

- 60 câu, chia 4 module.
- Module 1 tập trung xác suất và đại số tuyến tính phần ma trận; không có giải tích.
- Câu toán cần giấy nháp nhưng không cần máy tính cầm tay.
- Module 2 có thuật toán Euclid, Python gọi API và giải thích code NumPy.
- Module 3 có đúng 3 câu tự luận; cả ba yêu cầu lập luận, ví dụ và cách triển khai theo ràng buộc.
- Có tình huống banking/privacy: dữ liệu nhạy cảm, giới hạn truy cập nhóm A/B, hậu quả pháp lý khi AI trả lời sai.

### Dữ liệu mới từ ảnh ghi chú khóa trước

- Bayes: tỷ lệ mắc bệnh, tỷ lệ xét nghiệm đúng/sai, hai lần đều dương tính.
- Nhân ma trận, đại số tuyến tính phần ma trận và inverse matrix.
- Thuật toán Euclid.
- Gọi API bằng Python và giải thích code NumPy.
- Confusion matrix: tính accuracy, precision, recall và F1-score.
- Backpropagation ở mức tính toán cơ bản.
- SVM ở mức nền tảng.
- Xác suất và xác suất có điều kiện.

Dòng “xác suất, xác suất có phụ thuộc” trong ảnh nằm phía dưới phần Module 3, nhưng được xếp vào Module 1 vì phản hồi trước xác nhận Module 1 là xác suất và ma trận. Đây là lựa chọn cấu trúc thận trọng, không phải khẳng định về thứ tự chính thức của đề.

## 2. Cách dùng SFIA Level 3 → 4

Bộ đề không phải bài đánh giá SFIA chính thức. SFIA chỉ được dùng để hiệu chỉnh kiểu năng lực:

- **Level 3 – Apply:** áp dụng phương pháp chuẩn, làm các tác vụ đa dạng, tự quản lý phần việc dưới định hướng chung.
- **Level 4 – Enable:** xử lý hoạt động phức tạp đa dạng hơn, lựa chọn phương pháp, giải thích quyết định, làm việc tương đối tự chủ và hỗ trợ mục tiêu nhóm.

Vì đây là đầu vào cho định hướng đào tạo từ Level 3 lên Level 4:

- Khoảng hai phần ba điểm kiểm tra khả năng **Apply**: tính toán, đọc code, chọn API đúng, đọc metric và áp dụng công thức.
- Khoảng một phần ba điểm kiểm tra tín hiệu sẵn sàng **Enable**: lập luận theo ràng buộc, chọn baseline, đưa ví dụ, lập kế hoạch triển khai, đánh giá, giám sát và biết khi nào phải chuyển người.
- Không yêu cầu chiến lược tổ chức, kiến trúc enterprise hay governance cấp cao.

Tham khảo chính thức:

- https://sfia-online.org/en/sfia-9/responsibilities
- https://sfia-online.org/en/tools-and-resources/ai-skills-framework/ai-skills-framework-home

## 3. Vì sao giảm từ 10 đề xuống 5 đề

Dữ liệu hiện có chỉ đủ tạo năm hồ sơ kiến thức khác nhau có giá trị học tập. Việc ép đủ 10 đề trước đây khiến nhiều câu chỉ thay số hoặc thay bối cảnh.

Collection mới gồm **5 đề × 60 câu = 300 câu**. Mỗi đề vẫn có cấu trúc:

| Module | Số câu | Điểm | Nội dung |
|---|---:|---:|---|
| A | 20 | 20 | 10 xác suất + 10 ma trận |
| B | 20 | 28 | 18 MCQ Euclid/API/NumPy + 2 câu code |
| C | 12 | 42 | 9 MCQ ML/RAG + 3 tự luận |
| D | 8 | 10 | Privacy, banking, phân quyền và human review |

## 4. Năm hồ sơ đề khác nhau

| Đề | Trọng tâm khác biệt |
|---:|---|
| 01 | Nền tảng Bayes, xác suất có điều kiện, ma trận 2×2, Requests, NumPy, RAG/FAQ/classifier |
| 02 | Bảng xác suất, biến cố bù, inverse matrix, confusion matrix và API model thử nghiệm |
| 03 | Nhân/nghịch đảo ma trận, đọc shape/slicing NumPy và SVM tuyến tính cơ bản |
| 04 | Backpropagation một nơ-ron, gradient descent, debug API và triển khai neural network nhỏ |
| 05 | Đề tổng hợp tín hiệu Level 3→4: chọn mô hình, chẩn đoán validation gap, giải thích và triển khai theo ràng buộc |

## 5. Phạm vi độ khó

### Module A

Được phép:

- Bayes một hoặc hai lần dương tính.
- Xác suất có điều kiện từ bảng đếm, xác suất toàn phần, biến cố bù, rút bi, xúc xắc, đồng xu, kỳ vọng và Bernoulli variance với số nhỏ.
- Nhân ma trận 2×2, determinant, inverse matrix, transpose, rank, hệ 2 phương trình, `Ax=b`, ma trận đơn vị và ma trận chéo.

Không đưa:

- Giải tích, tối ưu liên tục, SVD/PCA, eigen nâng cao, Markov hoặc ma trận lớn.

### Module B

Được phép:

- Tính/trace/debug Euclid, độ phức tạp cơ bản.
- `requests.get/post`, `params`, `json`, header, timeout, `raise_for_status`, `response.json`, `RequestException`, status code và schema validation.
- NumPy `shape`, `ndim`, broadcasting, `axis`, slicing, boolean indexing và `reshape`.

Không đưa distributed system, streaming, queue hoặc agent protocol.

### Module C

Được phép:

- Train/validation/test, overfit.
- Confusion matrix và tính accuracy, precision, recall, F1 bằng số nhỏ.
- SVM tuyến tính: margin, support vector và hàm quyết định đơn giản.
- Backpropagation: mục đích, gradient của một nơ-ron tuyến tính, cập nhật trọng số và đạo hàm ReLU ngoài điểm 0.
- RAG cơ bản: retrieval, embedding, citation và từ chối khi thiếu bằng chứng.
- Ba tự luận có ràng buộc, yêu cầu lập luận + ví dụ + triển khai/đánh giá.

Không yêu cầu kernel trick nâng cao, dual optimization, mạng sâu, đạo hàm ma trận hoặc MLOps enterprise.

### Module D

- Least privilege.
- Phân quyền nhóm A/B ở server/data layer.
- Data minimization, purpose limitation và consent ở mức tình huống.
- Human approval cho quyết định ảnh hưởng lớn.
- Audit log, kiểm tra chênh lệch theo nhóm và xử lý sự cố dữ liệu.

## 6. Chống lặp kiến thức

Mỗi câu Crown có:

- `skillId`: kỹ năng cụ thể.
- `sfiaBand`: `L3` hoặc `L3-L4`.
- `difficulty`: mức độ câu hỏi.

Validator kiểm tra:

- Mỗi đề có ít nhất 50 `skillId` khác nhau.
- Không cặp đề nào có Jaccard overlap `skillId` lớn hơn 75%.
- Không cặp đề nào có hơn 18/60 prompt giống nguyên văn.
- Collection phải phủ Bayes, conditional probability, inverse/matrix multiplication, Euclid, API, NumPy, confusion metrics, SVM, backprop, RAG, privacy và essay.

Cấu trúc nền tảng vẫn được phép lặp ở mức hợp lý; mục tiêu là khác về kỹ năng và dạng suy luận, không phải đổi tên bối cảnh để tạo cảm giác mới giả tạo.
