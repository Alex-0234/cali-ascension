 import { create } from 'zustand';

const useUIStore = create((set) => ({
    isNotificationOpen: false,
    isProfileOpen: false,
    isHistory: {open: false, type: null},

    toggleNotification: () => set((state) => ({ 
        isNotificationOpen: !state.isNotificationOpen 
    })),
    
    toggleProfile: () => set((state) => ({ 
        isProfileOpen: !state.isProfileOpen 
    })),

    setNotification: (value) => set({ 
        isNotificationOpen: value 
    }),
    
    setProfile: (value) => set({ 
        isProfileOpen: value 
    }),

    setHistory: (value) => set({
        isHistory: value,
    })
}));
export default useUIStore;