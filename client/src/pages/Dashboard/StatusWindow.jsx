import useUserStore from "../../store/usePlayerStore"
import useUIStore from "../../store/useUIStore";
import { useState, useEffect } from "react";
import calculateLevel, { getLevelProgress } from "../../utils/levelUpSystem";
import { calculateBMR } from "../../utils/calculateBMI";
import WeightTracker from "../../components/stats/weightTracker";
import HealthTracker from "../../components/stats/HealthTracker";
import CurrentProgram from "../../components/stats/CurrentProgram";


import styles from "../../styles/status.module.css";

const getStatName = (statKey) => {
    switch (statKey) {
        case 'STR': return 'Strength';
        case 'AGI': return 'Agility';
        case 'DEX': return 'Dexterity';
        case 'VIT': return 'Vitality';
        default: return statKey;
    }
};

export default function StatusWindow() {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);
    const weightHistory = useUserStore((state) => state.userData.weightHistory);
    const workoutHistory = useUserStore((state) => state.userData.workoutHistory);
    const setProfile = useUIStore((state) => state.setProfile)

    const [loaded, setLoaded] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);
    const displayXP = userData.level >= 100 ? "MAX" : userData.xp;

    const { BMR, BMI } = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);

    useEffect(() => {
        setLoaded(true);
    },[])

    useEffect(() => {
        const currentProgress = getLevelProgress(userData.xp, userData.level);
        setLevelProgress(currentProgress);
        const {level, currentLeftoverXP} = calculateLevel(userData);

        setUserData({
            ...userData,
            level: level,
            xp: currentLeftoverXP,
        })
    },[workoutHistory]);

    if (!loaded) {
        return <div><p>Initializing user...</p></div>
    }

    return (
        <>
        <div className={`${styles.window} border`}>
            
            <div className={styles.flexRow}>
                <h3>[ Level  {userData.level} ]</h3>
                <h3> [ {userData.rank} ] </h3>
            </div>
            
            <hr className={styles.divider}/>
            
            <div className={styles.userInfo}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2> {userData.shownName} </h2>
                    <button className="generic-btn" onClick={() => setProfile(true)}>
                        Edit Profile
                    </button>
                </div>
                
                <div className={styles.progressContainer} style={{flexDirection: 'column', gap: '0.5rem'}}>
                    <div className={styles.levelBar} style={{ height: '1rem', width: '100%' }}>
                        <div className={styles.levelProgress} style={{ width: `${levelProgress}%` }}></div>
                    </div>
                    <p style={{placeSelf: 'start', margin: '0'}}>XP: {Math.round(displayXP)} </p>
                </div>
            </div>
            
            <hr className={styles.divider}/>
            
            <div className={styles.statsGrid}>
                {Object.keys(userData.stats).map(statKey => (
                    <div key={statKey} className={styles.statBox}>
                        <h3>[ {getStatName(statKey)} ]</h3>
                        <p>{userData.stats[statKey]}</p>
                    </div>
                ))}
            </div>

            <CurrentProgram />
            <WeightTracker weightHistory={weightHistory} />
            <HealthTracker />
            
        </div>
        </>
    )
}