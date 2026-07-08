import SystemButton from '../../components/ui/systemBtn';

const STATUS_STYLES = {
    optimal: 'border-emerald-400 text-emerald-300 bg-emerald-500/10',
    restday: 'border-amber-400 text-amber-300 bg-amber-500/10',
    critical: 'border-red-400 text-red-300 bg-red-500/10',
};

export default function BioStatusGate({
    bioStatus,
    savedStatus,
    onSetStatus,
    onAcknowledgeOverride,
    onStart,
}) {
    const overridePending = savedStatus !== bioStatus;
    const gated = bioStatus !== 'optimal';

    return (
        <section className="h-screen w-full bg-slate-950 text-slate-100 p-8">

            <div className="flex items-center gap-3 text-xs tracking-widest text-slate-400 uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.7)]"></span>
                <span>System.Workout_bio</span>
                <span className="flex-1 h-px bg-slate-800"></span>
            </div>

              <div className="h-fit w-fit flex flex-row flex-1 gap-6 mx-auto p-6">
                <div className="w-full max-w-md border border-cyan-500/20 bg-slate-900/60 rounded-sm p-5">
                    <div className="mb-4">
                        <h2 className="text-xs tracking-widest text-slate-400 uppercase">Biometric.Status</h2>
                    </div>
                    <div className="flex gap-2">
                        {['optimal', 'restday', 'critical'].map(status => {
                            const isActive = bioStatus === status;
                            return (
                                <button
                                    key={status}
                                    className={`flex-1 px-3 py-2 text-xs tracking-wider uppercase rounded-sm border transition-colors ${isActive ? STATUS_STYLES[status] : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                    onClick={() => onSetStatus(status)}
                                >
                                    {status.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>

                    {overridePending && (
                        <div className="mt-4 flex flex-col gap-3 border border-amber-400/30 bg-amber-500/5 rounded-sm p-3">
                            <p className="text-xs text-amber-200">System override detected. Logging {bioStatus === 'recovery' ? 'rest day' : 'medical leave'}.</p>
                            <button className="self-start text-xs tracking-wider uppercase px-3 py-1.5 border border-amber-400/40 text-amber-300 rounded-sm hover:bg-amber-500/10 transition-colors" onClick={() => onAcknowledgeOverride(bioStatus)}>Acknowledge & Log</button>
                        </div>
                    )}
                </div>

                <div
                    className="flex flex-col items-center gap-5 transition-all duration-300"
                    style={{ opacity: gated ? 0.3 : 1, pointerEvents: gated ? 'none' : 'auto' }}
                >

                    <div className="flex flex-col items-center gap-3">
                        <SystemButton text='Initialize Training' onClick={onStart} />
                    </div>
                    
                </div>
            </div>
        </section>
    );
}