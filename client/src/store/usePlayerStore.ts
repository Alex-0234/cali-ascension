import { create } from 'zustand';

interface userInfo {
  visibleName: string | null
  age: number | null
  gender: string | null
  height: number | null
  weight: number | null
}
interface streak {
  current: number
  highest: number
  lastActive: Date | null
}
interface stats {
  STR: number
  HYP: number 
  END: number
  POW: number 
  BAL: number
  AP: number
}
export interface exerciseProgress {
  totalReps: number
  personalBest: number
}
export interface Workout {
  status: string
  duration: number
  exercises: any
  leveledUp: number
  notes: string
  totalSets: number
  totalVolume: number
}

interface userData {
  userId: string
  username: string
  email: string
  dateCreated: Date | null

  userInfo: userInfo
  title: string
  color: string
  bioStatus: string
  streak: streak

  rating: number
  level: number
  prestige: number
  prestigeXPConsumed: number
  xp: number
  ep: number
  stats: stats

  isLoading: boolean   //Deprecated?
  isLoggedIn: boolean
  isConfigured: boolean

  exerciseProgress: Record<string, exerciseProgress>
  weightHistory: number[]
  customWorkouts: object
  workoutHistory: Record<string, Workout>
}


const INITIAL_PLAYER_STATE: userData = {
    // essentials
    userId: "",
    username: "",
    email: "",
    dateCreated: null,
    // user specified
    userInfo: {
        visibleName: null,
        age: null,
        gender: null,
        height: null,
        weight: null,
    },
    title: "Rookie",
    color: "lightblue",
    bioStatus: 'optimal',
    streak: {    
      current: 0,
      highest: 0,
      lastActive: null,
    },

    // default stats
    rating: 0,
    level: 1,
    prestige: 0,
    prestigeXPConsumed: 0,
    xp: 0,
    ep: 0, // exercise points?
    stats: {
      STR: 10, // REP RANGE: 1-4
      HYP: 10, // REP RANGE: 5-12
      END: 10, // REP RANGE: 13-25+
      POW: 10, // EXPLOSIVE REPS
      BAL: 10,
      AP: 0
    },
    
    isLoading: false,
    isLoggedIn: false,
    isConfigured: false,

    exerciseProgress: {},
    weightHistory: [],
    customWorkouts: [],
    workoutHistory: {}, 

}


interface UserStoreState {
  userData: userData;
  hasFetchedInitialData: boolean;
  setUserData: (newData: Partial<userData>) => void;
  fetchUser: (userId: string) => Promise<void>;
  syncUser: () => Promise<void>;
  logout: () => void;
}

const useUserStore = create<UserStoreState>()((set, get) => ({
  userData: INITIAL_PLAYER_STATE,

  hasFetchedInitialData: false,

  setUserData: (newData: Partial<userData>) =>
    set((state) => ({
      userData: { ...state.userData, ...newData }
    })),

  fetchUser: async (userId: string) => {
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
      } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          console.error('Fetch Failed', message);

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