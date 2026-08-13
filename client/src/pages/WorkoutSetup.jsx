import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ALL_EXERCISES } from '../data/exercise_db';
import useUserStore from '../store/usePlayerStore';
import { getHighestUnlockedExercises } from '../utils/workoutSelector';
import useWorkoutContext from '../hooks/useWorkoutContext';

import Panel, { PanelHeading } from '../components/ui/panel';
import ConfirmDialog from '../components/ui/confirmDialog';
import BioStatusGate from '../components/ui/bioStatusGate';
import { AlertIcon, PlusIcon } from '../components/ui/icons';

const BASE_ROUTINE = {
    name: 'Full protocol',
    description: 'Every category, highest unlocked variation',
    exercises: ALL_EXERCISES,
};

const BLOCKED_COPY = {
    restday: 'Rest day logged. Training is paused until the status is cleared.',
    critical: 'Status critical — recover before logging another session.',
};

function countExercises(exercises) {
    return Object.values(exercises || {}).reduce((total, list) => total + (list?.length || 0), 0);
}

function RoutineRow({ routine, custom, disabled, onStart, onDelete }) {
    return (
        <li className="flex flex-col gap-3 border-t border-border-subtle/60 py-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm tracking-wide text-text-bright">{routine.name}</span>
                <span className="truncate text-xs text-text-muted">
                    {routine.description || '—'} · {countExercises(routine.exercises)} exercises
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {custom && (
                    <>
                        <Link
                            to={`/workout/routines/${encodeURIComponent(routine.name)}`}
                            className="rounded-sm border border-border-main px-3 py-1.5 text-[10px] tracking-wider text-text-main uppercase transition-colors hover:border-accent/50 hover:text-accent-light"
                        >
                            Edit
                        </Link>
                        <button
                            type="button"
                            onClick={onDelete}
                            aria-label={`Delete ${routine.name}`}
                            className="cursor-pointer rounded-sm border border-border-main px-2.5 py-1.5 text-[10px] text-text-muted uppercase transition-colors hover:border-danger/50 hover:text-danger"
                        >
                            ✕
                        </button>
                    </>
                )}
                <button
                    type="button"
                    onClick={onStart}
                    disabled={disabled}
                    className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 px-4 py-1.5 text-[10px] tracking-wider text-accent-light uppercase transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Start
                </button>
            </div>
        </li>
    );
}

export default function WorkoutSetup() {
    const navigate = useNavigate();
    const { isActive, startWorkout } = useWorkoutContext();

    const { userData, setUserData } = useUserStore();
    const [pendingDelete, setPendingDelete] = useState(null);

    const customRoutines = userData?.customWorkouts || [];
    const canStart = userData.bioStatus === 'optimal';
    const personalBests = getHighestUnlockedExercises(userData?.exerciseProgress || {});

    const handleDelete = () => {
        setUserData({ customWorkouts: customRoutines.filter((w) => w.name !== pendingDelete) });
        setPendingDelete(null);
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">

            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-lg tracking-wide text-text-bright">Training</h1>
                    <p className="text-xs text-text-muted">Pick a routine to open a session.</p>
                </div>
                <Link
                    to="/workout/routines/new"
                    className="flex items-center gap-2 rounded-sm border border-border-main px-3 py-2 text-[10px] tracking-wider text-text-main uppercase transition-colors hover:border-accent/50 hover:text-accent-light"
                >
                    <PlusIcon className="h-3.5 w-3.5" /> New routine
                </Link>
            </header>

            {isActive && (
                <div className="flex flex-wrap items-center gap-3 rounded-sm border border-accent/40 bg-accent/5 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-glow shadow-[0_0_6px_#22d3ee]" />
                    <p className="flex-1 text-xs text-text-main">A session is already running.</p>
                    <button
                        type="button"
                        onClick={() => navigate('/workout/session')}
                        className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 px-4 py-1.5 text-[10px] tracking-wider text-accent-light uppercase transition-colors hover:bg-accent/20"
                    >
                        Resume
                    </button>
                </div>
            )}

            {!canStart && (
                <div className="flex items-start gap-3 rounded-sm border border-warning/40 bg-warning/5 px-4 py-3">
                    <AlertIcon className="mt-0.5 h-4 w-4 text-warning" />
                    <p className="text-xs leading-relaxed text-warning">
                        {BLOCKED_COPY[userData.bioStatus] || 'Training is unavailable right now.'}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

                <Panel label="routines" className="min-w-0 flex-1">
                    <ul className="flex flex-col">
                        <RoutineRow
                            routine={BASE_ROUTINE}
                            disabled={!canStart}
                            onStart={() => startWorkout(BASE_ROUTINE.exercises)}
                        />
                        {customRoutines.map((routine) => (
                            <RoutineRow
                                key={routine.name}
                                routine={routine}
                                custom
                                disabled={!canStart}
                                onStart={() => startWorkout(routine.exercises)}
                                onDelete={() => setPendingDelete(routine.name)}
                            />
                        ))}
                    </ul>

                    {customRoutines.length === 0 && (
                        <p className="mt-4 border-t border-border-subtle/60 pt-3 text-[11px] text-text-muted">
                            // no custom routines yet — build one to train a specific split
                        </p>
                    )}
                </Panel>

                <div className="flex w-full flex-col gap-6 lg:w-80 lg:shrink-0">
                    <Panel label="biometric_status">
                        <BioStatusGate savedStatus={userData.bioStatus} />
                    </Panel>

                    <Panel label="personal_bests">
                        {Object.keys(personalBests).length > 0 ? (
                            <ul className="flex flex-col gap-2">
                                {Object.entries(personalBests).map(([category, exercise]) => (
                                    <li key={category} className="flex items-center justify-between gap-3 text-xs">
                                        <span className="truncate text-text-muted uppercase">{category}</span>
                                        <span className="truncate text-text-bright">
                                            {exercise.name} <span className="text-accent-light">T{exercise.tier}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-text-muted">No exercises unlocked yet.</p>
                        )}
                    </Panel>

                    <Panel bodyClassName="border-dashed">
                        <PanelHeading>Unlock more</PanelHeading>
                        <p className="text-xs leading-relaxed text-text-muted">
                            Harder variations are bought with EP in the{' '}
                            <Link to="/skills" className="text-accent-light hover:underline">skill tree</Link>.
                        </p>
                    </Panel>
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Delete routine"
                body={`"${pendingDelete}" will be removed. Logged sessions are not affected.`}
                confirmLabel="Delete"
                tone="danger"
                onConfirm={handleDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </div>
    );
}
