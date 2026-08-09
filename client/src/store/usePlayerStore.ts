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

export type TrackerValue = number | string | boolean

export interface TrackerEntry<T> {
  value: T
  loggedAt: string
  note?: string
}

export interface Tracker<T> {
  createdAt: Date
  name: string
  tracking: T
  history: TrackerEntry<T>[]
}

export type AnyTracker = Tracker<number> | Tracker<string> | Tracker<boolean>

export const MAX_CUSTOM_TRACKERS = 5

/** Entries older than this fall off the log, so the stored blob stays bounded. */
const MAX_TRACKER_HISTORY = 365

export const WEIGHT_TRACKER_NAME = 'Weight'

/** Local calendar day of a date — the unit a tracker can be logged once per. */
export function dayKey(date: Date | string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${parsed.getFullYear()}-${month}-${day}`;
}

export function latestEntry(tracker: AnyTracker): TrackerEntry<TrackerValue> | null {
  return tracker.history.length > 0 ? tracker.history[tracker.history.length - 1] : null;
}

/** True once today's value is in — resets on its own at local midnight. */
export function isLoggedToday(tracker: AnyTracker): boolean {
  const latest = latestEntry(tracker);
  return latest !== null && dayKey(latest.loggedAt) === dayKey(new Date());
}

export function createTracker(name: string, value: TrackerValue): AnyTracker {
  const createdAt = new Date();
  return {
    createdAt,
    name,
    tracking: value,
    history: [{ value, loggedAt: createdAt.toISOString() }],
  } as AnyTracker;
}

export function createWeightTracker(startingWeight: number): Tracker<number> {
  return createTracker(WEIGHT_TRACKER_NAME, startingWeight) as Tracker<number>;
}

/** Brings trackers saved before history held dated entries onto the current shape. */
function normalizeTracker(tracker: AnyTracker): AnyTracker {
  const createdAt = tracker.createdAt ? new Date(tracker.createdAt) : new Date();
  const raw: unknown[] = Array.isArray(tracker.history) ? tracker.history : [];
  const isEntry = (item: unknown): item is TrackerEntry<TrackerValue> =>
    item !== null && typeof item === 'object' && 'value' in item;

  const history: TrackerEntry<TrackerValue>[] = raw.map(item =>
    isEntry(item)
      ? { ...item, loggedAt: item.loggedAt ?? createdAt.toISOString() }
      : { value: item as TrackerValue, loggedAt: createdAt.toISOString() }
  );

  // Legacy trackers kept the live value outside history — fold it back in.
  if (raw.length === 0 || raw.some(item => !isEntry(item))) {
    history.push({ value: tracker.tracking, loggedAt: createdAt.toISOString() });
  }

  return {
    createdAt,
    name: tracker.name,
    tracking: history[history.length - 1].value,
    history: history.slice(-MAX_TRACKER_HISTORY),
  } as AnyTracker;
}

function withWeightTracker(trackers: AnyTracker[] | undefined, weight: number | null | undefined): AnyTracker[] {
  const list = (trackers ?? []).map(normalizeTracker);
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
  logCustomTracker: (index: number, value: TrackerValue, note?: string) => void
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

  logCustomTracker: (index: number, value: TrackerValue, note?: string) =>
    set((state) => {
      const tracker = state.userData.customTrackers[index];
      if (!tracker) return state;

      const now = new Date();
      const trimmedNote = note?.trim();
      const entry: TrackerEntry<TrackerValue> = {
        value,
        loggedAt: now.toISOString(),
        ...(trimmedNote ? { note: trimmedNote } : {}),
      };

      // One entry per calendar day: re-logging before midnight corrects today's.
      const history = [...tracker.history];
      if (isLoggedToday(tracker)) history[history.length - 1] = entry;
      else history.push(entry);

      const updated = {
        ...tracker,
        tracking: value,
        history: history.slice(-MAX_TRACKER_HISTORY),
      } as AnyTracker;

      return {
        userData: {
          ...state.userData,
          customTrackers: state.userData.customTrackers.map((t, i) => (i === index ? updated : t)),
          userInfo: tracker.name === WEIGHT_TRACKER_NAME && typeof value === 'number'
            ? { ...state.userData.userInfo, weight: value }
            : state.userData.userInfo,
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