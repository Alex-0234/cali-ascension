
import useUserStore from "../../store/usePlayerStore";

import BioStatusGate from '../../components/ui/bioStatusGate';
import SystemButton from "./systemBtn";
import Grid from "./grid";
import Card from "./card";

export default function SetupWorkout({timer, onChangeToStart, onChangeToBuild}) {
    const { userData } = useUserStore();


    return (
        <Grid>
            <Card name="workout_interface" bg={true}>
                    <div className="flex flex-col m-4 w-fit">
                        <h2 className="text-xs tracking-widest text-slate-400 uppercase">workout_interface</h2>

                        <p className='text-[11px] mt-4 tracking-widest text-text-bright uppercase'> You can start a workout, select default routine, and choose as you go or you can build custom routine.</p>
                    </div>
                    <div className="flex flex-col m-4">
                        {userData.bioStatus === 'optimal' ? (
                <>
                    <div className='flex gap-4'>
                        <SystemButton text='Start Workout' onClick={() => {onChangeToStart(); timer.toggle()}} />
                        <SystemButton variant='secondary' text='Build Workout' onClick={() => onChangeToBuild()} />
                    </div>
                </>
            ) : (
                <>
                    <div className='flex gap-4'>
                        <SystemButton text='Start Workout' onClick={onChangeToStart} disabled={true} />
                        <SystemButton variant='secondary' text='Build Workout' onClick={onChangeToBuild} disabled={true} />
                    </div>
                    {userData.bioStatus === 'restday' && <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: RESTDAY</p>}
                    {userData.bioStatus === 'critical' && <p className='text-xs tracking-widest text-slate-400 uppercase'>USER.BIOMETRIC_STATUS: CRITICAL - RECOVER FIRST!</p>}
                </>
            )}
                    </div>
            </Card>

            <Card name='Biometric_status' bg={true}>
                <BioStatusGate savedStatus={userData.bioStatus} />
            </Card>        
            <Card name='leaderbords' bg={true}>
                  <h2>Leaderboards</h2>
                <div className='bg-panel flex h-32 max-h-32 w-full rounded-md border-border-main border p-4'>
                    <p>sssssss

                    </p>
                </div>
            </Card>
            {/* <Leaderboards /> */}
        </Grid>
    )
}