import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import calculateLevel, { getLevelProgress, getXpNeededForLevel } from "../../utils/levelUpSystem";
import WeightTracker from "../../components/stats/weightTracker";
import StatusReport from "../../components/stats/statusReport";
import { calculateStreakFromObject } from "../../utils/calculateStreak";
import { calculatePlayerStats } from '../../utils/statSystem';

import styles from "../../styles/status.module.css";

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

    useEffect(() => {
        setLevelProgress(currentProgress);
        
        setUserData({
            ...userData,
            level: level,
            xp: currentLeftoverXP,
            stats: {...stats},
            streak: {
                current: current,
                highest: highest
            },
        });

    }, [userData.workoutHistory, currentProgress]);

    if (!isReady) return <div className={styles.sysLoading}>Synchronizing Hunter Data...</div>;

    if (!userData.isConfigured) {
        navigate('/evaluation');
    }

    return (
        <div className="mock-body">
            <div className={styles.dashboardWrapper}>
                
                <div className={styles.sysHeader}>
                    <h2 className={styles.sysTitle}>System.Hunter_Profile</h2>
                </div>

                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.badgeContainer} style={{borderColor: userData.color || '#00e5ff'}}>
                            {userData.equippedBadge || "👤"}
                        </div>

                        <div className={styles.nameBlock}>
                            <div className={styles.playerTitle} style={{color: userData.color}}>
                                {userData.title || "Unranked Hunter"}
                            </div>
                            <h2 className={styles.playerName}>{userData.shownName}</h2>
                        </div>
                    </div>

                    <div className={styles.entryDivider}></div>

                    <div className={styles.coreStatsRow}>
                        <div className={`${styles.sysStatBox} ${styles.streakBox}`}>
                            <span className={styles.sysLabel}>Active Streak</span>
                            <span className={`${styles.sysValue} ${styles.textGold}`}>[ 🔥 {current} DAYS ]</span>
                        </div>

                        <div className={styles.sysStatBox}>
                            <span className={styles.sysLabel}>Hunter Rank</span>
                            <span className={styles.sysValue} style={{color: userData.color}}>{userData.rank}</span>
                        </div>
                        
                        <div className={styles.sysStatBox} >
                            <span className={styles.sysLabel}>Current Level</span>
                            <span className={styles.sysValue}>{userData.level}</span>
                        </div>
                    </div>

                    <div className={styles.xpSection}>
                        <div className={styles.xpLabels}>
                            <span className={styles.sysLabel}>Experience.Progress</span>
                            <span className={styles.xpValue}>
                                {displayXP} <span style={{color: '#64748b'}}>/ {Math.round(xpNeeded)} XP</span>
                            </span>
                        </div>
                        <div className={styles.xpTrack}>
                            <div className={styles.xpFill} style={{ width: `${levelProgress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.sysHeader} style={{marginTop: '10px'}}>
                    <h2 className={styles.sysTitle}>Biometric.Attributes</h2>
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
        </div>
    );
}