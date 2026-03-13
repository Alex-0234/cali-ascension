

export const setsPerGroup = (workoutHistory, startOnMonday = true) => { 
    const seriesData = [
        { id: 'push', label: 'Push', data: [0, 0, 0, 0], color: '#ef4444' },
        { id: 'pull', label: 'Pull', data: [0, 0, 0, 0], color: '#00e5ff' },
        { id: 'squat', label: 'Legs', data: [0, 0, 0, 0], color: '#10b981' },
        { id: 'core', label: 'Core', data: [0, 0, 0, 0], color: '#f59e0b' }
    ];

    if (Object.keys(workoutHistory).length < 1) {
        return seriesData; 
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); 
    
    let daysToSubtract = 0;
    if (startOnMonday) {
        daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    } else {
        daysToSubtract = dayOfWeek;
    }

    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - daysToSubtract);

    Object.keys(workoutHistory).forEach(day => {
        const entryDate = new Date(day);
        entryDate.setHours(0, 0, 0, 0);

        const diffTime = entryDate.getTime() - startOfCurrentWeek.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let weekIndex = null;
        
        if (diffDays >= 0 && diffDays < 7) {
            weekIndex = 3; 
        } else if (diffDays >= -7 && diffDays < 0) {
            weekIndex = 2;
        } else if (diffDays >= -14 && diffDays < -7) {
            weekIndex = 1; 
        } else if (diffDays >= -21 && diffDays < -14) {
            weekIndex = 0; 
        }

        if (weekIndex !== null) {
            

            workoutHistory[day].exercises.forEach(exercise => {
                const exerciseId = exercise.exerciseID || "";
                const amountOfSets = workoutHistory[day].totalSets;

                if (exerciseId.startsWith('pushup')) {
                    seriesData[0].data[weekIndex] += amountOfSets;
                } else if (exerciseId.startsWith('pullup')) {
                    seriesData[1].data[weekIndex] += amountOfSets;
                } else if (exerciseId.startsWith('squat')) {
                    seriesData[2].data[weekIndex] += amountOfSets;
                } else if (exerciseId.startsWith('core')) {
                    seriesData[3].data[weekIndex] += amountOfSets;
                }
            })
        }
            
    });

    return seriesData;
}