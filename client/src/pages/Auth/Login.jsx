import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useUserStore from '../../store/usePlayerStore';
import Field from '../../components/ui/field';

const DEMO = { identifier: 'test', password: 'test' };

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const fetchUser = useUserStore((state) => state.fetchUser);

    // One field for both credentials — an '@' is all we need to tell them apart,
    // which is simpler than making the user pick a mode first.
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const redirectTo = location.state?.from || '/';

    async function submitCredentials({ identifier: id, password: secret }) {
        const isEmail = id.includes('@');

        const response = await fetch('/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                isEmail
                    ? { username: null, email: id.trim(), password: secret }
                    : { username: id.toLowerCase().trim(), email: null, password: secret }
            ),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Invalid credentials');
        }

        await fetchUser();
        navigate(redirectTo, { replace: true });
    }

    async function handleSubmit(event, credentials = { identifier, password }) {
        event?.preventDefault();

        if (!credentials.identifier || !credentials.password) {
            setError('Enter your credentials to continue.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            await submitCredentials(credentials);
        } catch (submitError) {
            setError(
                submitError instanceof TypeError
                    ? 'Cannot reach the server.'
                    : submitError.message
            );
        } finally {
            setIsProcessing(false);
        }
    }

    const handleDemo = (event) => {
        setIdentifier(DEMO.identifier);
        setPassword(DEMO.password);
        handleSubmit(event, DEMO);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5 rounded-sm border border-accent/20 bg-panel/60 p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xs tracking-widest text-accent-light uppercase">[ System.Auth ]</h1>
                    <p className="text-xs text-text-muted">Verify your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field
                        label="Username or e-mail"
                        type="text"
                        autoComplete="username"
                        placeholder="operator"
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        autoFocus
                    />

                    <div className="flex flex-col gap-1.5">
                        <Field
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="self-end cursor-pointer text-[10px] tracking-wider text-text-muted uppercase transition-colors hover:text-accent-light"
                        >
                            {showPassword ? 'Hide' : 'Show'} password
                        </button>
                    </div>

                    <p className="min-h-4 text-xs text-danger" role="alert">{error}</p>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isProcessing ? 'Verifying...' : 'Initialize'}
                    </button>
                </form>

                <p className="text-center text-xs text-text-muted">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" state={location.state} className="text-accent-light hover:underline">
                        Register
                    </Link>
                </p>
            </div>

            <button
                type="button"
                onClick={handleDemo}
                disabled={isProcessing}
                className="cursor-pointer rounded-sm border border-dashed border-border-main py-2.5 text-[10px] tracking-widest text-text-muted uppercase transition-colors hover:border-accent/50 hover:text-accent-light disabled:cursor-not-allowed disabled:opacity-50"
            >
                Try the demo account
            </button>
        </div>
    );
}
