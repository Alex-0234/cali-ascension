import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useUserStore from '../store/usePlayerStore';

/**
 * Route-level access rules. RootLayout has already settled `authStatus` by the
 * time any of these render, so they can decide synchronously — no loading flicker
 * and no half-rendered protected page.
 */

/** Signed-in only. Remembers where the user was headed so login can send them back. */
export function RequireAuth() {
    const authStatus = useUserStore((state) => state.authStatus);
    const location = useLocation();

    if (authStatus !== 'authenticated') {
        return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
    }
    return <Outlet />;
}

/** Signed-out only — keeps /login and /register out of reach once authenticated. */
export function RequireGuest() {
    const authStatus = useUserStore((state) => state.authStatus);
    const location = useLocation();

    if (authStatus === 'authenticated') {
        return <Navigate to={location.state?.from || '/'} replace />;
    }
    return <Outlet />;
}

/** The main app needs a calibrated profile; anyone without one is sent to onboarding. */
export function RequireCalibration() {
    const isConfigured = useUserStore((state) => state.userData.isConfigured);

    if (!isConfigured) return <Navigate to="/onboarding" replace />;
    return <Outlet />;
}

