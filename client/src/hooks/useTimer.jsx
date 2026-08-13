import { useMemo, useState, useSyncExternalStore } from 'react';

export const formatDuration = (totalSeconds = 0) => {
    const safe = Math.max(0, Math.floor(totalSeconds));
    return `${Math.floor(safe / 60).toString().padStart(2, '0')}:${(safe % 60).toString().padStart(2, '0')}`;
};

const TICK_MS = 500;

// One shared clock for every timer on screen. Reading `Date.now()` during render
// would make the component impure and could return a different value on each of
// React's render passes, so the value is cached here and only moves on a tick.
let cachedNow = Date.now();
const listeners = new Set();
let intervalId = null;

function subscribeToClock(onChange) {
    listeners.add(onChange);
    if (intervalId === null) {
        cachedNow = Date.now();
        intervalId = setInterval(() => {
            cachedNow = Date.now();
            listeners.forEach((listener) => listener());
        }, TICK_MS);
    }
    return () => {
        listeners.delete(onChange);
        if (listeners.size === 0 && intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };
}

const getClock = () => cachedNow;

/**
 * Elapsed-time counter anchored to wall-clock timestamps rather than a tick count.
 *
 * A background tab throttles intervals, so counting ticks silently loses minutes
 * off a real session. Storing `startedAt` instead means the clock only drives
 * re-renders — the value itself is always derived from real time, and the
 * `snapshot` it returns is enough to restore a running timer after a reload.
 */
export default function useTimer({ base = 0, startedAt = null } = {}) {
    const [state, setState] = useState({ base, startedAt });
    const now = useSyncExternalStore(subscribeToClock, getClock, getClock);

    const isRunning = state.startedAt !== null;
    // The shared clock can lag a freshly set `startedAt` by up to one tick.
    const seconds = Math.max(0, Math.floor(state.base + (state.startedAt ? (now - state.startedAt) / 1000 : 0)));

    const controls = useMemo(() => ({
        start: () => setState((prev) => (prev.startedAt ? prev : { ...prev, startedAt: Date.now() })),
        toggle: () => setState((prev) => (
            prev.startedAt
                ? { base: prev.base + (Date.now() - prev.startedAt) / 1000, startedAt: null }
                : { ...prev, startedAt: Date.now() }
        )),
        reset: () => setState({ base: 0, startedAt: null }),
    }), []);

    return {
        ...controls,
        time: seconds,
        isRunning,
        snapshot: state,
        format: (value = seconds) => formatDuration(value),
    };
}
