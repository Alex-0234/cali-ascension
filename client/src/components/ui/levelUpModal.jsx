export default function LevelUpModal({ levelChange, onAcknowledge }) {
    if (!levelChange.show) return null;

    return (
        <div
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm cursor-pointer"
            onClick={onAcknowledge}
        >
            <div className="flex flex-col items-center gap-4 border border-cyan-400/40 bg-slate-950/90 px-10 py-8 rounded-sm">
                <span className="text-3xl text-cyan-300">⇈</span>

                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="flex items-center gap-2 text-lg tracking-widest text-slate-100 uppercase">
                        System.Level_Up
                        <span className="text-xs px-2 py-0.5 rounded-sm bg-cyan-500/10 border border-cyan-400/40 text-cyan-300">+{levelChange.newLevels}</span>
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Total XP Yield:</span>
                        <span className="text-emerald-400 font-mono">+{Math.round(levelChange.xpGain)} XP</span>
                    </div>
                </div>
            </div>

            <div className="text-xs tracking-widest text-slate-500 uppercase">[ Click to acknowledge ]</div>
        </div>
    );
}