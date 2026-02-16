
import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";
import { getLevelProgress } from "../../utils/levelUpSystem";


export default function StatusWindow() {
    const userData = useUserStore((state) => state.userData);
    const addXP = useUserStore((state) => state.addXP);
    const [loaded, setLoaded] = useState(false);
    const currentProgress = getLevelProgress(userData.xp, userData.level);

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

            <h3> {userData.shownName} </h3>
            <div className="progress-bar">
                <div className='level-bar' style={{width: 90 + '%', height: 1 + 'rem', placeSelf: "center"}}>
                    <div className='level-progress' style={{width: currentProgress + '%', height: 1 + 'rem', background: 'lightblue', transitionDelay: 0.15 + 's' }}></div>
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
        </div>
        </>
    )
}