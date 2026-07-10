import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import calculateLevel, { getLevelProgress, getXpNeededForLevel } from "../../utils/levelUpSystem";
//import WeightTracker from "../../components/stats/weightTracker";
import { calculateStreakFromObject } from "../../utils/calculateStreak";
import { calculatePlayerStats } from '../../utils/statCalculator';
import Column from "../../components/ui/column";
import Grid from "../../components/ui/grid";
import Card from "../../components/ui/card";

const getStatName = (statKey) => {
    switch (statKey) {
        case 'STR': return 'Strength';
        case 'HYP': return 'Hypertrophy'; // UHH, maybe change name later
        case 'END': return 'Endurance';
        case 'POW': return 'Power'; 
        // DELETE?
        case 'MOB': return 'Mobility'; 
        case 'TEC': return 'Technique'; 
        default: return statKey;
    }
};

const XP_TICKS = 20;

export default function Status() {
    const { userData, setUserData } = useUserStore();

    const [isReady, setIsReady] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);

    const currentLevelProgress = getLevelProgress(userData.xp, userData.level);
    const { current, highest } = calculateStreakFromObject(userData.workoutHistory);

    const displayXP = userData.level >= 100 ? "MAX" : Math.round(userData.xp);
    const xpNeeded = getXpNeededForLevel(userData.level);
    const { level, currentLeftoverXP } = calculateLevel(userData);
    const stats = calculatePlayerStats(userData, userData.exerciseProgress);

    const hasActiveStreak = current > 0;
    const filledTicks = Math.round((levelProgress / 100) * XP_TICKS);

    useEffect(() => {
        setIsReady(true);
    }, []);


    useEffect(() => {
        setLevelProgress(currentLevelProgress);

        setUserData({
            ...userData,
            level: level,
            xp: currentLeftoverXP,
            stats: { ...stats },
            streak: {
                current: current,
                highest: highest
            },
        });

    }, [userData.workoutHistory, currentLevelProgress]);

    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-card text-accent-light text-sm tracking-widest uppercase">
                Synchronizing Operator Data...
            </div>
        );
    }

    return (
        <Column>
            <Card name='operator_profile' TWCSS='flex flex-col sm:flex-row gap-3'> 
                    <div className="border border-accent/20 bg-panel/60 rounded-sm p-4 flex flex-col gap-5">
                        <div className="flex items-center w-full gap-4">
                            <div
                                className="w-14 h-14 flex items-center justify-center rounded-full border-2 text-2xl bg-card flex-shrink-0"
                                style={{ borderColor: userData.color || 'var(--color-accent-glow)' }}
                            >
                                {userData.equippedBadge || "👤"}
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <div className="text-xs tracking-widest uppercase" style={{ color: userData.color }}>
                                    {userData.title || "Rookie"}
                                </div>
                                <h2 className="text-xl font-semibold text-text-bright">{userData.userInfo.visibleName || userData.username}</h2>
                            </div>
                        </div>

                        <div className="h-px bg-border-subtle"></div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className={`border rounded-sm p-3 flex flex-col items-center gap-1 ${hasActiveStreak ? 'border-warning/30 bg-warning/5' : 'border-border-main bg-panel/40'}`}>
                                <span className="text-[10px] tracking-widest uppercase text-text-muted">Active Streak</span>
                                <span className={`text-lg font-mono flex items-center gap-1.5 ${hasActiveStreak ? 'text-warning' : 'text-text-muted'}`}>
                                    <span className={hasActiveStreak ? 'opacity-100' : 'opacity-30'}>🔥</span>
                                    {current}{current === 1 ? ' DAY' : ' DAYS'}
                                </span>
                                {highest > 0 && (
                                    <span className="text-[10px] text-text-muted">Best: {highest}d</span>
                                )}
                            </div>

                            <div className="border border-border-main bg-panel/40 rounded-sm p-3 flex flex-col items-center gap-1">
                                <span className="text-[10px] tracking-widest uppercase text-text-muted">Rating</span>
                                <span className="text-sm font-mono text-text-bright">{userData.rating}</span>
                            </div>

                            <div className="border border-border-main bg-panel/40 rounded-sm p-3 flex flex-col items-center gap-1">
                                <span className="text-[10px] tracking-widest uppercase text-text-muted">Current Level</span>
                                <span className="text-sm font-mono text-text-bright">{userData.level}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-1">
                            <div className="flex justify-between items-baseline text-xs">
                                <span className="text-[10px] tracking-widest uppercase text-text-muted">Experience.Progress</span>
                                <span className="font-mono text-accent-light">
                                    {displayXP} <span className="text-text-muted">/ {Math.round(xpNeeded)} XP</span>
                                </span>
                            </div>
                            <div className="flex gap-[3px]">
                                {Array.from({ length: XP_TICKS }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-2 rounded-[1px] ${i < filledTicks ? 'bg-accent-glow shadow-[0_0_4px_#22d3ee80]' : 'bg-border-subtle'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-1 flex-col'>
                    
                        <div className="h-full w-full flex flex-col sm:flex-col justify-evenly bg-panel/40 p-2 rounded-md">
                            <div className="flex items-center gap-3 p-3 text-xs tracking-widest text-text-main uppercase mt-1">
                                <span>Biometric.Attributes</span>
                                <span className="flex-1 h-px bg-border-subtle"></span>
                            </div>
                            {Object.keys(userData.stats).map(statKey => (
                                <div key={statKey} className=" rounded-sm p-3 pr-6 flex flex-row justify-between items-center gap-1">
                                    <span className="text-[10px] tracking-widest uppercase text-text-muted">{getStatName(statKey)}</span>
                                    <p className="text-lg font-mono text-text-bright m-0">{userData.stats[statKey]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
            </Card>
        </Column>
    );
}