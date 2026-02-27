
import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import { getLevelProgress } from "../../utils/levelUpSystem";
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
    const weightHistory = useUserStore((state) => state.userData.weightHistory);

    const [loaded, setLoaded] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const currentProgress = getLevelProgress(userData.xp, userData.level);
    const { BMR, BMI } = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);

    useEffect(() => {
        setLoaded(true);
        

    },[userData]);

    if (!loaded) {
        return <div><p>Initializing user...</p></div>
    }

    const onCloseEditModal = () => {
        setShowEditModal(false);
    }


    return (
        <>
        <div className="status-window border">
            <div className="d_flex_dir_row">
                <h3>[ Level  {userData.level} ]</h3>
                <h3> [ {userData.rank} ] </h3>
            </div>
            <hr/>
            {showEditModal && <EditProfileModal onClose={onCloseEditModal} />}
            <div className="user-info">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2> {userData.shownName} </h2>
                    <button className="generic-btn" onClick={() => setShowEditModal(true)}>Edit Profile</button>
                </div>
                
                <div className="progress-bar">
                    <div className='level-bar' style={{  height: '15px'}}>
                        <div className='level-progress' style={{ width: `${currentProgress}%` }}></div>
                    </div>
                    <p>XP: {userData.xp}</p>
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