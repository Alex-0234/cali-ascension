import { EXERCISE_DB } from "../../data/exercise_db";

export default function SessionSummaryList({ session, onRemove }) {
    if (!session || Object.keys(session.exercises || {}).length === 0) return null;

    return (
        <div className="mx-4 border border-slate-700 bg-slate-900/60 rounded-sm p-3">
            <h4 className="text-xs tracking-widest text-slate-400 uppercase mb-2">Transmission Log:</h4>
            <ul className="flex flex-col gap-1.5">
                {Object.entries(session.exercises).map(([exId, exData], i) => (
                    <li key={i} className="flex items-center justify-between gap-3 border-t border-slate-800 pt-1.5 first:border-t-0 first:pt-0">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-200">{EXERCISE_DB[exId]?.name || exId}</span>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500 font-mono">{exData.sets.map(s => s.reps).join(' + ')}</span>
                                <span className="text-cyan-300 font-mono">= {exData.totalReps} {EXERCISE_DB[exId]?.unit || 'reps'}</span>
                            </div>
                        </div>
                        <button className="text-slate-500 hover:text-red-400 text-xs" onClick={() => onRemove(exId)}>✕</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}