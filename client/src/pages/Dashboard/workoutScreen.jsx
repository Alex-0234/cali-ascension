import { useState, useEffect } from "react";

import { SPLIT_MODES, EXERCISE_DB, ALL_EXERCISES } from "../../data/exercise_db";
import useUserStore from "../../store/usePlayerStore";  

import calculateLevel from "../../utils/levelUpSystem";
import { calculatePlayerStats } from "../../utils/statSystem";
import { getHighestUnlockedExercises } from "../../utils/workoutSelector";
import { getPrevNextExerciseID } from "../../utils/workoutSelector";

import SystemButton from '../../components/ui/systemBtn'
import CloseButton from "../../components/ui/closeBtn";

import styles from '../../styles/workout.module.css'

export function WorkoutScreen() {
    const FALLBACK_PLAN = {
        cycle: [
            { name: 'Push Day', categories: ['pushups'] },
            { name: 'Pull Day', categories: ['pullups'] },
            { name: 'Leg Day', categories: ['squats'] },
            { name: 'Core & Mobility', categories: ['core'] }
        ],
        currentDayIndex: 0
    };

    const dateNow = new Date().toISOString().split('T')[0];

    const { userData, setUserData, syncUser } = useUserStore();
    const currentProgress = useUserStore(state => state.userData.exerciseProgress);
    const selectedSplit = userData.currentProgram || 'Full Body';
    const workoutPlan = userData.workoutPlan || FALLBACK_PLAN;
    
    const [overrideWorkout, setOverrideWorkout] = useState(null);

    const [training, setTraining] = useState(false);
    const [currentWorkoutSession, setCurrentWorkoutSession] = useState({});

    const [activeExercises, setActiveExercises] = useState({});

    const [workoutSets, setWorkoutSets] = useState({});
    const [levelChange, setLevelChange] = useState({show: false, newLevels: 0, xpGain: 0});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);


    useEffect(() => {
        console.log(currentWorkoutSession);
    },[currentWorkoutSession])


    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsRunning(!isRunning);
    
    const resetTimer = () => {
        setIsRunning(false);
        setTimeElapsed(0);
    };

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

    const handleStartTraining = () => {
        setTraining(true);
        setIsRunning(true);
    }

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

    const handleAddExerciseToSession = (category, exerciseID) => {
        const sets = workoutSets[category] || [];
        const totalReps = sets.reduce((sum, set) => sum + (Number(set.reps) || 0), 0);

        if (totalReps === 0) return;

        setCurrentWorkoutSession(prev => {   
            const currentDay = prev[dateNow] || userData.workoutHistory[dateNow] || {
                status: 'workout',
                totalVolume: 0,
                totalSets: 0,
                duration: 0,
                notes: '',
                exercises: {}
            };

            const existingExercise = currentDay.exercises[exerciseID];

            return {
                ...prev,
                [dateNow]: {
                    ...currentDay,
                    totalVolume: (currentDay.totalVolume || 0) + totalReps,
                    totalSets: (currentDay.totalSets || 0) + sets.length,
                    exercises: {
                        ...currentDay.exercises,
                        [exerciseID]: {
                            totalReps: (existingExercise?.totalReps || 0) + totalReps,
                            sets: existingExercise ? [...existingExercise.sets, ...sets] : [...sets]
                        }
                    }
                }
            };
        });

        setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
    };

    const handleFinishWorkoutDay = () => {
        const todaySession = currentWorkoutSession[dateNow];

        if (!todaySession || Object.keys(todaySession.exercises).length === 0) { 
            console.log("No exercises were added to the session");
            return;
        }

        setIsRunning(false);

        const finalDayRecord = {
            ...todaySession,
            duration: todaySession.duration + timeElapsed, 
            notes: '' // Add later
        };

        const stats = calculatePlayerStats(finalDayRecord);

        let nextIndex = workoutPlan.currentDayIndex;
        if (!overrideWorkout) {
            nextIndex = (workoutPlan.currentDayIndex + 1) % workoutPlan.cycle.length;
        } 

        const newUserData = {
            ...userData,
            stats: stats,
            workoutHistory: {
                ...userData.workoutHistory, 
                [dateNow]: finalDayRecord 
            },
            workoutPlan: {
                ...workoutPlan,
                currentDayIndex: nextIndex
            }
        };

        const { level, currentLeftoverXP, totalXPEarned } = calculateLevel(newUserData);
        const levelDifference = level - userData.level;

        if (levelDifference > 0) {
            setLevelChange({show: true, newLevels: levelDifference, xpGain: totalXPEarned});
            setTimeout(() => setLevelChange({show: false, newLevels: 0, xpGain: 0}), 3000);
        }

        setUserData({
            ...newUserData,
            level: level,
            xp: currentLeftoverXP
        });

        syncUser();
        setCurrentWorkoutSession({});
        setTraining(false);
        setTimeElapsed(0);
        setOverrideWorkout(null);
    };

    const activeDay = workoutPlan.cycle[workoutPlan.currentDayIndex];
    const visibleCategories = activeDay?.categories || SPLIT_MODES[selectedSplit] || [];
    const activeDayName = activeDay?.name || "Workout";

    return (
        <div className={styles.workoutScreenContainer}>
            {levelChange.show && (
                <div className={styles.levelUpNotification}>
                    <h2>Level Up +{levelChange.newLevels}!</h2>
                    <p>Total XP Gained: {Math.round(levelChange.xpGain)}</p>
                </div>
            )}

            {!training ? (
                <div className={styles.startScreen}>
                    <div className={styles.topBar}>
                        <h2 style={{margin: 0, fontSize: '1rem', color: '#94a3b8'}}>
                            On schedule: <span className={styles.scheduleTitle}>{activeDayName}</span>
                        </h2>
                        <SystemButton text='Switch' />
                    </div>
                    <div className={styles.startBtnWrapper}>
                        <SystemButton text='Start training' onClick={handleStartTraining}/>
                    </div>
                </div>      
            ) : (
                <div className={styles.trainingActiveScreen}>
                    <div className={styles.stickyHeader}>
                        <div className={styles.topBar}>
                            <h2 style={{margin: 0, fontSize: '1rem', color: '#94a3b8'}}>
                                On schedule: <span className={styles.scheduleTitle}>{activeDayName}</span>
                            </h2>
                            <SystemButton text='Switch' />
                        </div>
                        <div className={styles.timerDisplay}>
                            Timer: <span className={styles.timerText}>{formatTime(timeElapsed)}</span>
                        </div>
                    </div>

                    {currentWorkoutSession[dateNow] && Object.keys(currentWorkoutSession[dateNow].exercises).length > 0 && (
                        <div className={styles.sessionSummary}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--cyan, #00e5ff)', textTransform: 'uppercase' }}>Logged Exercises:</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#94a3b8' }}>
                                {Object.entries(currentWorkoutSession[dateNow].exercises).map(([exId, exData], i) => (
                                    <li key={i}>
                                        {EXERCISE_DB[exId]?.name || exId} - {exData.totalReps} {EXERCISE_DB[exId]?.unit || 'reps'}
                                    </li>
                                ))}
                            </ul>
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
                                        
                                        <h3 className={isUnlocked ? styles.unlocked : styles.locked}>
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
                                                            placeholder={exerciseData.unit}
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
                                                            >✕</button>
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
                                                    onClick={() => handleAddExerciseToSession(category, currentExId)}
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
                    
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                        <SystemButton text='Complete Workout Day' onClick={handleFinishWorkoutDay} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkoutScreen;