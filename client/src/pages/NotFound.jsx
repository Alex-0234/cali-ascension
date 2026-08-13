import { Link, useRouteError } from 'react-router-dom';

/**
 * Serves both the catch-all route and every route's `errorElement`, so a bad URL
 * and a render crash both land somewhere with a way back instead of a blank page.
 */
export default function NotFound({ asError = false }) {
    const error = useRouteError();
    const message = asError && error ? (error.statusText || error.message) : null;

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-dark px-4 text-center font-robotomono">
            <span className="text-[10px] tracking-[0.3em] text-text-muted uppercase">
                {asError ? 'System fault' : 'Error 404'}
            </span>

            <h1 className="text-2xl tracking-wide text-text-bright">
                {asError ? 'Something broke' : 'Signal lost'}
            </h1>

            <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                {message || 'That route does not exist. The protocol only knows dashboard, workout, skills and history.'}
            </p>

            <Link
                to="/"
                className="rounded-sm border border-accent/50 bg-accent/10 px-5 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
            >
                Return to dashboard
            </Link>
        </div>
    );
}
