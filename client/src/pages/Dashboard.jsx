import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import useUserStore from '../store/usePlayerStore';
import IdentityCard from '../components/dashboard/IdentityCard';
import AttributesCard from '../components/dashboard/AttributesCard';
import Trackers from '../components/ui/tracker/trackersCard';
import HistoryCard from '../components/ui/historyCard';
import Panel from '../components/ui/panel';
import { ChevronIcon } from '../components/ui/icons';

const RECENT_COUNT = 2;

const BIO_CTA = {
    optimal:  { label: 'Start training', tone: 'border-accent/50 bg-accent/10 text-accent-light hover:bg-accent/20' },
    restday:  { label: 'Rest day logged', tone: 'border-warning/40 bg-warning/5 text-warning' },
    critical: { label: 'Recovery required', tone: 'border-danger/40 bg-danger/5 text-danger' },
};

export default function Dashboard() {
    const userData = useUserStore((state) => state.userData);

    const recent = useMemo(() => {
        const history = userData.workoutHistory;
        if (!history || Array.isArray(history)) return [];
        return Object.entries(history)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, RECENT_COUNT);
    }, [userData.workoutHistory]);

    const today = new Date().toISOString().split('T')[0];
    const trainedToday = Boolean(userData.workoutHistory?.[today]?.totalVolume);
    const cta = BIO_CTA[userData.bioStatus] ?? BIO_CTA.optimal;

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">

            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg tracking-wide text-text-bright">Dashboard</h1>
                    <p className="text-xs text-text-muted">
                        {trainedToday
                            ? 'Session logged today. Anything else you add merges into it.'
                            : 'No session logged today.'}
                    </p>
                </div>

                <Link
                    to="/workout"
                    className={`rounded-sm border px-5 py-2.5 text-xs tracking-widest uppercase transition-colors ${cta.tone}`}
                >
                    {cta.label}
                </Link>
            </header>

            <IdentityCard />

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <AttributesCard />
                <Trackers />
            </div>

            <Panel
                label="recent_sessions"
                bare
                action={
                    <Link
                        to="/history"
                        className="flex items-center gap-1 text-[10px] tracking-wider text-text-muted uppercase transition-colors hover:text-accent-light"
                    >
                        View all <ChevronIcon className="h-3 w-3" />
                    </Link>
                }
            >
                {recent.length > 0 ? (
                    <div className="grid items-start gap-4 lg:grid-cols-2">
                        {recent.map(([date, workout]) => (
                            <HistoryCard key={date} date={date} workout={workout} />
                        ))}
                    </div>
                ) : (
                    <p className="rounded-sm border border-dashed border-border-main px-4 py-6 text-center font-robotomono text-xs text-text-muted">
                        // no sessions on record — your first workout starts the log
                    </p>
                )}
            </Panel>
        </div>
    );
}
