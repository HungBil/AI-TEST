# Crown password verifier

Cloudflare Worker này giữ mật khẩu Crown ở phía máy chủ. Frontend công khai chỉ biết URL Worker, không chứa mật khẩu hoặc hash dùng để dò offline.

## Bảo vệ được gì

- Không lộ mật khẩu trong repo, source map hoặc bundle JavaScript.
- Không thể kiểm tra hàng loạt mật khẩu offline từ hash frontend.
- Chỉ chấp nhận origin được cấu hình.
- Rate limit theo thiết bị và toàn cục.
- So sánh digest theo thời gian cố định và thêm độ trễ ngẫu nhiên khi sai.
- Trả token HMAC có hạn dùng; token chỉ được lưu trong `sessionStorage`.

Bộ câu hỏi và đáp án vẫn là dữ liệu public theo yêu cầu. Người biết kỹ thuật vẫn có thể sửa frontend để bỏ qua màn hình Crown, nhưng không thể suy ra mật khẩu từ mã nguồn vì việc xác minh nằm ở Worker.

## Triển khai bằng GitHub Actions

Tạo repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CROWN_PASSWORD`
- `CROWN_TOKEN_SECRET`, chuỗi ngẫu nhiên tối thiểu 32 ký tự

Chạy workflow **Deploy Crown authentication Worker**. Sau khi deploy, lấy URL dạng:

```text
https://ai-test-crown-auth.<subdomain>.workers.dev
```

Tạo repository variable:

```text
CROWN_AUTH_URL=https://ai-test-crown-auth.<subdomain>.workers.dev
```

Sau đó chạy lại workflow GitHub Pages hoặc push vào `main`.

## Triển khai thủ công

```bash
cd workers/crown-auth
npx wrangler secret put CROWN_PASSWORD
npx wrangler secret put CROWN_TOKEN_SECRET
npx wrangler deploy
```

## Chạy local

```bash
cd workers/crown-auth
cp .dev.vars.example .dev.vars
npx wrangler dev
```

Ở terminal khác:

```bash
VITE_CROWN_AUTH_URL=http://localhost:8787 npm run dev
```

Không commit `.dev.vars`, `.env`, mật khẩu thật hoặc token signing secret.
