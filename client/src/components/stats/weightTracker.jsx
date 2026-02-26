import { LineChart } from '@mui/x-charts';
import { useState } from 'react';
import useUserStore from '../../store/usePlayerStore';


export default function WeightTracker({ weightHistory = [] }) {
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);
  const syncUser = useUserStore((state) => state.syncUser);

      const [isTypingWeight, setIsTypingWeight] = useState(false);
      const [tempWeight, setTempWeight] = useState(userData.weight);

    if (!weightHistory || weightHistory.length === 0) {
        return (
            <div className="weight-tracker-empty">
                <h4>Weight</h4>
                <p>No weight data yet...</p>
            </div>
        );
    }

    const data = weightHistory.map(entry => ({
        weight: entry.weight,
        date: new Date(entry.date).toLocaleDateString(),
    }));

    const xData = data.map(d => d.date);
    const yData = data.map(d => d.weight);

    const minWeight = Math.min(...yData) - 2;
    const maxWeight = Math.max(...yData) + 2;
    const currentWeight = yData[yData.length - 1];

    return (
        <div className="weight-tracker-card">
            <div className="weight-tracker-header">
                <h4>Weight</h4>
                <h2>{currentWeight} kg</h2>
                {!isTypingWeight && (<button onClick={() => setIsTypingWeight(!isTypingWeight)}>Update</button>)}
                {isTypingWeight && (
                    <div className="weight-modal">
                        <h3>Enter your weight</h3>
                        <div className="btn-close" onClick={() => setIsTypingWeight(false)}>X</div>
                        <input type="number" value={tempWeight} onChange={(e) => setTempWeight(e.target.value)} />
                        <button onClick={() => {
                            setUserData({ weight: tempWeight , weightHistory: [...userData.weightHistory, { weight: tempWeight, date: new Date() }] });
                            syncUser();
                            setIsTypingWeight(false);
                        }}
                        >Save</button>
                    </div>
                )}
            </div>

            <div className="weight-tracker-chart-wrapper">
                <LineChart
                    xAxis={[{ 
                        data: xData, 
                        scaleType: 'point', 
                        tickLabelStyle: { fill: '#6b7280', fontFamily: 'monospace', fontSize: 10 } 
                    }]}
                    
                    yAxis={[{
                        min: minWeight,
                        max: maxWeight,
                        tickLabelStyle: { display: 'none' }
                    }]}
                    
                    series={[
                        {
                            data: yData,
                            color: '#3b82f6', 
                            area: true,     
                            showMark: true,   
                        },
                    ]}
                    
                    margin={{ left: 0, right: 10, top: 10, bottom: 25 }} 
                    className="weight-tracker-linechart"
                />
            </div>
        </div>
    );
}