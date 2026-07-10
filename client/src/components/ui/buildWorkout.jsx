import { useState } from "react";
import { ALL_EXERCISES, EXERCISE_DB } from "../../data/exercise_db";
import SystemButton from "./systemBtn"
import CloseButton from "./closeBtn";
import useUserStore from "../../store/usePlayerStore";


const CATEGORY_MAP = {
    PUSH: 'pushups', // TODO - include dips everywhere
    PULL: 'pullups',
    LEGS: 'squats',
    CORE: 'core',
};
const BASE_WORKOUT = {name: 'Default', description: 'ALL EXERCISES', exercises: 'all'};

export default function BuildWorkout() {
    const { userData, setUserData, syncUser } = useUserStore();
    const [custom, setCustom] = useState({name: '', description: '', exercises: {}});

    const [selectedCategory, setSelectedCategory] = useState('PUSH');
    const activeCategoryKey = CATEGORY_MAP[selectedCategory];

    const [createModal, setCreateModal] = useState(false);
    const [selectExerciseModal, setSelectExerciseModal] = useState(false);
    const [saveError, setSaveError] = useState('');

    const workouts = [BASE_WORKOUT, ...(userData?.customWorkouts || [])];

    const handleAddExercise = (exerciseId, categoryKey) => {
        setCustom(prev => {
            const current = prev.exercises[categoryKey] || [];
            const alreadyIncluded = current.includes(exerciseId);
            const updated = alreadyIncluded
                ? current.filter(id => id !== exerciseId)
                : [...current, exerciseId];

            return {
                ...prev,
                exercises: {
                    ...prev.exercises,
                    [categoryKey]: updated,
                },
            };
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
        const isDuplicate = existing.some(w => w.name === custom.name);
        if (isDuplicate) {
            setSaveError('A workout with that name already exists.');
            return;
        }

        const newUserData = {
            ...userData,
            customWorkouts: [...existing, custom],
        };
        setUserData(newUserData);

        await syncUser();

        setCreateModal(false);
        setCustom({name: '', description: '', exercises: {}});
    }
    
    /* const handleRemoveWorkout = () => {

    } */

    return (
        <section className='flex flex-col max-h-screen h-auto w-full p-4 sm:p-8'>

            <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase">
                <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                <span>System.build_workout</span>
                <span className="flex-1 h-px bg-border-subtle"></span>
            </div>
            <div className="min-h-[80%] h-auto w-full flex-col">
                <div className='p-4 h-fit w-full'>
                    <SystemButton text='create new' onClick={() => setCreateModal(!createModal)}/>
                </div>
                <div className="h-full w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 relative">
                    {selectExerciseModal && (
                        <div className='absolute top-0 w-full h-full flex flex-col justify-evenly z-30 bg-panel border-b-1 border-b-border-main rounded-t-md overflow-hidden'>
                            <div className='flex justify-evenly w-full h-auto mt-2 '>
                                {Object.keys(CATEGORY_MAP).map((label) => (
                                    <SystemButton
                                        key={label}
                                        variant='secondary'
                                        text={label}
                                        onClick={() => setSelectedCategory(label)}
                                    />
                                ))}
                            </div>
                            <div className='w-full h-[75%] overflow-auto p-4 pb-12'>

                                {(ALL_EXERCISES[activeCategoryKey] || []).map(exerciseID => {
                                    const exData = EXERCISE_DB[exerciseID];
                                    const isChecked = (custom.exercises[activeCategoryKey] || []).includes(exData.id);
                                    return (
                                        <div key={exData.id} className='w-full h-fit flex items-center mt-4 mb-4'>
                                            <span>{exData.name}</span>
                                            <span className="flex-1 h-px bg-border-subtle ml-2 mr-2"></span>
                                            <span className='text-text-muted text-xs mr-2'>TIER {exData.tier}</span>
                                            <span>
                                                <input
                                                    type='checkbox'
                                                    className='h-4 w-4'
                                                    checked={isChecked}
                                                    onChange={() => handleAddExercise(exData.id, activeCategoryKey)}
                                                />
                                            </span>
                                            
                                        </div>
                                    )
                                })}
                            </div> 
                            <div className='h-auto w-full ml-4'>
                                <SystemButton text='Confirm selection' onClick={() => setSelectExerciseModal(false)}/> 
                            </div> 
                            
                        </div>
                    )}
                    {createModal && (
                        <div className='absolute h-full w-full bg-panel border border-border-subtle rounded-md'>
                            <div className="h-full w-full flex-row justify-between p-4 relative">
                                <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                                    <span>System.create</span>
                                    <span className="flex-1 h-px bg-border-subtle"></span>
                                    <CloseButton onClose={() => setCreateModal(false)} color='white' />
                                </div>
                                <div className='h-[90%] w-full p-4 pl-8 overflow-hidden'>
                                    <label className='uppercase block mt-4'>workout.name
                                        <br/>
                                        <input type='text' className='w-[60%] mt-1 h-8 rounded-md pl-4 bg-border-subtle' value={custom.name} onChange={(e) => setCustom({...custom, name: e.target.value})}/>
                                    </label>
                                    <label className='uppercase block mt-4 mb-4'>workout.decription
                                        <br/>
                                        <input type='text' className='w-[60%] mt-1 h-8 rounded-md pl-4 bg-border-subtle' value={custom.description} onChange={(e) => setCustom({...custom, description: e.target.value})}/>
                                    </label>
                                    <div className='flex flex-col gap-8 w-[60%] justify-between mt-8'>
                                        <SystemButton variant='secondary' text='add exercises' onClick={() => setSelectExerciseModal(!selectExerciseModal)}/>
                                    
                                        <SystemButton text='create' onClick={() => handleSubmitWorkout()}/>
                                    </div>
                                    {saveError && (
                                        <p className='text-red-400 text-xs mt-2'>{saveError}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {workouts.map((workout, index) => (
                        <div key={`${workout.name}-${index}`} className='h-fit w-full max-w-md flex flex-col justify-between bg-panel rounded-md p-4'>
                            <div className='h-fit min-h-16 w-full flex flex-col justify-evenly'>
                                <div className='flex justify-evenly m-2'>
                                    <SystemButton text='start' disabled={true}/>  {/* Need some smaller buttons */}
                                    <SystemButton text='edit' disabled={true}/>
                                    <SystemButton text='delete' disabled={true}/>
                                </div>
                                <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase mb-1">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                                    <span><h2 className='uppercase text-lg text-text-bright'>{workout.name}</h2></span>
                                    <span className="flex-1 h-px bg-border-subtle"></span>
                                </div>
                                    

                                
                                <p className='lowercase text-md text-text-main'>{workout.description}</p>
                            </div>

                            {workout.exercises === 'all' ? (
                                <p className='text-text-muted text-s mt-2'>All exercises included</p>
                            ) : (
                                <div className='flex flex-col gap-2 mt-2'>
                                    {Object.entries(CATEGORY_MAP).map(([label, categoryKey]) => {
                                        const ids = workout.exercises[categoryKey] || [];
                                        if (ids.length === 0) return null;

                                        return (
                                            <div key={categoryKey} className='w-full'>
                                                <span className='text-text-muted text-s uppercase tracking-widest'>{label}:</span>
                                                <div className='flex flex-col ml-2'>
                                                    {ids.map(id => (
                                                        <span key={id}>{EXERCISE_DB[id]?.name || id}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    )
};