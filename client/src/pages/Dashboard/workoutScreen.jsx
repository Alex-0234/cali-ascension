import { useState, useEffect } from "react";

import { SPLIT_MODES, EXERCISE_DB, ALL_EXERCISES } from "../../data/exercise_db";
import useUserStore from "../../store/usePlayerStore";  
import {saveWorkoutReps} from '../../utils/workoutSystem'
import { calculateLevelUp } from "../../utils/levelUpSystem";
import { calculatePlayerStats } from "../../utils/statSystem";
import Navbar from "../../components/layout/Navbar";
import { getHighestUnlockedExercises } from "../../utils/workoutSelector";
import { getPrevNextExerciseID } from "../../utils/workoutSelector";

export function WorkoutScreen() {
    const setUserData = useUserStore((state) => state.setUserData);
    const userData = useUserStore((state) => state.userData);
    const currentProgress = useUserStore(state => state.userData.exerciseProgress);
    const syncUser = useUserStore((state) => state.syncUser);
    
    const [selectedSplit, setSelectedSplit] = useState('Push/Pull/Legs');
    const [activeExercises, setActiveExercises] = useState({});
    const [workoutSets, setWorkoutSets] = useState({});
    
    const [levelUpData, setLevelUpData] = useState({ show: false, levelUps: 0, newLevel: 0 });

    useEffect(() => {
        const highestUnlocked = getHighestUnlockedExercises(currentProgress);
        const initialActive = {};
        const initialSets = {};

        Object.keys(SPLIT_MODES).forEach(split => {
            SPLIT_MODES[split].forEach(category => {
                // Výchozí je nejvyšší odemčený cvik. Pokud není žádný, ukážeme úplně první cvik stromu (tier 0)
                initialActive[category] = highestUnlocked[category]?.id || ALL_EXERCISES[category][0];
                initialSets[category] = [{ reps: 0, extraWeight: 0 }];
            });
        });

        setActiveExercises(initialActive);
        setWorkoutSets(initialSets);
    }, [currentProgress]);

    const handleSwitchExercise = (category, direction) => {
        const currentId = activeExercises[category];
        const { prevID, nextID } = getPrevNextExerciseID(category, currentId);
        const newId = direction === 'prev' ? prevID : nextID;
        
        if (newId) {
            setActiveExercises(prev => ({ ...prev, [category]: newId }));
            setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
        }
    };

    const handleAddSet = (category) => {
        setWorkoutSets(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), { reps: 0, extraWeight: 0 }]
        }));
    };

    const handleUpdateSet = (category, index, field, value) => {
        const updatedSets = [...workoutSets[category]];
        updatedSets[index][field] = Number(value);
        setWorkoutSets(prev => ({ ...prev, [category]: updatedSets }));
    };

    const handleRemoveSet = (category, index) => {
        const updatedSets = workoutSets[category].filter((_, i) => i !== index);
        setWorkoutSets(prev => ({ ...prev, [category]: updatedSets }));
    };

    const handleForceUnlock = (category, exerciseId) => {
        setUserData({
            ...userData,
            exerciseProgress: {
                ...currentProgress,
                [exerciseId]: { totalReps: 0, personalBest: 0 }
            }
        });
        setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
    };

    const finishExercise = (category, exerciseID) => {
        const sets = workoutSets[category] || [];
        const totalReps = sets.reduce((sum, set) => sum + (set.reps || 0), 0);
        
        if (totalReps === 0) return;

        const newProgress = saveWorkoutReps(currentProgress, exerciseID, totalReps);
        
        const { newLevel, leftoverXP } = calculateLevelUp(userData.level, userData.xp, exerciseID, totalReps);
        const levelUps = newLevel - userData.level;

        if (levelUps > 0) {
            setLevelUpData({ show: true, levelUps: levelUps, newLevel: newLevel });
            setTimeout(() => setLevelUpData({ show: false, levelUps: 0, newLevel: 0 }), 3000);
        }
        
        const stats = calculatePlayerStats(newProgress);

        const workoutRecord = {
            exerciseID,
            sets: [...sets],
        };

        setUserData({
            level: newLevel,
            xp: leftoverXP,
            stats: stats,
            exerciseProgress: newProgress,
            workoutHistory: [...(userData.workoutHistory || []), workoutRecord]
        });

        syncUser();

        setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
    };

    const visibleCategories = SPLIT_MODES[selectedSplit] || [];

    return (
        <div className="workout-screen-container">
            {/* Split Selector */}
            <div className="split-selector">
                {Object.keys(SPLIT_MODES).map(split => (
                    <button 
                        key={split}
                        className={`split-btn ${selectedSplit === split ? 'active' : ''}`}
                        onClick={() => setSelectedSplit(split)}
                    >
                        {split}
                    </button>
                ))}
            </div>

            {/* Level Up Notification */}
            {levelUpData.show && (
                <div className="level-up-notification">
                    <h2>Level Up!</h2>
                    <p>You gained {levelUpData.levelUps} level(s) and are now level {levelUpData.newLevel}!</p>
                </div>
            )}

            {/* Exercises List */}
            <div>
                {visibleCategories.map(category => {
                    const currentExId = activeExercises[category];
                    if (!currentExId) return null;

                    const exerciseData = EXERCISE_DB[currentExId];
                    const currentSets = workoutSets[category] || [];
                    
                    const isUnlocked = currentProgress[currentExId] !== undefined;

                    return (
                        <div key={category} className={`exercise-card ${isUnlocked ? '' : 'locked'}`}>
                            
                            {/* Exercise Header */}
                            <div className="exercise-header">
                                <button 
                                    className="nav-btn"
                                    onClick={() => handleSwitchExercise(category, 'prev')}
                                >&lt;</button>
                                
                                <h3 className={isUnlocked ? 'unlocked' : 'locked'}>
                                    {exerciseData?.name || currentExId}
                                </h3>
                                
                                <button 
                                    className="nav-btn"
                                    onClick={() => handleSwitchExercise(category, 'next')}
                                >&gt;</button>
                            </div>

                            {/* Badge Label */}
                            <div className="badge-container">
                                <span className={`sys-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                    {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                                </span>
                            </div>

                            {/* Content based on Lock Status */}
                            {isUnlocked ? (
                                <>
                                    <div className="sets-container">
                                        {currentSets.map((set, index) => (
                                            <div key={index} className="set-row">
                                                <span className="set-label">Set {index + 1}</span>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="Reps"
                                                    value={set.reps || ''}
                                                    onChange={(e) => handleUpdateSet(category, index, 'reps', e.target.value)}
                                                    className="set-input"
                                                />
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="+ kg"
                                                    value={set.extraWeight || ''}
                                                    onChange={(e) => handleUpdateSet(category, index, 'extraWeight', e.target.value)}
                                                    className="set-input"
                                                />
                                                {currentSets.length > 1 && (
                                                    <button 
                                                        className="btn-remove"
                                                        onClick={() => handleRemoveSet(category, index)}
                                                    >X</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="exercise-actions">
                                        <button 
                                            className="btn-add-set"
                                            onClick={() => handleAddSet(category)}
                                        >+ Add Set</button>
                                        <button 
                                            className="btn-complete"
                                            onClick={() => finishExercise(category, currentExId)}
                                        >Complete Exercise</button>
                                    </div>
                                </>
                            ) : (
                                <div className="locked-state-box">
                                    <span>🔒</span>
                                    <h4>Exercise Locked</h4>
                                    <p>You haven't reached this variation in your Skill Tree yet.</p>
                                    <button 
                                        className="btn-force-unlock"
                                        onClick={() => handleForceUnlock(category, currentExId)}
                                    >
                                        Force Unlock (Start Tracking)
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <Navbar />
        </div>
    );
}

export default WorkoutScreen;