import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import calculateLevel, { getLevelProgress, getXpNeededForLevel } from "../../utils/levelUpSystem";

import { calculateStreakFromObject } from "../../utils/calculateStreak";
import { calculatePlayerStats } from '../../utils/statSystem';

const getStatName = (statKey) => {
    switch (statKey) {
        case 'STR': return 'Strength';
        case 'END': return 'Endurance';
        case 'MOB': return 'Mobility';
        case 'TEC': return 'Technique';
        default: return statKey;
    }
};

export default function Status() {
    const { userData, setUserData } = useUserStore();

    const [isReady, setIsReady] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);

    const currentProgress = getLevelProgress(userData.xp, userData.level);
    const { current, highest } = calculateStreakFromObject(userData.workoutHistory);

    const displayXP = userData.level >= 100 ? "MAX" : Math.round(userData.xp);
    const xpNeeded = getXpNeededForLevel(userData.level);
    const { level, currentLeftoverXP } = calculateLevel(userData);
    const stats = calculatePlayerStats(userData.exerciseProgress);

    useEffect(() => {
        setIsReady(true);
    }, []);

    /* useEffect(() => {
        if (!userData.isConfigured) {
            navigate('/evaluation');
        }
    }, [userData.isConfigured]); */

    useEffect(() => {
        setLevelProgress(currentProgress);

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

    }, [userData.workoutHistory, currentProgress]);

    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-950 text-cyan-300 text-sm tracking-widest uppercase">
                Synchronizing Hunter Data...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="flex flex-col gap-5 max-w-3xl mx-auto p-6">

                <div className="flex items-center gap-3 text-xs tracking-widest text-slate-400 uppercase">
                    <span>System.Hunter_Profile</span>
                    <span className="flex-1 h-px bg-slate-800"></span>
                </div>

                <div className="border border-cyan-500/20 bg-slate-900/60 rounded-sm p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 flex items-center justify-center rounded-full border-2 text-2xl bg-slate-950 flex-shrink-0"
                            style={{ borderColor: userData.color || '#00e5ff' }}
                        >
                            {userData.equippedBadge || "👤"}
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <div className="text-xs tracking-widest uppercase" style={{ color: userData.color }}>
                                {userData.title || "Unranked Hunter"}
                            </div>
                            <h2 className="text-lg font-semibold text-slate-100">{userData.shownName}</h2>
                        </div>
                    </div>

                    <div className="h-px bg-slate-800"></div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="border border-amber-400/30 bg-amber-500/5 rounded-sm p-3 flex flex-col items-center gap-1">
                            <span className="text-[10px] tracking-widest uppercase text-slate-500">Active Streak</span>
                            <span className="text-sm font-mono text-amber-400">[ 🔥 {current} DAYS ]</span>
                        </div>

                        <div className="border border-slate-700 bg-slate-900/40 rounded-sm p-3 flex flex-col items-center gap-1">
                            <span className="text-[10px] tracking-widest uppercase text-slate-500">Hunter Rank</span>
                            <span className="text-sm font-mono" style={{ color: userData.color }}>{userData.rank}</span>
                        </div>

                        <div className="border border-slate-700 bg-slate-900/40 rounded-sm p-3 flex flex-col items-center gap-1">
                            <span className="text-[10px] tracking-widest uppercase text-slate-500">Current Level</span>
                            <span className="text-sm font-mono text-slate-100">{userData.level}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-1">
                        <div className="flex justify-between items-baseline text-xs">
                            <span className="text-[10px] tracking-widest uppercase text-slate-500">Experience.Progress</span>
                            <span className="font-mono text-cyan-300">
                                {displayXP} <span className="text-slate-500">/ {Math.round(xpNeeded)} XP</span>
                            </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-sm overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${levelProgress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs tracking-widest text-slate-400 uppercase mt-1">
                    <span>Biometric.Attributes</span>
                    <span className="flex-1 h-px bg-slate-800"></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.keys(userData.stats).map(statKey => (
                        <div key={statKey} className="border border-slate-700 bg-slate-900/40 rounded-sm p-3 flex flex-col items-center gap-1">
                            <span className="text-[10px] tracking-widest uppercase text-slate-500">{getStatName(statKey)}</span>
                            <p className="text-lg font-mono text-slate-100 m-0">{userData.stats[statKey]}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 mt-1">
                   {/*  <StatusReport />
                    <WeightTracker weightHistory={userData.weightHistory} /> */}
                </div>

            </div>
        </div>
    );
}