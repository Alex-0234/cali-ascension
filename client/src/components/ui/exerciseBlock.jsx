import { EXERCISE_DB } from '../../data/exercise_db'

import styles from '../../styles/report.module.css'

const ExerciseBlock = ({workout, index}) => {

    return (
        <div key={index} className={styles.exerciseBlock}>
            <div className={styles.entryStats}>
                <p style={{margin: '0'}}><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
                <p style={{marginBottom: '0.5rem'}}><strong>Exercise:</strong> {EXERCISE_DB[workout.exerciseID]?.name || "Unknown"}</p>
                <p className={styles.totalReps}>
                    <strong>Total Reps:</strong> {workout.totalReps}
                </p>
            </div>
            
            <div className={styles.entryDivider}></div>
            
            <div className={styles.setsWrapper}>
                
                <p style={{margin: '0 0 0.5rem 0'}}><strong>Sets:</strong></p>
                
                <ul className={styles.setsList}>
                    {workout.sets.map((set, setIndex) => (
                        <li key={setIndex}>
                            Set {setIndex + 1}: {set.reps} reps 
                            {set.extraWeight > 0 ? ` (+ ${set.extraWeight} kg)` : ''}
                        </li>   
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default ExerciseBlock;