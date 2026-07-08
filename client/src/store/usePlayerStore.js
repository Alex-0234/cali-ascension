import { create } from 'zustand';

const INITIAL_PLAYER_STATE = {
    // essentials
    userId: "",
    username: "",
    email: "",
    // user specified
    userInfo: {
        visibleName: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
    },
    title: "Rookie",
    color: "lightblue",
    bioStatus: 'optimal',
    streak: {    
      current: 0,
      highest: 0,
      lastActive: '',
    },

    // default stats
    rating: "100",
    level: 1,
    xp: 0,
    ep: 0, // exercise points?
    stats: {
      STR: 10, // REP RANGE: 1-4
      HYP: 10, // REP RANGE: 5-12
      END: 10, // REP RANGE: 13-25+
      POW: 10, // EXPLOSIVE REPS
      // DELETE?
      MOB: 10, // STRETCHING ??
      TEC: 10 // INCREASE WITH PROFICIENCY ??
    },
    exerciseProgress: {},

    isLoading: false,
    isLoggedIn: false,
    isConfigured: false,

    weightHistory: [],
    workoutHistory: {}, 

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