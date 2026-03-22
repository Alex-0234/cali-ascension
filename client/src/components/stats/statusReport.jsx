import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts';
import { setsPerGroup } from '../../utils/setsPerGroup';
import { SPLIT_MODES } from '../../data/exercise_db';

import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";

import SystemButton from "../ui/systemBtn";
import ExerciseBlock from '../ui/exerciseBlock';


import styles from '../../styles/workout.module.css'


export default function StatusReport() {
    const { userData, setUserData, syncUser } = useUserStore()
    const { setHistory } = useUIStore();

    const workoutHistory = useUserStore((state) => state.userData.workoutHistory);
    const data =  setsPerGroup(workoutHistory);
    
    const [filteredWorkout, setFilteredWorkout] = useState('')

    useEffect(() => {
        setFilteredWorkout('');
    }, [workoutHistory])

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
            <p>Working on this...</p>

            <SystemButton text='History' onClick={() => setHistory({open: true, type: 'exercise'})} />

        </div>

        </>
    );
}