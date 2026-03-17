import { create } from 'zustand';

const INITIAL_PLAYER_STATE = {
  
    userId: "",
    username: "",
    email: "",

    shownName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    currentSplit: {
      split: 'Full Body',
      currentDayIndex: 0,
    },
    bioStatus: 'optimal',

    level: 1,
    rank: "Unranked",
    title: "None",
    color: "blue",
    streak: {    // Change to work with the workoutHistory rework.
      current: 0,
      highest: 0,
      lastActive: '',
    },
    xp: 0,
    stats: {
      STR: 10,
      END: 10,
      MOB: 10,
      TEC: 10
    },

    userEvaluation: {},
    exerciseProgress: {},
    personalRecords: {},


    isLoading: false,
    isLoggedIn: false,
    isConfigured: false,

    weightHistory: [],
    workoutHistory: {}, 

    /* workoutHistory = {
        2026-03-12: {
            status: 'restday' / 'workout',      ...maybe change status to something better
            totalVolume: 120,
            totalSets: 5,
            duration: 0,
            notes: '',
            exercises: [
              {"pushup_05A": {totalReps: ...., sets: [...sets]} } 
            ]
        }
        2026-03-11: {
        etc.}
      } */

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
          console.error('Fetch Failed', error.message);
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

}));

export default useUserStore;