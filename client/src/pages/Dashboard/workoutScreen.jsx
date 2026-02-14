import { calculateProficiencyCascade } from '../../utils/proficiencySystem';
import useUserStore from "../../store/usePlayerStore";
import { getHighestUnlockedExercises } from '../../utils/workoutSelector';
import { getProficiencyLevel, getProficiencyProgress } from '../../utils/proficiencySystem';

export function WorkoutScreen() {
    const userData = useUserStore(state => state.userData);
    const setUserData = useUserStore(state => state.setUserData);
    const userProgress = useUserStore(state => state.userData.exerciseProgress);

    const finishWorkout = (exerciseID, repsDone) => {
        const updatedProgress = calculateProficiencyCascade(
            userData.userProgress, 
            exerciseID, 
            repsDone
        );

        setUserData({
            ...userData,
            userProgress: updatedProgress
        });
        
        console.log("Workout saved! Cascading proficiency applied.");
    };

   const currentQuests = getHighestUnlockedExercises(userProgress);

return (
        <div className="workout-dashboard">
            <h2>🔥 Daily Quests: Your Current Limits</h2>
            
            <div className="exercise-grid">
                {Object.entries(currentQuests).map(([category, exerciseData]) => {
                    
                    const currentLevel = getProficiencyLevel(exerciseData.proficiency);
                    const progressPercent = getProficiencyProgress(exerciseData.proficiency);

                    return (
                        <div key={category} className="quest-card">
                            <span className="category-label">{category.toUpperCase()}</span>
                            <h3>{exerciseData.name} (Tier {exerciseData.tier})</h3>
                            
                            {/* --- NOVÝ PROGRESS BAR --- */}
                            <div className="skill-progress-container">
                                <div className="skill-header">
                                    <span className="skill-level">Lv. {currentLevel}</span>
                                    {currentLevel < 10 ? (
                                        <span className="skill-points">
                                            {(exerciseData.proficiency % 1000)} / 1000
                                        </span>
                                    ) : (
                                        <span className="skill-max">MAX LEVEL</span>
                                    )}
                                </div>
                                
                                <div className="mini-xp-bar">
                                    <div 
                                        className="mini-xp-fill" 
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                            {/* ------------------------- */}

                            <button className="btn-start-workout">
                                START TRAINING
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
