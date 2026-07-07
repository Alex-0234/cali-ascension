import { useState } from 'react';
import calculateLevel from '../utils/levelUpSystem';

export default function useLevelUp() {
    const [levelChange, setLevelChange] = useState({ show: false, newLevels: 0, xpGain: 0 });

    const evaluate = (previousLevel, updatedUserData) => {
        const { level, currentLeftoverXP, totalXPEarned } = calculateLevel(updatedUserData);
        const gained = level - previousLevel;

        if (gained > 0) {
            setLevelChange({ show: true, newLevels: gained, xpGain: totalXPEarned });
        }

        return { level, xp: currentLeftoverXP };
    };

    const acknowledge = () => setLevelChange({ show: false, newLevels: 0, xpGain: 0 });

    return { levelChange, evaluate, acknowledge };
}