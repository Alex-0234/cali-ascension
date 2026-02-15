import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Přidáno pro odchod
import { getRankFromXP, calculatePlayerEP } from '../../utils/rankSystem';
import useUserStore from '../../store/usePlayerStore';

export default function Awakening() {
    const navigate = useNavigate();
    const [stage, setStage] = useState('calculating'); 
    
    const setUserData = useUserStore((state) => state.setUserData);
    const userData = useUserStore((state) => state.userData);
    
    const [finalResult, setFinalResult] = useState(null);

    useEffect(() => {

        const xp = calculatePlayerEP(userData.userEvaluation);
        const result = getRankFromXP(xp);

        console.log("Awakening Results:", { xp, result });

        setFinalResult(result);

        const timer = setTimeout(() => {
            
            setUserData({ 
                ...userData,
                rank: result.rank,
                title: result.title,
                level: 1,             
                isConfigured: true,
            });

            setStage('awakening');
        }, 2500);

        return () => clearTimeout(timer);
    }, []); 


    const handleEnterSystem = () => {
        navigate('/');
    };

    return (
        <div className="rank-screen">

            {stage === 'calculating' && (
                <div className="system-loading">
                    <div className="spinner"></div>
                    <h2>SYSTEM PROCESSING...</h2>
                    <p className="blinking-text">Analyzing Muscle Density</p>
                    <p className="blinking-text" style={{animationDelay: '0.5s'}}>Calculating Mana Capacity</p>
                </div>
            )}

            {stage === 'awakening' && finalResult && (
                <div className="rank-reveal fade-in">
                    <h2>CONGRATULATIONS</h2>
                    <p>You have awakened as</p>
                    
                    <div 
                        className="rank-card"
                        style={{ 
                            borderColor: finalResult.color,
                            boxShadow: `0 0 30px ${finalResult.color}`
                        }}
                    >
                        <h1 style={{ color: finalResult.color }}>
                            {finalResult.rank}
                        </h1>
                        <span className="rank-title">{finalResult.title}</span>
                    </div>

                    <button className="btn-enter" onClick={handleEnterSystem}>
                        ENTER SYSTEM
                    </button>
                </div>
            )}
        </div>
    );
}