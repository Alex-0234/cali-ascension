import { useState, useEffect } from "react";

import { SPLIT_MODES, EXERCISE_DB } from "../../data/exercise_db";
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
    
    const [selectedSplit, setSelectedSplit] = useState('Push & Pull');
    const [activeExercises, setActiveExercises] = useState({});
    const [workoutSets, setWorkoutSets] = useState({});

    useEffect(() => {
        const highestUnlocked = getHighestUnlockedExercises(currentProgress);
        const initialActive = {};
        const initialSets = {};

        Object.keys(highestUnlocked).forEach(category => {
            initialActive[category] = highestUnlocked[category].id;
            initialSets[category] = [{ reps: 0, extraWeight: 0 }];
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

    const finishExercise = (category, exerciseID) => {
        const sets = workoutSets[category] || [];
        const totalReps = sets.reduce((sum, set) => sum + (set.reps || 0), 0);
        
        if (totalReps === 0) return;

        const newProgress = saveWorkoutReps(currentProgress, exerciseID, totalReps);
        const { newLevel, leftoverXP } = calculateLevelUp(userData.level, userData.xp, exerciseID, totalReps);
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
        <div className="">
            <div className="">
                {Object.keys(SPLIT_MODES).map(split => (
                    <button 
                        key={split}
                        className=''
                        onClick={() => setSelectedSplit(split)}
                    >
                        {split}
                    </button>
                ))}
            </div>

            <div className="exercise-container">
                {visibleCategories.map(category => {
                    const currentExId = activeExercises[category];
                    if (!currentExId) return null;

                    const exerciseData = EXERCISE_DB[currentExId];
                    const currentSets = workoutSets[category] || [];

                    return (
                        <div key={category} className="exercise-wrapper">
                            <div className="exercise-navigation">
                                <button 
                                    onClick={() => handleSwitchExercise(category, 'prev')}
                                    className="prev-exercise"
                                >&lt;</button>
                                <h3 className="Exercise-name">{exerciseData?.name || currentExId}</h3>
                                <button 
                                    onClick={() => handleSwitchExercise(category, 'next')}
                                    className="next-exercise"
                                >&gt;</button>
                            </div>

                            <div className="exercise-input-row">
                                {currentSets.map((set, index) => (
                                    <div key={index} className="input-wrapper">
                                        <span className="">Set {index + 1}</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            placeholder="Reps"
                                            value={set.reps || ''}
                                            onChange={(e) => handleUpdateSet(category, index, 'reps', e.target.value)}
                                            className="reps-input"
                                        />
                                        <input 
                                            type="number" 
                                            min="0"
                                            placeholder="+ kg"
                                            value={set.extraWeight || ''}
                                            onChange={(e) => handleUpdateSet(category, index, 'extraWeight', e.target.value)}
                                            className="extra-weight-input"
                                        />
                                        {currentSets.length > 1 && (
                                            <button 
                                                onClick={() => handleRemoveSet(category, index)}
                                                className="close"
                                            >X</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="">
                                <button 
                                    onClick={() => handleAddSet(category)}
                                    className=""
                                >+ Add Set</button>
                                <button 
                                    onClick={() => finishExercise(category, currentExId)}
                                    className=""
                                >Complete Exercise</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Navbar />
        </div>
    );
}

export default WorkoutScreen