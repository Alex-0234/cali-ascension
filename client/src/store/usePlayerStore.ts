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
interface set {
  reps: number 
  extraWeight: number
  modifiers: string[]
}
export interface workoutPerExercise {
  sets: set[]
  totalReps: number
}

export interface Workout {
  status: string
  duration?: number
  exercises?: Record<string, workoutPerExercise>
  leveledUp?: number
  notes?: string
  totalSets?: number
  totalVolume?: number
}

export interface Tracker<T> {
  createdAt: Date
  name: string
  tracking: T
  history: T[]
}

export type AnyTracker = Tracker<number> | Tracker<string> | Tracker<boolean>

export const MAX_CUSTOM_TRACKERS = 5

export const WEIGHT_TRACKER_NAME = 'Weight'

export function createWeightTracker(startingWeight: number): Tracker<number> {
  return {
    createdAt: new Date(),
    name: WEIGHT_TRACKER_NAME,
    tracking: startingWeight,
    history: [],
  };
}

function withWeightTracker(trackers: AnyTracker[] | undefined, weight: number | null | undefined): AnyTracker[] {
  const list = trackers ?? [];
  if (list.some(tracker => tracker.name === WEIGHT_TRACKER_NAME)) return list;
  return [createWeightTracker(weight ?? 0), ...list].slice(0, MAX_CUSTOM_TRACKERS);
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
  customTrackers: AnyTracker[]
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
    customTrackers: [createWeightTracker(0)],
    customWorkouts: [],
    workoutHistory: {}, 

}


interface UserStoreState {
  userData: userData;
  hasFetchedInitialData: boolean;
  setCustomTracker: (newTracker: AnyTracker) => void
  removeCustomTracker: (index: number) => void
  setUserData: (newData: Partial<userData>) => void;
  fetchUser: () => Promise<void>;
  syncUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const useUserStore = create<UserStoreState>()((set, get) => ({
  userData: INITIAL_PLAYER_STATE,

  hasFetchedInitialData: false,

  setCustomTracker: (newTracker: AnyTracker) =>
    set((state) => {
      if (state.userData.customTrackers.length >= MAX_CUSTOM_TRACKERS) return state;
      return {
        userData: {
          ...state.userData,
          customTrackers: [...state.userData.customTrackers, newTracker]
        }
      };
    }),

  removeCustomTracker: (index: number) =>
    set((state) => ({
      userData: {
        ...state.userData,
        customTrackers: state.userData.customTrackers.filter((_, i) => i !== index)
      }
    })),

  setUserData: (newData: Partial<userData>) => 
    set((state) => ({
      userData: { ...state.userData, ...newData }
    })),

  fetchUser: async () => {
      set((state) => ({
          userData: { ...state.userData, isLoading: true }
      }));

      try {
          const response = await fetch(`/api/user/me`, {
              credentials: 'include',
          });

          if (!response.ok) throw new Error('Not authenticated');

          const data = await response.json();

          console.log('System: User Data Loaded', data);

          set((state) => ({
              hasFetchedInitialData: true,
              userData: {
                  ...state.userData,
                  ...data,
                  customTrackers: withWeightTracker(data.customTrackers, data.userInfo?.weight),
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
      await fetch(`/api/user/me`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      console.log('Done');
    } catch (error) {
      console.error('System Error: Sync Failed', error);
    }
  },
  logout: async () => {
        try {
            await fetch(`/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('System Error: Logout request failed', error);
        }
        set({ hasFetchedInitialData: false, userData: INITIAL_PLAYER_STATE });
  },

}));

export default useUserStore;