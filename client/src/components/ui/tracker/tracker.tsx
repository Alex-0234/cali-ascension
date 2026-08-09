import type { AnyTracker } from "../../../store/usePlayerStore";

function formatValue(value: number | string | boolean) {
    if (typeof value === 'boolean') return value ? 'ACTIVE' : 'IDLE';
    if (typeof value === 'number') return String(value);
    return value.trim() || '—';
}

function formatDate(date: Date | string) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase();
}

export default function Tracker({ tracker, onRemove }: { tracker: AnyTracker; onRemove: () => void }) {
    const { name, tracking, history, createdAt } = tracker;

    const previous = history.length > 0 ? history[history.length - 1] : null;
    const delta = typeof tracking === 'number' && typeof previous === 'number'
        ? tracking - previous
        : null;

    return (
        <li className="group flex items-center gap-3 border-t border-border-subtle/60 px-3 py-2.5 transition-colors first:border-t-0 hover:bg-accent/5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_6px_#22d3ee]" />

            <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs text-text-bright">{name}</span>
                <span className="font-robotomono text-[10px] tracking-wider text-text-muted uppercase">
                    since {formatDate(createdAt)} · {history.length} logged
                </span>
            </div>

            {delta !== null && delta !== 0 && (
                <span className={`font-robotomono shrink-0 text-[10px] ${delta > 0 ? 'text-success' : 'text-warning'}`}>
                    {delta > 0 ? '+' : ''}{delta}
                </span>
            )}

            <span className="font-robotomono shrink-0 text-sm text-accent-light">{formatValue(tracking)}</span>

            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${name}`}
                className="shrink-0 cursor-pointer rounded-xs border border-transparent px-1.5 py-0.5 text-xs leading-none text-text-muted opacity-0 transition-[opacity,color,border-color] hover:border-danger/40 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
            >
                ✕
            </button>
        </li>
    );
}
