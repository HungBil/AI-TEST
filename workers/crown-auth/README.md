# Crown password verifier

Cloudflare Worker này giữ mật khẩu Crown ở phía máy chủ. Frontend công khai chỉ biết URL Worker, không chứa mật khẩu hoặc hash có thể dùng để dò offline.

## Bảo vệ được gì

- Không lộ mật khẩu trong repo, source map hoặc bundle JavaScript.
- Không thể kiểm tra hàng loạt mật khẩu offline từ verifier phía client.
- Chỉ chấp nhận origin trong allowlist.
- Rate limit theo thiết bị và toàn cục.
- So sánh digest theo thời gian cố định, thêm độ trễ và jitter khi sai.
- Trả token HMAC có hạn dùng; frontend chỉ lưu token trong `sessionStorage`.

Câu hỏi và đáp án vẫn là dữ liệu public theo yêu cầu. Người có kỹ thuật có thể sửa frontend để bỏ qua màn hình Crown, nhưng không thể suy ra mật khẩu từ mã nguồn vì việc xác minh nằm tại Worker.

## Triển khai bằng GitHub Actions

Tạo repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CROWN_PASSWORD`
- `CROWN_TOKEN_SECRET`, chuỗi ngẫu nhiên tối thiểu 32 ký tự

Chạy workflow **Deploy Crown authentication Worker**. Workflow sẽ:

1. Chạy test Worker.
2. Deploy code.
3. Upload `CROWN_PASSWORD` và `CROWN_TOKEN_SECRET` bằng cơ chế secret của Wrangler.

Sau khi deploy, lấy URL dạng:

```text
https://ai-test-crown-auth.<subdomain>.workers.dev
```

Tạo repository variable:

```text
CROWN_AUTH_URL=https://ai-test-crown-auth.<subdomain>.workers.dev
```

Sau đó chạy lại workflow GitHub Pages.

## Triển khai thủ công lần đầu

```bash
cd workers/crown-auth
npx wrangler deploy
npx wrangler secret put CROWN_PASSWORD
npx wrangler secret put CROWN_TOKEN_SECRET
```

Bản deploy đầu tiên sẽ trả 503 cho tới khi hai secret được cấu hình. `wrangler secret put` tạo phiên bản mới có secret mà không đưa giá trị vào source.

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
