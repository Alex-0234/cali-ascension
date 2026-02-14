import { EXERCISE_DB } from "../data/exercise_db";

export const calculatePlayerStats = (userEvaluation) => {
    

    let totalEP = 0;

    // 1. PUSHUPS CALCULATION
    if (userEvaluation?.pushups) {
        const { variationID, maxReps } = userEvaluation.pushups;
        const tierIndex = EXERCISE_DB[variationID].tier;
        const tierEP = (tierIndex || 0) * 100; 
        const repEP = (maxReps || 0) * 6; 
        totalEP += tierEP + repEP;
    }

    // 2. SQUATS CALCULATION
    if (userEvaluation?.squats) {
        const { variationID, maxReps } = userEvaluation.squats;
        const tierIndex = EXERCISE_DB[variationID].tier;
        const tierEP = (tierIndex || 0) * 100;
        const repEP = (maxReps || 0) * 6; 
        totalEP += tierEP + repEP;
    }
    // 3. PULLUPS CALCULATION
    if (userEvaluation?.pullups) {
        const { variationID, maxReps } = userEvaluation.pullups;
        const tierIndex = EXERCISE_DB[variationID].tier;
        const tierEP = (tierIndex || 0) * 100;
        const repEP = (maxReps || 0) * 6; 
        totalEP += tierEP + repEP;
    }

    // 3. PLANK / RUN (Do budoucna)
    // ...

    return totalEP;
};

export const getRankFromXP = (EP) => {
    if (EP < 100) return { rank: "E-Rank", title: "Civilian", color: "#808080" }; 
    if (EP < 300) return { rank: "D-Rank", title: "Novice Hunter", color: "#ffffff" }; 
    if (EP < 600) return { rank: "C-Rank", title: "Experienced", color: "#2ecc71" }; 
    if (EP < 1000) return { rank: "B-Rank", title: "Elite", color: "#3498db" }; 
    if (EP < 1800) return { rank: "A-Rank", title: "Master", color: "#9b59b6" }; 
    if (EP < 3000) return { rank: "S-Ran k", title: "Monarch", color: "#f1c40f" }; 
    
    return { rank: "National Level", title: "Ruler", color: "#e74c3c" }; 
};