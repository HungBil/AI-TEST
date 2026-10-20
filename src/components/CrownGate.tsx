import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { verifyCrownPassword } from '../utils/crownLock';

const UNLOCKED_KEY = 'ai-test:crown-unlocked';
const ATTEMPTS_KEY = 'ai-test:crown-attempts';
const MAX_FAILURES = 5;
const LOCK_MS = 60_000;

interface Props {
  onUnlock: () => void;
}

interface AttemptState {
  failures: number;
  lockedUntil: number;
}

const emptyAttempts = (): AttemptState => ({ failures: 0, lockedUntil: 0 });

function readAttempts(now = Date.now()): AttemptState {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY) ?? '') as Partial<AttemptState>;
    if (!Number.isInteger(parsed.failures) || !Number.isFinite(parsed.lockedUntil)) return emptyAttempts();
    if ((parsed.lockedUntil ?? 0) <= now && (parsed.lockedUntil ?? 0) > 0) {
      sessionStorage.removeItem(ATTEMPTS_KEY);
      return emptyAttempts();
    }
    return {
      failures: Math.max(0, parsed.failures ?? 0),
      lockedUntil: Math.max(0, parsed.lockedUntil ?? 0)
    };
  } catch {
    return emptyAttempts();
  }
}

function saveAttempts(attempts: AttemptState) {
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // Session persistence is optional; the in-memory limit still applies.
  }
}

function clearAttempts() {
  try {
    sessionStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    // Session persistence is optional.
  }
}

function isSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveSessionUnlock() {
  try {
    sessionStorage.setItem(UNLOCKED_KEY, 'true');
  } catch {
    // The current unlock still works when session storage is unavailable.
  }
}

export function CrownGate({ onUnlock }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const checkingRef = useRef(false);
  const attemptsRef = useRef<AttemptState>(emptyAttempts());
  const locked = lockedUntil > Date.now();

  useEffect(() => {
    if (!lockedUntil) return;
    const remaining = lockedUntil - Date.now();
    if (remaining <= 0) {
      attemptsRef.current = emptyAttempts();
      clearAttempts();
      setLockedUntil(0);
      return;
    }
    const timer = window.setTimeout(() => {
      attemptsRef.current = emptyAttempts();
      clearAttempts();
      setLockedUntil(0);
      setError('');
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [lockedUntil]);

  const openGate = () => {
    if (isSessionUnlocked()) {
      onUnlock();
      return;
    }
    attemptsRef.current = readAttempts();
    setLockedUntil(attemptsRef.current.lockedUntil);
    setOpen(true);
  };

  const close = () => {
    if (checkingRef.current) return;
    setOpen(false);
    setPassword('');
    setError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkingRef.current || attemptsRef.current.lockedUntil > Date.now()) return;

    const candidate = password.trim();
    if (!candidate) {
      setError('Hãy nhập mật khẩu.');
      return;
    }

    checkingRef.current = true;
    setChecking(true);
    setError('');
    try {
      if (!await verifyCrownPassword(candidate)) {
        const failures = attemptsRef.current.failures + 1;
        const next = {
          failures,
          lockedUntil: failures >= MAX_FAILURES ? Date.now() + LOCK_MS : 0
        };
        attemptsRef.current = next;
        saveAttempts(next);
        setLockedUntil(next.lockedUntil);
        setError('Mật khẩu không đúng.');
        return;
      }

      clearAttempts();
      attemptsRef.current = emptyAttempts();
      saveSessionUnlock();
      setOpen(false);
      setPassword('');
      onUnlock();
    } finally {
      checkingRef.current = false;
      setChecking(false);
    }
  };

  return (
    <>
      <button
        className="study-space study-space-crown crown-access"
        type="button"
        aria-label="Mở ôn tập nền tảng khóa mới 2026"
        title="Bộ đề khóa mới"
        onClick={openGate}
      >
        <span className="study-space-top"><span className="study-space-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 10 6 5 5-8 5 8 6-5-3 14H8L5 10Zm4 18h14" /></svg>
        </span><span className="study-space-label">Khóa mới 2026</span></span>
        <strong className="study-space-title">Ôn tập nền tảng</strong>
        <span className="study-space-description">Toán, Python, ML/AI và đạo đức AI. Bộ mô phỏng 60 câu mỗi đề.</span>
        <span className="study-space-footer"><span>Mở bằng mật khẩu</span><span className="study-space-arrow" aria-hidden="true">↗</span></span>
      </button>

      {open && (
        <div className="gate-backdrop" role="presentation" onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) close();
        }}>
          <form className="gate-dialog card" onSubmit={submit}>
            <button className="gate-close" type="button" aria-label="Đóng" onClick={close}>×</button>
            <span className="eyebrow">Khu vực giới hạn</span>
            <h2>Mở bộ mô phỏng khóa mới</h2>
            <p>Đây là cổng truy cập phía trình duyệt, không phải hệ thống xác thực.</p>
            <label htmlFor="new-exam-password">
              <span>Mật khẩu</span>
              <input
                id="new-exam-password"
                type="password"
                value={password}
                autoFocus
                autoComplete="current-password"
                maxLength={256}
                disabled={checking || locked}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                  setError('');
                }}
              />
            </label>
            {error && <p className="gate-error" role="alert">{error}</p>}
            <button className="primary" type="submit" disabled={checking || locked}>
              {checking ? 'Đang kiểm tra...' : locked ? 'Tạm khóa 60 giây' : 'Mở bộ đề'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
