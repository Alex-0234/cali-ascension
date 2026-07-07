import { useState, useEffect } from "react";
import useUserStore from "../../store/usePlayerStore";

import Workout from "./workout";
import Status from "./status";

const SECTIONS = [
    { id: 'status', label: 'Dashboard' },
    { id: 'workout', label: 'Workout' },
    { id: 'skilltree', label: 'Skill Tree' },
    { id: 'stats', label: 'Stats' },
];

const System = () => {
    const { userData } = useUserStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeSection, setActiveSection] = useState('status');

    useEffect(() => {
        setIsLoggedIn(!!userData.isLoggedIn);
    }, [userData]);

    return (
        <section className="flex justify-center items-center h-screen w-full bg-slate-950">
            <div className="flex flex-col h-[90%] w-[90%] bg-slate-900/60 border border-cyan-500/20 rounded-[6px] overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-900/40">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
                        <span className="text-sm tracking-widest text-slate-200 uppercase">System</span>
                        <span className="text-xs tracking-widest text-slate-500 uppercase hidden sm:inline">// Calisthenics Protocol</span>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-400">LV <b className="text-slate-200">{userData.level ?? 1}</b></span>
                            <div
                                className="w-8 h-8 flex items-center justify-center rounded-full border text-sm bg-slate-950"
                                style={{ borderColor: userData.color || '#22d3ee' }}
                            >
                                {userData.equippedBadge || "👤"}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button className="text-xs tracking-wider uppercase px-3 py-1.5 border border-slate-700 text-slate-300 rounded-sm hover:border-cyan-400 hover:text-cyan-300 transition-colors">
                                Login
                            </button>
                            <button className="text-xs tracking-wider uppercase px-3 py-1.5 border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 rounded-sm hover:bg-cyan-500/20 transition-colors">
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

                <nav className="flex gap-1 px-6 border-b border-cyan-500/20 bg-slate-900/20 overflow-x-auto">
                    {SECTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={`px-4 py-2.5 text-xs tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors ${
                                activeSection === id
                                    ? 'text-cyan-300 border-cyan-400'
                                    : 'text-slate-500 border-transparent hover:text-slate-300'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="flex-1 overflow-auto">
                    {activeSection === 'status' && <Status />}
                    {activeSection === 'workout' && <Workout />}

                    {(activeSection === 'skilltree' || activeSection === 'stats') && (
                        <div className="flex flex-col items-center justify-center gap-3 h-full text-center px-6">
                            <span className="text-xl text-slate-600">◇</span>
                            <p className="text-xs tracking-widest uppercase text-slate-500">Module Offline</p>
                            <p className="text-xs text-slate-600 max-w-xs">This section hasn't been built yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}

export default System;