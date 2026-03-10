 import { create } from 'zustand';

const useUIStore = create((set) => ({
    isNotificationOpen: false,
    isHistory: {open: false, type: null},

    toggleNotification: () => set((state) => ({ 
        isNotificationOpen: !state.isNotificationOpen 
    })),

    setNotification: (value) => set({ 
        isNotificationOpen: value 
    }),

    setHistory: (value) => set({
        isHistory: value,
    })
}));
export default useUIStore;