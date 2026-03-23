import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";
import { EXERCISE_DB } from "../../data/exercise_db";
import CloseButton from "./closeBtn";

import styles from '../../styles/history.module.css'

export default function WorkoutHistoryBlock() {
    const userData = useUserStore((state) => state.userData);
    const setHistory = useUIStore((state) => state.setHistory);

    const workoutHistory = userData.workoutHistory || [];
    let safeWorkoutHistory = Array.isArray(workoutHistory) ? {} : workoutHistory;

    let tempHistory = {};
    let numErr = 0;
    Object.keys(safeWorkoutHistory).map(date => {
        if (date.split('-').length !== 3) {
            numErr += 1;
        }
        else {
            tempHistory[date] = safeWorkoutHistory[date];
        }
    })
    safeWorkoutHistory = tempHistory;
    console.log(safeWorkoutHistory)

    return (
        <section className={styles.workoutBlock}>
            
            <div className={styles.headerRow}>
                <h3>Workout History</h3>
                <CloseButton onClose={() => setHistory({open: false, type: 'none'})} />
            </div>

            <div className={styles.wrapper}>
                {safeWorkoutHistory.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#64748b', marginTop: '2rem'}}>
                        No workout history available yet.
                    </p>
                ) : (
                    Object.keys(safeWorkoutHistory).map((date, index) => (
                        <div key={index} className={styles.workoutEntry}>
                            <div>
                                <h2>{date}</h2>
                                <p className={styles.totalReps}>
                                    <strong>Total Reps:</strong> {workoutHistory[date].totalVolume} <br/>
                                    <strong>Total Sets:</strong> {workoutHistory[date].totalSets}
                                </p>
                            </div>
                            
                            <div className={styles.entryDivider}></div>
                            
                            <div>
                                
                                <p style={{margin: '0 0 0.5rem 0'}}><strong>Sets:</strong></p>
                                
                               <ul className={styles.setsList}>
                                    {console.log(safeWorkoutHistory[date])}
                                    { Object.keys(safeWorkoutHistory[date].exercises).map((ex, exIndex) => (
                                        <div key={exIndex}> 
                                        <h2>{ex}</h2>
                                        <ul>
                                            {safeWorkoutHistory[date].exercises[ex].sets.map((set, setIndex) => {
                                            return (
                                            <li key={`${ex}-${setIndex}`}>
                                                Set {setIndex + 1}: {set.reps} reps 
                                                {set.extraWeight > 0 ? ` (+ ${set.extraWeight} kg)` : ''}
                                            </li>  
                                            )
                                            })}
                                          
                                        </ul>

                                        </div>
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