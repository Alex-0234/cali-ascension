import useUserStore from "../../store/usePlayerStore";
import { EXERCISE_DB } from "../../data/exercise_db";

export default function WorkoutHistoryBlock() {
    const userData = useUserStore((state) => state.userData);
    const workoutHistory = userData.workoutHistory || [];

    return (
        <div className="workout-history-block ">
            <h3>Workout History</h3>
            {workoutHistory.length === 0 ? (
                <p>No workout history available.</p>
            ) : (
                workoutHistory.map((entry, index) => (
                    <div key={index} className="workout-entry generic-border">
                        {console.log('Workout Entry:', entry.exerciseID, entry.date, entry.sets)}
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
    );
}