import { useState } from "react";
import useTimer from "../../hooks/useTimer";
import useKeyedTimers from "../../hooks/useKeyedTimer";
import useLevelUp from "../../hooks/useLevelUp";
import useWorkoutSession from "../../hooks/useWorkoutSession";
import useExerciseSelection from "../../hooks/useExerciseSelection";

import { ALL_EXERCISES, EXERCISE_DB } from "../../data/exercise_db";
import useUserStore from "../../store/usePlayerStore";
import { calculatePlayerStats } from '../../utils/statSystem';
import { processWorkoutHistoryObject } from "../../utils/workoutSystem";

import SystemButton from '../../components/ui/systemBtn';
import LevelUpModal from "../../components/ui/levelUpModal";
import BioStatusGate from '../../components/ui/bioStatusGate'
import SessionSummaryList from '../../components/ui/sessionSummaryList';
import ExerciseCard from '../../components/ui/exerciseCard';

function Workout() {
    const dateNow = new Date().toISOString().split('T')[0];

    const mainTimer = useTimer();
    const exerciseTimer = useKeyedTimers();
    const { levelChange, evaluate, acknowledge } = useLevelUp();

    const { userData, setUserData, syncUser } = useUserStore();
    const currentProgress = useUserStore(state => state.userData?.exerciseProgress || {});

    const [bioStatus, setBioStatus] = useState(userData.bioStatus || 'optimal');
    const [training, setTraining] = useState(false);

    const visibleCategories = Object.keys(ALL_EXERCISES);
    const exerciseSelection = useExerciseSelection(visibleCategories, currentProgress);
    const workoutSession = useWorkoutSession(dateNow);

    const handleBiometricStatusChange = (status) => {
        if (userData.workoutHistory?.[dateNow]?.totalVolume) {
            return alert('User already had a workout today... Logging status: optimal'); // TODO: replace with notification
        }
        setBioStatus(status);
        setUserData({
            ...userData,
            bioStatus: status,
            workoutHistory: {
                ...(userData?.workoutHistory || {}),
                [dateNow]: { ...(userData?.workoutHistory?.[dateNow] || {}), status }
            }
        });
        syncUser();
    };

    const handleForceUnlock = (category, exerciseId) => {
        setUserData({ ...userData, exerciseProgress: { ...currentProgress, [exerciseId]: { totalReps: 0, personalBest: 0 } } });
        exerciseSelection.setExercise(category, exerciseId);
    };

    const handleLogExercise = (category, exerciseID) => {
        const added = workoutSession.addExercise(category, exerciseID, exerciseSelection.workoutSets[category] || []);
        if (added) {
            exerciseSelection.resetSets(category);
            exerciseTimer.resetAll();
        }
    };

    const handleFinishWorkoutDay = () => {
        if (!workoutSession.hasEntries) return;

        const finalDayRecord = workoutSession.mergeIntoHistory(userData?.workoutHistory?.[dateNow], mainTimer.time);
        if (!finalDayRecord) return;

        const newUserData = { ...userData, workoutHistory: { ...userData.workoutHistory, [dateNow]: finalDayRecord } };
        const newProgress = processWorkoutHistoryObject(newUserData.workoutHistory);
        const stats = calculatePlayerStats(newProgress);
        const { level, xp } = evaluate(userData.level, newUserData);

        setUserData({ ...newUserData, level, xp, stats, bioStatus: 'optimal', exerciseProgress: newProgress });
        syncUser();
        workoutSession.clear();
        setTraining(false);
        mainTimer.reset();
    };

    const handleCancelWorkout = () => {
        if (window.confirm("Are you sure you want to delete this workout?")) {
            setTraining(false);
            workoutSession.clear();
            mainTimer.reset();
        }
    };

    return (
        <>
            <LevelUpModal levelChange={levelChange} onAcknowledge={acknowledge} />

            <div className="flex flex-col h-full w-full bg-card text-text-bright">
                {!training ? (
                    <BioStatusGate
                        bioStatus={bioStatus}
                        savedStatus={userData.bioStatus}
                        onSetStatus={setBioStatus}
                        onAcknowledgeOverride={handleBiometricStatusChange}
                        onStart={() => { setTraining(true); mainTimer.toggle(); }}
                    />
                ) : (
                    <div className="flex flex-col gap-4 h-full overflow-auto">
                        <div className="sticky top-0 z-10 bg-card/95 border-b border-accent/20 backdrop-blur-sm">
                            <div className="flex items-center justify-between gap-4 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-accent-glow rounded-full shadow-[0_0_6px_#22d3eeb3]"></span>
                                    <h2 className="m-0 text-sm text-text-main tracking-wide">Training Session</h2>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 border border-border-main rounded-sm px-2.5 py-1 bg-panel/60">
                                        <span className={`font-mono text-sm ${!mainTimer.isRunning ? 'text-text-muted' : 'text-accent-light'}`}>{mainTimer.format()}</span>
                                        <button
                                            className="w-6 h-6 flex items-center justify-center text-text-main hover:text-accent-light transition-colors text-xs"
                                            onClick={mainTimer.toggle}
                                            title={mainTimer.isRunning ? "Pause Timer" : "Resume Timer"}
                                        >
                                            {mainTimer.isRunning ? "❚❚" : "▶"}
                                        </button>
                                    </div>
                                    <button
                                        className="w-7 h-7 flex items-center justify-center text-text-main border border-border-main rounded-sm hover:border-danger hover:text-danger transition-colors text-xs"
                                        title="Cancel Workout"
                                        onClick={handleCancelWorkout}
                                    >✕</button>
                                </div>
                            </div>
                        </div>

                        <SessionSummaryList
                            session={workoutSession.today}
                            onRemove={workoutSession.removeExercise}
                        />

                        <div className="flex items-center gap-3 px-4 text-xs tracking-widest text-text-muted uppercase">
                            <span>Exercise Modules</span>
                            <span className="flex-1 h-px bg-border-subtle"></span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-4">
                            {visibleCategories.map(category => {
                                const currentExId = exerciseSelection.activeExercises[category];
                                if (!currentExId) return null;

                                return (
                                    <ExerciseCard
                                        key={category}
                                        category={category}
                                        exerciseData={EXERCISE_DB[currentExId]}
                                        isUnlocked={currentProgress[currentExId] !== undefined}
                                        sets={exerciseSelection.workoutSets[category] || []}
                                        exerciseTimer={exerciseTimer}
                                        onSwitch={(dir) => exerciseSelection.switchExercise(category, dir)}
                                        onUpdateSet={(index, field, value) => exerciseSelection.updateSet(category, index, field, value)}
                                        onAddSet={() => exerciseSelection.addSet(category)}
                                        onRemoveSet={(index) => exerciseSelection.removeSet(category, index)}
                                        onLog={() => handleLogExercise(category, currentExId)}
                                        onForceUnlock={() => handleForceUnlock(category, currentExId)}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex justify-center px-4 pt-2 pb-6 border-t border-border-subtle/60">
                            <SystemButton text='Terminate Protocol (Finish)' onClick={handleFinishWorkoutDay} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Workout;