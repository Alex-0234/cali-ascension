import { create } from 'zustand';

const useTerminalStore = create((set) => ({
  isTyping: false,
  isAsking: false,
  isExplaining: false,

  setScenario: (newScenario) => set({ 
    currentScenario: newScenario, 
    isTyping: true 
  }),

  Typing: (bool) => set({ isTyping: bool }),
  
  setAsking: (bool) => set({ isAsking: bool }),
  setExplaining: (bool) => set({ isExplaining: bool }),
}));

export default useTerminalStore;