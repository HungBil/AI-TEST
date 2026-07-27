import { useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';

const PASSWORD_HASH = '25d8f633a763a77cdef452a6f479d4c4ddecba0df41518cfca02bddf916418d3';

interface Props {
  onUnlock: () => void;
}

async function sha256(value: string): Promise<string> {
  const payload = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', payload);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function CrownGate({ onUnlock }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const close = () => {
    if (checking) return;
    setOpen(false);
    setPassword('');
    setError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const candidate = password.trim();
    if (!candidate) {
      setError('Hãy nhập mật khẩu.');
      return;
    }
    if (!window.crypto?.subtle) {
      setError('Trình duyệt này không hỗ trợ kiểm tra mật khẩu.');
      return;
    }

    setChecking(true);
    setError('');
    try {
      const digest = await sha256(candidate);
      if (digest !== PASSWORD_HASH) {
        setError('Mật khẩu không đúng.');
        setChecking(false);
        return;
      }

      setChecking(false);
      setOpen(false);
      setPassword('');
      setError('');
      onUnlock();
    } catch {
      setChecking(false);
      setError('Không thể kiểm tra mật khẩu. Hãy thử lại.');
    }
  };

  return (
    <>
      <button
        className="crown-access"
        type="button"
        aria-label="Mở bộ đề khóa mới"
        title="Bộ đề khóa mới"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">👑</span>
      </button>

      {open && (
        <div className="gate-backdrop" role="presentation" onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) close();
        }}>
          <form className="gate-dialog card" onSubmit={submit}>
            <button className="gate-close" type="button" aria-label="Đóng" onClick={close}>×</button>
            <span className="eyebrow">Khu vực giới hạn</span>
            <h2>Mở bộ mô phỏng khóa mới</h2>
            <p>Nhập mật khẩu để truy cập. Bộ đề cũ vẫn được giữ nguyên ở trang chính.</p>
            <label htmlFor="new-exam-password">
              <span>Mật khẩu</span>
              <input
                id="new-exam-password"
                type="password"
                value={password}
                autoFocus
                autoComplete="off"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                  setError('');
                }}
              />
            </label>
            {error && <p className="gate-error" role="alert">{error}</p>}
            <button className="primary" type="submit" disabled={checking}>
              {checking ? 'Đang kiểm tra...' : 'Mở bộ đề'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
