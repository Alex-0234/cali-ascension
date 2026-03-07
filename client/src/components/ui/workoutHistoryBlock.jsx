import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";
import { EXERCISE_DB } from "../../data/exercise_db";
import CloseButton from "./closeBtn";

import styles from '../../styles/history.module.css'

export default function WorkoutHistoryBlock() {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);
    const setHistory = useUIStore((state) => state.setHistory);

    const workoutHistory = userData.workoutHistory || [];

    const handleExerciseDelete = (indexToRemove) => {
        const filteredHistory = workoutHistory.filter((_, index) => index !== indexToRemove);
        setUserData({
            ...userData,
            workoutHistory: filteredHistory
        });
    };

    return (
        <section className={styles.workoutBlock}>
            
            <div className={styles.headerRow}>
                <h3>Workout History</h3>
                <CloseButton onClose={() => setHistory({open: false, type: 'none'})} />
            </div>

            <div className={styles.wrapper}>
                {workoutHistory.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#64748b', marginTop: '2rem'}}>
                        No workout history available yet.
                    </p>
                ) : (
                    workoutHistory.map((entry, index) => (
                        <div key={index} className={styles.workoutEntry}>
                            
                            <div className={styles.deleteBtn} onClick={() => handleExerciseDelete(index)}>
                                DELETE
                            </div>
                            
                            <div className={styles.entryStats}>
                                <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                                <p><strong>Exercise:</strong> {EXERCISE_DB[entry.exerciseID]?.name || "Unknown"}</p>
                            </div>
                            
                            <div className={styles.entryDivider}></div>
                            
                            <div>
                                <p className={styles.totalReps}>
                                    <strong>Total Reps:</strong> {entry.totalReps}
                                </p>
                                <p style={{margin: '0 0 0.5rem 0'}}><strong>Sets:</strong></p>
                                
                                <ul className={styles.setsList}>
                                    {entry.sets.map((set, setIndex) => (
                                        <li key={setIndex}>
                                            Set {setIndex + 1}: {set.reps} reps 
                                            {set.extraWeight > 0 ? ` (+ ${set.extraWeight} kg)` : ''}
                                        </li>   
                                    ))}
                                </ul>
                            </div>
                            
                        </div>
                    ))
                )}
            </div>
            
        </section>
    );
}