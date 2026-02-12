import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  userData: {
    // Should be kept in DB
    private: {
      email: "",
    },

    isLoggedIn: false, 
    userId: "",
    username: "",
    gender: "",
    age: null,
    weight: null,
    height: null,
    level: null,
    stats: {
      strength: null,
      agility: null,
      inteligence: null,
      //...
    },

    userEvaluation: {
      
    },
    isConfigured: false,
    skillProgress: {}
  },

  setUserData: (newData) => 
    set((state) => ({
      userData: { ...state.userData, ...newData }
    })),
  
  fetchUser: async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`);
      const data = await response.json();
      console.log('System: User Data Loaded', data);
      
      set((state) => ({ 
        userData: { ...state.userData, ...data, loggedIn: true } 
      }));
    } catch (error) {
      console.error('System Error: Fetch Failed', error);
    }
  },
  syncUser: async () => {
    const { userData } = get(); 
    if (!userData.userId) return;

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

}));

export default useUserStore;