import { useState } from "react";
import { ALL_EXERCISES, EXERCISE_DB } from "../../data/exercise_db";
import SystemButton from "./systemBtn";
import CloseButton from "./closeBtn";
import useUserStore from "../../store/usePlayerStore";

const CATEGORY_MAP = {
    PUSH: ['pushups', 'dips'],
    PULL: ['pullups'],
    LEGS: ['squats'],
    CORE: ['core'],
};

export default function BuildWorkout({ state, onClose }) {
    const { userData, setUserData, syncUser } = useUserStore();
    const isEditingWorkout = state.is && state.is !== 'empty';

    // setupWorkout.jsx remounts this component (via `key`) each time it opens for a
    // different workout, so seeding state from `state.is` here only ever runs once per session.
    const [custom, setCustom] = useState(() =>
        isEditingWorkout
            ? { name: state.is.name, description: state.is.description, exercises: state.is.exercises }
            : { name: '', description: '', exercises: {} }
    );
    const [editingName] = useState(() => (isEditingWorkout ? state.is.name : null));
    const [selectedCategory, setSelectedCategory] = useState('PUSH');
    const [selectExerciseModal, setSelectExerciseModal] = useState(false);
    const [saveError, setSaveError] = useState('');

    const activeCategoryKeys = CATEGORY_MAP[selectedCategory];
    const activeExercises = activeCategoryKeys.flatMap(key => ALL_EXERCISES[key] || []);

    const handleAddExercise = (exerciseId, categoryKey) => {
        setCustom(prev => {
            const current = prev.exercises[categoryKey] || [];
            const alreadyIncluded = current.includes(exerciseId);
            const updated = alreadyIncluded
                ? current.filter(id => id !== exerciseId)
                : [...current, exerciseId];
            return { ...prev, exercises: { ...prev.exercises, [categoryKey]: updated } };
        });
    };

    const handleSubmitWorkout = async () => {
        setSaveError('');
        const hasExercises = Object.values(custom.exercises).some(list => list && list.length > 0);
        if (custom.name.trim() === '' || !hasExercises) {
            setSaveError('Give the workout a name and select at least one exercise.');
            return;
        }
        const existing = userData?.customWorkouts || [];
        const nameTaken = existing.some(w => w.name === custom.name && w.name !== editingName);
        if (nameTaken) {
            setSaveError('A workout with that name already exists.');
            return;
        }
        const isReplacingExisting = editingName !== null && existing.some(w => w.name === editingName);
        const updatedWorkouts = isReplacingExisting
            ? existing.map(w => (w.name === editingName ? custom : w))
            : [...existing, custom];
        setUserData({ ...userData, customWorkouts: updatedWorkouts });
        await syncUser();
        onClose();
    };

    const handleClose = () => {
        setSelectExerciseModal(false);
        setSaveError('');
        onClose();
    };

    if (!state.open) return null;

    if (selectExerciseModal) {
        return (
            <div className='absolute inset-0 z-30 flex flex-col bg-panel border border-border-subtle rounded-md overflow-hidden'>
                <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase px-4 pt-4 pb-2">
                    <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                    <span>System.select_exercise</span>
                    <span className="flex-1 h-px bg-border-subtle"></span>
                </div>
                <div className='flex justify-start gap-4 w-full px-4 py-2 border-b border-border-subtle'>
                    {Object.keys(CATEGORY_MAP).map(label => (
                        <SystemButton key={label} variant='secondary' text={label} onClick={() => setSelectedCategory(label)} />
                    ))}
                </div>
                <div className='flex-1 overflow-auto p-4'>
                    <span className='text-text-muted text-xs uppercase tracking-widest'>{selectedCategory} exercises</span>
                    {[...activeExercises]
                        .sort((a, b) => EXERCISE_DB[a].tier - EXERCISE_DB[b].tier)
                        .map(exerciseID => {
                        const exData = EXERCISE_DB[exerciseID];
                        const isChecked = (custom.exercises[exData.category] || []).includes(exData.id);
                        return (
                            <div key={exData.id} className='w-full flex items-center gap-2 py-3 border-b border-border-subtle last:border-0'>
                                <span className='text-sm text-text-bright'>{exData.name}</span>
                                <span className="flex-1 h-px bg-border-subtle"></span>
                                <span className='text-text-muted text-xs tracking-widest'>TIER {exData.tier}</span>
                                <input
                                    type='checkbox'
                                    className='h-6 w-6 accent-cyan-400 cursor-pointer'
                                    checked={isChecked}
                                    onChange={() => handleAddExercise(exData.id, exData.category)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className='p-4 border-t border-border-subtle'>
                    <SystemButton text='Confirm selection' onClick={() => setSelectExerciseModal(false)} />
                </div>
            </div>
        );
    }

    return (
        <div className='absolute inset-0 z-20 flex flex-col bg-panel border border-border-subtle rounded-md overflow-hidden'>
            <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase p-4">
                <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                <span>{editingName !== null ? 'System.edit_preset' : 'System.create_preset'}</span>
                <span className="flex-1 h-px bg-border-subtle"></span>
                <CloseButton onClose={handleClose} color='white' />
            </div>
            <div className='flex flex-col flex-1 overflow-auto gap-6 p-4'>
                <label className='flex flex-col gap-2 text-xs tracking-widest text-text-muted uppercase'>
                    workout.name
                    <input
                        type='text'
                        placeholder='[ Monday, Upper, Current ]'
                        className='w-full max-w-xs h-9 rounded-sm px-3 bg-card border border-border-main text-text-bright text-sm focus:border-accent focus:outline-none'
                        value={custom.name}
                        onChange={(e) => setCustom({ ...custom, name: e.target.value })}
                    />
                </label>
                <label className='flex flex-col gap-2 text-xs tracking-widest text-text-muted uppercase'>
                    workout.description
                    <input
                        type='text'
                        placeholder="[ Push, Pull ]"
                        className='w-full max-w-xs h-9 rounded-sm px-3 bg-card border border-border-main text-text-bright text-sm focus:border-accent focus:outline-none'
                        value={custom.description}
                        onChange={(e) => setCustom({ ...custom, description: e.target.value })}
                    />
                </label>
                <div className='flex flex-col gap-3 w-fit'>
                    <SystemButton variant='secondary' text='add exercises' onClick={() => setSelectExerciseModal(true)} />
                    <SystemButton text='complete' onClick={handleSubmitWorkout} />
                </div>
                {saveError && <p className='text-danger text-xs tracking-wide'>{saveError}</p>}
            </div>
        </div>
    );
}
