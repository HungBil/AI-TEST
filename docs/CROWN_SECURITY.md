# Cổng truy cập Crown trên GitHub Pages

## Phạm vi

Crown là **client-side access gate**, không phải authentication. Repo, GitHub Pages, câu hỏi và đáp án đều công khai. Người có kỹ thuật vẫn có thể sửa frontend để bỏ qua cổng, thay đổi `sessionStorage` hoặc brute-force verifier offline.

Mục tiêu giới hạn là không commit mật khẩu dạng rõ, không để người dùng chỉ mở source rồi copy mật khẩu, và làm việc dò mật khẩu tốn chi phí vừa phải.

## Cơ chế build-time

`scripts/generate-crown-lock.mjs` đọc `CROWN_PASSWORD` từ môi trường build, sinh salt 16 byte, IV 12 byte và nonce 32 byte, rồi dùng PBKDF2-SHA-256 với 600.000 vòng để derive khóa AES-GCM 256 bit. Khóa này mã hóa payload marker và nonce.

File `src/generated/crown-lock.ts` chỉ chứa version, iterations, salt, IV và ciphertext. File được `.gitignore`, không được commit hoặc upload riêng. Vite đưa verifier vào bundle GitHub Pages; vì vậy brute-force offline vẫn khả thi và được chấp nhận trong mô hình này.

Frontend derive lại khóa từ mật khẩu người dùng và chỉ mở Crown khi AES-GCM giải mã thành công, payload hợp lệ và marker đúng. Sau năm lần sai liên tiếp, form bị khóa 60 giây. Trạng thái khóa và cờ mở Crown chỉ dùng `sessionStorage`, nên tab mới vẫn yêu cầu mật khẩu.

## Mật khẩu production

Mọi mật khẩu từng xuất hiện trong lịch sử repo phải được coi là đã lộ và không được tái sử dụng. Maintainer cần tạo passphrase Crown mới gồm khoảng năm từ không liên quan hoặc ít nhất 20 ký tự, rồi lưu duy nhất tại:

`Settings → Secrets and variables → Actions → New repository secret`

Tên secret: `CROWN_PASSWORD`

Không đặt giá trị vào source, file mẫu môi trường, README, pull request, commit message hoặc log. Workflow GitHub Pages dừng với lỗi nếu secret chưa tồn tại, chạy generator trong job build và chỉ upload `dist/`.
