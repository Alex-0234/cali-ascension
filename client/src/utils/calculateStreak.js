

export function calculateStreakFromObject(workoutHistory) {
    if (!workoutHistory || Object.keys(workoutHistory).length === 0) {
        return { current: 0, highest: 0 };
    }

    const sortedDates = Object.keys(workoutHistory).sort((a, b) => new Date(b) - new Date(a));

    let highestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const isStreakAlive = workoutHistory[today] || workoutHistory[yesterday];

    let lastDate = null;

    for (let i = sortedDates.length - 1; i >= 0; i--) {
        const dateString = sortedDates[i];
        const log = workoutHistory[dateString];

        const isLegitWorkout = log.type === 'workout' && (log.totalVolume >= 20);
        const isRestDay = log.type === 'rest';

        if (isLegitWorkout) {
            tempStreak++;
            highestStreak = Math.max(highestStreak, tempStreak);
        } /* else if (isRestDay) {

        } */ 
        else {
            tempStreak = 0;
        }
        lastDate = dateString;
    }

    currentStreak = isStreakAlive ? tempStreak : 0;

    return {
        current: currentStreak,
        highest: highestStreak
    };
}
