import { useNavigate } from 'react-router';
import { BarChart } from '@mui/x-charts';
import { setsPerGroup } from '../../utils/setsPerGroup';

import useUserStore from "../../store/usePlayerStore";

import SystemButton from "../ui/systemBtn";
import ExerciseBlock from '../ui/exerciseBlock';


import styles from '../../styles/workout.module.css'


export default function StatusReport() {
    const navigate = useNavigate()

    const workoutHistory = useUserStore((state) => state.userData.workoutHistory);
    const data =  setsPerGroup(workoutHistory);

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

            <SystemButton text='History' onClick={() => navigate('/workout-history')} />

        </div>

        </>
    );
}