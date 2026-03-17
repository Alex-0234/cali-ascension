import { useState, useEffect, useMemo } from "react";

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
    const dateNow = new Date().toISOString().split('T')[0];

    const { userData, setUserData, syncUser } = useUserStore();
    const currentProgress = useUserStore(state => state.userData.exerciseProgress);
    
    const defaultSplitName = userData.currentSplit?.split || 'Full Body';
    const scheduledDayIndex = userData.currentSplit?.currentDayIndex || 0;
    
    const [bioStatus, setBioStatus] = useState(userData.bioStatus || 'optimal');
    const [overrideSplit, setOverrideSplit] = useState(null);

    const [training, setTraining] = useState(false);
    const [currentWorkoutSession, setCurrentWorkoutSession] = useState({});

    const [activeExercises, setActiveExercises] = useState({});
    const [workoutSets, setWorkoutSets] = useState({});
    const [levelChange, setLevelChange] = useState({show: false, newLevels: 0, xpGain: 0});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const activeSplitKey = overrideSplit || defaultSplitName;
    const splitData = SPLIT_MODES[activeSplitKey];
    const isOverride = overrideSplit !== null;

    const { visibleCategories, activeDayName } = useMemo(() => {
        if (isOverride) {
            const allCats = splitData?.cycle ? splitData.cycle.flatMap(day => day.categories) : (splitData || []);
           
            return {
                visibleCategories: [...new Set(allCats)],
                activeDayName: userData.currentSplit.split === activeSplitKey ? `${activeSplitKey} ` : `${activeSplitKey} [Override]`
            };
        } else {
            const todayData = splitData?.cycle ? splitData.cycle[scheduledDayIndex] : { name: activeSplitKey, categories: splitData };
            return {
                visibleCategories: todayData?.categories || [],
                activeDayName: todayData?.name || activeSplitKey
            };
        }
    }, [activeSplitKey, isOverride, scheduledDayIndex, splitData]);

    useEffect(() => {
        let interval = null;
        if (isRunning) interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        else clearInterval(interval);
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const toggleTimer = () => setIsRunning(!isRunning);

    useEffect(() => {
        const highestUnlocked = getHighestUnlockedExercises(currentProgress);

        setActiveExercises(prev => {
            const next = { ...prev };
            visibleCategories.forEach(cat => {
                if (!next[cat]) next[cat] = highestUnlocked[cat]?.id || ALL_EXERCISES[cat][0];
            });
            return next;
        });

        setWorkoutSets(prev => {
            const next = { ...prev };
            visibleCategories.forEach(cat => {
                if (!next[cat]) next[cat] = [{ reps: 0, extraWeight: 0 }];
            });
            return next;
        });
    }, [visibleCategories, currentProgress]);

    const handleOverride = () => {
        const splitNames = Object.keys(SPLIT_MODES);
        const nextIndex = (splitNames.indexOf(activeSplitKey) + 1) % splitNames.length;
        const nextSplit = splitNames[nextIndex];
        setOverrideSplit(nextSplit === defaultSplitName ? null : nextSplit);
        setUserData({
            ...userData,
            currentSplit: {split: nextSplit, currentDayIndex: 0}
        })
        console.log(userData, nextSplit)
    };

    const handleSwitchExercise = (category, direction) => {
        const { prevID, nextID } = getPrevNextExerciseID(category, activeExercises[category]);
        const newId = direction === 'prev' ? prevID : nextID;
        if (newId) {
            setActiveExercises(prev => ({ ...prev, [category]: newId }));
            setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
        }
    };

    const handleUpdateSet = (cat, idx, field, val) => {
        const updated = [...workoutSets[cat]];
        updated[idx][field] = Number(val);
        setWorkoutSets(prev => ({ ...prev, [cat]: updated }));
    };

    const handleForceUnlock = (category, exerciseId) => {
        setUserData({ ...userData, exerciseProgress: { ...currentProgress, [exerciseId]: { totalReps: 0, personalBest: 0 } } });
        setActiveExercises(prev => ({ ...prev, [category]: exerciseId }));
        setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
    };

    const handleAddExerciseToSession = (category, exerciseID) => {
        const validSets = (workoutSets[category] || []).filter(s => Number(s.reps) > 0);
        const totalReps = validSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
        if (totalReps === 0) return;

        setCurrentWorkoutSession(prev => {   
            const currentDay = prev[dateNow] || { status: 'workout', totalVolume: 0, totalSets: 0, duration: 0, exercises: {} };
            const existing = currentDay.exercises[exerciseID];
            return {
                ...prev,
                [dateNow]: {
                    ...currentDay,
                    totalVolume: currentDay.totalVolume + totalReps,
                    totalSets: currentDay.totalSets + validSets.length,
                    exercises: {
                        ...currentDay.exercises,
                        [exerciseID]: {
                            totalReps: (existing?.totalReps || 0) + totalReps,
                            sets: existing ? [...existing.sets, ...validSets] : [...validSets]
                        }
                    }
                }
            };
        });
        setWorkoutSets(prev => ({ ...prev, [category]: [{ reps: 0, extraWeight: 0 }] }));
    };

    const handleRemoveFromSession = (exerciseID) => {
        setCurrentWorkoutSession(prev => {
            const currentDay = prev[dateNow];
            if (!currentDay?.exercises[exerciseID]) return prev;
            
            const exToRemove = currentDay.exercises[exerciseID];
            const updatedEx = { ...currentDay.exercises };
            delete updatedEx[exerciseID];

            return {
                ...prev,
                [dateNow]: {
                    ...currentDay,
                    totalVolume: currentDay.totalVolume - exToRemove.totalReps,
                    totalSets: currentDay.totalSets - exToRemove.sets.length,
                    exercises: updatedEx
                }
            };
        });
    };

    const handleBiometricStatusChange = (status) => {
        if (userData.workoutHistory[dateNow]) return alert('User already had a workout today.');
        setUserData({
            ...userData, bioStatus: status,
            workoutHistory: { ...userData.workoutHistory, [dateNow]: { ...userData.workoutHistory[dateNow], status } }
        });
        syncUser();
    };

    const handleFinishWorkoutDay = () => {
        const todaySession = currentWorkoutSession[dateNow];
        if (!todaySession || Object.keys(todaySession.exercises).length === 0) return;

        setIsRunning(false);
        const historyDay = userData.workoutHistory?.[dateNow] || { totalVolume: 0, totalSets: 0, duration: 0, exercises: {} };
        const mergedExercises = { ...historyDay.exercises };
        
        Object.entries(todaySession.exercises).forEach(([exId, exData]) => {
            if (mergedExercises[exId]) {
                mergedExercises[exId] = { totalReps: mergedExercises[exId].totalReps + exData.totalReps, sets: [...mergedExercises[exId].sets, ...exData.sets] };
            } else {
                mergedExercises[exId] = exData;
            }
        });

        const finalDayRecord = {
            status: 'workout',
            duration: (historyDay.duration || 0) + todaySession.duration + timeElapsed, 
            totalVolume: (historyDay.totalVolume || 0) + todaySession.totalVolume,
            totalSets: (historyDay.totalSets || 0) + todaySession.totalSets,
            notes: historyDay.notes || '',
            exercises: mergedExercises
        };

        const nextIndex = (!isOverride && splitData?.cycle) ? (scheduledDayIndex + 1) % splitData.cycle.length : scheduledDayIndex;

        const newUserData = {
            ...userData,
            stats: calculatePlayerStats(finalDayRecord),
            workoutHistory: { ...userData.workoutHistory, [dateNow]: finalDayRecord },
            currentSplit: { ...userData.currentSplit, currentDayIndex: nextIndex }
        };

        const { level, currentLeftoverXP, totalXPEarned } = calculateLevel(newUserData);
        if (level - userData.level > 0) {
            setLevelChange({ show: true, newLevels: level - userData.level, xpGain: totalXPEarned });
            setTimeout(() => setLevelChange({ show: false, newLevels: 0, xpGain: 0 }), 3000);
        }

        setUserData({ ...newUserData, level, xp: currentLeftoverXP });
        syncUser();
        setCurrentWorkoutSession({});
        setTraining(false);
        setTimeElapsed(0);
        setOverrideSplit(null);
    };

    return (
        <div className={`${styles.workoutScreenContainer} ${training ? styles.trainingActive : styles.trainingInactive}`}>
            {levelChange.show && (
                <div className={styles.levelUpNotification}>
                    <h2>Level Up +{levelChange.newLevels}!</h2>
                    <p>Total XP Gained: {Math.round(levelChange.xpGain)}</p>
                </div>
            )}

            {!training ? (
                <div className={styles.startScreen}>
                    <div className={styles.statusPanel}>
                        <div className={styles.sysHeader}>
                            <h2 className={styles.sysTitle}>Biometric.Status</h2>
                        </div>
                        <div className={styles.statusOptions}>
                            {['optimal', 'recovery', 'critical'].map(status => (
                                <button 
                                    key={status}
                                    className={`${styles.statusBtn} ${bioStatus === status ? styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`] : ''}`}
                                    onClick={() => setBioStatus(status)}
                                >
                                    {status.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {bioStatus !== 'optimal' && (
                            <div className={styles.overrideBox}>
                                <p>System override detected. Logging {bioStatus === 'recovery' ? 'rest day' : 'medical leave'}.</p>
                                <button className={styles.btnConfirmOverride} onClick={() => handleBiometricStatusChange(bioStatus)}>Acknowledge & Log</button>
                            </div>
                        )}
                    </div>

                    <div className={styles.startScreenContent} style={{ opacity: bioStatus !== 'optimal' ? 0.3 : 1, pointerEvents: bioStatus !== 'optimal' ? 'none' : 'auto', transition: 'all 0.3s' }}>
                        <div className={styles.scheduleInfo}>
                            <span className={styles.scheduleLabel}>Target Schedule:</span>
                            <span className={styles.scheduleTarget}>{activeDayName}</span>
                        </div>

                        <div className={styles.startBtnWrapper}>
                            <SystemButton text='Initialize Training' onClick={() => { setTraining(true); setIsRunning(true); }}/>
                            <SystemButton style='dashedBtn' text='Override Split' onClick={handleOverride}/>
                        </div>
                    </div>
                </div>      
            ) : (
                <div className={styles.trainingActiveScreen}>
                    <div className={styles.stickyHeader}>
                        <div className={styles.topBar}>
                            <h2 style={{margin: 0, fontSize: '1rem', color: '#94a3b8'}}>
                                Protocol: <span className={styles.scheduleTitle}>{activeDayName}</span>
                            </h2>
                            <div className={styles.timerWrapper}>
                                <span className={`${styles.timerText} ${!isRunning ? styles.timerPaused : ''}`}>{formatTime(timeElapsed)}</span>
                                <button className={styles.pauseBtn} onClick={toggleTimer} title={isRunning ? "Pause Timer" : "Resume Timer"}>
                                    {isRunning ? "❚❚" : "▶"}
                                </button>
                                <button className={styles.cancelBtn} title="Cancel Workout" onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this workout?")) {
                                        setTraining(false); setCurrentWorkoutSession({}); setTimeElapsed(0); setIsRunning(false); setOverrideSplit(null);
                                    }
                                }}>✕</button>
                            </div>
                        </div>
                    </div>

                    {currentWorkoutSession[dateNow] && Object.keys(currentWorkoutSession[dateNow].exercises).length > 0 && (
                        <div className={styles.sessionSummary}>
                            <h4 className={styles.summaryTitle}>Transmission Log:</h4>
                            <ul className={styles.summaryList}>
                                {Object.entries(currentWorkoutSession[dateNow].exercises).map(([exId, exData], i) => (
                                    <li key={i} className={styles.summaryItem}>
                                        <div className={styles.summaryInfoWrapper}>
                                            <span className={styles.summaryName}>{EXERCISE_DB[exId]?.name || exId}</span>
                                            <div className={styles.summaryDetails}>
                                                <span className={styles.summarySets}>{exData.sets.map(s => s.reps).join(' + ')}</span>
                                                <span className={styles.summaryTotal}>= {exData.totalReps} {EXERCISE_DB[exId]?.unit || 'reps'}</span>
                                            </div>
                                        </div>
                                        <button className={styles.btnRemoveLog} onClick={() => handleRemoveFromSession(exId)}>✕</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.exercisesGrid}>
                        {visibleCategories.map(category => {
                            const currentExId = activeExercises[category];
                            if (!currentExId) return null;

                            const exerciseData = EXERCISE_DB[currentExId];
                            const currentSets = workoutSets[category] || [];
                            const isUnlocked = currentProgress[currentExId] !== undefined;

                            return (
                                <div key={category} className={`${styles.exerciseCard} ${!isUnlocked ? styles.locked : ''}`}>
                                    <div className={styles.exerciseHeader}>
                                        <button className={styles.navBtn} onClick={() => handleSwitchExercise(category, 'prev')}>&lt;</button>
                                        <h3 className={isUnlocked ? styles.unlocked : styles.lockedTitle}>{exerciseData?.name || currentExId}</h3>
                                        <button className={styles.navBtn} onClick={() => handleSwitchExercise(category, 'next')}>&gt;</button>
                                    </div>

                                    <div className={styles.badgeContainer}>
                                        <span className={`${styles.sysBadge} ${isUnlocked ? styles.unlockedBadge : styles.lockedBadge}`}>
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
                                                            type="number" min="0" placeholder={exerciseData?.unit || "reps"} required
                                                            value={set.reps || ''} onChange={(e) => handleUpdateSet(category, index, 'reps', e.target.value)}
                                                            className={styles.setInput}
                                                        />
                                                        <input 
                                                            type="number" min="0" placeholder="+ kg"
                                                            value={set.extraWeight || ''} onChange={(e) => handleUpdateSet(category, index, 'extraWeight', e.target.value)}
                                                            className={styles.setInput}
                                                        />
                                                        {currentSets.length > 1 && (
                                                            <button className={styles.btnRemove} onClick={() => setWorkoutSets(prev => ({ ...prev, [category]: workoutSets[category].filter((_, i) => i !== index) }))}>✕</button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={styles.exerciseActions}>
                                                <button className={styles.btnAddSet} onClick={() => setWorkoutSets(prev => ({ ...prev, [category]: [...(prev[category] || []), { reps: 0, extraWeight: 0 }] }))}>+ Add Set</button>
                                                <button className={styles.btnComplete} onClick={() => handleAddExerciseToSession(category, currentExId)}>Log Data</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.lockedStateBox}>
                                            <span className={styles.lockIcon}>🔒</span>
                                            <h4>Module Encrypted</h4>
                                            <p>Access denied. Required skill node not activated.</p>
                                            <button className={styles.btnForceUnlock} onClick={() => handleForceUnlock(category, currentExId)}>Bypass Encryption (Unlock)</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className={styles.finishWorkoutWrapper}>
                        <SystemButton text='Terminate Protocol (Finish)' onClick={handleFinishWorkoutDay} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkoutScreen;