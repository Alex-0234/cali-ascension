
import { BarChart } from '@mui/x-charts';

import useUserStore from "../../store/usePlayerStore";
import useUIStore from "../../store/useUIStore";

import SystemButton from "../ui/systemBtn";

export default function CurrentProgram() {
    const userData = useUserStore((state) => state.userData);
    const syncUser = useUserStore((state) => state.syncUser);
    const setHistory = useUIStore((state) => state.setHistory);

    /* const setsPerGroup =  */ // Add for the chart data

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
        <div className="current-program generic-border">
            <h3>Workout Window</h3>
            <h4>Current Program: [ {userData.currentProgram || "None Selected"} ]</h4>
            <select value={userData.currentProgram} onChange={handleProgramChange}>
                <option value="">Select a program</option>
                <option value="Push/Pull/Legs">Push/Pull/Legs Split</option>
                <option value="Upper/Lower">Upper/Lower Split</option>
                <option value="Bro Split">Bro Split</option>
                <option value="Full Body">Full Body Split</option>
            </select>
            

            <div className='bar-chart-wrapper'>
                <BarChart
                    series={[
                        { data: [35, 44, 24, 34] },
                        { data: [51, 6, 49, 30] },
                        { data: [15, 25, 30, 50] },
                        { data: [60, 50, 15, 25] },
                    ]}
                    height={150}
                    xAxis={[{ data: ['1. week', '2. week', '3. week', '4. week'], scaleType: 'band', color: 'var(--cyan)' }]}
                    margin={{ top: 40, bottom: 10, left: 0, right: 10 }}
                    sx={{
                            '& .MuiChartsAxis-directionY .MuiChartsAxis-line': { display: 'none' },
                            '& .MuiChartsAxis-directionY .MuiChartsAxis-tick': { display: 'none' },
                        }}
                />
            </div>

            
            <p>Working on this...</p>

            <SystemButton text='History' onClick={() => setHistory({open: true, type: 'exercise'})} />

        </div>

        </>
    );
}