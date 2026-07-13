import { useState, useEffect, useRef } from "react";
import { MODIFIERS } from "../../data/exercise_db";

const inputClass = "bg-slate-950 border border-slate-700 text-slate-100 text-sm px-2 py-1.5 rounded-sm w-20 focus:border-cyan-400 focus:outline-none";
const iconBtnClass = "w-7 h-7 flex items-center justify-center text-slate-400 border border-slate-700 rounded-sm hover:border-cyan-400 hover:text-cyan-300 transition-colors text-xs";

const MOD_ABBR = { incline: "INC", decline: "DEC", band: "BND", explosive: "EXP" };

const modBtnClass = (active, isExplosive) => {
    const base = "text-[10px] tracking-widest uppercase px-2.5 py-1 transition-colors";
    if (!active) return `${base} text-slate-400 hover:text-slate-200`;
    return isExplosive
        ? `${base} text-amber-300 bg-amber-500/10`
        : `${base} text-cyan-300 bg-cyan-500/10`;
};

function ModifierChips({ mods }) {
    if (!mods?.length) return null;
    return (
        <span className="flex gap-1">
            {mods.map((m) => (
                <span
                    key={m}
                    className={`text-[9px] tracking-wider px-1.5 py-0.5 rounded-sm border ${m === "explosive" ? "border-amber-400/30 text-amber-300" : "border-cyan-400/30 text-cyan-300"}`}
                >
                    {MOD_ABBR[m] || m.toUpperCase()}
                </span>
            ))}
        </span>
    );
}

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
    const [activeMods, setActiveMods] = useState([]);
    const prevSetCount = useRef(sets.length);

    // Toggles persist across sets, only reset when the exercise changes
    useEffect(() => setActiveMods([]), [exerciseData?.id]);

    // A newly added set inherits the current toggles; earlier sets keep
    // whatever was saved on them
    useEffect(() => {
        if (sets.length > prevSetCount.current) {
            onUpdateSet(sets.length - 1, "modifiers", activeMods);
        }
        prevSetCount.current = sets.length;
    }, [sets.length]);

    // Native explosive exercises already feed the power stat
    const supported = (exerciseData?.supportedModifiers || []).filter(
        (m) => !(m === "explosive" && exerciseData?.isExplosive)
    );
    const hasSlope = supported.includes("incline") && supported.includes("decline");
    const standalone = supported.filter((m) => !hasSlope || (m !== "incline" && m !== "decline"));

    // Toggling edits the set currently being filled (the last one) and
    // becomes the default for sets added afterwards
    const toggleMod = (mod) => {
        let next;
        if (activeMods.includes(mod)) {
            next = activeMods.filter((m) => m !== mod);
        } else {
            const cleared = mod === "incline" || mod === "decline"
                ? activeMods.filter((m) => m !== "incline" && m !== "decline")
                : activeMods;
            next = [...cleared, mod];
        }
        setActiveMods(next);
        onUpdateSet(sets.length - 1, "modifiers", next);
    };

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
                    {supported.length > 0 && (
                        <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-2">
                            <span className="text-[10px] tracking-widest uppercase text-slate-500">Modifiers</span>
                            <div className="flex flex-wrap items-center gap-2">
                                {hasSlope && (
                                    <div className="flex border border-slate-700 rounded-sm overflow-hidden divide-x divide-slate-700">
                                        <button className={modBtnClass(activeMods.includes("incline"))} onClick={() => toggleMod("incline")}>
                                            {MODIFIERS.incline.label}
                                        </button>
                                        <button className={modBtnClass(activeMods.includes("decline"))} onClick={() => toggleMod("decline")}>
                                            {MODIFIERS.decline.label}
                                        </button>
                                    </div>
                                )}
                                {standalone.map((m) => (
                                    <button
                                        key={m}
                                        className={`border rounded-sm ${activeMods.includes(m) && m === "explosive" ? "border-amber-400/40" : "border-slate-700"} ${modBtnClass(activeMods.includes(m), m === "explosive")}`}
                                        onClick={() => toggleMod(m)}
                                    >
                                        {MODIFIERS[m]?.label || m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        {sets.map((set, index) => {
                            const timerKey = `${category}-${index}`;
                            const isSeconds = exerciseData?.unit === 'seconds';

                            return (
                                <div key={index} className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-slate-500 w-10">Set {index + 1}</span>

                                    {isSeconds ? (
                                        <div className="flex items-center gap-2">
                                            <span className={`font-mono text-sm ${!exerciseTimer.running[timerKey] ? 'text-border-main' : 'text-cyan-300'} ${exerciseTimer.countdown[timerKey] && 'text-red-600'}`}>
                                                {exerciseTimer.running[timerKey] ? exerciseTimer.format(exerciseTimer.times[timerKey] || 0) : exerciseTimer.format(exerciseTimer.countdown[timerKey] || exerciseTimer.times[timerKey])}
                                            </span>

                                            <button
                                                className={iconBtnClass}
                                                onClick={() => {
                                                    exerciseTimer.running[timerKey] ? exerciseTimer.toggle(timerKey) : exerciseTimer.startTimer(timerKey);
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

                                    <ModifierChips mods={set.modifiers} />

                                    {sets.length > 1 && (
                                        <button className="text-slate-500 hover:text-red-400 text-xs ml-auto" onClick={() => onRemoveSet(index)}>✕</button>
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