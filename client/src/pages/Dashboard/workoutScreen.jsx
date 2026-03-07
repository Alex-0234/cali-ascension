import { useState, useEffect } from "react";

import { SPLIT_MODES, EXERCISE_DB, ALL_EXERCISES } from "../../data/exercise_db";
import useUserStore from "../../store/usePlayerStore";  

import {saveWorkoutReps} from '../../utils/workoutSystem'
import calculateLevel from "../../utils/levelUpSystem";
import { calculatePlayerStats } from "../../utils/statSystem";
import Navbar from "../../components/layout/Navbar";
import { getHighestUnlockedExercises } from "../../utils/workoutSelector";
import { getPrevNextExerciseID } from "../../utils/workoutSelector";

import styles from '../../styles/workout.module.css'

export function WorkoutScreen() {
    const setUserData = useUserStore((state) => state.setUserData);
    const userData = useUserStore((state) => state.userData);
    const currentProgress = useUserStore(state => state.userData.exerciseProgress);
    const syncUser = useUserStore((state) => state.syncUser);
    
    const [selectedSplit, setSelectedSplit] = useState(userData.currentProgram || 'Full Body');
    const [activeExercises, setActiveExercises] = useState({});
    const [workoutSets, setWorkoutSets] = useState({});
    
    const [levelChange, setLevelChange] = useState({show: false, newLevels: 0, xpGain: 0})

    useEffect(() => {
        const highestUnlocked = getHighestUnlockedExercises(currentProgress);
        const initialActive = {};
        const initialSets = {};

        Object.keys(SPLIT_MODES).forEach(split => {
            SPLIT_MODES[split].forEach(category => {
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
        const stats = calculatePlayerStats(newProgress);

        const workoutRecord = {
            date: new Date(),
            exerciseID: exerciseID,
            totalReps: totalReps,
            sets: [...sets],
        };

        const newUserData = {
            ...userData,
            stats: stats,
            exerciseProgress: newProgress,
            workoutHistory: [...(userData.workoutHistory), workoutRecord]
        };

        const { level: newLevel, currentLeftoverXP, totalXPEarned } = calculateLevel(newUserData);

        const levelDifference = newLevel - userData.level;

        if (levelDifference > 0) {
            setLevelChange({show: true, newLevels: levelDifference, xpGain: totalXPEarned});
            setTimeout(() => setLevelChange({show: false, newLevels: 0, xpGain: 0}), 3000);
        }
        const dateNow = new Date();

        setUserData({
            ...newUserData,
            level: newLevel,
            xp: currentLeftoverXP,
            streak: { 
                current: userData.current + 1,
                highest: userData.current + 1 > userData.highest ? userData.current + 1 : userData.highest,
                lastActive: dateNow.toLocaleDateString('en-CA'),
            },
            lastActive: [...userData.lastActive, dateNow.toLocaleDateString('en-CA')]
        });

        syncUser();
        setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
    };

    const visibleCategories = SPLIT_MODES[selectedSplit] || [];

    return (
        <>
        <div className={styles.workoutScreenContainer}>

            {levelChange.show && (
                <div className={styles.levelUpNotification}>
                    <h2>Level Up +{levelChange.newLevels}!</h2>
                    <p>Total XP Gained: {Math.round(levelChange.xpGain)}</p>
                </div>
            )}

            <div>
                {visibleCategories.map(category => {
                    const currentExId = activeExercises[category];
                    if (!currentExId) return null;

                    const exerciseData = EXERCISE_DB[currentExId];
                    const currentSets = workoutSets[category] || [];
                    const isUnlocked = currentProgress[currentExId] !== undefined;

                    return (
                        <div key={category} className={`${styles.exerciseCard} ${!isUnlocked ? styles.locked : ''}`}>
                            
                            <div className={styles.exerciseHeader}>
                                <button 
                                    className={styles.navBtn}
                                    onClick={() => handleSwitchExercise(category, 'prev')}
                                >&lt;</button>
                                
                                <h3 className={isUnlocked ? styles.unlocked : styles.locked} style={{ margin: 0 }}>
                                    {exerciseData?.name || currentExId}
                                </h3>
                                
                                <button 
                                    className={styles.navBtn}
                                    onClick={() => handleSwitchExercise(category, 'next')}
                                >&gt;</button>
                            </div>

                            <div className={styles.badgeContainer}>
                                <span className={`${styles.sysBadge} ${isUnlocked ? styles.unlocked : styles.locked}`}>
                                    {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                                </span>
                            </div>

                            {isUnlocked ? (
                                <>
                                    <div className={styles.setsContainer}>
                                        {currentSets.map((set, index) => (
                                            <div key={index} className={styles.setRow}>
                                                <span className={styles.setLabel}>Set {index + 1}</span>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="Reps"
                                                    value={set.reps || ''}
                                                    onChange={(e) => handleUpdateSet(category, index, 'reps', e.target.value)}
                                                    className={styles.setInput}
                                                    required
                                                />
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="+ kg"
                                                    value={set.extraWeight || ''}
                                                    onChange={(e) => handleUpdateSet(category, index, 'extraWeight', e.target.value)}
                                                    className={styles.setInput}
                                                />
                                                {currentSets.length > 1 && (
                                                    <button 
                                                        className={styles.btnRemove}
                                                        onClick={() => handleRemoveSet(category, index)}
                                                    >X</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.exerciseActions}>
                                        <button 
                                            className={styles.btnAddSet}
                                            onClick={() => handleAddSet(category)}
                                        >+ Add Set</button>
                                        <button 
                                            className={styles.btnComplete}
                                            onClick={() => finishExercise(category, currentExId)}
                                        >Complete Exercise</button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.lockedStateBox}>
                                    <span>🔒</span>
                                    <h4>Exercise Locked</h4>
                                    <p>You haven't reached this variation in your Skill Tree yet.</p>
                                    <button 
                                        className={styles.btnForceUnlock}
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
        </>
    );
}

export default WorkoutScreen;