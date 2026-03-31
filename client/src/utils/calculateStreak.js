

export function calculateStreakFromObject(workoutHistory) {
    
    const safeWorkoutHistory = Array.isArray(workoutHistory) ? {} : workoutHistory;
    if (!safeWorkoutHistory || Object.keys(safeWorkoutHistory).length === 0) {
        return { current: 0, highest: 0 };
    }

    const sortedDates = Object.keys(safeWorkoutHistory).sort((a, b) => new Date(b) - new Date(a));

    let highestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const isStreakAlive = safeWorkoutHistory[today] || safeWorkoutHistory[yesterday];


    for (let i = sortedDates.length - 1; i >= 0; i--) {
        const dateString = sortedDates[i];
        const log = safeWorkoutHistory[dateString];

        if (!log.status && log.type) {
            log.status = log.type;
        }

        const isLegitWorkout = log.status === 'workout' && (log.totalVolume >= 12);
        const isRestDay = log.status === 'restday';

        if (isLegitWorkout || isRestDay) {
            tempStreak++;
            highestStreak = Math.max(highestStreak, tempStreak);
        } 

        else {
            tempStreak = 0;
        }
    }

    currentStreak = isStreakAlive ? tempStreak : 0;

    return {
        current: currentStreak,
        highest: highestStreak
    };
}
