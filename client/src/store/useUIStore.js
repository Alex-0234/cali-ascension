import { create } from 'zustand';

const useUIStore = create((set, get) => ({
    isNotificationOpen: false,
    isProfileOpen: false,

    setNotification: (value) => 
        set((state) => {
            state.isNotificationOpen = value;
        }),
    
    setProfile: (value) => 
        set((state) => {
            state.isProfileOpen =  value;
        })
}))

export default useUIStore;