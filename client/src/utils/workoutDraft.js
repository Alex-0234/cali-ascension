const STORAGE_KEY = 'cali:active-workout';

/**
 * A workout in progress is the one piece of state the app cannot afford to lose to
 * a stray refresh, and it isn't worth syncing to the server until it's finished —
 * so it lives in sessionStorage until the session is logged or cancelled.
 */
export function readWorkoutDraft() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const draft = JSON.parse(raw);
        // A draft from a previous day would merge into the wrong history entry.
        if (!draft?.routine || draft.date !== new Date().toISOString().split('T')[0]) {
            clearWorkoutDraft();
            return null;
        }
        return draft;
    } catch {
        return null;
    }
}

export function writeWorkoutDraft(draft) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...draft,
            date: new Date().toISOString().split('T')[0],
        }));
    } catch {
        // Private mode or a full quota — the workout still works, it just won't survive a reload.
    }
}

export function clearWorkoutDraft() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // nothing to clean up
    }
}
