import { useMemo } from 'react';

import useUserStore from '../../store/usePlayerStore';
import { calculatePlayerStats } from '../../utils/statCalculator';
import Panel from '../ui/panel';

const STAT_META = {
    STR: { name: 'Strength',    tip: 'Peak exercise difficulty × reps. Tier matters most — grinding easy sets won’t move this.' },
    HYP: { name: 'Hypertrophy', tip: 'Volume in the 6–12 rep range across all categories. Low reps and holds contribute nothing here.' },
    END: { name: 'Endurance',   tip: 'High-rep and long-hold performance. Tier matters less — consistency and volume win.' },
    POW: { name: 'Power',       tip: 'Explosive movements primarily. Heavy strength work bleeds in at a reduced rate.' },
    BAL: { name: 'Balance',     tip: 'How evenly training is spread across all categories. Neglecting any one area drags this down.' },
    AP:  { name: 'Adaptive Potential', tip: 'Measures training stimulus against recovery balance.' },
};

const AP_STATES = {
    adapting:     { bar: 'bg-success',    text: 'text-success',     label: 'Training load is in the optimal range for adaptation.' },
    detraining:   { bar: 'bg-warning',    text: 'text-warning',     label: 'Recent load is too low. Increase training frequency.' },
    overreaching: { bar: 'bg-danger',     text: 'text-danger',      label: 'Acute load spike detected. Consider a rest day.' },
};

const MAX_STAT = 1000;

function StatRow({ statKey, value }) {
    const meta = STAT_META[statKey] ?? { name: statKey, tip: '' };

    return (
        <li className="flex items-center gap-4 border-b border-border-subtle py-3 last:border-b-0">
            <div className="group/stat relative w-24 shrink-0">
                <span className="cursor-default text-xs tracking-wide text-text-main uppercase">{meta.name}</span>
                {meta.tip && (
                    <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-52 rounded-md border border-border-subtle bg-panel p-2.5 shadow-lg group-hover/stat:block">
                        <p className="text-xs leading-relaxed text-text-muted">{meta.tip}</p>
                    </div>
                )}
            </div>

            <div className="h-1 min-w-4 flex-1 overflow-hidden rounded-full bg-card">
                <div
                    className="h-full rounded-full bg-accent-glow transition-[width] duration-1000 ease-out"
                    style={{ width: `${(value / MAX_STAT) * 100}%` }}
                />
            </div>

            <span className="shrink-0 text-right font-robotomono text-sm text-text-bright tabular-nums">{value}</span>
        </li>
    );
}

export default function AttributesCard() {
    const userData = useUserStore((state) => state.userData);
    const stats = useMemo(() => calculatePlayerStats(userData), [userData]);

    const apState = AP_STATES[stats.apState];
    const attributes = Object.keys(STAT_META).filter((key) => key !== 'AP' && key in stats);

    return (
        <Panel label="attributes" className="min-w-0">
            <ul className="flex flex-col">
                {attributes.map((key) => (
                    <StatRow key={key} statKey={key} value={stats[key]} />
                ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2 rounded-sm border border-border-subtle bg-card/60 p-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs tracking-wide text-text-main uppercase">Adaptive Potential</span>
                    <span className="font-robotomono text-sm text-text-bright tabular-nums">{stats.AP}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-panel">
                    <div
                        className={`h-full rounded-full transition-[width] duration-1000 ease-out ${apState?.bar ?? 'bg-accent-glow'}`}
                        style={{ width: `${(stats.AP / MAX_STAT) * 100}%` }}
                    />
                </div>
                <p className={`text-[11px] leading-relaxed ${apState?.text ?? 'text-text-muted'}`}>
                    {apState?.label ?? 'Measures training stimulus and recovery balance.'}
                </p>
            </div>
        </Panel>
    );
}
