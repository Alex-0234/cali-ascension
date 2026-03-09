

export default function calculateStreakFromHistory(workoutHistory) {

    if (!workoutHistory || workoutHistory.length === 0) {
        return { current: 0, highest: 0, lastActive: null };
    }

    const uniqueDatesRaw = workoutHistory.map(w => {
        const date = new Date(w.date);
        return date.toISOString().split('T')[0];
    });
    
    const uniqueDates = [...new Set(uniqueDatesRaw)].sort((a, b) => new Date(b) - new Date(a));

    if (uniqueDates.length === 0) {
        return { current: 0, highest: 0, lastActive: null };
    }

    let highestStreak = 1;
    let tempStreak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const previousDate = new Date(uniqueDates[i + 1]);

        const diffTime = Math.abs(currentDate - previousDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            tempStreak++;
            highestStreak = Math.max(highestStreak, tempStreak);
        } else {
            tempStreak = 1; 
        }
    }

    let currentStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const lastActiveDate = uniqueDates[0];

    if (lastActiveDate === today || lastActiveDate === yesterday) {
        currentStreak = 1;
        
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const currentDate = new Date(uniqueDates[i]);
            const previousDate = new Date(uniqueDates[i + 1]);
            
            const diffTime = Math.abs(currentDate - previousDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    return {
        current: currentStreak,
        highest: Math.max(highestStreak, currentStreak),
        lastActive: lastActiveDate
    };
}