import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useUserStore from '../../store/usePlayerStore';
import calculateLevel, { canPrestige, getLevelProgress, getXpNeededForLevel, prestigeUser } from '../../utils/levelUpSystem';
import { calculateStreakFromObject } from '../../utils/calculateStreak';
import { getCheapestUnlockable } from '../../utils/Progression';

import Panel from '../ui/panel';
import ConfirmDialog from '../ui/confirmDialog';
import { BoltIcon, FlameIcon } from '../ui/icons';

const MAX_LEVEL = 100;

function formatJoined(dateCreated) {
    if (!dateCreated) return null;
    const parsed = new Date(dateCreated);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export default function IdentityCard() {
    const { userData, setUserData, syncUser } = useUserStore();

    const { level, currentLeftoverXP } = calculateLevel(userData);
    const { current, highest } = calculateStreakFromObject(userData.workoutHistory);
    const cheapestUnlock = getCheapestUnlockable(userData?.exerciseProgress || {});

    const xpNeeded = getXpNeededForLevel(level, userData.prestige);
    const atMaxLevel = level >= MAX_LEVEL;
    const targetProgress = getLevelProgress(currentLeftoverXP, level, userData.prestige);

    const [confirmPrestige, setConfirmPrestige] = useState(false);
    const [barProgress, setBarProgress] = useState(0);

    // Animate the fill from empty on mount and on every change.
    useEffect(() => {
        const id = requestAnimationFrame(() => setBarProgress(targetProgress));
        return () => cancelAnimationFrame(id);
    }, [targetProgress]);

    const handlePrestige = () => {
        setUserData(prestigeUser(userData));
        syncUser();
        setConfirmPrestige(false);
    };

    const joined = formatJoined(userData.dateCreated);
    const displayName = userData.userInfo?.visibleName || userData.username || 'Operator';

    return (
        <Panel label="operator_profile" className="min-w-0">
            <div className="flex flex-col gap-5">

                <div className="flex flex-wrap items-start gap-4">
                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-card font-robotomono text-lg font-semibold text-accent"
                        style={{ borderColor: userData.color || 'var(--color-border-main)' }}
                    >
                        {displayName.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="min-w-40 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl leading-tight font-bold tracking-tight text-text-bright lg:text-2xl">
                                {displayName}
                            </h1>
                            <span className="rounded-md border border-border-main px-2 py-0.5 text-xs tracking-wide text-text-main uppercase">
                                {userData.title || 'Rookie'}
                            </span>
                        </div>
                        <p className="mt-1 font-robotomono text-xs text-text-muted">
                            Calisthenics{joined ? ` · Member since ${joined}` : ''}
                        </p>
                    </div>

                    <div className="flex basis-full items-center gap-2 sm:ml-auto sm:basis-auto">
                        <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-card px-3 py-2">
                            <FlameIcon className="h-4 w-4 text-accent" />
                            <div className="flex flex-col leading-tight">
                                <span className="font-robotomono text-sm font-semibold text-text-bright tabular-nums">
                                    {current} days
                                </span>
                                <span className="font-robotomono text-xs tracking-wide text-text-muted uppercase">
                                    Best {highest}d
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/skills"
                            className="flex min-w-0 items-center gap-2 rounded-md border border-border-subtle bg-card px-3 py-2 transition-colors hover:border-accent/40"
                        >
                            <BoltIcon className="h-4 w-4 text-accent" />
                            <div className="flex min-w-0 flex-col leading-tight">
                                <span className="font-robotomono text-sm font-semibold text-accent tabular-nums">
                                    {userData.ep ?? 0}{' '}
                                    <span className="text-xs tracking-wide text-text-muted uppercase">EP</span>
                                </span>
                                {cheapestUnlock && (
                                    <span className="max-w-40 truncate font-robotomono text-xs text-text-muted">
                                        Next: {cheapestUnlock.name} ({cheapestUnlock.cost})
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row">

                    <div className="flex flex-1 flex-col gap-3.5 rounded-md border border-border-subtle bg-card p-4 lg:flex-[1.3]">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div className="flex items-baseline gap-2.5">
                                <span className="font-robotomono text-xs tracking-[0.08em] text-text-muted uppercase">Level</span>
                                <span className="font-robotomono text-4xl leading-none font-semibold text-text-bright tabular-nums">
                                    {level}
                                </span>
                                {canPrestige(userData) ? (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmPrestige(true)}
                                        className="cursor-pointer rounded-md border border-accent/40 bg-accent/10 px-2 py-1 font-robotomono text-xs whitespace-nowrap text-accent transition-colors hover:bg-accent/20"
                                    >
                                        ⇈ Prestige {userData.prestige}
                                    </button>
                                ) : (
                                    <span className="rounded-md border border-border-subtle px-2 py-1 font-robotomono text-xs whitespace-nowrap text-text-muted">
                                        Prestige {userData.prestige}
                                    </span>
                                )}
                            </div>

                            <div className="font-robotomono text-xs text-text-main">
                                <span className="font-semibold text-text-bright tabular-nums">
                                    {atMaxLevel ? 'MAX' : Math.round(currentLeftoverXP)}
                                </span>{' '}
                                / {Math.round(xpNeeded)} <span className="text-text-muted">XP</span>
                            </div>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-panel">
                            <div
                                className="h-full rounded-md bg-accent transition-[width] duration-1000 ease-out"
                                style={{ width: `${barProgress}%` }}
                            />
                        </div>

                        <div className="flex justify-between font-robotomono text-xs text-text-muted">
                            {!atMaxLevel && <span>Progress to level {level + 1}</span>}
                            <span>
                                {atMaxLevel ? 0 : Math.max(0, Math.round(xpNeeded - currentLeftoverXP))} XP remaining
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2.5 rounded-md border border-dashed border-border-main bg-card p-4">
                        <span className="font-robotomono text-xs tracking-[0.08em] text-text-muted uppercase">
                            Effort rating
                        </span>
                        <span className="font-robotomono text-3xl leading-none font-semibold text-text-main tabular-nums">
                            {userData.rating || 100}
                        </span>
                        <p className="font-robotomono text-xs leading-relaxed text-text-muted">
                            Elo-style rating. Beat workouts above your level to climb.
                        </p>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmPrestige}
                title={`Prestige ${(userData.prestige ?? 0) + 1}`}
                body="Your level and XP reset to zero. In exchange every future XP gain is multiplied. Unlocks, stats and history are kept."
                confirmLabel="Prestige"
                onConfirm={handlePrestige}
                onCancel={() => setConfirmPrestige(false)}
            />
        </Panel>
    );
}
