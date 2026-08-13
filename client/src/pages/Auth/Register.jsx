import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useUserStore from '../../store/usePlayerStore';
import validatePassword from '../../utils/validatePassword';
import Field from '../../components/ui/field';

export default function Register() {
    const navigate = useNavigate();
    const fetchUser = useUserStore((state) => state.fetchUser);

    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

    // Live feedback beats finding out the password was rejected only on submit.
    const passwordCheck = useMemo(
        () => (form.password ? validatePassword(form.password) : null),
        [form.password]
    );
    const mismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    async function handleSubmit(event) {
        event.preventDefault();

        const { username, email, password, confirmPassword } = form;

        if (!username || !email || !password || !confirmPassword) {
            setError('Missing required fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!passwordCheck?.isValid) {
            setError(String(passwordCheck?.errors ?? 'Password is too weak.'));
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.toLowerCase().trim(),
                    email: email.trim(),
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Registration failed');
            }

            // The server signs the new account in as part of registering, so go
            // straight to calibration instead of asking for the password again.
            await fetchUser();
            navigate('/onboarding', { replace: true });
        } catch (submitError) {
            setError(
                submitError instanceof TypeError
                    ? 'Cannot reach the server.'
                    : submitError.message
            );
            setIsProcessing(false);
        }
    }

    return (
        <div className="flex flex-col gap-5 rounded-sm border border-accent/20 bg-panel/60 p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-xs tracking-widest text-accent-light uppercase">[ System.Register ]</h1>
                <p className="text-xs text-text-muted">Create an account to begin training</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field
                    label="Username"
                    type="text"
                    autoComplete="username"
                    placeholder="operator"
                    value={form.username}
                    onChange={update('username')}
                    autoFocus
                />

                <Field
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                />

                <Field
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    error={passwordCheck && !passwordCheck.isValid ? String(passwordCheck.errors) : undefined}
                />

                <Field
                    label="Verify password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    error={mismatch ? 'Passwords do not match.' : undefined}
                />

                <p className="min-h-4 text-xs text-danger" role="alert">{error}</p>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isProcessing ? 'Submitting...' : 'Initialize'}
                </button>
            </form>

            <p className="text-center text-xs text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-light hover:underline">Log in</Link>
            </p>
        </div>
    );
}
