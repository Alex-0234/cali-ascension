import { useState } from 'react';
import calculateLevel from '../utils/levelUpSystem';

export default function useLevelUp() {
    const [levelChange, setLevelChange] = useState({ show: false, newLevels: 0, xpGain: 0 });

    const evaluate = (previousUserData, updatedUserData) => {
        const { totalXPEarned: prevTotalXP, level: previousLevel } = calculateLevel(previousUserData);
        const { level, currentLeftoverXP, totalXPEarned } = calculateLevel(updatedUserData);
        const gained = level - previousLevel;

        if (gained > 0) {
            setLevelChange({ show: true, newLevels: gained, xpGain: totalXPEarned - prevTotalXP });
        }

        return { level, xp: currentLeftoverXP, gained };
    };

    const acknowledge = () => setLevelChange({ show: false, newLevels: 0, xpGain: 0 });

    return { levelChange, evaluate, acknowledge };
}