import { useState } from 'react'

import useUserStore from '../../store/usePlayerStore'

export default function Login({ onFinish, onRedirect }) {
    const { fetchUser } = useUserStore();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState('Username');

    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleLogin(e) {
        if (e) e.preventDefault();

        if ((!username && !email) || !password) {
            setNotification({ message: "Please fill in all required fields", error: true });
            return;
        }

        setIsProcessing(true);
        setNotification({ message: "", error: false });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    mode === 'Username'
                        ? { username: username.toLowerCase().trim(), email: null, password }
                        : { username: null, email: email.trim(), password }
                ),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userId', data.userId);
                await fetchUser(data.userId);
                onFinish();
            } else {
                setNotification({ message: data.message || "Invalid credentials", error: true });
            }

        } catch (error) {
            console.error("Login error:", error);
            setNotification({ message: "Cannot connect to server.", error: true });
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="max-h-full w-full flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md flex flex-col gap-6">

                <div className="border border-cyan-500/20 bg-slate-900/60 rounded-sm p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xs tracking-widest text-cyan-300 uppercase">[ System.Auth ]</h2>
                        <p className="text-xs text-slate-500">Verify your credentials to continue</p>
                    </div>

                    <div className="flex border border-slate-700 rounded-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setMode('Username')}
                            className={`flex-1 py-2 text-xs tracking-wider uppercase transition-colors ${mode === 'Username' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Username
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('E-mail')}
                            className={`flex-1 py-2 text-xs tracking-wider uppercase border-l border-slate-700 transition-colors ${mode === 'E-mail' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            E-mail
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {mode === 'Username' ? (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] tracking-widest uppercase text-slate-500">Username</label>
                                <input
                                    autoComplete='username' type="text"
                                    placeholder="Enter your username"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                    className="bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded-sm focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] tracking-widest uppercase text-slate-500">E-mail</label>
                                <input
                                    autoComplete='email' type="email"
                                    placeholder="Enter your e-mail"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded-sm focus:border-cyan-400 focus:outline-none"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] tracking-widest uppercase text-slate-500">Password</label>
                            <input
                                autoComplete="current-password" type="password"
                                placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded-sm focus:border-cyan-400 focus:outline-none"
                            />
                        </div>

                        {notification.message && (
                            <p className={`text-xs ${notification.error ? 'text-red-400' : 'text-emerald-400'}`}>
                                {notification.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="mt-1 py-2.5 text-xs tracking-widest uppercase border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 rounded-sm hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Verifying...' : 'Initialize'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500">
                        Don't have an account? <span onClick={onRedirect} className="text-cyan-300 cursor-pointer hover:underline">Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
}