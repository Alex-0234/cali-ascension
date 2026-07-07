const inputClass = "bg-slate-950 border border-slate-700 text-slate-100 text-sm px-2 py-1.5 rounded-sm w-20 focus:border-cyan-400 focus:outline-none";
const iconBtnClass = "w-7 h-7 flex items-center justify-center text-slate-400 border border-slate-700 rounded-sm hover:border-cyan-400 hover:text-cyan-300 transition-colors text-xs";

export default function ExerciseCard({
    category,
    exerciseData,
    isUnlocked,
    sets,
    exerciseTimer,
    onSwitch,
    onUpdateSet,
    onAddSet,
    onRemoveSet,
    onLog,
    onForceUnlock,
}) {
    return (
        <div className={`flex flex-col gap-3 border rounded-sm p-4 ${isUnlocked ? 'border-slate-700 bg-slate-900/60' : 'border-slate-800 bg-slate-900/30 opacity-80'}`}>
            <div className="flex items-center justify-between gap-2">
                <button className={iconBtnClass} onClick={() => onSwitch('prev')}>&lt;</button>
                <h3 className={`text-sm text-center ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>{exerciseData?.name || category}</h3>
                <button className={iconBtnClass} onClick={() => onSwitch('next')}>&gt;</button>
            </div>

            <div className="flex justify-center">
                <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm border ${isUnlocked ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10' : 'border-amber-400/40 text-amber-300 bg-amber-500/10'}`}>
                    {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                </span>
            </div>

            {isUnlocked ? (
                <>
                    <div className="flex flex-col gap-2">
                        {sets.map((set, index) => {
                            const timerKey = `${category}-${index}`;
                            const isSeconds = exerciseData?.unit === 'seconds';

                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 w-10">Set {index + 1}</span>

                                    {isSeconds ? (
                                        <div className="flex items-center gap-2">
                                            <span className={`font-mono text-sm ${!exerciseTimer.running[timerKey] ? 'text-slate-500' : 'text-cyan-300'}`}>
                                                {exerciseTimer.format(exerciseTimer.times[timerKey] || 0)}
                                            </span>

                                            <button
                                                className={iconBtnClass}
                                                onClick={() => {
                                                    exerciseTimer.toggle(timerKey);
                                                    if (exerciseTimer.running[timerKey]) {
                                                        onUpdateSet(index, 'reps', exerciseTimer.times[timerKey]);
                                                    }
                                                }}
                                                title={exerciseTimer.running[timerKey] ? "Pause Timer" : "Resume Timer"}
                                            >
                                                {exerciseTimer.running[timerKey] ? "❚❚" : "▶"}
                                            </button>

                                            <button
                                                className={`${iconBtnClass} hover:border-red-400 hover:text-red-300`}
                                                title="Reset Timer"
                                                onClick={() => exerciseTimer.reset(timerKey)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type="number" min="0" placeholder={exerciseData?.unit || "reps"} required
                                            value={set.reps || ''} onChange={(e) => onUpdateSet(index, 'reps', e.target.value)}
                                            className={inputClass}
                                        />
                                    )}

                                    <input
                                        type="number" min="0" placeholder="+ kg"
                                        value={set.extraWeight || ''} onChange={(e) => onUpdateSet(index, 'extraWeight', e.target.value)}
                                        className={inputClass}
                                    />
                                    {sets.length > 1 && (
                                        <button className="text-slate-500 hover:text-red-400 text-xs" onClick={() => onRemoveSet(index)}>✕</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                        <button className="text-xs text-slate-400 hover:text-cyan-300 transition-colors" onClick={onAddSet}>+ Add Set</button>
                        <button
                            className="text-xs tracking-wider uppercase px-3 py-1.5 border border-cyan-400/40 text-cyan-300 rounded-sm hover:bg-cyan-500/10 transition-colors"
                            onClick={onLog}
                        >Log Data</button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-center py-3">
                    <span className="text-xl text-amber-400">🔒</span>
                    <h4 className="text-sm text-slate-200">Module Encrypted</h4>
                    <p className="text-xs text-slate-500">Access denied. Required skill node not activated.</p>
                    <button className="mt-1 text-xs tracking-wider uppercase px-3 py-1.5 border border-amber-400/40 text-amber-300 rounded-sm hover:bg-amber-500/10 transition-colors" onClick={onForceUnlock}>Bypass Encryption (Unlock)</button>
                </div>
            )}
        </div>
    );
}