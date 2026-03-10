import { useState } from 'react'

import { BarChart } from '@mui/x-charts';
import { setsPerGroup } from '../../utils/setsPerGroup';

import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";

import SystemButton from "../ui/systemBtn";

import filterWorkout from '../../utils/filterWorkout'

import styles from '../../styles/workout.module.css'


export default function StatusReport() {
    const { userData, syncUser } = useUserStore()
    const { setHistory } = useUIStore();

    const [currentFilter, setCurrentFilter] = useState({day: 'all', exercise: 'all' })

    const workoutHistory = useUserStore((state) => state.userData.workoutHistory);
    const filteredWorkoutHistory = filterWorkout(workoutHistory, currentFilter);
    const data =  setsPerGroup(workoutHistory);



    const handleProgramChange = (e) => {
        const newProgram = e.target.value;
        console.log("Selected program:", newProgram);
        useUserStore.setState((state) => ({
            userData: {
                ...state.userData,
                currentProgram: newProgram
            }
        }));
        syncUser();
    };

    return (
        <>
        <div className={styles.workoutCard}>
    
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>[ STATUS REPORT ]</h3>
                </div>

                <div className={styles.statusRow}>
                    <span className={styles.statusLabel}>Active Program:</span>
                    <span className={styles.statusValue}>
                        {userData.currentProgram ? `[ ${userData.currentProgram.toUpperCase()} ]` : "[ UNASSIGNED ]"}
                    </span>
                </div>

                <div className={styles.selectWrapper}>
                    <select 
                        className={styles.styledSelect}
                        value={userData.currentProgram} 
                        onChange={handleProgramChange}
                    >
                        <option value="">-- INITIALIZE PROTOCOL --</option>
                        <option value="Push/Pull/Legs">Push / Pull / Legs</option>
                        <option value="Upper/Lower">Upper / Lower Split</option>
                        <option value="Full Body">Full Body Mastery</option>
                    </select>

                    <div className={styles.selectIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>
                
           <div className='bar-chart-wrapper' style={{ width: '100%', height: '250px', paddingTop: '1rem', marginTop: '2rem', border: '2px solid var(--border-a)', borderRadius: 'var(--border-radius)' }}>
                <BarChart
                    series={data} 

                    xAxis={[{ 
                        fill: 'var(--text-main)',
                        data: ['3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week'], 
                        scaleType: 'band', 
                        tickLabelStyle: { fill: 'var(--text-main)', fontFamily: 'monospace', fontSize: 10 } 
                    }]}

                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'top', horizontal: 'middle' },
                            padding: 0,
                        }
                    }}

                    margin={{ top: 50, bottom: 30, left: 0, right: 10 }}

                    sx={{
                        '& .MuiChartsAxis-directionY .MuiChartsAxis-line': { display: 'none' },
                        '& .MuiChartsAxis-directionY .MuiChartsAxis-tick': { display: 'none' },
                        '& .MuiChartsAxis-directionY .MuiChartsAxis-tickLabel': { fill: '#64748b', fontFamily: 'monospace' },
                        '& .MuiChartsAxis-directionX .MuiChartsAxis-line': { stroke: '#334155' },
                        '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: '#334155' },
                    }}
                />
            </div>
            
            <div style={{ width: '100%', height: '250px', paddingTop: '1rem', marginTop: '2rem', border: '2px solid var(--border-a)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
                <div className={styles.cardHeader} style={{marginLeft: '1rem'}}>
                    <h3 className={styles.cardTitle}>[ TODAYS WORKOUT ]</h3>
                </div>
                <div style={{overflow: 'auto', height: '100%'}}>
                    <h1> Work in progress... </h1>
                    { filteredWorkoutHistory.map((workout, index) => {
                        return (
                            <div key={index}> 
                                <h2>{workout.exerciseID}</h2>
                                <p>{workout.date}</p>
                            </div>
                        )
                    })}
                </div>
                

            </div>

            
            <p>Working on this...</p>

            <SystemButton text='History' onClick={() => setHistory({open: true, type: 'exercise'})} />

        </div>

        </>
    );
}