import { useState } from "react";
import { EXERCISE_DB, MODIFIERS } from "../../data/exercise_db";
import { Workout, workoutPerExercise } from "../../store/usePlayerStore";
import { formatDuration } from "../../hooks/useTimer";

const COLLAPSED_H = 'h-[11rem]';
const EXPANDED_H = 'h-[26rem]';

const STATUS_META: Record<string, { label: string; tw: string; dot: string }> = {
    workout:  { label: 'session logged', tw: 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',       dot: 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' },
    optimal:  { label: 'optimal',        tw: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10', dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]' },
    restday:  { label: 'rest day',       tw: 'border-amber-400/40 text-amber-300 bg-amber-500/10',    dot: 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' },
    critical: { label: 'critical',       tw: 'border-red-400/40 text-red-300 bg-red-500/10',          dot: 'bg-red-400 shadow-[0_0_6px_#f87171]' },
};

const FALLBACK_STATUS = { label: 'unknown', tw: 'border-slate-600 text-slate-400 bg-slate-500/10', dot: 'bg-slate-500' };

function splitDate(date: string) {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return { day: date, month: '', weekday: '' };
    return {
        day: String(parsed.getDate()).padStart(2, '0'),
        month: parsed.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
        weekday: parsed.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
    };
}

function Stat({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
    return (
        <div className="flex min-w-0 flex-col gap-1 border-l border-border-subtle pl-2 first:border-l-0 first:pl-0">
            <span className="truncate text-[10px] tracking-wider text-text-muted uppercase">{label}</span>
            <span className={`font-robotomono text-sm ${accent ? 'text-accent-light' : 'text-text-bright'}`}>{value}</span>
        </div>
    );
}

function ExerciseRow({ exId, data, max }: { exId: string; data: workoutPerExercise; max: number }) {
    const meta = EXERCISE_DB[exId];
    const sets = data?.sets ?? [];
    const totalReps = data?.totalReps ?? 0;

    const modifiers = [...new Set(sets.flatMap(s => s.modifiers ?? []))];
    const addedWeight = Math.max(0, ...sets.map(s => s.extraWeight ?? 0));

    return (
        <li className="group/row flex flex-col gap-1.5 py-2 border-t border-border-subtle/60 first:border-t-0">
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-text-bright truncate">{meta?.name ?? exId}</span>
                <span className="font-robotomono text-xs text-accent-light shrink-0">
                    {totalReps}<span className="text-text-muted"> {meta?.unit ?? 'reps'}</span>
                </span>
            </div>

            <div className="h-px w-full bg-border-subtle/60 overflow-hidden">
                <div
                    className="h-full bg-linear-to-r from-accent/40 to-accent-glow transition-[width] duration-500"
                    style={{ width: `${max > 0 ? (totalReps / max) * 100 : 0}%` }}
                />
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-robotomono text-[10px] text-text-muted">
                    {sets.length > 0 ? sets.map(s => s.reps).join(' · ') : '—'}
                </span>
                {addedWeight > 0 && (
                    <span className="font-robotomono text-[10px] text-warning">+{addedWeight}kg</span>
                )}
                {modifiers.map(m => (
                    <span key={m} className="px-1.5 py-px text-[9px] tracking-wider uppercase rounded-xs border border-border-main text-text-muted">
                        {MODIFIERS[m as keyof typeof MODIFIERS]?.label ?? m}
                    </span>
                ))}
            </div>
        </li>
    );
}

export default function HistoryCard({ date, workout }: { date: string; workout: Workout }) {
    const [open, setOpen] = useState(false);

    const { day, month, weekday } = splitDate(date);
    const status = STATUS_META[workout?.status] ?? FALLBACK_STATUS;

    const exercises = Object.entries(workout?.exercises ?? {});
    const maxReps = Math.max(0, ...exercises.map(([, ex]) => ex?.totalReps ?? 0));
    const leveledUp = workout?.leveledUp ?? 0;
    const panelId = `history-log-${date}`;

    return (
        <article className={`group relative flex flex-col gap-4 overflow-hidden rounded-sm border border-border-subtle bg-panel/70 p-5 transition-[height,border-color,box-shadow] duration-300 ease-out hover:border-accent/40 hover:shadow-[0_0_28px_-10px_#06b6d4] ${open ? EXPANDED_H : COLLAPSED_H}`}>

            <span className="pointer-events-none absolute -top-px -left-px h-3 w-3 border-t border-l border-accent/50 opacity-60 transition-opacity group-hover:opacity-100" />
            <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent/50 opacity-60 transition-opacity group-hover:opacity-100" />

            <header className="flex shrink-0 items-start justify-between gap-3">
                <div className="flex items-baseline gap-2">
                    <span className="font-robotomono text-2xl leading-none text-text-bright">{day}</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] tracking-widest text-accent-light uppercase leading-none">{month}</span>
                        <span className="text-[10px] tracking-widest text-text-muted uppercase leading-none mt-0.5">{weekday}</span>
                    </div>
                </div>

                <span className={`flex items-center gap-1.5 shrink-0 px-2 py-1 text-[10px] tracking-widest uppercase rounded-xs border ${status.tw}`}>
                    <span className={`h-1 w-1 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </header>

            <div className="grid shrink-0 grid-cols-4 gap-x-2">
                {/* `duration` is stored in seconds — it used to render with an "m" suffix. */}
                <Stat label="time" value={formatDuration(workout?.duration ?? 0)} />
                <Stat label="sets" value={workout?.totalSets ?? 0} />
                <Stat label="volume" value={workout?.totalVolume ?? 0} accent />
                <Stat label="levels" value={leveledUp > 0 ? `+${leveledUp}` : '—'} accent={leveledUp > 0} />
            </div>

            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex shrink-0 items-center gap-2 text-left cursor-pointer group/btn"
            >
                <span className="text-[10px] tracking-widest uppercase text-text-muted transition-colors group-hover/btn:text-accent-light">
                    Exercise Log
                </span>
                <span className="flex-1 h-px bg-border-subtle transition-colors group-hover/btn:bg-accent/30" />
                <span className="font-robotomono text-[10px] text-text-muted">{exercises.length}</span>
                <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className={`h-3 w-3 text-text-muted transition-transform duration-300 group-hover/btn:text-accent-light ${open ? 'rotate-180' : ''}`}
                >
                    <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <section
                id={panelId}
                aria-hidden={!open}
                className={`flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 transition-opacity duration-200 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
                {exercises.length > 0 ? (
                    <ul className="flex flex-col">
                        {exercises.map(([exId, exData]) => (
                            <ExerciseRow key={`${date}-${exId}`} exId={exId} data={exData} max={maxReps} />
                        ))}
                    </ul>
                ) : (
                    <p className="font-robotomono text-[11px] text-text-muted py-2">// no entries recorded</p>
                )}

                {workout?.notes && (
                    <p className="text-[11px] italic text-text-main border-l-2 border-border-main pl-3">{workout.notes}</p>
                )}
            </section>
        </article>
    );
}
