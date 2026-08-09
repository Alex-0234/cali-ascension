import { isLoggedToday, latestEntry, type AnyTracker } from "../../../store/usePlayerStore";

function formatValue(value: number | string | boolean) {
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'number') return String(value);
    return value.trim() || '—';
}

function formatDate(date: Date | string) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase();
}

export default function Tracker({
    tracker,
    onLog,
    onRemove,
    removable = true,
}: {
    tracker: AnyTracker;
    onLog: () => void;
    onRemove: () => void;
    removable?: boolean;
}) {
    const { name, tracking, history } = tracker;

    const latest = latestEntry(tracker);
    const loggedToday = isLoggedToday(tracker);

    const previous = history.length > 1 ? history[history.length - 2] : null;
    const delta = typeof tracking === 'number' && typeof previous?.value === 'number'
        ? tracking - previous.value
        : null;

    return (
        <li className="group flex items-center gap-3 border-t border-border-subtle/60 px-3 py-2.5 transition-colors first:border-t-0 hover:bg-accent/5">
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    loggedToday ? 'bg-accent shadow-[0_0_6px_#22d3ee]' : 'bg-text-muted/40'
                }`}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs text-text-bright">{name}</span>
                <span className="font-robotomono truncate text-[10px] tracking-wider text-text-muted uppercase">
                    {latest ? `logged ${formatDate(latest.loggedAt)}` : 'never logged'} · {history.length} entries
                </span>
                {latest?.note && (
                    <span className="truncate text-[10px] text-text-muted/80 italic">{latest.note}</span>
                )}
            </div>

            {delta !== null && delta !== 0 && (
                <span className={`font-robotomono shrink-0 text-[10px] ${delta > 0 ? 'text-success' : 'text-warning'}`}>
                    {delta > 0 ? '+' : ''}{Number(delta.toFixed(2))}
                </span>
            )}

            <span className="font-robotomono shrink-0 text-sm text-accent-light">{formatValue(tracking)}</span>

            <button
                type="button"
                onClick={onLog}
                title={loggedToday ? 'Logged today — resets at midnight' : 'Log today’s value'}
                className={`shrink-0 cursor-pointer rounded-xs border px-2 py-1 text-[9px] tracking-widest uppercase transition-colors ${
                    loggedToday
                        ? 'border-border-main text-text-muted hover:border-accent/50 hover:text-accent-light'
                        : 'border-accent/50 bg-accent/10 text-accent-light hover:bg-accent/20'
                }`}
            >
                {loggedToday ? '✓ Logged' : 'Update'}
            </button>

            {removable ? (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${name}`}
                    className="shrink-0 cursor-pointer rounded-xs border border-transparent px-1.5 py-0.5 text-xs leading-none text-text-muted opacity-0 transition-[opacity,color,border-color] hover:border-danger/40 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                >
                    ✕
                </button>
            ) : (
                <span className="shrink-0 px-1.5 py-0.5 text-[9px] tracking-wider text-text-muted/60 uppercase">
                    default
                </span>
            )}
        </li>
    );
}
