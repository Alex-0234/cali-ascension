
import useUserStore from "../../store/usePlayerStore"
import { useState, useEffect } from "react";


export default function StatusWindow() {
    const userData = useUserStore((state) => state.userData);
    const addXP = useUserStore((state) => state.addXP);
    const [loaded, setLoaded] = useState(false);

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

            <h3> {userData.username} </h3>
            <div className="progress-bar">
                <p>XP: [☐☐☐☐☐☐☐☐☐☐☐☐☐]</p>
                <button onClick={() => addXP(1)}>+1xp</button>
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
            <hr/>
            <div className="daily-quest" >
                <h3>DAILY QUEST: template_name </h3>
                <div className="quest-row " >
                    <input className="inline-b" type="checkbox" style={{height: 20 + 'px', width: 20 + 'px'} }></input>
                    <p className="inline-b">Pushups:    50/100 </p>
                </div>
                <div className="quest-row " >
                    <input className="inline-b" type="checkbox" style={{height: 20 + 'px', width: 20 + 'px'} }></input>
                    <p className="inline-b">Squats:     50/100 </p>
                </div>
                <div className="quest-row " >
                    <input className="inline-b" type="checkbox" style={{height: 20 + 'px', width: 20 + 'px'} }></input>
                    <p className="inline-b">Pullups:    50/100 </p>
                </div>
            </div>
        </div>

        </>
    )
}