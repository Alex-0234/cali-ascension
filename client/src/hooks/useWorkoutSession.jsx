import { useState } from 'react';

export default function useWorkoutSession(dateNow) {
    const [session, setSession] = useState({});
    const today = session[dateNow];

    const addExercise = (category, exerciseID, sets) => {
        const validSets = sets.filter(s => Number(s.reps) > 0);
        const totalReps = validSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
        if (totalReps === 0) return false;

        setSession(prev => {
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
        return true;
    };

    const removeExercise = (exerciseID) => {
        setSession(prev => {
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

    const mergeIntoHistory = (existingHistoryDay, extraDuration = 0) => {
        const todaySession = session[dateNow];
        if (!todaySession) return null;

        const historyDay = existingHistoryDay || { totalVolume: 0, totalSets: 0, duration: 0, exercises: {} };
        const mergedExercises = { ...historyDay.exercises };

        Object.entries(todaySession.exercises || {}).forEach(([exId, exData]) => {
            mergedExercises[exId] = mergedExercises[exId]
                ? { totalReps: mergedExercises[exId].totalReps + exData.totalReps, sets: [...mergedExercises[exId].sets, ...exData.sets] }
                : exData;
        });

        return {
            status: 'workout',
            duration: (historyDay.duration || 0) + todaySession.duration + extraDuration,
            totalVolume: (historyDay.totalVolume || 0) + todaySession.totalVolume,
            totalSets: (historyDay.totalSets || 0) + todaySession.totalSets,
            notes: historyDay.notes || '',
            exercises: mergedExercises
        };
    };

    const clear = () => setSession({});

    const hasEntries = !!today && Object.keys(today.exercises || {}).length > 0;

    return { session, today, hasEntries, addExercise, removeExercise, mergeIntoHistory, clear };
}