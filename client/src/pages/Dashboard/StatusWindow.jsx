
import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import { getLevelProgress } from "../../utils/levelUpSystem";
import { calculateBMR } from "../../utils/calculateBMI";
import WeightTracker from "../../components/stats/weightTracker";
import HealthTracker from "../../components/stats/HealthTracker";


export default function StatusWindow() {
    const userData = useUserStore((state) => state.userData);
    const weightHistory = useUserStore((state) => state.userData.weightHistory);

    const addXP = useUserStore((state) => state.addXP);
    const [loaded, setLoaded] = useState(false);
    const currentProgress = getLevelProgress(userData.xp, userData.level);
    const { BMR, BMI } = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);

    useEffect(() => {
        setLoaded(true);
        

    },[userData]);

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

            <h2> {userData.shownName} </h2>
            <div className="progress-bar">
                <div className='level-bar' style={{  height: '15px'}}>
                    <div className='level-progress' style={{ width: `${currentProgress}%` }}></div>
                </div>
                <button onClick={() => addXP(100)}>+100xp</button>
            </div>
            <hr/>
            <div className="stats d_grid_2_2" >
                <div className="stat-wrapper">
                    <h3>[ Strength ]</h3>
                    <p>{userData.stats.STR}</p>
                </div>
                
                <div className="stat-wrapper">
                    <h3>[ Agility ]</h3>
                    <p>{userData.stats.AGI}</p>
                </div>
                <div className="stat-wrapper">
                    <h3>[ Dexterity ]</h3>
                    <p>{userData.stats.DEX}</p>
                </div>
                
                <div className="stat-wrapper">
                    <h3>[ Vitality ]</h3>
                    <p>{userData.stats.VIT}</p>
                </div>
            </div>

            <WeightTracker weightHistory={weightHistory} />
            <HealthTracker />
            
        </div>
        </>
    )
}