import useUserStore from "../../store/usePlayerStore";
import { EXERCISE_DB } from "../../data/exercise_db";

export default function WorkoutHistoryBlock({ onClose }) {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);
    const workoutHistory = userData.workoutHistory || [];


    const handleExerciseDelete = (entry) => {
        const filteredHistory = workoutHistory.filter(obj => obj !== entry);
        console.log(filteredHistory);
        setUserData({
            workoutHistory: [...filteredHistory]
        })
    }

    return (
        <div className="workout-history-block generic-border">
                <h3>Workout History</h3>
                <div className="btn-close" onClick={onClose}>x</div>

                <div style={{width: 'calc(100% - 2rem)', height: '100%', overflow: 'auto'}}>
                {workoutHistory.length === 0 ? (
                    <p>No workout history available.</p>
                ) : (
                    
                    workoutHistory.map((entry, index) => (

                        <div key={index} className="workout-entry generic-border" style={{position: 'relative'}}>
                                <div style={{position: 'absolute', top: '1rem', right: '1rem', color: 'red'}} onClick={() => handleExerciseDelete(entry)}>Delete</div>

                            <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                            <p><strong>Exercise:</strong> {EXERCISE_DB[entry.exerciseID].name}</p>
                            <p><strong>Total Reps:</strong> {entry.totalReps}</p>
                            <p><strong>Sets:</strong></p>
                            <ul>
                                {entry.sets.map((set, setIndex) => (
                                    <li key={setIndex}>
                                        Reps: {set.reps}, Extra Weight: {set.extraWeight} kg
                                    </li>   
                                ))}
                            </ul>
                        </div>
                    
                    ))
                )}
                </div>
        </div>
    );
}