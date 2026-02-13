import { create } from 'zustand';

const INITIAL_PLAYER_STATE = {
  
    userId: "",
    username: "",
    email: "",

    gender: "",
    age: "",
    height: "",
    weight: "",

    level: 1,
    rank: "E-Rank",
    title: "None",
    xp: 0,
    stats: {
        strength: 10,
        agility: 10,
        sense: 10,
        vitality: 10,
        intelligence: 10
    },

    userEvaluation: {},
    skillProgress: {},

    isLoading: false,
    isLoggedIn: false,
    isConfigured: false,

    weightHistory: []

}


const useUserStore = create((set, get) => ({
  userData: INITIAL_PLAYER_STATE,

  setUserData: (newData) => 
    set((state) => ({
      userData: { ...state.userData, ...newData }
    })),
  
  fetchUser: async (userId) => {
      set({ isLoading: true });
      try {
          const response = await fetch(`http://localhost:5000/api/user/${userId}`);
          const data = await response.json();
          
          console.log('System: User Data Loaded', data);

          set((state) => ({
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
              userData: { 
                ...state.userData,
                isLoading: false,
                isLoggedIn: false } 
          }));
      }
  },

  syncUser: async () => {
    const { userData } = get(); 
    if (!userData.userId) return;

    if (!userData.isLoggedIn) {
        console.warn("Sync zablokován: Uživatel není přihlášen.");
        return;
    }

    try {
      console.log('System: Syncing to Database...');
      await fetch(`http://localhost:5000/api/user/${userData.userId}`, {
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
        set({ userData: INITIAL_PLAYER_STATE });
    }
}));

export default useUserStore;