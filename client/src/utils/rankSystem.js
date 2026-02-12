
export const calculatePlayerStats = (userEvaluation) => {
    

    let totalXP = 0;

    // 1. PUSHUPS CALCULATION
    if (userEvaluation?.pushups) {
        const { tierIndex, maxReps } = userEvaluation.pushups;
        
        const tierXP = (tierIndex || 0) * 100; 
        const repXP = (maxReps || 0) * 2; 
        totalXP += tierXP + repXP;
    }

    // 2. SQUATS CALCULATION
    if (userEvaluation?.squats) {
        const { tierIndex, maxReps } = userEvaluation.squats;
        const tierXP = (tierIndex || 0) * 100;
        const repXP = (maxReps || 0) * 5; 
        totalXP += tierXP + repXP;
    }

    // 3. PLANK / RUN (Do budoucna)
    // ...

    return totalXP;
};

export const getRankFromXP = (xp) => {
    if (xp < 100) return { rank: "E-Rank", title: "Civilian", color: "#808080" }; 
    if (xp < 300) return { rank: "D-Rank", title: "Novice Hunter", color: "#ffffff" }; 
    if (xp < 600) return { rank: "C-Rank", title: "Experienced", color: "#2ecc71" }; 
    if (xp < 1000) return { rank: "B-Rank", title: "Elite", color: "#3498db" }; 
    if (xp < 1800) return { rank: "A-Rank", title: "Master", color: "#9b59b6" }; 
    if (xp < 3000) return { rank: "S-Rank", title: "Monarch", color: "#f1c40f" }; 
    
    return { rank: "National Level", title: "Ruler", color: "#e74c3c" }; 
};