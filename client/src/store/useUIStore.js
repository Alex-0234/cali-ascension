import { create } from 'zustand';

const useUIStore = create((set, get) => ({
    activeSection: 'status',
    navGuard: null,

    // Called by whichever component owns the "in progress" state (e.g. Workout)
    // to block section switches. Pass null to release the guard.
    setNavGuard: (guard) => set({ navGuard: guard }),

    // Nav buttons should call this instead of setting activeSection directly,
    // so a registered guard gets a chance to confirm before we actually navigate.
    requestSection: (id) => {
        const { activeSection, navGuard } = get();
        if (id === activeSection) return;
        if (navGuard && navGuard() && !window.confirm('You have a workout in progress. Leave anyway?')) {
            return;
        }
        set({ activeSection: id });
    },
}));

export default useUIStore;
