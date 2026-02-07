import { create } from 'zustand';

const useUserStore = create((set) => ({
  userData: {
    username: "",
    gender: "",
    age: null,
    weight: null,
    height: null,
    experienceLevel: {
      pushup: null,
      squat: null,
      plank: null,
    },
    skillProgress: {}
  },

  setUserData: (newData) => 
    set((state) => ({
      userData: { ...state.userData, ...newData }
    })),

  setExperience: (exercise, level) =>
    set((state) => ({
      userData: {
        ...state.userData,
        experienceLevel: {
          ...state.userData.experienceLevel,
          [exercise]: level
        }
      }
    })),

  resetUser: () => set({ userData: {  } }),

 setSkillProgress: (skillId, xpGained) =>
    set((state) => {
      const currentSkill = state.userData.skillProgress[skillId] || { xp: 0, proficiency: 0, learned: false };
      const newTotalXp = currentSkill.xp + xpGained;
        // can later make changes
      const newProficiency = Math.min(100, Math.floor(newTotalXp / 100));

      return {
        userData: {
          ...state.userData,
          skillProgress: {
            ...state.userData.skillProgress,
            [skillId]: {
              xp: newTotalXp,
              proficiency: newProficiency,
              learned: true,
            },
          },
        },
      };
    }),
}));

export default useUserStore;