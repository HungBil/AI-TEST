# Ma trận phủ nội dung bộ Crown 2026

## Nguyên tắc thiết kế

Bộ Crown gồm 10 đề, mỗi đề 60 câu. Các đề **không được khác nhau quá xa** vì cùng mô phỏng một phạm vi đầu vào. Mục tiêu là:

- giữ một lõi kiến thức chung để người học ôn chắc nền tảng;
- thay đổi vừa phải ở dữ kiện, cách hỏi và 4–8 câu trắc nghiệm;
- tạo khác biệt rõ hơn ở đúng 3 câu tự luận của Module C;
- ưu tiên câu ở mức áp dụng trực tiếp, giấy nháp và đọc code;
- chỉ dùng câu lập luận/triển khai để quan sát mức sẵn sàng từ SFIA Level 3 lên Level 4, không biến đề thành bài kiến trúc hệ thống nâng cao.

Đây không phải bài đánh giá SFIA chính thức.

## Nguồn baseline

Phạm vi được giữ quanh dữ liệu người thi các khóa trước cung cấp:

1. 60 câu, chia 4 module.
2. Module 1 có xác suất, xác suất có điều kiện/phụ thuộc và đại số tuyến tính phần ma trận, gồm nhân ma trận và inverse matrix.
3. Câu toán cần dùng giấy nháp nhưng không cần máy tính cầm tay; không có giải tích.
4. Module 2 có thuật toán Euclid, Python gọi API và giải thích code NumPy.
5. Module 3 có confusion matrix, accuracy, precision, recall, F1, SVM và backpropagation cơ bản.
6. Module 3 có đúng 3 câu tự luận yêu cầu lập luận, ví dụ và cách triển khai theo ràng buộc.
7. Có tình huống banking/privacy: dữ liệu nhạy cảm, quyền nhóm A/B, hậu quả pháp lý/tài chính và human review.

## Blueprint cố định mỗi đề

| Module | Số câu | Điểm | Nội dung |
|---|---:|---:|---|
| A | 20 | 20 | 10 xác suất + 10 ma trận |
| B | 20 | 28 | 18 MCQ Euclid/API/NumPy + 2 câu code |
| C | 12 | 42 | 9 MCQ ML/RAG + 3 tự luận |
| D | 8 | 10 | Privacy, banking và trách nhiệm AI |
| **Tổng** | **60** | **100** | 90 phút |

Mỗi đề có đúng 55 câu `L3` và 5 câu `L3-L4`. Năm câu `L3-L4` là 2 câu code ở B và 3 câu tự luận ở C.

## Hồ sơ 10 đề

| Đề | Lõi chung | Phần thay đổi vừa phải | Ba tự luận |
|---:|---|---|---|
| 01 | Bayes, ma trận 2×2, Euclid, Requests, NumPy, RAG | Đề baseline | RAG nội bộ; FAQ bảo vệ dữ liệu; classifier + metrics |
| 02 | Xác suất có điều kiện, inverse matrix, API, NumPy | Confusion matrix đầy đủ | Classifier + metrics; RAG nội bộ; deploy model API |
| 03 | Xác suất/ma trận, Euclid, API, NumPy | SVM tuyến tính: margin, support vector, decision function | SVM pipeline; FAQ privacy; classifier + metrics |
| 04 | Xác suất/ma trận, API debug, NumPy | Backprop một nơ-ron, ReLU, một bước cập nhật | Neural network nhỏ; deploy model API; RAG nội bộ |
| 05 | Nền tảng tổng hợp | Chọn phương pháp và đọc F1 ở mức cơ bản | Model selection; classifier + metrics; RAG nội bộ |
| 06 | Gần Đề 01 | Thay vài câu API/NumPy và thêm accuracy/precision/recall | Classifier + metrics; FAQ privacy; deploy model API |
| 07 | Gần Đề 02 | Thêm vài câu SVM trực quan | SVM pipeline; RAG nội bộ; FAQ privacy |
| 08 | Gần Đề 03 | Thêm gradient/backprop với số nhỏ | Neural network nhỏ; classifier + metrics; FAQ privacy |
| 09 | Gần Đề 04 | Đọc confusion matrix, RAG và chọn mô hình | Model selection; RAG nội bộ; deploy model API |
| 10 | Đề tổng hợp vừa sức | Kết hợp metrics, một câu SVM và một câu backprop khái niệm | Cải thiện validation; classifier + metrics; FAQ privacy |

## Mức độ khó

### Module A

Chỉ dùng các dạng có thể làm trên giấy:

- Bayes một hoặc hai lần dương tính;
- xác suất có điều kiện từ nhóm hoặc bảng đếm;
- xác suất toàn phần;
- biến cố bù và ít nhất một;
- rút bi không hoàn lại;
- xúc xắc, đồng xu, tổ hợp nhỏ;
- kỳ vọng và phương sai Bernoulli với số nhỏ;
- kích thước, cộng, nhân vô hướng và nhân ma trận 2×2;
- định thức, nghịch đảo 2×2, chuyển vị;
- giải hệ hai phương trình hoặc `Ax=b`;
- rank đơn giản, ma trận đơn vị/chéo và nhận biết ma trận suy biến.

Không dùng giải tích, SVD/PCA, tối ưu nâng cao, eigen nâng cao hoặc phép tính cần máy tính cầm tay.

### Module B

- GCD và các bước Euclid;
- đọc vòng lặp/đệ quy, tìm lỗi đơn giản;
- `requests.get`, `requests.post`, `params`, `json`, header, timeout;
- `raise_for_status`, `response.json`, `RequestException`, HTTP status;
- kiểm tra schema JSON và API key cơ bản;
- NumPy `shape`, `ndim`, broadcasting, `axis`, slicing, boolean indexing, `reshape`;
- hai câu mở: một câu Euclid và một câu API/NumPy.

Không dùng distributed systems, streaming, agent protocol hoặc hạ tầng production phức tạp.

### Module C

Lõi chung:

- supervised classification;
- train/validation/test;
- overfit;
- confusion matrix và lựa chọn metric;
- retrieval, embedding, thiếu bằng chứng trong RAG;
- human review và monitoring.

Phần xoay vòng:

- SVM ở mức maximum margin, support vectors và hàm quyết định tuyến tính đơn giản;
- backpropagation ở mức một nơ-ron, gradient, ReLU và một bước gradient descent;
- không có dual optimization, kernel nâng cao, mạng sâu hoặc đạo hàm ma trận lớn.

## Quy tắc đa dạng

Bộ đề chủ động cho phép overlap kiến thức cao vì cùng một baseline. Validator chỉ ngăn hai cực đoan:

- một đề tự lặp quá nhiều kỹ năng;
- hai đề giống gần như toàn bộ cả skill lẫn prompt.

Các ràng buộc chính:

- đúng 10 đề và 600 câu;
- mỗi đề A/B/C/D = 20/20/12/8;
- đúng 2 câu code và 3 câu tự luận mỗi đề;
- bộ ba tự luận không được trùng hoàn toàn giữa hai đề;
- mỗi đề 3–10 có ít nhất 2 câu thuộc confusion matrix/SVM/backprop;
- skill overlap giữa hai đề không vượt 90%;
- prompt giống nguyên văn không vượt 48/60;
- không yêu cầu mỗi đề phải là một syllabus khác.
