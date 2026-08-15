import { useEffect, useState, type MouseEvent } from 'react';
import '../styles/result-celebration.css';

interface Props {
  percent: number;
  examTitle: string;
}

export interface CelebrationTier {
  key: 'high' | 'mid' | 'low';
  title: string;
  subtitle: string;
  image: string;
}

export function getCelebrationTier(percent: number): CelebrationTier {
  if (percent >= 70) {
    return {
      key: 'high',
      title: 'Giỏi hơn anh Hưng rồi!',
      subtitle: 'Bạn đạt từ 70% trở lên.',
      image: 'result-cats/cats-70.webp'
    };
  }
  if (percent >= 50) {
    return {
      key: 'mid',
      title: 'Giỏi ha!',
      subtitle: 'Bạn đã vượt mốc 50%.',
      image: 'result-cats/cats-50.webp'
    };
  }
  return {
    key: 'low',
    title: 'Cố lên nhé!',
    subtitle: 'Xem lại các câu sai rồi thử thêm một lượt.',
    image: 'result-cats/cats-under-50.webp'
  };
}

function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function ResultCelebration({ percent, examTitle }: Props) {
  const [open, setOpen] = useState(true);
  const tier = getCelebrationTier(percent);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!open) return null;

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setOpen(false);
  };

  return (
    <div className={`result-celebration-backdrop tier-${tier.key}`} onMouseDown={closeFromBackdrop}>
      <section
        className="result-celebration-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-celebration-title"
        aria-describedby="result-celebration-description"
      >
        <button
          type="button"
          className="result-celebration-close"
          aria-label="Đóng lời chúc"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <img
          className="result-celebration-image"
          src={assetUrl(tier.image)}
          alt={`${tier.title} ${tier.subtitle}`}
        />
        <div className="result-celebration-copy">
          <span>{examTitle}</span>
          <h2 id="result-celebration-title">{tier.title}</h2>
          <p id="result-celebration-description">
            Điểm của bạn: <strong>{percent}%</strong>. {tier.subtitle}
          </p>
          <button type="button" className="primary" autoFocus onClick={() => setOpen(false)}>
            Xem kết quả chi tiết
          </button>
        </div>
      </section>
    </div>
  );
}
