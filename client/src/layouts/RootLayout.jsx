import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import useUserStore from '../store/usePlayerStore';
import BootScreen from '../components/system/BootScreen';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PING_RETRY_MS = 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Keeps pinging the free-tier backend until it answers a cold start. */
async function waitForServer(shouldStop) {
    while (!shouldStop()) {
        try {
            const response = await fetch(API_ROOT);
            if (response.ok) return true;
        } catch {
            // server still asleep — fall through to the retry
        }
        await wait(PING_RETRY_MS);
    }
    return false;
}

/**
 * Owns everything that has to happen before any route can render: waking the
 * server, then resolving the session. Guards downstream can therefore assume
 * `authStatus` is settled and never bounce a signed-in user to /login on refresh.
 */
export default function RootLayout() {
    const fetchUser = useUserStore((state) => state.fetchUser);
    const syncUser = useUserStore((state) => state.syncUser);

    const [bootStatus, setBootStatus] = useState('connecting');
    const [showApp, setShowApp] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const awake = await waitForServer(() => cancelled);
            if (!awake || cancelled) return;
            await fetchUser();
            if (!cancelled) setBootStatus('ready');
        })();

        return () => { cancelled = true; };
    }, [fetchUser]);

    // Unsaved edits are debounced; flush them the moment the tab goes away.
    useEffect(() => {
        const flush = () => {
            if (useUserStore.getState().isDirty) void syncUser();
        };
        const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };

        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('pagehide', flush);
        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pagehide', flush);
        };
    }, [syncUser]);

    if (!showApp) {
        return <BootScreen status={bootStatus} onExited={() => setShowApp(true)} />;
    }

    return (
        <>
            <ScrollRestoration />
            <Outlet />
        </>
    );
}
