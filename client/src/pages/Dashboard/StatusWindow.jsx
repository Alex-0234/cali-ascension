
import useUserStore from "../../store/usePlayerStore"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import calculateLevel, { getLevelProgress } from "../../utils/levelUpSystem";
import WeightTracker from "../../components/stats/weightTracker";
import StatusReport from "../../components/stats/statusReport";
import calculateStreakFromHistory from "../../utils/calculateStreak";

import styles from "../../styles/status.module.css";
import SystemButton from "../../components/ui/systemBtn";


const getStatName = (statKey) => {
    switch (statKey) {
        case 'STR': return 'Strength';
        case 'END': return 'Endurance';
        case 'MOB': return 'Mobility';
        case 'TEC': return 'Technique';
        default: return statKey;
    }
};


export default function StatusWindow() {
    const navigate = useNavigate();

    const { userData, setUserData } = useUserStore();

    const [loaded, setLoaded] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);

    const currentProgress = getLevelProgress(userData.xp, userData.level);
    const currentStreak = calculateStreakFromHistory(userData.workoutHistory);
    
    const displayXP = userData.level >= 100 ? "MAX" : userData.xp;
    const {level, currentLeftoverXP} = calculateLevel(userData);

    useEffect(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        setLevelProgress(currentProgress);
        
        setUserData({
            ...userData,
            level: level,
            xp: currentLeftoverXP,
            streak: currentStreak,
        });

    }, [userData.workoutHistory]);

    if (!loaded) return <div style={{color: '#00e5ff', fontFamily: 'monospace'}}>Synchronizing Hunter Data...</div>;

    return (
        <>
        
        <div className="mock-body">

                <div className={styles.profileHeader}>
                    <div className={styles.badgeContainer}>
                        {userData.equippedBadge || "👤"}
                    </div>

                    <div className={styles.nameBlock}>
                        <div className={styles.playerTitle} style={{color: userData.color}}>{userData.title || "Unranked Hunter"}</div>
                        <h2 className={styles.playerName}>{userData.shownName}</h2>
                    </div>
                </div>

                <div className={styles.coreStatsRow}>
                    <div className={styles.corePill} style={{ flexBasis: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.pillLabel}>Active Streak</span>
                        <span className={`${styles.pillValue} ${styles.textGold}`}>🔥 {currentStreak.current} Days</span>
                    </div>

                    <div className={styles.corePill}>
                        <span className={styles.pillLabel}>Hunter Rank</span>
                        <span className={styles.pillValue} style={{color: userData.color}}>{userData.rank}</span>
                    </div>
                    
                    <div className={styles.corePill} >
                        <span className={styles.pillLabel}>Current Level</span>
                        <span className={styles.pillValue}>{userData.level}</span>
                    </div>
                </div>

                <div className={styles.xpSection}>
                    <div className={styles.xpLabels}>
                        <span>Experience Progress</span>
                        <span style={{fontFamily: 'monospace'}}>{Math.round(displayXP)} XP</span>
                    </div>
                    <div className={styles.xpTrack}>
                        <div className={styles.xpFill} style={{ width: `${levelProgress}%` }}></div>
                    </div>
                </div>

                <div className={styles.attributesGrid}>
                    {Object.keys(userData.stats).map(statKey => (
                        <div key={statKey} className={styles.attrBox}>
                            <span className={styles.attrName}>{getStatName(statKey)}</span>
                            <p className={styles.attrVal}>{userData.stats[statKey]}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.trackersStack}>
                    <StatusReport />
                    <WeightTracker weightHistory={userData.weightHistory} />
                </div>
                
            </div>
        </>
    );
}