import { useState } from "react";
import useUserStore from "../../store/usePlayerStore";
import { ALL_EXERCISES } from "../../data/exercise_db";

import BioStatusGate from '../../components/ui/bioStatusGate';
import PersonalBests from "./personalBests";
import SystemButton from "./systemBtn";
import Grid from "./grid";
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
                
                <Grid gridTWCSS="w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start">
                      <Card name='Biometric_status' bg={true} contTWCSS='w-full max-w-3xl' TWCSS='w-full min-w-fit h-fit relative'>
                        {!isLoggedIn && (
                            <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                        )}
                        <BioStatusGate savedStatus={userData.bioStatus} />
                    </Card>

                    <Card name="workout_interface" bg={true} contTWCSS='max-w-3xl' TWCSS='w-full h-fit relative'>
                        {!isLoggedIn && (
                            <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                        )}
                        <div className="flex flex-col m-4">
                            <p className='text-xs max-w-[95%] tracking-widest text-text-bright uppercase'>
                                Select a preset to start, or create a new custom routine.
                            </p>
                        </div>

                        {!canStart && (
                            <div className="mx-4 mb-4">
                                {userData.bioStatus === 'restday' && (
                                    <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: RESTDAY</p>
                                )}
                                {userData.bioStatus === 'critical' && (
                                    <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: CRITICAL — RECOVER FIRST!</p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 m-4">
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

                    <Card name='leaderbords' bg={true} contTWCSS='w-full max-w-3xl' TWCSS='w-full min-w-fit h-fit relative'>
                        {!isLoggedIn && (
                            <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                        )}
                        <h2>Leaderboards</h2>
                        <div className='bg-panel flex h-32 max-h-32 w-full rounded-md border-border-main border p-4'>
                            <p>sssssss</p>
                        </div>
                    </Card>

                    <PersonalBests />
                </Grid>
            )}
          

            <BuildWorkout
                key={create.open ? (create.is === 'empty' ? 'new' : create.is.name) : 'closed'}
                state={create}
                onClose={() => setCreate({open: false, is: 'empty'})}
            />
        </div>
    );
}
