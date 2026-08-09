import { useEffect, useState } from "react";
import { createTracker, type AnyTracker } from "../../../store/usePlayerStore";

const TYPES = [
    { id: 'number', label: 'Number' },
    { id: 'text', label: 'Text' },
    { id: 'toggle', label: 'Toggle' },
] as const;

const NOTE_PLACEHOLDER = 'e.g. Weighed in at 7:00, empty stomach';

type TrackerType = typeof TYPES[number]['id'];

function buildTracker(name: string, type: TrackerType, value: string, note: string): AnyTracker {
    const parsed = type === 'number' ? Number(value)
        : type === 'toggle' ? value === 'true'
        : value.trim();

    const tracker = createTracker(name, parsed);
    const trimmedNote = note.trim();
    if (trimmedNote) tracker.history[0].note = trimmedNote;

    return tracker;
}

export default function NewTrackerModal({
    onClose,
    onCreate,
    existingNames,
}: {
    onClose: () => void;
    onCreate: (tracker: AnyTracker) => void;
    existingNames: string[];
}) {
    const [name, setName] = useState("");
    const [type, setType] = useState<TrackerType>('number');
    const [value, setValue] = useState("0");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    function selectType(next: TrackerType) {
        setType(next);
        setValue(next === 'number' ? '0' : next === 'toggle' ? 'false' : '');
        setError("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) return setError("Tracker needs a name");
        if (existingNames.some(n => n.toLowerCase() === trimmed.toLowerCase())) {
            return setError("A tracker with that name already exists");
        }
        if (type === 'number' && !Number.isFinite(Number(value))) {
            return setError("Starting value must be a number");
        }

        onCreate(buildTracker(trimmed, type, value, note));
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
                aria-label="New tracker"
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-sm border border-accent/40 bg-card/95 p-6 shadow-[0_0_40px_-12px_#06b6d4]"
            >
                <span className="pointer-events-none absolute -top-px -left-px h-3 w-3 border-t border-l border-accent/60" />
                <span className="pointer-events-none absolute -right-px -bottom-px h-3 w-3 border-r border-b border-accent/60" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xs tracking-widest text-accent-light uppercase">[ System.New_Tracker ]</h2>
                        <p className="text-[11px] text-text-muted">Define a metric for the system to record</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="tracker-name" className="text-[10px] tracking-widest text-text-muted uppercase">
                            Name
                        </label>
                        <input
                            id="tracker-name"
                            autoFocus
                            type="text"
                            maxLength={32}
                            placeholder="e.g. Resting heart rate"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(""); }}
                            className="rounded-sm border border-border-main bg-card px-3 py-2 text-sm text-text-bright focus:border-accent focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] tracking-widest text-text-muted uppercase">Type</span>
                        <div className="flex overflow-hidden rounded-sm border border-border-main">
                            {TYPES.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => selectType(t.id)}
                                    className={`flex-1 cursor-pointer py-2 text-[11px] tracking-wider uppercase transition-colors not-first:border-l not-first:border-border-main ${
                                        type === t.id
                                            ? 'bg-accent/10 text-accent-light'
                                            : 'text-text-muted hover:text-text-main'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="tracker-value" className="text-[10px] tracking-widest text-text-muted uppercase">
                            Starting value
                        </label>
                        {type === 'toggle' ? (
                            <select
                                id="tracker-value"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                className="cursor-pointer rounded-sm border border-border-main bg-card px-3 py-2 text-sm text-text-bright focus:border-accent focus:outline-none"
                            >
                                <option value="false">False</option>
                                <option value="true">True</option>
                            </select>
                        ) : (
                            <input
                                id="tracker-value"
                                type={type === 'number' ? 'number' : 'text'}
                                step="any"
                                maxLength={type === 'text' ? 32 : undefined}
                                placeholder={type === 'number' ? '0' : '—'}
                                value={value}
                                onChange={e => { setValue(e.target.value); setError(""); }}
                                className="rounded-sm border border-border-main bg-card px-3 py-2 font-robotomono text-sm text-text-bright focus:border-accent focus:outline-none"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="tracker-note" className="text-[10px] tracking-widest text-text-muted uppercase">
                            Note <span className="normal-case opacity-60">— optional</span>
                        </label>
                        <input
                            id="tracker-note"
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
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
