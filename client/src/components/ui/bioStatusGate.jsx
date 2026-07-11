import { useState } from 'react';
import Card from './card';
import SystemButton from '../../components/ui/systemBtn';
import useUserStore from '../../store/usePlayerStore';

const STATUS_STYLES = {
    optimal: 'border-emerald-400 text-emerald-300 bg-emerald-500/10',
    restday: 'border-amber-400 text-amber-300 bg-amber-500/10',
    critical: 'border-red-400 text-red-300 bg-red-500/10',
};

export default function BioStatusGate({savedStatus}) {
    const { userData, setUserData, syncUser } = useUserStore();
    const [bioStatus, setBioStatus] = useState(userData.bioStatus || 'optimal');

    const dateNow = new Date().toISOString().split('T')[0];
    const overridePending = savedStatus !== bioStatus;

    const handleBiometricStatusChange = (status) => {
        if (userData.workoutHistory?.[dateNow]?.totalVolume) {
            return alert('User already had a workout today... Logging status: optimal'); 
        }
        setBioStatus(status);
        setUserData({
            ...userData,
            bioStatus: status,
            workoutHistory: {
                ...(userData?.workoutHistory || {}),
                [dateNow]: { ...(userData?.workoutHistory?.[dateNow] || {}), status }
            }
        });
        syncUser();
    };

    return (
        <>
            <div className='flex flex-col m-4 w-auto'>
                <div className="mb-4">
                    <h2 className="text-xs tracking-widest text-slate-400 uppercase">Biometric.Status</h2>
                </div>
                <div className="flex gap-2 w-full">
                    {['optimal', 'restday', 'critical'].map(status => {
                        const isActive = bioStatus === status;
                        return (
                            <button
                                key={status}
                                className={`flex-1 px-3 py-2 text-xs tracking-wider uppercase rounded-sm border transition-colors ${isActive ? STATUS_STYLES[status] : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                onClick={() => setBioStatus(status)}
                            >
                                {status.toUpperCase()}
                            </button>
                        );
                    })}
                </div>

                {overridePending ? (
                    <div className="mt-4 flex flex-col gap-3 border border-amber-400/30 bg-amber-500/5 rounded-sm p-3">
                        <p className="text-xs text-amber-200">System override detected. Logging {bioStatus === 'restday' ? 'recovery' : 'medical leave'}.</p>
                        <button className="self-start text-xs tracking-wider uppercase px-3 py-1.5 border border-amber-400/40 text-amber-300 rounded-sm hover:bg-amber-500/10 transition-colors" onClick={() => handleBiometricStatusChange(bioStatus)}>Acknowledge & Log</button>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col gap-3 border border-emerald-400 bg-emerald-500/10 rounded-sm p-3">
                        <p className="text-xs text-emerald-300">Make sure to rest once in a while..</p>
                    </div>
                )}
            </div>
        </>
    );
}