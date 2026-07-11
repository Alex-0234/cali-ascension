import { useState } from "react";
import { ALL_EXERCISES, EXERCISE_DB } from "../../data/exercise_db";
import Column from "./column";
import Grid from "./grid";
import Card from "./card";
import SystemButton from "./systemBtn"
import CloseButton from "./closeBtn";
import useUserStore from "../../store/usePlayerStore";


const CATEGORY_MAP = {
    PUSH: ['pushups', 'dips'],
    PULL: ['pullups'],
    LEGS: ['squats'],
    CORE: ['core'],
};
const BASE_WORKOUT = {name: 'Default', description: 'ALL EXERCISES', exercises: ALL_EXERCISES};

export default function BuildWorkout({onWorkoutStart}) {
    const { userData, setUserData, syncUser } = useUserStore();
    const [custom, setCustom] = useState({name: '', description: '', exercises: {}});

    const [selectedCategory, setSelectedCategory] = useState('PUSH');
    const activeCategoryKeys = CATEGORY_MAP[selectedCategory]; 
    const activeExercises = activeCategoryKeys.flatMap(key => ALL_EXERCISES[key] || []);

    const [createModal, setCreateModal] = useState(false);
    const [selectExerciseModal, setSelectExerciseModal] = useState(false);
    const [routine, setRoutine] = useState({open: false, is: ''});
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
        <>
            <Card name='build_workout' contTWCSS="h-30" TWCSS=''>
                <div className="sticky top-0 h-20 flex-col">
                    <div className='p-4 h-fit w-full'>
                        <SystemButton text='create new' onClick={() => setCreateModal(!createModal)}/>
                    </div>
                </div>
            </Card>
            <Card contTWCSS="h-full overflow-auto" TWCSS='flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-4 h-fit gap-2 p-2'>
                        {selectExerciseModal && (
                            <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-start z-30 bg-panel border-b border-b-border-main rounded-t-md'>
                                <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase px-4 mt-2">
                                    <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                                    <span>System.select_exercise</span>
                                    <span className="flex-1 h-px bg-border-subtle"></span>
                                </div>
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
                                <div className='w-full h-[75%] max-h-1/4 md:max-h-2/4 lg:max-h-3/4 overflow-auto p-4 pb-12'>
                                    <span className='text-text-muted text-xs uppercase tracking-widest'>{selectedCategory} exercises</span>
                                    {activeExercises.map(exerciseID => {
                                        const exData = EXERCISE_DB[exerciseID];
                                        const exCategoryKey = exData.category;
                                        const isChecked = (custom.exercises[exCategoryKey] || []).includes(exData.id);
                                        return (
                                            <div key={exData.id} className='w-full h-fit flex items-center mt-4 mb-4'>
                                                <span>{exData.name}</span>
                                                <span className="flex-1 h-px bg-border-subtle ml-2 mr-2"></span>
                                                <span className='text-text-muted text-xs mr-2'>TIER {exData.tier}</span>
                                                <input
                                                    type='checkbox'
                                                    className='h-4 w-4'
                                                    checked={isChecked}
                                                    onChange={() => handleAddExercise(exData.id, exCategoryKey)}
                                                />
                                            </div>
                                        )
                                    })}
                                </div> 
                                <div className='h-auto w-full m-8'>
                                    <SystemButton text='Confirm selection' onClick={() => setSelectExerciseModal(false)}/> 
                                </div> 
                                
                            </div>
                        )}
                        {createModal && (
                            <div className='absolute top-0 left-0 h-auto w-4 w- bg-panel z-20 border border-border-subtle rounded-md overflow-hidden m-2'>
                                <div className=" h-full w-full flex-row justify-between p-4 relative">
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
                        {routine.open && (
                            <div className='absolute top-0 left-0 h-full w-full bg-panel z-10 border border-border-subtle rounded-md overflow-hidden m-1'>
                                <div className="h-full w-full flex-row justify-between p-4 relative">
                                    <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase">
                                        <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                                        <span>System.create</span>
                                        <span className="flex-1 h-px bg-border-subtle"></span>
                                        <CloseButton onClose={() => setRoutine({open: false, is: ''})} color='white' />
                                    </div>
                                    <div className='h-full w-full p-4 pl-8   overflow-auto'>
                                        <div className='flex justify-evenly m-2'>
                                            <SystemButton text='start' onClick={() => { setRoutine({open: false, is: ''}); onWorkoutStart(routine.is.exercises)}} />  
                                            <SystemButton text='edit' disabled={true}/>
                                            <SystemButton text='delete' disabled={true}/>
                                        </div>
                                        
                                        <div className='flex flex-col gap-2 mt-2'>
                                            <h2 className='uppercase text-2xl text-text-bright'>{routine.is.name}</h2>
                                            <p className='lowercase text-md mt-4 text-text-main'>{routine.is.description}</p>
                                            
                                            {Object.entries(CATEGORY_MAP).map(([label, categoryKey]) => {
                                                const ids = routine.is.exercises[categoryKey] || [];
                                                if (ids.length === 0) {
                                                    return // Could remove when the function is ready since it shouldnt happen..
                                                }
                                                return (
                                                    <div key={categoryKey} className='w-full h-full'>
                                                        
                                                        <div className='flex flex-col ml-2'>
                                                            <span className='text-text-muted text-s uppercase tracking-widest'>{label}:</span>
                                                            {ids.map(id => (
                                                                <>
                                                                    <span key={`${label}-${id}`}>{EXERCISE_DB[id]?.name || id}</span>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {workouts.map((workout, index) => (
                            <div key={`${workout.name}-${index}`} className='h-fit w-full max-w-md flex flex-col justify-between bg-panel rounded-md p-4'>
                                <div className='h-32 w-full flex flex-col justify-start'>
                                    
                                    <div className="flex items-center gap-2 text-xs tracking-widest text-text-main uppercase">
                                        <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                                        <span><h2 className='uppercase text-lg text-text-bright'>{workout.name}</h2></span>
                                        <span className="flex-1 h-px bg-border-subtle"></span>
                                        <SystemButton text='Open' onClick={() => {setRoutine({open: true, is: workout})}}/>
                                    </div>
                                        
                                    <p className='lowercase text-md mt-4 text-text-main'>{workout.description}</p>
                                </div>
                            </div>
                        ))}
                </Card>
            </>
    )
};