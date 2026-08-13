import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import useUserStore from '../store/usePlayerStore';
import { formatDuration } from '../hooks/useTimer';
import HistoryCard from '../components/ui/historyCard';

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'workout', label: 'Sessions' },
    { id: 'restday', label: 'Rest' },
    { id: 'critical', label: 'Critical' },
];

function Summary({ label, value }) {
    return (
        <div className="flex flex-col gap-1 rounded-sm border border-border-subtle bg-panel/50 px-4 py-3">
            <span className="text-[10px] tracking-widest text-text-muted uppercase">{label}</span>
            <span className="font-robotomono text-lg text-text-bright tabular-nums">{value}</span>
        </div>
    );
}

export default function History() {
    const workoutHistory = useUserStore((state) => state.userData.workoutHistory);
    const [filter, setFilter] = useState('all');

    const entries = useMemo(() => {
        if (!workoutHistory || Array.isArray(workoutHistory)) return [];
        return Object.entries(workoutHistory).sort(([a], [b]) => b.localeCompare(a));
    }, [workoutHistory]);

    const totals = useMemo(() => entries.reduce((acc, [, workout]) => ({
        sessions: acc.sessions + (workout?.status === 'workout' ? 1 : 0),
        volume: acc.volume + (workout?.totalVolume ?? 0),
        sets: acc.sets + (workout?.totalSets ?? 0),
        seconds: acc.seconds + (workout?.duration ?? 0),
    }), { sessions: 0, volume: 0, sets: 0, seconds: 0 }), [entries]);

    const visible = filter === 'all' ? entries : entries.filter(([, w]) => w?.status === filter);

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">

            <header>
                <h1 className="text-lg tracking-wide text-text-bright">History</h1>
                <p className="text-xs text-text-muted">Every logged day, newest first.</p>
            </header>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Summary label="Sessions" value={totals.sessions} />
                <Summary label="Total sets" value={totals.sets} />
                <Summary label="Total volume" value={totals.volume} />
                <Summary label="Time trained" value={formatDuration(totals.seconds)} />
            </div>

            <div className="flex flex-wrap gap-2">
                {FILTERS.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setFilter(id)}
                        className={`cursor-pointer rounded-sm border px-3 py-1.5 text-[10px] tracking-wider uppercase transition-colors ${
                            filter === id
                                ? 'border-accent/50 bg-accent/10 text-accent-light'
                                : 'border-border-main text-text-muted hover:text-text-main'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {visible.length > 0 ? (
                <div className="grid items-start gap-4 lg:grid-cols-2">
                    {visible.map(([date, workout]) => (
                        <HistoryCard key={date} date={date} workout={workout} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border-main px-6 py-12 text-center">
                    <p className="font-robotomono text-xs text-text-muted">
                        {entries.length === 0 ? '// no sessions on record' : '// nothing matches this filter'}
                    </p>
                    {entries.length === 0 && (
                        <Link
                            to="/workout"
                            className="rounded-sm border border-accent/50 bg-accent/10 px-4 py-2 text-[10px] tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
                        >
                            Start your first session
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
