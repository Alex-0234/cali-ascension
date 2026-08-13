import { useState } from 'react';
import { Navigate, useBlocker } from 'react-router-dom';

import { EXERCISE_DB } from '../data/exercise_db';
import useWorkoutContext from '../hooks/useWorkoutContext';

import ExerciseCard from '../components/ui/exerciseCard';
import SessionSummaryList from '../components/ui/sessionSummaryList';
import ConfirmDialog from '../components/ui/confirmDialog';
import { PanelHeading } from '../components/ui/panel';

export default function WorkoutSession() {
    const {
        isActive,
        activeRef,
        categories,
        mainTimer,
        exerciseTimer,
        workoutSession,
        exerciseSelection,
        currentProgress,
        finishWorkout,
        cancelWorkout,
        logExercise,
    } = useWorkoutContext();

    const [confirmCancel, setConfirmCancel] = useState(false);

    // Leaving mid-session would drop the sets that haven't been written to history
    // yet, so intercept the navigation and let the user decide.
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            activeRef.current && currentLocation.pathname !== nextLocation.pathname
    );

    if (!isActive) return <Navigate to="/workout" replace />;

    const session = workoutSession.today;
    const loggedCount = Object.keys(session?.exercises || {}).length;

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6">

            <div className="sticky top-14 z-30 -mx-4 border-b border-accent/20 bg-card/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent-glow shadow-[0_0_6px_#22d3eeb3]" />
                        <div className="flex min-w-0 flex-col">
                            <h1 className="truncate text-sm tracking-wide text-text-bright">Training session</h1>
                            <span className="font-robotomono text-[10px] tracking-wider text-text-muted uppercase">
                                {loggedCount} logged · {session?.totalSets ?? 0} sets · {session?.totalVolume ?? 0} volume
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 rounded-sm border border-border-main bg-panel/60 px-2.5 py-1">
                            <span className={`font-robotomono text-sm tabular-nums ${mainTimer.isRunning ? 'text-accent-light' : 'text-text-muted'}`}>
                                {mainTimer.format()}
                            </span>
                            <button
                                type="button"
                                onClick={mainTimer.toggle}
                                title={mainTimer.isRunning ? 'Pause timer' : 'Resume timer'}
                                className="flex h-6 w-6 cursor-pointer items-center justify-center text-xs text-text-main transition-colors hover:text-accent-light"
                            >
                                {mainTimer.isRunning ? '❚❚' : '▶'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setConfirmCancel(true)}
                            title="Discard session"
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border border-border-main text-xs text-text-main transition-colors hover:border-danger hover:text-danger"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            <SessionSummaryList session={session} onRemove={workoutSession.removeExercise} />

            <div>
                <PanelHeading>Exercise modules</PanelHeading>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
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
                                unlockHref={`/skills/${category}?node=${currentExId}`}
                                onSwitch={(dir) => exerciseSelection.switchExercise(category, dir)}
                                onUpdateSet={(index, field, value) => exerciseSelection.updateSet(category, index, field, value)}
                                onAddSet={() => exerciseSelection.addSet(category)}
                                onRemoveSet={(index) => exerciseSelection.removeSet(category, index)}
                                onLog={() => logExercise(category, currentExId)}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 border-t border-border-subtle/60 pt-5 pb-2">
                <button
                    type="button"
                    onClick={finishWorkout}
                    disabled={!workoutSession.hasEntries}
                    className="w-full max-w-sm cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-3 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Terminate protocol · finish
                </button>
                {!workoutSession.hasEntries && (
                    <p className="text-[10px] tracking-wider text-text-muted uppercase">
                        // log at least one exercise to finish
                    </p>
                )}
            </div>

            <ConfirmDialog
                open={confirmCancel}
                title="Discard session"
                body="Everything logged in this session will be deleted. Finished sessions are unaffected."
                confirmLabel="Discard"
                tone="danger"
                onConfirm={() => { setConfirmCancel(false); cancelWorkout(); }}
                onCancel={() => setConfirmCancel(false)}
            />

            <ConfirmDialog
                open={blocker.state === 'blocked'}
                title="Leave session?"
                body="The session keeps running and your logged sets are held until you finish or discard it."
                confirmLabel="Leave"
                cancelLabel="Stay"
                onConfirm={() => blocker.proceed?.()}
                onCancel={() => blocker.reset?.()}
            />
        </div>
    );
}
