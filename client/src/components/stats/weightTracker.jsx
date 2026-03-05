import { LineChart } from '@mui/x-charts';
import { useState, useEffect } from 'react';
import useUserStore from '../../store/usePlayerStore';
import getAvarage from '../../utils/weightTrackerFunctions';
import evaluateReset from '../../utils/evaluateReset';


export default function WeightTracker({ weightHistory = [] }) {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);
    const syncUser = useUserStore((state) => state.syncUser);

    const [isTypingWeight, setIsTypingWeight] = useState(false);
    const [tempWeight, setTempWeight] = useState(userData.weight || 0);
    const [emptyHistory, setEmptyHistory] = useState(true);
    const [avgWeight, setAvgWeight] = useState(0);

    useEffect(() => {
        if (weightHistory && weightHistory.length > 0) {
            setEmptyHistory(false);
            const newAvgWeight = getAvarage(weightHistory);
            setAvgWeight(newAvgWeight);
        } else {
            setEmptyHistory(true);
        }
    }, [weightHistory]);
    
    const data = emptyHistory ? [] : weightHistory.map(entry => ({
        weight: Number(entry.weight),
        date: new Date(entry.date).toLocaleDateString(),
    }));

    const xData = data.map(d => d.date);
    const yData = data.map(d => d.weight);

    const minWeight = emptyHistory ? 0 : Math.min(...yData) - 2;
    const maxWeight = emptyHistory ? 100 : Math.max(...yData) + 2;
    const currentWeight = emptyHistory ? '--' : yData[yData.length - 1];

    const handleSaveWeight = () => {
        const val = evaluateReset(weightHistory);
        console.log('val: ',val);
        if (!val || !val.newDate) return;

        if (val.reset) {
            setUserData({ 
                id: Date.now(),
                weight: Number(tempWeight), 
                weightHistory: [...userData.weightHistory, { weight: Number(tempWeight), date: new Date() }] 
            });
        } else if (!val.reset) {
            const filteredHistory = weightHistory.filter(obj => obj.id !== val.lastDateId);

            setUserData({
                id: Date.now(),
                weight: Number(tempWeight),
                weightHistory: [...filteredHistory, {id: Date.now(), weight: Number(tempWeight), date: val.newDate }]
            });
        }


        syncUser();
        setIsTypingWeight(false);
    };

    return (
        <>
        <div className="weight-tracker-card generic-border">
            
            <div className="weight-main-row">
                
                <div className="weight-info-col">
                    <h4 className="weight-title">WEIGHT</h4>
                    <h2 className="weight-value">{currentWeight} {emptyHistory ? '' : 'kg'}</h2>
                    
                    {!isTypingWeight ? (
                        <button className="generic-btn" onClick={() => setIsTypingWeight(true)}>
                            Update
                        </button>
                    ) : (
                        <div className="weight-modal">
                            <div className="modal-header">
                                <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>New weight</span>
                                <button className="btn-close" onClick={() => setIsTypingWeight(false)}>X</button>
                            </div>
                            <input 
                                type="number" 
                                value={tempWeight} 
                                onChange={(e) => setTempWeight(e.target.value)} 
                                className="weight-input"
                            />
                            <button className="generic-btn" onClick={handleSaveWeight}>Save</button>
                        </div>
                    )}
                </div>

                <div className="weight-chart-col">
                    {emptyHistory ? (
                        <div className="empty-chart-placeholder">
                            <p>No data yet...</p>
                        </div>
                    ) : (
                        <LineChart
                            height={160} 
                            xAxis={[{ 
                                data: xData, 
                                scaleType: 'point', 
                                tickLabelStyle: { fill: 'var(--cyan)', fontFamily: 'monospace', fontSize: 10 } 
                            }]}
                            yAxis={[{
                                min: minWeight,
                                max: maxWeight,
                                tickLabelStyle: { display: 'none' } 
                            }]}
                            series={[{
                                data: yData,
                                color: 'var(--primary)', 
                                area: true,     
                                showMark: true,   
                            }]}
                            margin={{ left: 0, right: 10, top: 10, bottom: 25 }} 
                            sx={{
                                '& .MuiChartsAxis-directionY .MuiChartsAxis-line': { display: 'none' },
                                '& .MuiChartsAxis-directionY .MuiChartsAxis-tick': { display: 'none' },
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="weight-bottom-row">
                <p>Week Average: <span>{Math.round(avgWeight)} kg</span></p>
                <button className='generic-btn' onClick={() => window.alert('Not yet')}>History</button>
            </div>
            
        </div>
        </>
    );
}