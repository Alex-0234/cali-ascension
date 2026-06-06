import { create } from 'zustand';

const useTerminalStore = create((set, get) => ({

    terminalData: {
        isAskingQuesting: false,
        isSuggesting: false,
        isHinting: false,
    },
    
    setTerminalData: (newData) => {
        set((state) => ({
            terminalData: {...state.terminalData, ...newData}
        }))
    },

}))

export default useTerminalStore;