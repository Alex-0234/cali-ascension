import { useState, useEffect } from "react";
import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";

import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Workout from "./workout";
import Status from "./status";
import ServerWakeup from "./serverWakeup";
import SkillTree from "../../components/skilltree/SkillTree";

const SECTIONS = [
    { id: 'status', label: 'Dashboard' },
    { id: 'workout', label: 'Workout' },
    { id: 'skilltree', label: 'Skill Tree' },
];

const System = () => {
    const { userData, logout } = useUserStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [auth, setAuth] = useState({isOpen: false, modal: '',});
    const { activeSection, requestSection } = useUIStore();

    useEffect(() => {
        setIsLoggedIn(!!userData.isLoggedIn);
    }, [userData]);

    return (
        <section className="flex justify-center items-center h-screen w-full bg-dark font-robotomono">
            <div className="flex flex-col h-[98%] w-[98%] sm:w-[90%] sm:h-[90%] bg-panel/60 border border-accent/20 rounded-[6px] overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-accent/20 bg-panel/40">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 bg-accent-glow rotate-45 shadow-[0_0_8px_#22d3ee99]"></span>
                        <span className="text-sm tracking-widest text-text-bright uppercase">System</span>
                        <span className="text-xs text-text-muted uppercase hidden sm:inline">// Calisthenics Protocol</span>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-text-main">LV <b className="text-text-bright">{userData.level ?? 1}</b></span>
                            <div
                                className="w-8 h-8 flex items-center justify-center rounded-full border text-sm bg-card"
                                style={{ borderColor: userData.color || 'var(--color-accent-glow)' }}
                            >
                                {userData.equippedBadge || "👤"}
                            </div>
                            <button className='cursor-pointer uppercase' onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button id='login-btn' className="text-xs tracking-wider uppercase px-3 py-1.5 border border-border-main text-text-main rounded-sm hover:border-accent-glow hover:text-accent-light transition-colors"
                            onClick={() => setAuth({isOpen: true, modal: 'login'})}>
                                Login
                            </button>
                            <button id='register-btn' className="text-xs tracking-wider uppercase px-3 py-1.5 border border-accent-glow/50 bg-accent/10 text-accent-light rounded-sm hover:bg-accent/20 transition-colors"
                            onClick={() => setAuth({isOpen: true, modal: 'register'})}>
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

                <nav className="flex gap-1 min-h-10 px-6 border-b border-accent/20 bg-panel/20 overflow-x-auto">
                    {SECTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => {requestSection(id); auth.isOpen && setAuth({isOpen: false, modal: ''})}}
                            className={`px-4 py-2.5 text-xs tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors ${
                                activeSection === id
                                    ? 'text-accent-light border-accent-glow'
                                    : 'text-text-muted border-transparent hover:text-text-main'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="h-full w-full overflow-auto">
                    {auth.isOpen && auth.modal === 'login' && (
                        <Login onFinish={() => setAuth({isOpen: false, modal: ''})} onRedirect={() => setAuth({isOpen: true, modal:'register'})} />
                    )}
                    {auth.isOpen && auth.modal === 'register' && (
                        <Register onFinish={() => setAuth({isOpen: true, modal: 'login'})} onRedirect={() => setAuth({isOpen: true, modal:'login'})}/>
                    )}
                    {!auth.isOpen && activeSection === 'status' && <Status />}
                    {!auth.isOpen && activeSection === 'workout' && <Workout />}

                    {!auth.isOpen && activeSection === 'skilltree' && <SkillTree />}
                </div>

            </div>
        </section>
    );
}

export default System;