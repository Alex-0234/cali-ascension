import { useState, useEffect } from "react";
import useUserStore from "../../store/usePlayerStore";
import calculateLevel, { getLevelProgress, getXpNeededForLevel, canPrestige, prestigeUser } from "../../utils/levelUpSystem";
import { calculateStreakFromObject } from "../../utils/calculateStreak";
import { calculatePlayerStats } from '../../utils/statCalculator';
import { getCheapestUnlockable } from '../../utils/Progression';
import Card from "./card";

const STAT_TOOLTIPS = {
    STR: 'Peak exercise difficulty × reps. Tier matters most — grinding easy sets won\'t move this.',
    HYP: 'Volume in the 6–12 rep range across all categories. Low reps and holds contribute nothing here.',
    END: 'High-rep and long-hold performance. Tier matters less — consistency and volume win.',
    POW: 'Explosive movements primarily. Heavy strength work bleeds in at a reduced rate.',
    BAL: 'How evenly training is spread across all categories. Neglecting any one area will drag this down.',
};

const AP_STATE_STYLES = {
    adapting:     { bar: 'bg-success',    text: 'text-success' },
    detraining:   { bar: 'bg-yellow-400', text: 'text-yellow-400' },
    overreaching: { bar: 'bg-red-400',    text: 'text-red-400' },
};

const AP_STATE_LABELS = {
    adapting:     'Training load is in the optimal range for adaptation.',
    detraining:   'Recent load is too low. Increase training frequency.',
    overreaching: 'Acute load spike detected. Consider a rest day.',
};

const getStatName = (statKey) => {
    switch (statKey) {
        case 'STR': return 'Strength';
        case 'HYP': return 'Hypertrophy';
        case 'END': return 'Endurance';
        case 'POW': return 'Power';
        case 'BAL': return 'Balance';
        case 'AP': return 'Adaptive Potential';

        default: return statKey;
    }
};

export default function Profile() {
    const { userData, setUserData, syncUser } = useUserStore();
    const { isLoggedIn } = userData;

    const stats = calculatePlayerStats(userData);
    const { level, currentLeftoverXP } = calculateLevel(userData);
    const { current, highest } = calculateStreakFromObject(userData.workoutHistory);
    const cheapestUnlock = getCheapestUnlockable(userData?.exerciseProgress || {});

    const showPrestige = canPrestige(userData);
    const xpNeeded = getXpNeededForLevel(level, userData.prestige);
    const displayXP = level >= 100 ? "MAX" : Math.round(currentLeftoverXP);
    const xpRemaining = level >= 100 ? 0 : Math.max(0, Math.round(xpNeeded - currentLeftoverXP));
    const currentLevelProgress = getLevelProgress(currentLeftoverXP, level, userData.prestige);

    const [isReady, setIsReady] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => setLevelProgress(currentLevelProgress));
        return () => cancelAnimationFrame(id);
    }, [currentLevelProgress]);

    const handlePrestige = () => {
        const newUserData = prestigeUser(userData);
        setUserData(newUserData);
        syncUser();
    };

    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-card text-accent-light text-sm tracking-widest uppercase">
                Synchronizing Operator Data...
            </div>
        );
    }

    return (
      <>
      <Card bg={true} contTWCSS="w-full h-auto min-w-0 lg:w-3/4 max-w-2xl" TWCSS={'p-6 relative h-full'}>
            {!isLoggedIn && (
                <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
            )}
            <div className="flex items-center justify-between relative">
                <span className="flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] uppercase text-text-muted">
                <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                Athlete Profile
                </span>
                <button className="absolute -top-4 -right-4 inline-flex items-center justify-center w-7.5 h-7.5 rounded-lg text-text-muted border border-transparent hover:bg-panel hover:text-text-bright hover:border-border-subtle transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2" aria-label="Settings">
                    <svg onClick={() => {console.log('profile toggle')}} className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">

                <div className="flex flex-col gap-4 lg:flex-[1.15] min-w-0">

                <div className="flex flex-wrap items-start gap-3.5">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-panel border border-border-main flex items-center justify-center font-mono text-lg font-semibold text-accent">T</div>
                    <div className="flex-1 min-w-40">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="font-robotomono font-bold text-xl leading-tight tracking-tight text-text-bright lg:text-2xl">{userData.userInfo.visibleName || userData.username}</h1>
                        <span className="font-mono text-xs tracking-wide uppercase text-text-main border border-border-main rounded-md px-2 py-0.5 leading-snug">{userData.title || 'Rookie'}</span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-muted">Calisthenics · Member since {}</div>
                    </div>

                    <div className="flex items-center gap-2 basis-full sm:basis-auto sm:ml-auto">
                        <div className="flex items-center gap-2 bg-panel border border-border-subtle rounded-md px-3 py-2">
                            <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 2c1 3-1.5 4.5-2.5 6.5C8.5 10.8 8 12.5 9 14c-1.5-.3-3-1.8-3-4C4.5 12 4 15 4 16.5 4 20 7.2 22 11 22c4.5 0 8-3 8-7.3 0-3.4-2.3-6-4.5-8-.3 1.8-1 2.6-2 3.3-.2-3-1-6-4-8z"/></svg>
                            <div className="flex flex-col leading-tight">
                                <span className="font-mono font-semibold text-sm text-text-bright tabular-nums">{current} days</span>
                                <span className="font-mono text-xs tracking-wide uppercase text-text-muted">Best {highest}d</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-panel border border-border-subtle rounded-md px-3 py-2 min-w-0">
                            <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>
                            <div className="flex flex-col leading-tight min-w-0">
                                <span className="font-mono font-semibold text-sm text-accent tabular-nums">{userData.ep} <span className="text-xs tracking-wide uppercase text-text-muted">EP</span></span>
                                {cheapestUnlock && (
                                    <span className="font-mono text-xs text-text-muted truncate max-w-40">Next: {cheapestUnlock.name} ({cheapestUnlock.cost})</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                    <div className="flex-1 sm:flex-[1.3] bg-panel border border-border-subtle rounded-md p-4 flex flex-col gap-3.5">
                        <div className="flex items-end justify-between gap-3 flex-wrap">
                            <div className="flex items-baseline gap-2.5">
                                <span className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted">Level</span>
                                <span className="font-mono font-semibold text-4xl leading-none text-text-bright tabular-nums">{level}</span>
                                <span className="font-mono text-xs tracking-wide text-accent bg-accent/10 border border-accent/25 rounded-md px-2 py-0.75 whitespace-nowrap">
                                {showPrestige ? (
                                    <span className='cursor-pointer' onClick={handlePrestige}>
                                        <span> ⇈ </span>
                                        Prestige {userData.prestige}
                                    </span>
                                ) : (
                                    <span>
                                        Prestige {userData.prestige}
                                    </span>
                                )}
                                </span>
                            </div>
                            <div className="font-mono text-xs text-text-main">
                                <span className="text-text-bright font-semibold tabular-nums">{displayXP}</span> / {Math.round(xpNeeded)} <span className="text-text-muted">XP</span>
                            </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-panel overflow-hidden">
                            <div className="fill-bar h-full rounded-md bg-accent transition-[width] duration-1000 ease-out" style={{width: levelProgress + '%'}}></div>
                        </div>
                        <div className="flex justify-between font-mono text-xs text-text-muted">
                            {level < 100 && (<span>Progress to Level {level + 1}</span>)}
                            <span>{xpRemaining} XP remaining</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-panel border border-dashed border-border-main rounded-md p-4 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted">Effort Rating</span>
                            <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"><circle cx="12" cy="12" r="9"></circle></svg>
                        </div>
                        <span className="font-mono font-semibold text-3xl leading-none text-text-main">{userData.rating || 100}</span>
                        <p className="font-mono text-xs text-text-muted leading-relaxed">Elo-style rating. Beat workouts above your level to climb.</p>
                    </div>
                </div>
                </div>

            </div>
        </Card>
        <Card contTWCSS="w-full sm:w-60 lg:w-1/4 shrink-0 rounded-md" TWCSS={'p-6 h-full relative'} bg={true} >
        {!isLoggedIn && (
                <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
            )}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted whitespace-nowrap">Attributes</span>
                    <span className="h-px flex-1 bg-border-subtle"></span>
                </div>
            </div>
            <div className="flex flex-col">
                {Object.keys(stats).map(statKey => (
                    <>
                    {statKey !== 'apState' && statKey !== 'AP' && (
                        <div key={statKey} className="flex justify-between items-center gap-3.5 py-2.5 border-b border-border-subtle last:border-b-0 min-w-0">
                            <div className="relative group/stat shrink-0">
                                <span className="font-mono text-xs tracking-wide uppercase text-text-main cursor-default">{getStatName(statKey)}</span>
                                {STAT_TOOLTIPS[statKey] && (
                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/stat:block w-48 bg-panel border border-border-subtle rounded-md p-2.5 z-10 pointer-events-none shadow-lg">
                                        <p className="font-mono text-xs text-text-muted leading-relaxed">{STAT_TOOLTIPS[statKey]}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 h-1 rounded-full bg-panel overflow-hidden min-w-4">
                                <div className="fill-bar h-full rounded-full bg-accent-glow transition-[width] duration-1000 ease-out" style={{width: `${(stats[statKey] / 1000) * 100}%`}}></div>
                            </div>
                            <span className="font-mono font-semibold text-sm text-text-bright text-right tabular-nums shrink-0">{stats[statKey]}</span>
                        </div>
                    )}
                    {statKey === 'AP' && (
                        <div key={statKey} className="flex flex-col gap-1.5 py-2.5 border-b border-border-subtle last:border-b-0 min-w-0">
                            <div className="flex justify-between items-center gap-3.5">
                                <div className="relative group/ap shrink-0">
                                    <span className="font-mono text-xs tracking-wide uppercase text-text-main cursor-default">{getStatName(statKey)}</span>
                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/ap:block w-48 bg-panel border border-border-subtle rounded-md p-2.5 z-10 pointer-events-none shadow-lg">
                                        <p className="font-mono text-xs text-text-muted leading-relaxed">
                                            {AP_STATE_LABELS[stats.apState] ?? 'Measures training stimulus and recovery balance.'}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-mono font-semibold text-sm text-text-bright tabular-nums shrink-0">{stats[statKey]}</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-panel overflow-hidden">
                                <div className={`fill-bar h-full rounded-full transition-[width] duration-1000 ease-out ${AP_STATE_STYLES[stats.apState]?.bar ?? 'bg-accent-glow'}`} style={{width: `${(stats[statKey] / 1000) * 100}%`}}></div>
                            </div>
                            <span className={`font-mono text-xs capitalize ${AP_STATE_STYLES[stats.apState]?.text ?? 'text-text-muted'}`}>{stats.apState}</span>
                        </div>
                    )}
                     
                    </>
                ))}
            </div>
        </Card>
    </>
    )
}
