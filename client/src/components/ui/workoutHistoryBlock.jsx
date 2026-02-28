import useUserStore from "../../store/usePlayerStore";

export default function WorkoutHistoryBlock() {
    const userData = useUserStore((state) => state.userData);
    const workoutHistory = userData.workoutHistory || [];

    return (
        <div className="workout-history-block generic-border">
            <h3>Workout History</h3>
            {workoutHistory.length === 0 ? (
                <p>No workout history available.</p>
            ) : (
                workoutHistory.map((entry, index) => (
                    <div key={index} className="workout-entry">
                        <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                        <p><strong>Exercise ID:</strong> {entry.exerciseId}</p>
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