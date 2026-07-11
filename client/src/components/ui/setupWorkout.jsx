
import useUserStore from "../../store/usePlayerStore";

import BioStatusGate from '../../components/ui/bioStatusGate';
import SystemButton from "./systemBtn";
import Grid from "./grid";
import Card from "./card";

export default function SetupWorkout({ timer, onChangeToStart, onChangeToBuild}) {
    const { userData } = useUserStore();
    const { isLoggedIn } = userData;


    return (
        <Grid gridTWCSS="w-full h-full">
            <Card name="workout_interface" bg={true} contTWCSS='max-w-3xl' TWCSS='w-full h-fit relative'>
                {!isLoggedIn && (
                    <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                )}
                    <div className="flex flex-col m-4">
                        <h2 className="text-xs tracking-widest text-slate-400 uppercase">workout_interface</h2>

                        <p className='text-xs max-w-[95%] mt-4 tracking-widest text-text-bright uppercase'> You can start a workout, select default routine, and choose as you go or you can build custom routine.</p>
                    </div>
                    <div className="flex flex-col m-4">
                        {userData.bioStatus === 'optimal' ? (
                <>
                    <div className='flex gap-4 w-full'>
                        <SystemButton text='Start Workout' onClick={() => {onChangeToStart(); timer.toggle()}} />
                        <SystemButton variant='secondary' text='Build Workout' onClick={() => onChangeToBuild()} />
                    </div>
                </>
            ) : (
                <>
                    <div className='flex gap-4 w-full'>
                        <SystemButton text='Start Workout' onClick={onChangeToStart} disabled={true} />
                        <SystemButton variant='secondary' text='Build Workout' onClick={onChangeToBuild} disabled={true} />
                    </div>
                    {userData.bioStatus === 'restday' && <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: RESTDAY</p>}
                    {userData.bioStatus === 'critical' && <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: CRITICAL - RECOVER FIRST!</p>}
                </>
            )}
                    </div>
            </Card>

            <Card name='Biometric_status' bg={true} contTWCSS='w-full max-w-3xl' TWCSS='w-full min-w-fit h-fit relative'>
                {!isLoggedIn && (
                    <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                )}
                <BioStatusGate savedStatus={userData.bioStatus} />
            </Card>        
            <Card name='leaderbords' bg={true} contTWCSS='w-full max-w-3xl' TWCSS='w-full min-w-fit h-fit relative'>
                {!isLoggedIn && (
                    <div className='absolute top-0 left-0 h-full w-full bg-dark/50'></div>
                )}
                  <h2>Leaderboards</h2>
                <div className='bg-panel flex h-32 max-h-32 w-full rounded-md border-border-main border p-4'>
                    <p>sssssss

                    </p>
                </div>
            </Card>
        </Grid>
    )
}