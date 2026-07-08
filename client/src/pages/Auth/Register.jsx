import { useState } from 'react'

import validatePassword from '../../utils/validatePassword';

export default function Register({ onFinish, onRedirect }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleRegister(e) {
        if (e) e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            setNotification({ message: "Missing required fields", error: true });
            return;
        }

        if (password !== confirmPassword) {
            setNotification({ message: "Passwords do not match", error: true });
            return;
        }

        const { isValid, errors } = validatePassword(password);

        if (!isValid) {
            setNotification({ message: errors, error: true });
            return;
        }

        setIsProcessing(true);
        setNotification({ message: "", error: false });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.toLowerCase().trim(), email: email.trim(), password }),
            });

            if (response.ok) {
                setNotification({ message: "Account created. Redirecting...", error: false });
                setTimeout(() => {
                    onRedirect();
                    onFinish();
                }, 1200);
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || "Registration failed", error: true });
            }

        } catch (error) {
            console.error("Registration error:", error);
            setNotification({ message: "Cannot connect to server.", error: true });
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md border border-cyan-500/20 bg-slate-900/60 rounded-sm p-6 flex flex-col gap-5">

                <div className="flex flex-col gap-1">
                    <h2 className="text-xs tracking-widest text-cyan-300 uppercase">[ System.Register ]</h2>
                    <p className="text-xs text-slate-500">Create a new account to begin training</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor='username' className="text-[10px] tracking-widest uppercase text-slate-500">Username</label>
                        <input
                            type="text" id='username'
                            placeholder="Enter your username"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            autoComplete='username'
                            className="bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded-sm focus:border-cyan-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor='email' className="text-[10px] tracking-widest uppercase text-slate-500">E-mail</label>
                        <input
                            type="email" id='email'
                            placeholder="Enter your e-mail address"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            autoComplete='email'
                            className="bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded-sm focus:border-cyan-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor='password' className="text-[10px] tracking-widest uppercase text-slate-500">Password</label>
                        <input
                            type="password" id='password'
                            placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            autoComplete='new-password'
                            className="bg-slate-950 border border-slate-700 text-slate-100 text-sm px-3 py-2 rounded-sm focus:border-cyan-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor='confirmPassword' className="text-[10px] tracking-widest uppercase text-slate-500">Verify Password</label>
                        <input
                            type="password" id='confirmPassword'
                            placeholder="••••••••"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete='new-password'
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
                        {isProcessing ? 'Submitting...' : 'Initialize'}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500">
                    Already have an account? <span onClick={onRedirect} className="text-cyan-300 cursor-pointer hover:underline">Log In</span>
                </p>
            </div>
        </div>
    );
}