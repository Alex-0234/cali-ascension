import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { ALL_EXERCISES, EXERCISE_DB } from '../data/exercise_db';
import useUserStore from '../store/usePlayerStore';

import Panel, { PanelHeading } from '../components/ui/panel';
import Field from '../components/ui/field';

// Covers every category in the database — the old builder silently omitted
// bridges, so those exercises could never make it into a custom routine.
const GROUPS = {
    PUSH: ['pushups', 'dips'],
    PULL: ['pullups'],
    LEGS: ['squats', 'bridges'],
    CORE: ['core'],
};

export default function RoutineBuilder() {
    const navigate = useNavigate();
    const { name: routeName } = useParams();

    const { userData, setUserData, syncUser } = useUserStore();
    const existing = useMemo(() => userData?.customWorkouts || [], [userData]);

    const editingName = routeName ? decodeURIComponent(routeName) : null;
    const source = editingName ? existing.find((w) => w.name === editingName) : null;

    const [draft, setDraft] = useState(() => ({
        name: source?.name ?? '',
        description: source?.description ?? '',
        exercises: source?.exercises ?? {},
    }));
    const [group, setGroup] = useState('PUSH');
    const [error, setError] = useState('');

    const groupExercises = useMemo(() => {
        const ids = GROUPS[group].flatMap((key) => ALL_EXERCISES[key] || []);
        return ids
            .map((id) => EXERCISE_DB[id])
            .filter(Boolean)
            .sort((a, b) => a.tier - b.tier);
    }, [group]);

    const selectedCount = Object.values(draft.exercises).reduce((sum, list) => sum + (list?.length || 0), 0);

    // Editing a routine that no longer exists (stale link, deleted elsewhere).
    if (editingName && !source) return <Navigate to="/workout" replace />;

    const toggleExercise = (exercise) => {
        setDraft((prev) => {
            const current = prev.exercises[exercise.category] || [];
            const next = current.includes(exercise.id)
                ? current.filter((id) => id !== exercise.id)
                : [...current, exercise.id];
            return { ...prev, exercises: { ...prev.exercises, [exercise.category]: next } };
        });
    };

    const handleSave = async () => {
        const trimmed = draft.name.trim();

        if (!trimmed) return setError('Give the routine a name.');
        if (selectedCount === 0) return setError('Select at least one exercise.');
        if (existing.some((w) => w.name === trimmed && w.name !== editingName)) {
            return setError('A routine with that name already exists.');
        }

        // Drop categories the user emptied out, so the session doesn't render blanks.
        const exercises = Object.fromEntries(
            Object.entries(draft.exercises).filter(([, list]) => list?.length > 0)
        );
        const saved = { ...draft, name: trimmed, exercises };

        setUserData({
            customWorkouts: editingName
                ? existing.map((w) => (w.name === editingName ? saved : w))
                : [...existing, saved],
        });
        await syncUser();
        navigate('/workout', { replace: true });
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">

            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-lg tracking-wide text-text-bright">
                        {editingName ? 'Edit routine' : 'New routine'}
                    </h1>
                    <p className="text-xs text-text-muted">
                        Pick the exercises this split trains. The session always opens the highest
                        unlocked variation in each category.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/workout')}
                    className="cursor-pointer rounded-sm border border-border-main px-3 py-2 text-[10px] tracking-wider text-text-main uppercase transition-colors hover:text-text-bright"
                >
                    Cancel
                </button>
            </header>

            <Panel label="details" className="min-w-0">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Routine name"
                        placeholder="Upper body"
                        value={draft.name}
                        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                        autoFocus
                    />
                    <Field
                        label="Description"
                        placeholder="Push · pull"
                        value={draft.description}
                        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    />
                </div>
            </Panel>

            <Panel label="exercises" className="min-w-0">
                <PanelHeading
                    action={
                        <span className="font-robotomono text-[10px] text-text-muted">{selectedCount} selected</span>
                    }
                >
                    Muscle group
                </PanelHeading>

                <div className="mb-4 flex flex-wrap gap-2">
                    {Object.keys(GROUPS).map((label) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => setGroup(label)}
                            className={`cursor-pointer rounded-sm border px-3 py-1.5 text-[10px] tracking-wider uppercase transition-colors ${
                                group === label
                                    ? 'border-accent/50 bg-accent/10 text-accent-light'
                                    : 'border-border-main text-text-muted hover:text-text-main'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <ul className="flex max-h-96 flex-col overflow-y-auto pr-1">
                    {groupExercises.map((exercise) => {
                        const checked = (draft.exercises[exercise.category] || []).includes(exercise.id);
                        return (
                            <li key={exercise.id}>
                                <label className="flex cursor-pointer items-center gap-3 border-t border-border-subtle/60 py-2.5 first:border-t-0 hover:bg-accent/5">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleExercise(exercise)}
                                        className="h-4 w-4 cursor-pointer accent-cyan-400"
                                    />
                                    <span className="min-w-0 flex-1 truncate text-sm text-text-bright">{exercise.name}</span>
                                    <span className="shrink-0 font-robotomono text-[10px] tracking-wider text-text-muted uppercase">
                                        Tier {exercise.tier}
                                    </span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </Panel>

            {error && <p className="text-xs text-danger" role="alert">{error}</p>}

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={handleSave}
                    className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 px-6 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
                >
                    {editingName ? 'Save changes' : 'Create routine'}
                </button>
            </div>
        </div>
    );
}
