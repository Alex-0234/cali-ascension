import { useEffect, useState } from "react";
import { isLoggedToday, latestEntry, type AnyTracker, type TrackerValue } from "../../../store/usePlayerStore";

const NOTE_PLACEHOLDER = 'e.g. Weighed in at 7:00, empty stomach';

export default function LogTrackerModal({
    tracker,
    onClose,
    onLog,
}: {
    tracker: AnyTracker;
    onClose: () => void;
    onLog: (value: TrackerValue, note?: string) => void;
}) {
    const type = typeof tracker.tracking as 'number' | 'string' | 'boolean';
    const previous = latestEntry(tracker);
    const alreadyLogged = isLoggedToday(tracker);

    const [value, setValue] = useState(() => String(alreadyLogged && previous ? previous.value : tracker.tracking));
    const [note, setNote] = useState(alreadyLogged ? previous?.note ?? "" : "");
    const [error, setError] = useState("");

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (type === 'number') {
            if (!Number.isFinite(Number(value)) || value.trim() === '') {
                return setError("Today's value must be a number");
            }
            onLog(Number(value), note);
        } else if (type === 'boolean') {
            onLog(value === 'true', note);
        } else {
            const trimmed = value.trim();
            if (!trimmed) return setError("Today's value can't be empty");
            onLog(trimmed, note);
        }

        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Log ${tracker.name}`}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-sm border border-accent/40 bg-card/95 p-6 shadow-[0_0_40px_-12px_#06b6d4]"
            >
                <span className="pointer-events-none absolute -top-px -left-px h-3 w-3 border-t border-l border-accent/60" />
                <span className="pointer-events-none absolute -right-px -bottom-px h-3 w-3 border-r border-b border-accent/60" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xs tracking-widest text-accent-light uppercase">[ System.Log_Entry ]</h2>
                        <p className="text-[11px] text-text-muted">
                            {alreadyLogged
                                ? <>Today&apos;s entry for <span className="text-text-bright">{tracker.name}</span> is already in — saving overwrites it</>
                                : <>Record today&apos;s value for <span className="text-text-bright">{tracker.name}</span></>}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="log-value" className="text-[10px] tracking-widest text-text-muted uppercase">
                            Today&apos;s value
                        </label>
                        {type === 'boolean' ? (
                            <select
                                id="log-value"
                                autoFocus
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                className="cursor-pointer rounded-sm border border-border-main bg-card px-3 py-2 font-robotomono text-sm text-text-bright focus:border-accent focus:outline-none"
                            >
                                <option value="false">False</option>
                                <option value="true">True</option>
                            </select>
                        ) : (
                            <input
                                id="log-value"
                                autoFocus
                                type={type === 'number' ? 'number' : 'text'}
                                step="any"
                                maxLength={type === 'string' ? 32 : undefined}
                                placeholder={previous ? String(previous.value) : '—'}
                                value={value}
                                onChange={e => { setValue(e.target.value); setError(""); }}
                                className="rounded-sm border border-border-main bg-card px-3 py-2 font-robotomono text-sm text-text-bright focus:border-accent focus:outline-none"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="log-note" className="text-[10px] tracking-widest text-text-muted uppercase">
                            Note <span className="normal-case opacity-60">— optional</span>
                        </label>
                        <input
                            id="log-note"
                            type="text"
                            maxLength={80}
                            placeholder={NOTE_PLACEHOLDER}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="rounded-sm border border-border-main bg-card px-3 py-2 text-sm text-text-bright placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                        />
                    </div>

                    {error && <p className="text-[11px] text-danger">{error}</p>}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 cursor-pointer rounded-sm border border-border-main py-2 text-[11px] tracking-widest text-text-muted uppercase transition-colors hover:text-text-bright"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-2 text-[11px] tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
                        >
                            {alreadyLogged ? 'Overwrite' : 'Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
