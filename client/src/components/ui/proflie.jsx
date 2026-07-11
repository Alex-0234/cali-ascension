
import { useState, useEffect } from "react";
import useUserStore from "../../store/usePlayerStore";
import calculateLevel, { getLevelProgress, getXpNeededForLevel } from "../../utils/levelUpSystem";
import { calculateStreakFromObject } from "../../utils/calculateStreak";
import { calculatePlayerStats } from '../../utils/statCalculator';
import Card from "./card";
import SystemButton from "./systemBtn";
import { canPrestige } from "../../utils/levelUpSystem";
import { prestigeUser } from "../../utils/levelUpSystem";

const XP_TICKS = 20;
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

export default function Profile() {
    const { userData, setUserData } = useUserStore();
    const prestige = canPrestige(userData);

    const displayXP = userData.level >= 100 ? "MAX" : Math.round(userData.xp);
    const xpNeeded = getXpNeededForLevel(userData.level);

    const [isReady, setIsReady] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);

    const currentLevelProgress = getLevelProgress(userData.xp, userData.level);
    const { current, highest } = calculateStreakFromObject(userData.workoutHistory);


    const { level, currentLeftoverXP } = calculateLevel(userData);
    const stats = calculatePlayerStats(userData, userData.exerciseProgress);
    
    const hasActiveStreak = current > 0;
    const filledTicks = Math.round((levelProgress / 100) * XP_TICKS);
    

    const handlePrestige  = () => {
        const newUserData = prestigeUser(userData);
        setUserData(newUserData);
    }

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
      <>
      <Card bg={true} contTWCSS="w-full h-full lg:w-3/4 max-w-xl" TWCSS={'p-6'}>
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-ink-faint">
                <span className="w-1.5 h-1.5 rounded-full bg-presence shadow-[0_0_0_3px_rgba(111,207,151,0.12)]"></span>
                Athlete Profile
                </span>
                <button className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-chip text-ink-muted border border-transparent hover:bg-raised hover:text-ink hover:border-hair transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2" aria-label="Settings">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                </button>
            </div>
        
            <div className="flex flex-col gap-5 @panel-lg:flex-row @panel-lg:gap-10">

                <div className="flex flex-col gap-4 @panel-lg:flex-[1.15] min-w-0">
        
                <div className="flex flex-wrap items-start gap-3.5">
                    <div className="shrink-0 w-12 h-12 rounded-chip bg-raised border border-hair-2 flex items-center justify-center font-mono text-lg font-semibold text-accent">T</div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="font-display font-bold text-[21px] leading-tight tracking-tight text-ink @panel-lg:text-2xl">{userData.visibleName || userData.username}</h1>
                        <span className="font-mono text-[10.5px] tracking-wide uppercase text-ink-muted border border-hair-2 rounded-[5px] px-[7px] py-[2.5px] leading-[1.4]">{userData.title || 'Rookie'}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11.5px] text-ink-faint">Calisthenics · Member since {}</div>
                    </div>
        
                    <div className="flex items-center gap-2 basis-full @panel-md:basis-auto @panel-md:ml-auto">
                    <div className="flex items-center gap-2 bg-raised border border-hair rounded-chip px-3 py-2">
                        <svg className="w-[15px] h-[15px] text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 2c1 3-1.5 4.5-2.5 6.5C8.5 10.8 8 12.5 9 14c-1.5-.3-3-1.8-3-4C4.5 12 4 15 4 16.5 4 20 7.2 22 11 22c4.5 0 8-3 8-7.3 0-3.4-2.3-6-4.5-8-.3 1.8-1 2.6-2 3.3-.2-3-1-6-4-8z"/></svg>
                        <div className="flex flex-col leading-tight">
                            <span className="font-mono font-semibold text-sm text-ink tabular-nums">{current} days</span>
                            <span className="font-mono text-[9.5px] tracking-wide uppercase text-ink-faint">Best {highest}d</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-raised border border-hair rounded-chip px-3 py-2">
                        <svg className="w-[15px] h-[15px] text-ep shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>
                        <div className="flex flex-col leading-tight">
                            <span className="font-mono font-semibold text-sm text-ep tabular-nums">{userData.ep}</span>
                            <span className="font-mono text-[9.5px] tracking-wide uppercase text-ink-faint">EP · unlocks</span>
                        </div>
                    </div>
                    </div>
                </div>
        
                <div className="flex flex-col gap-3 @panel-md:flex-row">
        
                    <div className="flex-1 @panel-md:flex-[1.3] bg-raised border border-hair rounded-card p-4 flex flex-col gap-3.5">
                    <div className="flex items-end justify-between gap-3 flex-wrap">
                        <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-faint">Level</span>
                        <span className="font-mono font-semibold text-[34px] leading-none text-ink tabular-nums">{userData.level}</span>
                        <span className="font-mono text-[10.5px] tracking-wide text-accent bg-accent/10 border border-accent/25 rounded-[5px] px-[7px] py-[3px] whitespace-nowrap">Prestige {userData.prestige}</span>
                        </div>
                        <div className="font-mono text-[12.5px] text-ink-muted">
                        <span className="text-ink font-semibold tabular-nums">{levelProgress === 100 ? 'MAX' : Math.round(levelProgress * (xpNeeded / 100))}</span> / {Math.round(xpNeeded)} <span className="text-ink-faint">XP</span>
                        </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-hair overflow-hidden">
                        <div className="fill-bar h-full rounded-full bg-accent transition-[width] duration-1000 ease-out w-[0%]" data-fill="64"></div>
                    </div>
                    <div className="flex justify-between font-mono text-[10.5px] text-ink-faint">
                        {!userData.level >= 100 && (<span>Progress to Level {userData.level + 1}</span>)}
                        <span>{xpNeeded - Math.round(levelProgress * (xpNeeded / 100))} XP remaining</span>
                    </div>
                    </div>
        
                    <div className="flex-1 bg-raised border border-dashed border-hair-2 rounded-card p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-faint">Effort Rating</span>
                        <svg className="w-4 h-4 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"><circle cx="12" cy="12" r="9"></circle></svg>
                    </div>
                    <span className="font-mono font-semibold text-[28px] leading-none text-ink-faint">—</span>
                    <p className="font-mono text-[10.5px] text-ink-faint leading-relaxed">Reserved for a daily effort score, separate from streak and level. Not tracking yet.</p>
                    </div>
                </div>
                </div>
                    
            </div>
        </Card>
        <Card contTWCSS="lg:w-1/4 rounded-md" TWCSS={'p-6 h-full'} bg={true} >
            <div className="flex flex-col gap-3 @panel-lg:flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-faint whitespace-nowrap">Attributes</span>
                    <span className="h-px flex-1 bg-hair"></span>
                </div>
            </div>
            <div className="flex flex-col @panel-md:grid @panel-md:grid-cols-2 @panel-md:gap-x-5">
                {Object.keys(userData.stats).map(statKey => (
                    <div  key={statKey} className="grid grid-cols-[84px_1fr_46px] items-center gap-3.5 py-2.5 border-b border-hair @panel-md:[&:nth-last-child(-n+2)]:border-b-0">
                        <span className="font-mono text-[11.5px] tracking-wide uppercase text-ink-muted">{getStatName(statKey)}</span>
                        <div className="h-1 rounded-full bg-raised overflow-hidden"><div className="fill-bar h-full rounded-full bg-hair-2 w-[0%]" data-fill="99"></div></div>
                        <span className="font-mono font-semibold text-[15px] text-ink text-right tabular-nums">{userData.stats[statKey]}</span>
                    </div>
                ))}
            </div>
        </Card>

        
    </>  

      /*   <Card bg={true} contTWCSS="h-[90%]] w-full " TWCSS={`flex flex-col h-full p-2 font-robotomono `}>
             <div className='w-full h-2/5'>
                <div className="flex justify-between items-center w-full gap-4 p-3 pb-6">
                    <div className="flex flex-col gap-0.5">
                        <div className="text-md tracking-widest uppercase" style={{ color: userData.color }}>
                            {userData.title || "Rookie"}
                        </div>
                        <h2 className="text-3xl font-semibold text-text-bright">{userData.userInfo.visibleName || userData.username}</h2>
                    </div>
                    <div className={`border rounded-sm p-3 flex flex-col items-center gap-1 ${hasActiveStreak ? 'border-warning/30 bg-warning/5' : 'border-border-main bg-panel/40'}`}>
                        <span className="text-xs tracking-widest uppercase text-text-muted">Active Streak</span>
                        <span className={`text-xl  font-mono flex items-center gap-1.5 ${hasActiveStreak ? 'text-warning' : 'text-text-muted'}`}>
                            <span className={hasActiveStreak ? 'opacity-100' : 'opacity-30'}>🔥</span>
                            {current}{current === 1 ? ' DAY' : ' DAYS'}
                        </span>
                        {highest > 0 && (
                            <span className="text-xs text-text-muted">Best: {highest}d</span>
                        )}
                    </div>
                </div>
             </div>
             <div className='w-full h-1/5'>
                <h1 className={`text-xl uppercase font-medium pl-3 `} style={{ color: userData.color }}>Prestige: {userData.prestige}</h1>
             </div>
             <div className='w-full h-1/5 flex justify-between items-center'>
                <h1 className='text-3xl uppercase font-medium pl-3'>Level: {userData.level}</h1>
                
                {prestige && (
                    <SystemButton text='prestige' onClick={() => handlePrestige()}/>
                )}
                
             </div>
             <div className='w-full h-1/5 p-3'>
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
        </Card> */
   
    )
}