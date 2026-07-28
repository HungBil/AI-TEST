import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';

const AUTH_BASE_URL = import.meta.env.VITE_CROWN_AUTH_URL?.trim().replace(/\/$/, '') ?? '';
const TOKEN_KEY = 'ai-test:crown-token';
const DEVICE_KEY = 'ai-test:crown-device';

interface Props {
  onUnlock: () => void;
}

interface AuthPayload {
  ok?: boolean;
  token?: string;
  expiresAt?: number;
  error?: string;
}

function readSessionToken(): string {
  try {
    return window.sessionStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveSessionToken(token: string) {
  try {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Session persistence is optional; successful unlock still works for this page.
  }
}

function clearSessionToken() {
  try {
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage restrictions.
  }
}

function createDeviceId(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

function getDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const created = createDeviceId();
    window.localStorage.setItem(DEVICE_KEY, created);
    return created;
  } catch {
    return createDeviceId();
  }
}

async function postAuth(path: '/unlock' | '/verify', body: Record<string, string>): Promise<{ response: Response; payload: AuthPayload }> {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Crown-Device': getDeviceId()
    },
    body: JSON.stringify(body),
    credentials: 'omit',
    cache: 'no-store',
    referrerPolicy: 'no-referrer'
  });

  let payload: AuthPayload = {};
  try {
    payload = await response.json() as AuthPayload;
  } catch {
    // Keep a generic error below; never expose backend internals to the UI.
  }
  return { response, payload };
}

export function CrownGate({ onUnlock }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(false);

  useEffect(() => {
    if (!AUTH_BASE_URL) return;
    const token = readSessionToken();
    if (!token) return;

    let cancelled = false;
    setVerifyingSession(true);
    void postAuth('/verify', { token })
      .then(({ response, payload }) => {
        if (cancelled) return;
        if (response.ok && payload.ok) {
          setAuthorized(true);
          return;
        }
        clearSessionToken();
        setAuthorized(false);
      })
      .catch(() => {
        // A temporary network failure should not erase a token that may still be valid.
      })
      .finally(() => {
        if (!cancelled) setVerifyingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openGate = () => {
    if (authorized) {
      onUnlock();
      return;
    }
    setOpen(true);
  };

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
    if (!AUTH_BASE_URL) {
      setError('Cổng bảo mật chưa được cấu hình trên bản triển khai này.');
      return;
    }

    setChecking(true);
    setError('');
    try {
      const { response, payload } = await postAuth('/unlock', { password: candidate });

      if (response.status === 429) {
        setError('Thử quá nhiều lần. Hãy đợi khoảng một phút rồi thử lại.');
        return;
      }
      if (response.status === 403) {
        setError('Tên miền hiện tại chưa được phép dùng cổng Crown.');
        return;
      }
      if (!response.ok || !payload.ok || typeof payload.token !== 'string') {
        setError('Mật khẩu không đúng.');
        return;
      }

      saveSessionToken(payload.token);
      setAuthorized(true);
      setOpen(false);
      setPassword('');
      onUnlock();
    } catch {
      setError('Không kết nối được cổng bảo mật. Hãy thử lại.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <button
        className="crown-access"
        type="button"
        aria-label="Mở bộ đề khóa mới"
        title="Bộ đề khóa mới"
        onClick={openGate}
        disabled={verifyingSession}
      >
        <span aria-hidden="true">{verifyingSession ? '…' : '👑'}</span>
      </button>

      {open && (
        <div className="gate-backdrop" role="presentation" onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) close();
        }}>
          <form className="gate-dialog card" onSubmit={submit}>
            <button className="gate-close" type="button" aria-label="Đóng" onClick={close}>×</button>
            <span className="eyebrow">Khu vực giới hạn</span>
            <h2>Mở bộ mô phỏng khóa mới</h2>
            <p>Mật khẩu được kiểm tra ở máy chủ bảo mật, không được nhúng trong mã frontend công khai.</p>
            <label htmlFor="new-exam-password">
              <span>Mật khẩu</span>
              <input
                id="new-exam-password"
                type="password"
                value={password}
                autoFocus
                autoComplete="current-password"
                maxLength={256}
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
