const DEFAULT_TEXT = 'Đây chỉ là đề cương ôn tập cộng đồng, không phải đề thi chính thức của VinUni, không cố gắng mô phỏng đề thi thật và không cam kết giống đề thật. Người học cần tự research thêm và tự phát triển thêm.';

export function Disclaimer({ text = DEFAULT_TEXT }: { text?: string }) {
  return (
    <aside className="disclaimer">
      <strong>Lưu ý:</strong> {text}
    </aside>
  );
}
