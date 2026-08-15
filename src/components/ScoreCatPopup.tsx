import '../styles/score-cat.css';

type Tier = 'high' | 'mid' | 'low';

interface Props {
  percent: number;
  onClose: () => void;
}

const COPY: Record<Tier, { title: string; detail: string; image: string; alt: string }> = {
  high: {
    title: 'Giỏi hơn anh Hưng rồi',
    detail: 'Từ 70% trở lên. Giữ nhịp này và xem lại vài câu sai để khóa kiến thức.',
    image: 'cats/cat-high.webp',
    alt: 'Nhiều chú mèo dễ thương ăn mừng với cúp và pháo giấy'
  },
  mid: {
    title: 'Giỏi ha',
    detail: 'Từ 50% đến dưới 70%. Nền tảng ổn rồi, tập trung đúng module còn yếu.',
    image: 'cats/cat-mid.webp',
    alt: 'Nhiều chú mèo dễ thương giơ ngón cái động viên'
  },
  low: {
    title: 'Cố lên nhé',
    detail: 'Dưới 50%. Làm lại theo Practice mode, mở gợi ý và học từng lỗi một.',
    image: 'cats/cat-low.webp',
    alt: 'Nhiều chú mèo dễ thương học bài và động viên cố gắng'
  }
};

function tierFor(percent: number): Tier {
  if (percent >= 70) return 'high';
  if (percent >= 50) return 'mid';
  return 'low';
}

export function ScoreCatPopup({ percent, onClose }: Props) {
  const tier = tierFor(percent);
  const copy = COPY[tier];
  const imageUrl = `${import.meta.env.BASE_URL}${copy.image}`;

  return (
    <div className="score-cat-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={`score-cat-dialog score-cat-${tier}`} role="dialog" aria-modal="true" aria-labelledby="score-cat-title">
        <button type="button" className="score-cat-close" aria-label="Đóng lời chúc" onClick={onClose}>×</button>
        <div className="score-cat-art">
          <img src={imageUrl} alt={copy.alt} />
        </div>
        <div className="score-cat-copy">
          <span className="eyebrow">Kết quả {percent}%</span>
          <h2 id="score-cat-title">{copy.title}</h2>
          <p>{copy.detail}</p>
          <button type="button" className="primary" onClick={onClose}>Xem chi tiết kết quả</button>
        </div>
      </section>
    </div>
  );
}
