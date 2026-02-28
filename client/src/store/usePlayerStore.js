import { create } from 'zustand';
import { testingLevelUp } from '../utils/levelUpSystem';

const INITIAL_PLAYER_STATE = {
  
    userId: "",
    username: "",
    email: "",

    shownName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    currentProgram: 'none',

    level: 1,
    rank: "Unranked",
    title: "None",
    xp: 0,
    stats: {
      STR: 10,
      AGI: 10,
      VIT: 10,
      DEX: 10
    },

    userEvaluation: {},
    exerciseProgress: {},

    isLoading: false,
    isLoggedIn: false,
    isConfigured: false,

    weightHistory: [],
    workoutHistory: [],

}


const useUserStore = create((set, get) => ({
  userData: INITIAL_PLAYER_STATE,

  hasFetchedInitialData: false,

  setUserData: (newData) => 
    set((state) => ({
      userData: { ...state.userData, ...newData }
    })),
  
  fetchUser: async (userId) => {
      set((state) => ({ 
          userData: { ...state.userData, isLoading: true } 
      }));

      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`);
          const data = await response.json();
          
          console.log('System: User Data Loaded', data);

          set((state) => ({
              hasFetchedInitialData: true,
              userData: { 
                  ...state.userData, 
                  ...data, 
                  isLoggedIn: true, 
                  isLoading: false, 
              }
          }));
      } catch (error) {
          console.error('Fetch Failed', error);

          set((state) => ({ 
              hasFetchedInitialData: true,
              userData: { 
                ...state.userData,
                isLoading: false,
                isLoggedIn: false } 
          }));
      }
  },

  syncUser: async () => {
    const state = get(); 
    const { userData } = state;
    if (!userData.userId) return;

    if (!userData.isLoggedIn) {
        console.warn("Sync blocked: Waiting for login.");
        return;
    }
    if (userData.isLoading) {
        console.warn("Sync blocked: Fetching from database.");
        return;
    }
    if (!state.hasFetchedInitialData) {
        console.warn("Sync blocked: Waiting for initial data fetch from DB!");
        return;
    }
    try {
      console.log('System: Syncing to Database...');
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userData.userId}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      console.log('Done');
    } catch (error) {
      console.error('System Error: Sync Failed', error);
    }
  },
  logout: () => {
        localStorage.removeItem('userId');
        set({  hasFetchedInitialData: false, userData: INITIAL_PLAYER_STATE });
        
  },

  addXP: (amount) => {
    const syncUser = get().syncUser;
    const currentData = get().userData;

    const { newLevel, leftoverXP } = testingLevelUp(currentData.level, amount, currentData.xp);

    set((state) => ({
      userData: { 
          ...state.userData,
          level: newLevel,
          xp: leftoverXP
      }
    }))
    syncUser();
  }
}));

export default useUserStore;