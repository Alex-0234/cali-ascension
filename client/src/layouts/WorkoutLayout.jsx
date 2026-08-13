import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useTimer from '../hooks/useTimer';
import useKeyedTimers from '../hooks/useKeyedTimer';
import useLevelUp from '../hooks/useLevelUp';
import useWorkoutSession from '../hooks/useWorkoutSession';
import useExerciseSelection from '../hooks/useExerciseSelection';

import useUserStore from '../store/usePlayerStore';
import { calculatePlayerStats } from '../utils/statCalculator';
import { applySessionToProgress } from '../utils/workoutSystem';
import { calculateWorkoutEP, calculateWorkoutRating, updateRating } from '../utils/Progression';
import { clearWorkoutDraft, readWorkoutDraft, writeWorkoutDraft } from '../utils/workoutDraft';

import LevelUpModal from '../components/ui/levelUpModal';

const today = () => new Date().toISOString().split('T')[0];

/**
 * Owns the training session so it can outlive the route that started it: /workout
 * picks a routine, /workout/session logs against it, and neither one holds the
 * state. A session in progress is mirrored to sessionStorage on every change, so a
 * reload lands back in the same workout rather than throwing the sets away.
 */
export default function WorkoutLayout() {
    const navigate = useNavigate();
    const dateNow = today();

    const [draft] = useState(readWorkoutDraft);

    const { userData, setUserData, syncUser } = useUserStore();
    const currentProgress = useUserStore((state) => state.userData?.exerciseProgress || {});

    const [routine, setRoutine] = useState(draft?.routine ?? null);

    const mainTimer = useTimer(draft?.timer);
    const exerciseTimer = useKeyedTimers();
    const workoutSession = useWorkoutSession(dateNow, draft?.session ?? {});
    const { levelChange, evaluate, acknowledge } = useLevelUp();

    const categories = useMemo(() => (routine ? Object.keys(routine) : []), [routine]);
    const exerciseSelection = useExerciseSelection(categories, currentProgress);

    const isActive = routine !== null;

    // The navigation blocker is consulted in the same tick that endWorkout navigates,
    // before the `routine` state update has been applied — so it reads this ref instead.
    // start/endWorkout set it directly; this only covers a draft restored on mount.
    const activeRef = useRef(isActive);
    useEffect(() => { activeRef.current = isActive; }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        writeWorkoutDraft({
            routine,
            session: workoutSession.session,
            timer: mainTimer.snapshot,
        });
    }, [isActive, routine, workoutSession.session, mainTimer.snapshot]);

    // A refresh or tab close mid-workout is nearly always an accident.
    useEffect(() => {
        if (!isActive) return;
        const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [isActive]);

    const startWorkout = useCallback((exercises) => {
        if (!exercises || Object.keys(exercises).length === 0) return;
        activeRef.current = true;
        setRoutine(exercises);
        mainTimer.start();
        navigate('/workout/session');
    }, [mainTimer, navigate]);

    const endWorkout = useCallback(() => {
        activeRef.current = false;
        setRoutine(null);
        workoutSession.clear();
        mainTimer.reset();
        exerciseTimer.resetAll();
        clearWorkoutDraft();
        navigate('/workout', { replace: true });
    }, [exerciseTimer, mainTimer, navigate, workoutSession]);

    const logExercise = useCallback((category, exerciseId) => {
        const added = workoutSession.addExercise(exerciseId, exerciseSelection.workoutSets[category] || []);
        if (added) {
            exerciseSelection.resetSets(category);
            exerciseTimer.resetAll();
        }
        return added;
    }, [exerciseSelection, exerciseTimer, workoutSession]);

    const finishWorkout = useCallback(() => {
        if (!workoutSession.hasEntries) return;

        const sessionExercises = workoutSession.today.exercises;
        const finalDayRecord = workoutSession.mergeIntoHistory(userData?.workoutHistory?.[dateNow], mainTimer.time);
        if (!finalDayRecord) return;

        const newProgress = applySessionToProgress(currentProgress, sessionExercises);
        const rating = updateRating(userData.rating, calculateWorkoutRating(sessionExercises));
        const ep = (userData.ep || 0) + calculateWorkoutEP(sessionExercises);

        const newUserData = {
            ...userData,
            workoutHistory: { ...userData.workoutHistory, [dateNow]: finalDayRecord },
            exerciseProgress: newProgress,
            rating,
            ep,
            bioStatus: 'optimal',
        };
        const stats = calculatePlayerStats(newUserData);

        const { level, xp, gained } = evaluate(userData, newUserData);
        const finishedDayRecord = gained > 0 ? { ...finalDayRecord, leveledUp: level } : finalDayRecord;

        setUserData({
            ...newUserData,
            workoutHistory: { ...newUserData.workoutHistory, [dateNow]: finishedDayRecord },
            stats,
            level,
            xp,
        });
        syncUser();
        endWorkout();
    }, [currentProgress, dateNow, endWorkout, evaluate, mainTimer.time, setUserData, syncUser, userData, workoutSession]);

    const context = {
        dateNow,
        isActive,
        activeRef,
        categories,
        mainTimer,
        exerciseTimer,
        workoutSession,
        exerciseSelection,
        currentProgress,
        startWorkout,
        finishWorkout,
        cancelWorkout: endWorkout,
        logExercise,
    };

    return (
        <>
            <LevelUpModal levelChange={levelChange} onAcknowledge={acknowledge} />
            <Outlet context={context} />
        </>
    );
}
