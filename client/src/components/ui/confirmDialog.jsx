import { useEffect, useRef } from 'react';

/**
 * In-app replacement for `window.confirm`. Native dialogs freeze the page, can't
 * be styled, and read as a browser error rather than part of the app — this one
 * traps focus, closes on Escape, and matches the rest of the interface.
 */
export default function ConfirmDialog({
    open,
    title,
    body,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    tone = 'accent',
    onConfirm,
    onCancel,
}) {
    const confirmRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        confirmRef.current?.focus();

        const onKeyDown = (event) => { if (event.key === 'Escape') onCancel?.(); };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    const confirmTone = tone === 'danger'
        ? 'border-danger/60 bg-danger/10 text-danger hover:bg-danger/20'
        : 'border-accent/50 bg-accent/10 text-accent-light hover:bg-accent/20';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="fixed inset-0 z-90 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="flex w-full max-w-sm flex-col gap-4 rounded-sm border border-border-main bg-panel p-6"
            >
                <h2 id="confirm-title" className="text-sm tracking-widest text-text-bright uppercase">{title}</h2>
                {body && <p className="text-xs leading-relaxed text-text-muted">{body}</p>}

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
                        onClick={onConfirm}
                        className={`cursor-pointer rounded-sm border px-4 py-2 text-xs tracking-wider uppercase transition-colors ${confirmTone}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
