

const filterWorkout = (workoutHistory, filterBy) => {
    if (!workoutHistory || workoutHistory.length === 0) return [];

    let targetDay = 'all';
    let exercisePrefix = 'all';

    if (filterBy.day) {
        switch (filterBy.day) {
            case 'today':
                targetDay = new Date().toISOString().split('T')[0];
                break;
            case 'yesterday':
                const yest = new Date();
                yest.setDate(yest.getDate() - 1);
                targetDay = yest.toISOString().split('T')[0];
                break;
            case 'all':
                targetDay = 'all';
                break;
            default:
                targetDay = filterBy.day; 
                break;
        }
    }

    if (filterBy.exercise) {
        switch (filterBy.exercise) {
            case 'pushups': exercisePrefix = 'pushup'; break;
            case 'pullups': exercisePrefix = 'pullup'; break;
            case 'squats': exercisePrefix = 'squat'; break;
            case 'core': exercisePrefix = 'core'; break;
            case 'all': exercisePrefix = 'all'; break;
            default: exercisePrefix = filterBy.exercise; break;
        }
    }

    let filteredHistory = workoutHistory;

    if (targetDay !== 'all') {
        filteredHistory = filteredHistory.filter(workout => workout.date.split('T')[0] === targetDay);
    }

    if (exercisePrefix !== 'all') {
        filteredHistory = filteredHistory.filter(workout => workout.exerciseID.startsWith(exercisePrefix));
    }

    return filteredHistory;
}

export default filterWorkout;