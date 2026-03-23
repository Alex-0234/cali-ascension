import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";
import { EXERCISE_DB } from "../../data/exercise_db";
import { useNavigate } from "react-router";
import CloseButton from "./closeBtn";

import styles from '../../styles/history.module.css'


export default function WorkoutHistoryBlock() {
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);

    const workoutHistory = userData.workoutHistory || {};
    const safeWorkoutHistory = Array.isArray(workoutHistory) ? {} : workoutHistory;

    const validDates = Object.keys(safeWorkoutHistory)
        .filter(date => date.split('-').length === 3)
        .sort((a, b) => new Date(b) - new Date(a));

    const formatDuration = (seconds) => {
        if (!seconds) return '0m';
        const m = Math.floor(seconds / 60);
        return `${m}m`;
    };

    return (
        <section className={styles.workoutBlock}>
            
            <div className={styles.headerRow}>
                <div className={styles.titleWrapper}>
                    <h3 className={styles.mainTitle}>System.Log_History</h3>
                </div>
                <CloseButton onClose={() => navigate('/status')} />
            </div>

            <div className={styles.wrapper}>
                {validDates.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>Ø</span>
                        <p>No transmission logs available in database.</p>
                    </div>
                ) : (
                    validDates.map((date) => {
                        const dayData = safeWorkoutHistory[date];
                        const isWorkout = dayData.status === 'workout';

                        return (
                            <div key={date} className={styles.workoutEntry}>
                                
                                <div className={styles.entryHeader}>
                                    <h2 className={styles.dateHeading}>{date}</h2>
                                    <div className={styles.badgesWrapper}>
                                        <span className={`${styles.statusBadge} ${styles[dayData.status] || styles.workout}`}>
                                            {dayData.status?.toUpperCase() || 'WORKOUT'}
                                        </span>
                                        {dayData.duration > 0 && (
                                            <span className={styles.durationBadge}>
                                                ⏱ {formatDuration(dayData.duration)}
                                            </span>
                                            
                                        )}
                                    </div>
                                </div>

                                {isWorkout ? (
                                    <>
                                        <div className={styles.statsRow}>
                                            <div className={styles.statBox}>
                                                <span className={styles.statLabel}>Total Vol</span>
                                                <span className={styles.statValue}>{dayData.totalVolume}</span>
                                            </div>
                                            <div className={styles.statBox}>
                                                <span className={styles.statLabel}>Total Sets</span>
                                                <span className={styles.statValue}>{dayData.totalSets}</span>
                                            </div>
                                        </div>

                                        <div className={styles.entryDivider}></div>

                                        <div className={styles.exercisesWrapper}>
                                            <p className={styles.subHeading}>Executed Protocols:</p>
                                            
                                            {dayData.exercises && Object.keys(dayData.exercises).map((exId) => {
                                                const exercise = dayData.exercises[exId];
                                                const exerciseName = EXERCISE_DB[exId]?.name || exId;
                                                const unit = EXERCISE_DB[exId]?.unit || 'reps';

                                                return (
                                                    <div key={exId} className={styles.exerciseCard}>
                                                        <h4 className={styles.exerciseName}>› {exerciseName}</h4>
                                                        <div className={styles.setsGrid}>
                                                            {exercise.sets.map((set, setIndex) => (
                                                                <div key={`${exId}-${setIndex}`} className={styles.setTag}>
                                                                    <span className={styles.setNum}>S{setIndex + 1}:</span> 
                                                                    <span className={styles.setVal}>
                                                                        {set.reps} {unit}
                                                                        {set.extraWeight > 0 ? ` (+${set.extraWeight}kg)` : ''}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.recoveryBox}>
                                        <p>Protocol suspended. Body in recovery/maintenance mode.</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}