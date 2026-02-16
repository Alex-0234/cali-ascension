
import { useState } from "react";
import { saveWorkoutReps } from "../../utils/workoutSystem";
import useUserStore from "../../store/usePlayerStore";
import { getHighestUnlockedExercises } from '../../utils/workoutSelector';
import {getProficiency } from '../../utils/proficiencySystem';
import { calculateLevelUp } from "../../utils/levelUpSystem";
import { calculatePlayerStats } from "../../utils/statSystem";

export function WorkoutScreen() {
    const setUserData = useUserStore((state) => state.setUserData);
    const userData = useUserStore((state) => state.userData);
    const currentProgress = useUserStore(state => state.userData.exerciseProgress);
    const syncUser = useUserStore(state => state.syncUser);
    const [currentValue, setCurrentValue] = useState(0);

    const finishWorkout = (exerciseID, repsDone) => {
        const newProgress = saveWorkoutReps(currentProgress, exerciseID, repsDone);
        const { newLevel, leftoverXP } = calculateLevelUp(userData.level, userData.xp, exerciseID, repsDone);
        const stats = calculatePlayerStats(newProgress);
        setUserData({
            ...userData,
            level: newLevel,
            xp: leftoverXP,
            stats: stats,
            exerciseProgress: newProgress
        })
        console.log("Workout saved! Cascading proficiency applied.");
        syncUser();
    };

   const currentQuests = getHighestUnlockedExercises(currentProgress);

return (
        <div className="workout-dashboard">
            <h2>🔥 Daily Quests: Your Current Limits</h2>
            
            <div className="exercise-grid">
                {Object.entries(currentQuests).map(([category, exerciseData]) => {
                    
                    const { currentLevel, currentProgress } = getProficiency(exerciseData.totalReps);
                    

                    return (
                        <div key={category} className="quest-card">
                            <span className="category-label">{category.toUpperCase()}</span>
                            <h3>{exerciseData.name} (Tier {exerciseData.tier})</h3>
                            
                            {/* --- NOVÝ PROGRESS BAR --- */}
                            <div className="skill-progress-container">
                                <div className="skill-header">
                                    {currentLevel < 10 ? (
                                        <span className="skill-points">
                                            [ Proficiency: {currentLevel} / 10 ]
                                        </span>
                                    ) : (
                                        <span className="skill-max">MAX LEVEL</span>
                                    )}
                                </div>
                                
                                <div className="mini-xp-bar"
                                    style={{width: 100 + '%', height: 1 + 'rem', margin: '0.5rem 0 0.5rem 0', background: 'gray'}}
                                    >
                                    <div 
                                        className="mini-xp-fill" 
                                        style={{ width: `${currentProgress}%`, height: 1 + 'rem', margin: '0.5rem 0 0.5rem 0', background: 'lightblue'}}
                                    ></div>
                                </div>
                            </div>
                            {/* ------------------------- */}

                            
                                <input className="exercise-input" onChange={(e) => setCurrentValue(e.target.value)}></input>
                                <button className="exercise-completion" onClick={() => finishWorkout(exerciseData.id, currentValue)}>Finish exercise</button>
                            <hr></hr>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
