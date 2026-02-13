import { useState } from "react";
import useUserStore from "../../store/usePlayerStore";
import Hologram from "../../components/ui/Hologram"; // Pozor na velké písmeno v názvu souboru?
import { useNavigate } from 'react-router-dom';
import { PUSHUP_TIERS, SQUAT_TIERS, PULLUP_TIERS } from "../../data/exercises";

const EvaluationScreen = () => {
    const navigate = useNavigate();
    const setUserData = useUserStore((state) => state.setUserData);
    const userData = useUserStore((state) => state.userData);

    const stages = ['pushups', 'squats', 'pullups']; 
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentTierIndex, setTierIndex] = useState(0); 
    const [mode, setMode] = useState('selection'); // selection | input
    const [maxReps, setMaxReps] = useState(0);

    const currentStageName = stages[currentStageIndex];

    let currentTiers = null;

    switch (currentStageName) {
        case 'pushups': {
            currentTiers = PUSHUP_TIERS;
            break
        }
        case 'squats': {
            currentTiers = SQUAT_TIERS;
            break
        }
        case 'pullups': {
            currentTiers = PULLUP_TIERS;
            break
        }
    }
        
    const currentTier = currentTiers[currentTierIndex] || currentTiers[0];

    const handleYes = () => {
        if (currentTierIndex < currentTiers.length - 1) {
            setTierIndex(prev => prev + 1);
        } else {
            setMode('input');
        }
    };

    const handleNo = () => {
        if (currentTierIndex > 0) {
            setTierIndex(prev => prev - 1); 
        }
        setMode('input');
    };

    const handleSubmit = () => {
        const updatedEvaluation = {
            ...userData.userEvaluation, 
            [currentStageName]: {      
                variation: currentTier.label,
                tierIndex: currentTierIndex,
                maxReps: maxReps
            }
        };


        setUserData({
            ...userData,
            userEvaluation: updatedEvaluation,
            isConfigured: true,
        });


        if (currentStageIndex < stages.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
            setTierIndex(0); 
            setMode('selection'); 
            setMaxReps(0); 
        } else {
            navigate('/awakening');
        }
    };

    // --- RENDER INPUT SCREEN ---
    if (mode === 'input') {
        return (
            <div className="input-screen">
                <h2>System Calibration: {currentStageName.toUpperCase()}</h2>
                
                {currentTier.animation && <Hologram videoSrc={currentTier.animation} />}
                
                <p className="highlight-text">Technique: {currentTier.label}</p>
                
                <label>Max Reps until failure:</label>
                <input 
                    type="number" 
                    placeholder={maxReps} 
                    onChange={(e) => setMaxReps(parseInt(e.target.value) || 0)} 
                    autoFocus
                />
                
                <button onClick={handleSubmit} className="btn-green">
                    CONFIRM DATA
                </button>
            </div>
        );
    }

    // --- RENDER SELECTION SCREEN ---
    return (
        <div className="selection-screen">
            <h2>Can you perform at least 1 rep?</h2>
            
            {currentTier.animation && <Hologram videoSrc={currentTier.animation} />}

            <h3 style={{marginTop: '10px'}}>{currentTier.label}</h3>

            <div className="buttons">
                <button onClick={handleNo} className="btn-red">No, too hard</button>
                <button onClick={handleYes} className="btn-green">Yes, easy</button>
            </div>
        </div>
    );
};

export default EvaluationScreen;