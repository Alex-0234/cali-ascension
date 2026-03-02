
import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import calculateLevel, { getLevelProgress } from "../../utils/levelUpSystem";
import { calculateBMR } from "../../utils/calculateBMI";
import WeightTracker from "../../components/stats/weightTracker";
import HealthTracker from "../../components/stats/HealthTracker";
import CurrentProgram from "../../components/stats/CurrentProgram";
import EditProfileModal from "../../components/stats/EditProfileModal";


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

    const [loaded, setLoaded] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);
    const displayXP = userData.level >= 100 ? "MAX" : userData.xp;

    
    const { BMR, BMI } = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);

    useEffect(() => {
        setLoaded(true);
        const currentProgress = getLevelProgress(userData.xp, userData.level);
        setLevelProgress(currentProgress);
    },[userData]);

    useEffect(() => {
        const {level, currentLeftoverXP} = calculateLevel(userData);

        setUserData({
            ...userData,
            level: level,
            xp: currentLeftoverXP,
        })
    }, []);

    if (!loaded) {
        return <div><p>Initializing user...</p></div>
    }


    return (
        <>
        <div className="status-window border">
            <div className="d_flex_dir_row">
                <h3>[ Level  {userData.level} ]</h3>
                <h3> [ {userData.rank} ] </h3>
            </div>
            <hr/>
            {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
            <div className="user-info">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2> {userData.shownName} </h2>
                    <button className="generic-btn" onClick={() => setShowEditModal(!showEditModal)}>Edit Profile</button>
                </div>
                
                <div className="progress-bar" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <div className='level-bar' style={{  height: '1rem', width: '100%'}}>
                        <div className='level-progress' style={{ width: `${levelProgress}%` }}></div>
                    </div>
                <p style={{placeSelf: 'start', margin: '0'}}>XP: {Math.round(displayXP)} </p>
                </div>
            </div>
            
            <hr/>
            <div className="stats d_grid_2_2" >
                {Object.keys(userData.stats).map(statKey => (
                    <div key={statKey} className="stat-wrapper">
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