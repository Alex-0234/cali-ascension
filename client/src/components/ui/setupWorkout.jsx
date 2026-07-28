import { useState } from "react";
import useUserStore from "../../store/usePlayerStore";
import { ALL_EXERCISES } from "../../data/exercise_db";

import BioStatusGate from '../../components/ui/bioStatusGate';
import PersonalBests from "./personalBests";
import SystemButton from "./systemBtn";
import Card from "./card";
import BuildWorkout from "./buildWorkout";

const BASE_WORKOUT = { name: 'Default', description: 'All exercises', exercises: ALL_EXERCISES };

export default function SetupWorkout({ onWorkoutStart }) {
    const { userData } = useUserStore();
    const { isLoggedIn } = userData;
    const [create, setCreate] = useState({open: false, is: 'empty'});
    console.log(create.is)

    const workouts = [BASE_WORKOUT, ...(userData?.customWorkouts || [])];
    const canStart = userData.bioStatus === 'optimal';

    return (
        <div className="relative h-full w-full overflow-auto">
            {!create.open && (
                <div className="w-full xl:max-w-6xl xl:mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                    <Card name="workout_interface" bg={true} contTWCSS='w-full md:flex-1 min-w-0' TWCSS='w-full h-fit relative p-6'>
                        {!isLoggedIn && (
                            <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                        )}
                        <p className='text-xs max-w-md tracking-widest text-text-bright uppercase mb-4'>
                            Select a preset to start, or create a new custom routine.
                        </p>

                        {!canStart && (
                            <div className="mb-4">
                                {userData.bioStatus === 'restday' && (
                                    <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: RESTDAY</p>
                                )}
                                {userData.bioStatus === 'critical' && (
                                    <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: CRITICAL — RECOVER FIRST!</p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-xs tracking-widest text-text-muted uppercase">
                                <span>Presets</span>
                                <span className="flex-1 h-px bg-border-subtle"></span>
                                <SystemButton variant='secondary' text='+ Create' onClick={() => setCreate({open: true, is: create.is})} />
                            </div>
                            <div className="flex flex-col gap-2">
                                {workouts.map((workout, index) => (
                                    <div
                                        key={`${workout.name}-${index}`}
                                        className="flex items-center justify-between gap-3 bg-card border border-border-subtle rounded-sm px-3 py-3"
                                    >
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="text-sm text-text-bright uppercase tracking-wide truncate">{workout.name}</span>
                                            <span className="text-xs text-text-muted truncate">{workout.description}</span>
                                        </div>

                                        <div className='flex gap-2'>
                                            <SystemButton
                                                variant="secondary"
                                                text='Edit'
                                                disabled={!canStart}
                                                onClick={() => {setCreate({open: true, is: workout})}}
                                            />
                                            <SystemButton
                                                text='Start'
                                                disabled={!canStart}
                                                onClick={() => onWorkoutStart(workout.exercises)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col gap-6 w-full md:w-96 md:shrink-0">
                        <Card name='Biometric_status' bg={true} contTWCSS='w-full' TWCSS='w-full h-fit relative p-6'>
                            {!isLoggedIn && (
                                <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                            )}
                            <BioStatusGate savedStatus={userData.bioStatus} />
                        </Card>

                        <PersonalBests />
                    </div>

                    </div>
                </div>
            )}

            <BuildWorkout
                key={create.open ? (create.is === 'empty' ? 'new' : create.is.name) : 'closed'}
                state={create}
                onClose={() => setCreate({open: false, is: 'empty'})}
            />
        </div>
    );
}
