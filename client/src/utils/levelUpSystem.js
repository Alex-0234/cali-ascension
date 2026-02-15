
export function getXpNeededForLevel(lvl) {
    const BASE_XP_NEEDED = 10;
    const output = BASE_XP_NEEDED + ((BASE_XP_NEEDED * 1.5) * lvl);
    return output;
}



export default function levelUp(currentLevel, totalXp) {
    
    let levelUps = 0;
    let currentXp = totalXp;
    let tempLevel = currentLevel; 

    
    while (currentXp >= getXpNeededForLevel(tempLevel)) {
        currentXp -= getXpNeededForLevel(tempLevel); 
        
        levelUps += 1;         
        tempLevel += 1; 
    }

    return { 
        xp: currentXp,
        levelUps: levelUps 
    };
}