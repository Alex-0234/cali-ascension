
import useUserStore from "../../store/usePlayerStore";

import BioStatusGate from '../../components/ui/bioStatusGate';
import SystemButton from "./systemBtn";

export default function SetupWorkout({timer, onChangeToStart, onChangeToBuild}) {
    const { userData } = useUserStore();


    return (
                <section className="flex flex-col gap-4 h-screen w-full bg-card text-text-bright p-4 sm:p-8 ">

                    <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase">
                        <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                        <span>System.Workout_setup</span>
                        <span className="flex-1 h-px bg-border-subtle"></span>
                    </div>

                    <section className="w-full max-w-md border border-cyan-500/20 bg-slate-900/60 rounded-sm p-5">
                        <div className="mb-4">
                            <h2 className="text-xs tracking-widest text-slate-400 uppercase">workout_interface</h2>

                            <p className='text-[11px] mt-4 tracking-widest text-text-bright uppercase'> You can start a workout, select default routine, and choose as you go or you can build custom routine.</p>
                        </div>
                        <div className="flex flex-col gap-4">
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

                    </section>
                <BioStatusGate savedStatus={userData.bioStatus} />
                
              
    
        </section>
    )
}