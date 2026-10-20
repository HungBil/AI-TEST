import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { FINAL_ATTEMPTS_KEY, decryptFinalCatalog, finalUnlocked, rememberFinalUnlock } from './access';
import { setFinalCatalog } from './catalog';
import './finals.css';

type Attempts = { failures: number; until: number };
function readAttempts(): Attempts {
  try {
    const v = JSON.parse(sessionStorage.getItem(FINAL_ATTEMPTS_KEY) ?? '{}');
    if (!Number.isInteger(v.failures) || v.failures < 0 || !Number.isFinite(v.until) || v.until < 0) return { failures: 0, until: 0 };
    return v.until && v.until <= Date.now() ? { failures: 0, until: 0 } : v;
  } catch { return { failures: 0, until: 0 }; }
}
function saveAttempts(v: Attempts) {
  try { sessionStorage.setItem(FINAL_ATTEMPTS_KEY, JSON.stringify(v)); } catch { /* Optional storage. */ }
}
export function FinalGate({ onUnlock }: { onUnlock: () => void }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState<Attempts>(readAttempts);
  const busy = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const locked = attempts.until > Date.now();
  useEffect(() => {
    if (!attempts.until) return;
    const timer = window.setTimeout(() => {
      const reset = { failures: 0, until: 0 };
      saveAttempts(reset); setAttempts(reset); setError('');
    }, Math.max(0, attempts.until - Date.now()));
    return () => window.clearTimeout(timer);
  }, [attempts.until]);
  const close = () => {
    if (busy.current) return;
    setOpen(false); setPassword(''); setError(''); trigger.current?.focus();
  };
  const handleKeys = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current || locked) return;
    if (!password.trim()) { setError('Nhập key của khu ôn cuối kỳ.'); return; }
    busy.current = true; setChecking(true); setError('');
    try {
      const catalog = await decryptFinalCatalog(password);
      if (catalog) {
        setFinalCatalog(catalog);
        saveAttempts({ failures: 0, until: 0 });
        setAttempts({ failures: 0, until: 0 });
        rememberFinalUnlock(); setPassword(''); setOpen(false); onUnlock();
      } else {
        const failures = attempts.failures + 1;
        const next = { failures, until: failures >= 5 ? Date.now() + 60_000 : 0 };
        setAttempts(next); saveAttempts(next); setPassword('');
        setError('Key không đúng. Key cuối kỳ tách biệt với Crown.');
      }
    } catch { setError('Chưa kiểm tra được key. Hãy thử lại.'); }
    finally { busy.current = false; setChecking(false); }
  };
  return <>
    <button ref={trigger} className="study-space study-space-finals finals-access" aria-label="Mở ôn tập cuối kỳ Phase 1" title="Ôn cuối kỳ" type="button"
      onClick={() => { if (finalUnlocked()) onUnlock(); else { setAttempts(readAttempts()); setOpen(true); } }}>
      <span className="study-space-top"><span className="study-space-icon" aria-hidden="true"><svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 12 13-6 13 6-13 6-13-6Zm6 4v7c4 4 10 4 14 0v-7M28 13v10" />
      </svg></span><span className="study-space-label">L34 · Phase 1</span></span>
      <strong className="study-space-title">Ôn tập cuối kỳ</strong>
      <span className="study-space-description">10 đề mô phỏng 85 câu và sổ tay kiến thức theo 15 ngày học.</span>
      <span className="study-space-footer"><span>Mở bằng key riêng</span><span className="study-space-arrow" aria-hidden="true">↗</span></span>
    </button>
    {open && <div className="gate-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
      <form className="gate-dialog card" role="dialog" aria-modal="true" aria-labelledby="finals-gate-title" onSubmit={submit} onKeyDown={handleKeys}>
        <button className="gate-close" type="button" aria-label="Đóng khu nhập key cuối kỳ" onClick={close} disabled={checking}>×</button>
        <span className="eyebrow">Không gian ôn tập riêng</span>
        <h2 id="finals-gate-title">Ôn cuối kỳ AI thực chiến</h2>
        <p>Key riêng; không mở bằng phiên Crown hiện tại.</p>
        <label htmlFor="finals-key">Key cuối kỳ</label>
        <input id="finals-key" type="password" value={password} maxLength={256} autoComplete="off" autoFocus
          disabled={checking || locked} onChange={e => setPassword(e.target.value)} />
        {error && <p className="gate-error" role="alert">{error}</p>}
        <button className="primary" disabled={checking || locked} type="submit">
          {checking ? 'Đang kiểm tra…' : locked ? 'Tạm khóa 60 giây' : 'Mở khu cuối kỳ'}
        </button>
      </form>
    </div>}
  </>;
}
