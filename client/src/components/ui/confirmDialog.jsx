import { useEffect, useId, useRef, useState } from 'react';

/**
 * In-app replacement for `window.confirm`. Native dialogs freeze the page, can't
 * be styled, and read as a browser error rather than part of the app.
 *
 * Pass `phrase` for destructive actions: the confirm button stays disabled until
 * the user types it exactly, which turns an irreversible click into a deliberate
 * one. The dialog body is a separate component mounted only while open, so the
 * typed value starts empty every time rather than persisting from a cancelled attempt.
 */
export default function ConfirmDialog({ open, ...props }) {
    if (!open) return null;
    return <Dialog {...props} />;
}

function Dialog({
    title,
    body,
    phrase,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    tone = 'accent',
    onConfirm,
    onCancel,
}) {
    const titleId = useId();
    const inputId = useId();

    const confirmRef = useRef(null);
    const inputRef = useRef(null);

    const [typed, setTyped] = useState('');
    const matches = !phrase || typed.trim() === phrase;

    useEffect(() => {
        (inputRef.current ?? confirmRef.current)?.focus();

        const onKeyDown = (event) => { if (event.key === 'Escape') onCancel?.(); };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onCancel]);

    const confirmTone = tone === 'danger'
        ? 'border-danger/60 bg-danger/10 text-danger hover:bg-danger/20'
        : 'border-accent/50 bg-accent/10 text-accent-light hover:bg-accent/20';

    const confirm = () => { if (matches) onConfirm?.(); };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-90 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="flex w-full max-w-sm flex-col gap-4 rounded-sm border border-border-main bg-panel p-6"
            >
                <h2 id={titleId} className="text-sm tracking-widest text-text-bright uppercase">{title}</h2>
                {body && <p className="text-xs leading-relaxed text-text-muted">{body}</p>}

                {phrase && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor={inputId} className="text-xs leading-relaxed text-text-muted">
                            To confirm, type{' '}
                            <span className="font-robotomono text-text-bright">{phrase}</span>{' '}
                            below.
                        </label>
                        <input
                            ref={inputRef}
                            id={inputId}
                            type="text"
                            value={typed}
                            autoComplete="off"
                            spellCheck="false"
                            onChange={(event) => setTyped(event.target.value)}
                            onKeyDown={(event) => { if (event.key === 'Enter') confirm(); }}
                            className="w-full rounded-sm border border-border-main bg-card px-3 py-2 font-robotomono text-sm text-text-bright transition-colors focus:border-danger focus:outline-none"
                        />
                    </div>
                )}

                <div className="mt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="cursor-pointer rounded-sm border border-border-main px-4 py-2 text-xs tracking-wider text-text-main uppercase transition-colors hover:border-border-subtle hover:text-text-bright"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        type="button"
                        onClick={confirm}
                        disabled={!matches}
                        className={`cursor-pointer rounded-sm border px-4 py-2 text-xs tracking-wider uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${confirmTone}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
