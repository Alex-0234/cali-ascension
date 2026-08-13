import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import useUserStore, { WEIGHT_TRACKER_NAME, createWeightTracker } from '../store/usePlayerStore';
import { EXERCISE_DB, EVALUATION_EXERCISES } from '../data/exercise_db';
import { initialExerciseUnlock } from '../utils/initialExerciseUnlock';
import { calculatePlayerStats } from '../utils/statCalculator';

import Field from '../components/ui/field';

const PERSONAL_STEPS = [
    { key: 'visibleName', field: 'Display name', label: 'What should the system call you?', type: 'text', placeholder: 'name' },
    { key: 'age', field: 'Age', label: 'How old are you?', type: 'number', placeholder: '25' },
    { key: 'gender', field: 'Gender', label: 'Gender', type: 'select' },
    { key: 'height', field: 'Height (cm)', label: 'Height in centimetres', type: 'number', placeholder: '180' },
    { key: 'weight', field: 'Weight (kg)', label: 'Weight in kilograms', type: 'number', placeholder: '75' },
];

const STAGES = ['pushups', 'squats', 'core', 'pullups'];
const STAGE_LABELS = { pushups: 'Push-ups', squats: 'Squats', core: 'Core', pullups: 'Pull-ups' };

// Total steps used for the progress bar: personal details, then a ladder + a rep
// count per exercise stage.
const TOTAL_STEPS = PERSONAL_STEPS.length + STAGES.length * 2;

function ExerciseClip({ exerciseId }) {
    const animation = EXERCISE_DB[exerciseId]?.animation;
    if (!animation) return null;

    return (
        <video
            key={exerciseId}
            src={animation}
            autoPlay
            loop
            muted
            playsInline
            className="h-44 w-full rounded-sm border border-border-subtle object-cover opacity-90"
        />
    );
}

export default function Onboarding() {
    const navigate = useNavigate();
    const { userData, setUserData, syncUser } = useUserStore();

    const [phase, setPhase] = useState('intro'); // intro | personal | ladder | reps | done
    const [personalIndex, setPersonalIndex] = useState(0);
    const [stageIndex, setStageIndex] = useState(0);
    const [tierIndex, setTierIndex] = useState(0);
    const [maxReps, setMaxReps] = useState('');

    const [personalInfo, setPersonalInfo] = useState(() => ({ ...userData.userInfo }));
    const [draft, setDraft] = useState({});
    const [result, setResult] = useState(null);

    // Captured on mount: finishing flips `isConfigured`, and a live check would
    // bounce the user out before the results screen ever renders.
    const [wasConfigured] = useState(userData.isConfigured);

    const stage = STAGES[stageIndex];
    const tiers = EVALUATION_EXERCISES[stage] ?? [];
    const currentTier = tiers[tierIndex];

    const stepNumber = phase === 'personal'
        ? personalIndex + 1
        : PERSONAL_STEPS.length + stageIndex * 2 + (phase === 'reps' ? 2 : 1);
    const progress = Math.round((stepNumber / TOTAL_STEPS) * 100);

    const personalField = PERSONAL_STEPS[personalIndex];
    const personalValue = personalInfo[personalField.key] ?? '';

    const canAdvancePersonal = String(personalValue).trim().length > 0;
    const repsValue = Number(maxReps);

    const summary = useMemo(() => Object.entries(draft).map(([key, entry]) => ({
        stage: STAGE_LABELS[key] ?? key,
        name: entry.variationName,
        reps: entry.maxReps,
    })), [draft]);

    if (wasConfigured) return <Navigate to="/" replace />;

    const goBack = () => {
        if (phase === 'personal') {
            if (personalIndex > 0) setPersonalIndex((index) => index - 1);
            else setPhase('intro');
            return;
        }
        if (phase === 'reps') {
            setPhase('ladder');
            setMaxReps('');
            return;
        }
        if (phase === 'ladder') {
            if (tierIndex > 0) setTierIndex((index) => index - 1);
            else if (stageIndex > 0) { setStageIndex((index) => index - 1); setTierIndex(0); }
            else { setPhase('personal'); setPersonalIndex(PERSONAL_STEPS.length - 1); }
        }
    };

    const nextPersonal = () => {
        if (personalIndex < PERSONAL_STEPS.length - 1) setPersonalIndex((index) => index + 1);
        else { setStageIndex(0); setTierIndex(0); setPhase('ladder'); }
    };

    // Walk up the ladder while the answer is yes; the first "no" (or the top of the
    // ladder) fixes the tier we ask for a rep count on.
    const answerLadder = (canDo) => {
        if (canDo && tierIndex < tiers.length - 1) setTierIndex((index) => index + 1);
        else {
            if (!canDo && tierIndex > 0) setTierIndex((index) => index - 1);
            setPhase('reps');
        }
    };

    const submitStage = async () => {
        const nextDraft = {
            ...draft,
            [stage]: {
                variationID: currentTier,
                variationName: EXERCISE_DB[currentTier].name,
                maxReps: repsValue,
            },
        };
        setDraft(nextDraft);

        if (stageIndex < STAGES.length - 1) {
            setStageIndex((index) => index + 1);
            setTierIndex(0);
            setMaxReps('');
            setPhase('ladder');
            return;
        }

        const cleanInfo = {
            ...personalInfo,
            age: Number(personalInfo.age) || 0,
            height: Number(personalInfo.height) || 0,
            weight: Number(personalInfo.weight) || 0,
        };

        const { progress: initialProgress, bonusEP } = initialExerciseUnlock(nextDraft);

        const newUserData = {
            ...userData,
            userInfo: cleanInfo,
            customTrackers: [
                createWeightTracker(cleanInfo.weight),
                ...(userData.customTrackers || []).filter((t) => t.name !== WEIGHT_TRACKER_NAME),
            ],
            exerciseProgress: initialProgress,
            ep: (userData.ep || 0) + bonusEP,
            isConfigured: true,
        };

        setResult({ unlocked: Object.keys(initialProgress).length, bonusEP });
        setPhase('done');

        setUserData({ ...newUserData, stats: calculatePlayerStats(newUserData) });
        await syncUser();
    };

    return (
        <div className="flex min-h-dvh flex-col bg-dark font-robotomono">
            <header className="border-b border-accent/20 bg-panel/40">
                <div className="mx-auto flex w-full max-w-2xl items-center gap-2.5 px-4 py-4">
                    <span className="h-2 w-2 rotate-45 bg-accent-glow shadow-[0_0_8px_#22d3ee99]" />
                    <span className="text-sm tracking-widest text-text-bright uppercase">System.Calibration</span>
                </div>
                {phase !== 'intro' && phase !== 'done' && (
                    <div className="h-0.5 w-full bg-border-subtle">
                        <div
                            className="h-full bg-accent transition-[width] duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-8">
                <div className="flex w-full max-w-md flex-col gap-6">

                    {phase === 'intro' && (
                        <div className="flex flex-col items-center gap-4 rounded-sm border border-accent/20 bg-panel/60 p-8 text-center">
                            <svg className="h-12 w-12 text-accent/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
                            </svg>
                            <h1 className="text-2xl font-bold tracking-wide text-text-bright uppercase">
                                Initial evaluation
                            </h1>
                            <p className="max-w-xs text-sm leading-relaxed text-text-muted">
                                A few questions about you, then the hardest variation you can manage in four
                                categories. Everything below that unlocks immediately, and the closer you are to
                                the next step the more bonus EP you start with.
                            </p>
                            <button
                                type="button"
                                onClick={() => setPhase('personal')}
                                className="mt-2 w-full cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-3 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
                            >
                                Begin calibration
                            </button>
                        </div>
                    )}

                    {phase === 'personal' && (
                        <form
                            onSubmit={(event) => { event.preventDefault(); if (canAdvancePersonal) nextPersonal(); }}
                            className="flex flex-col gap-5 rounded-sm border border-accent/20 bg-panel/60 p-6"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] tracking-widest text-text-muted uppercase">
                                    Personal details · {personalIndex + 1}/{PERSONAL_STEPS.length}
                                </span>
                                <h2 className="text-lg text-text-bright">{personalField.label}</h2>
                            </div>

                            {personalField.type === 'select' ? (
                                <Field label="Gender">
                                    {(props) => (
                                        <select
                                            {...props}
                                            value={personalValue}
                                            autoFocus
                                            onChange={(event) => setPersonalInfo({ ...personalInfo, [personalField.key]: event.target.value })}
                                        >
                                            <option value="" disabled>Select…</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    )}
                                </Field>
                            ) : (
                                <Field
                                    label={personalField.field}
                                    type={personalField.type}
                                    placeholder={personalField.placeholder}
                                    value={personalValue}
                                    autoFocus
                                    onChange={(event) => setPersonalInfo({ ...personalInfo, [personalField.key]: event.target.value })}
                                />
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="cursor-pointer rounded-sm border border-border-main px-4 py-2.5 text-xs tracking-wider text-text-main uppercase transition-colors hover:text-text-bright"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={!canAdvancePersonal}
                                    className="flex-1 cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    )}

                    {phase === 'ladder' && currentTier && (
                        <div className="flex flex-col gap-5 rounded-sm border border-accent/20 bg-panel/60 p-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] tracking-widest text-text-muted uppercase">
                                    {STAGE_LABELS[stage]} · tier {tierIndex + 1}/{tiers.length}
                                </span>
                                <h2 className="text-lg text-text-bright">Can you do at least one rep?</h2>
                                <p className="text-sm text-accent-light">{EXERCISE_DB[currentTier]?.name}</p>
                            </div>

                            <ExerciseClip exerciseId={currentTier} />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => answerLadder(false)}
                                    className="flex-1 cursor-pointer rounded-sm border border-danger/50 bg-danger/10 py-3 text-xs tracking-wider text-danger uppercase transition-colors hover:bg-danger/20"
                                >
                                    No · too hard
                                </button>
                                <button
                                    type="button"
                                    onClick={() => answerLadder(true)}
                                    className="flex-1 cursor-pointer rounded-sm border border-success/50 bg-success/10 py-3 text-xs tracking-wider text-success uppercase transition-colors hover:bg-success/20"
                                >
                                    Yes
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={goBack}
                                className="cursor-pointer self-start text-[10px] tracking-wider text-text-muted uppercase transition-colors hover:text-text-main"
                            >
                                ← Back
                            </button>
                        </div>
                    )}

                    {phase === 'reps' && currentTier && (
                        <form
                            onSubmit={(event) => { event.preventDefault(); if (repsValue > 0) submitStage(); }}
                            className="flex flex-col gap-5 rounded-sm border border-accent/20 bg-panel/60 p-6"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] tracking-widest text-text-muted uppercase">
                                    {STAGE_LABELS[stage]}
                                </span>
                                <h2 className="text-lg text-text-bright">Max reps to failure</h2>
                                <p className="text-sm text-accent-light">{EXERCISE_DB[currentTier]?.name}</p>
                            </div>

                            <ExerciseClip exerciseId={currentTier} />

                            <Field
                                label={EXERCISE_DB[currentTier]?.unit === 'seconds' ? 'Seconds held' : 'Reps'}
                                type="number"
                                min="1"
                                placeholder="0"
                                value={maxReps}
                                autoFocus
                                onChange={(event) => setMaxReps(event.target.value)}
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="cursor-pointer rounded-sm border border-border-main px-4 py-2.5 text-xs tracking-wider text-text-main uppercase transition-colors hover:text-text-bright"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={!(repsValue > 0)}
                                    className="flex-1 cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {stageIndex < STAGES.length - 1 ? 'Log & continue' : 'Complete calibration'}
                                </button>
                            </div>
                        </form>
                    )}

                    {phase === 'done' && result && (
                        <div className="flex flex-col gap-5 rounded-sm border border-success/30 bg-panel/60 p-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] tracking-widest text-success uppercase">Calibration complete</span>
                                <h2 className="text-xl text-text-bright">System configured</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-sm border border-border-subtle bg-card px-4 py-3">
                                    <p className="text-[10px] tracking-widest text-text-muted uppercase">Unlocked</p>
                                    <p className="font-robotomono text-xl text-text-bright tabular-nums">{result.unlocked}</p>
                                </div>
                                <div className="rounded-sm border border-border-subtle bg-card px-4 py-3">
                                    <p className="text-[10px] tracking-widest text-text-muted uppercase">Bonus EP</p>
                                    <p className="font-robotomono text-xl text-accent-light tabular-nums">+{result.bonusEP}</p>
                                </div>
                            </div>

                            <ul className="flex flex-col gap-2">
                                {summary.map((entry) => (
                                    <li key={entry.stage} className="flex items-center justify-between gap-3 border-b border-border-subtle pb-2 text-xs last:border-b-0">
                                        <span className="text-text-muted uppercase">{entry.stage}</span>
                                        <span className="truncate text-text-bright">
                                            {entry.name} <span className="text-accent-light">× {entry.reps}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => navigate('/', { replace: true })}
                                className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-3 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
                            >
                                Enter the system
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
