
import useUserStore from "../../store/usePlayerStore";

import BioStatusGate from '../../components/ui/bioStatusGate';
import SystemButton from "./systemBtn";

export default function SetupWorkout({timer, onChangeToStart, onChangeToBuild}) {
    const { userData } = useUserStore();


    return (
        <section className="h-screen w-full bg-card text-text-bright p-4 sm:p-8">

            <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase">
                <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                <span>System.Workout_setup</span>
                <span className="flex-1 h-px bg-border-subtle"></span>
            </div>

            <div className='flex flex-col justify-center items-between '>
                <section id='workout'>
                      {userData.bioStatus === 'optimal' ? (
                        <>
                            <SystemButton text='Start Workout' onClick={() => {onChangeToStart; timer.toggle()}} />
                            <SystemButton variant='secondary' text='Build Workout' onClick={onChangeToBuild} />
                        </>
                    ) : (
                        <>
                            <SystemButton text='Start Workout' onClick={onChangeToStart} disabled={true} />
                            <SystemButton variant='secondary' text='Build Workout' onClick={onChangeToBuild} disabled={true} />
                            <p className='text-sm'>Switch biometric status to continue...</p>
                        </>
                    )}
                </section>
                <BioStatusGate savedStatus={userData.bioStatus} />
                
              
    
            </div>
        </section>
    )
}