import { useMemo, useState } from 'react';
import { ALL_EXERCISES } from '../data/exercise_db';
import { getHighestUnlockedExercises, getPrevNextExerciseID } from '../utils/workoutSelector';

const emptySet = () => ({ reps: 0, extraWeight: 0 });

// Shared starting value so a category the user hasn't touched keeps a stable
// identity across renders instead of handing children a fresh array every time.
const INITIAL_SETS = Object.freeze([Object.freeze(emptySet())]);

/**
 * Which exercise each category is showing, and the sets being filled in for it.
 *
 * Both are derived rather than synced: the default is the highest unlocked
 * variation, and state only holds what the user has actually changed. That keeps
 * a newly unlocked exercise from needing an effect to appear, while a manual
 * switch still wins over the default.
 */
export default function useExerciseSelection(categories, currentProgress) {
    const [chosen, setChosen] = useState({});
    const [sets, setSets] = useState({});

    const defaults = useMemo(() => {
        const highestUnlocked = getHighestUnlockedExercises(currentProgress);
        return Object.fromEntries(categories.map(category => [
            category,
            highestUnlocked[category]?.id || ALL_EXERCISES[category]?.[0] || 'unknown_exercise',
        ]));
    }, [categories, currentProgress]);

    const activeExercises = useMemo(() => ({ ...defaults, ...chosen }), [defaults, chosen]);

    const workoutSets = useMemo(
        () => Object.fromEntries(categories.map(category => [category, sets[category] ?? INITIAL_SETS])),
        [categories, sets]
    );

    const setExercise = (category, exerciseId) => {
        setChosen(prev => ({ ...prev, [category]: exerciseId }));
        setSets(prev => ({ ...prev, [category]: [emptySet()] }));
    };

    const switchExercise = (category, direction) => {
        const { prevID, nextID } = getPrevNextExerciseID(category, activeExercises[category]);
        const newId = direction === 'prev' ? prevID : nextID;
        if (newId) setExercise(category, newId);
    };

    const updateSet = (category, index, field, value) => {
        setSets(prev => {
            const updated = [...(prev[category] ?? INITIAL_SETS)];
            const numeric = field === 'reps' || field === 'extraWeight';
            updated[index] = { ...updated[index], [field]: numeric ? Number(value) : value };
            return { ...prev, [category]: updated };
        });
    };

    const addSet = (category) => {
        setSets(prev => ({ ...prev, [category]: [...(prev[category] ?? INITIAL_SETS), emptySet()] }));
    };

    const removeSet = (category, index) => {
        setSets(prev => ({
            ...prev,
            [category]: (prev[category] ?? INITIAL_SETS).filter((_, i) => i !== index),
        }));
    };

    const resetSets = (category) => {
        setSets(prev => ({ ...prev, [category]: [emptySet()] }));
    };

    return { activeExercises, workoutSets, setExercise, switchExercise, updateSet, addSet, removeSet, resetSets };
}
