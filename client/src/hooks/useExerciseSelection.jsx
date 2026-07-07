import { useState, useEffect } from 'react';
import { ALL_EXERCISES } from '../data/exercise_db';
import { getHighestUnlockedExercises, getPrevNextExerciseID } from '../utils/workoutSelector';

const emptySet = () => ({ reps: 0, extraWeight: 0 });

export default function useExerciseSelection(categories, currentProgress) {
    const [activeExercises, setActiveExercises] = useState({});
    const [workoutSets, setWorkoutSets] = useState({});

    useEffect(() => {
        const highestUnlocked = getHighestUnlockedExercises(currentProgress);

        setActiveExercises(prev => {
            let changed = false;
            const next = { ...prev };
            categories.forEach(cat => {
                if (!next[cat]) {
                    next[cat] = highestUnlocked[cat]?.id || ALL_EXERCISES[cat]?.[0] || 'unknown_exercise';
                    changed = true;
                }
            });
            return changed ? next : prev;
        });

        setWorkoutSets(prev => {
            let changed = false;
            const next = { ...prev };
            categories.forEach(cat => {
                if (!next[cat]) {
                    next[cat] = [emptySet()];
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [categories, currentProgress]);

    const setExercise = (category, exerciseId) => {
        setActiveExercises(prev => ({ ...prev, [category]: exerciseId }));
        setWorkoutSets(prev => ({ ...prev, [category]: [emptySet()] }));
    };

    const switchExercise = (category, direction) => {
        const { prevID, nextID } = getPrevNextExerciseID(category, activeExercises[category]);
        const newId = direction === 'prev' ? prevID : nextID;
        if (newId) setExercise(category, newId);
    };

    const updateSet = (category, index, field, value) => {
        setWorkoutSets(prev => {
            const updated = [...prev[category]];
            updated[index] = { ...updated[index], [field]: Number(value) };
            return { ...prev, [category]: updated };
        });
    };

    const addSet = (category) => {
        setWorkoutSets(prev => ({ ...prev, [category]: [...(prev[category] || []), emptySet()] }));
    };

    const removeSet = (category, index) => {
        setWorkoutSets(prev => ({ ...prev, [category]: prev[category].filter((_, i) => i !== index) }));
    };

    const resetSets = (category) => {
        setWorkoutSets(prev => ({ ...prev, [category]: [emptySet()] }));
    };

    return { activeExercises, workoutSets, setExercise, switchExercise, updateSet, addSet, removeSet, resetSets };
}