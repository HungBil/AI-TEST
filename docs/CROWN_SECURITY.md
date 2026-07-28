# Bảo vệ mật khẩu Crown

## Mục tiêu

Repo và GitHub Pages đều công khai. Mục tiêu của cơ chế này là **không để mật khẩu Crown hoặc một verifier có thể dùng để dò offline xuất hiện trong source frontend**. Nội dung câu hỏi và đáp án vẫn công khai theo chủ ý của dự án.

## Kiến trúc

```text
Người dùng nhập mật khẩu
        ↓ HTTPS
Cloudflare Worker /unlock
        ├─ kiểm tra Origin allowlist
        ├─ rate limit theo device và toàn cục
        ├─ so sánh digest theo thời gian cố định
        └─ đúng → token HMAC có hạn dùng
                ↓
Frontend lưu token trong sessionStorage
                ↓
/verify khi tải lại trang
```

Mật khẩu thật chỉ nằm trong Cloudflare Worker secret `CROWN_PASSWORD`. Khóa ký token nằm trong `CROWN_TOKEN_SECRET`. Hai giá trị này không được commit và không được đưa vào biến Vite.

## Bắt buộc xoay mật khẩu cũ

Không tái sử dụng bất kỳ mật khẩu nào từng có chuỗi rõ hoặc hash trong lịch sử Git của repo. Xóa hash khỏi nhánh hiện tại không thể bảo đảm hash biến mất khỏi commit cũ, pull request, fork hoặc cache. Khi chuyển sang Worker, hãy đặt một mật khẩu Crown mới trong GitHub secret và chỉ chia sẻ ngoài repo.

## Giới hạn cố ý

Câu hỏi và đáp án được đóng trong bundle public. Người có kỹ thuật có thể đọc dữ liệu hoặc sửa frontend để bỏ qua màn hình Crown. Điều đó không làm lộ mật khẩu vì frontend không giữ verifier. Đây là bảo vệ **password**, không phải DRM cho đề thi.

## Cấu hình bắt buộc

Repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CROWN_PASSWORD`, phải là mật khẩu mới chưa từng xuất hiện trong lịch sử repo
- `CROWN_TOKEN_SECRET`, tối thiểu 32 ký tự ngẫu nhiên

Repository variable:

- `CROWN_AUTH_URL`, URL Worker sau khi deploy

Quy trình chi tiết nằm trong [`workers/crown-auth/README.md`](../workers/crown-auth/README.md).
