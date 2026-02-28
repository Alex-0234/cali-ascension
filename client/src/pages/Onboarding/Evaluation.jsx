import { useState } from "react";
import useUserStore from "../../store/usePlayerStore";
import Hologram from "../../components/ui/hologram";
import { useNavigate } from 'react-router-dom';
import { EXERCISE_DB, EVALUATION_EXERCISES } from "../../data/exercise_db";
import { initialExerciseUnlock } from "../../utils/initialExerciseUnlock";
import { calculatePlayerStats } from "../../utils/statSystem";

const PERSONAL_STEPS = [
    { key: 'shownName', label: 'Choose your username', type: 'text', placeholder: 'Hunter Name' },
    { key: 'age', label: 'Enter your age', type: 'number', placeholder: '25' },
    { key: 'gender', label: 'Select your gender', type: 'text', placeholder: 'Male / Female / Solo Leveler' },
    { key: 'height', label: 'Enter your height (cm)', type: 'number', placeholder: '180' },
    { key: 'weight', label: 'Enter your weight (kg)', type: 'number', placeholder: '75' }
];

const STAGES = ['personal_details', 'pushups', 'squats','core','pullups'];

const EvaluationScreen = () => {
    const navigate = useNavigate();
    const setUserData = useUserStore((state) => state.setUserData);
    const syncUser = useUserStore((state) => state.syncUser)
    const userData = useUserStore((state) => state.userData);

    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [mode, setMode] = useState('personal'); // personal | selection | input
    
    const [currentTierIndex, setTierIndex] = useState(0); 
    const [maxReps, setMaxReps] = useState(0);
    const [personalStepIndex, setPersonalStepIndex] = useState(0);
    
    const [personalInfo, setPersonalInfo] = useState({
        shownName: '', age: '', gender: '', height: '', weight: ''
    });
    const [evaluationDraft, setEvaluationDraft] = useState({});

    const currentStageName = STAGES[currentStageIndex];

     let currentTiers = '';

        if (currentStageName === 'pushups') currentTiers = EVALUATION_EXERCISES.pushups;
        if (currentStageName === 'squats') currentTiers = EVALUATION_EXERCISES.squats;
        if (currentStageName === 'core') currentTiers = EVALUATION_EXERCISES.core;
        if (currentStageName === 'pullups') currentTiers = EVALUATION_EXERCISES.pullups;


    const currentTier = currentTiers.length > 0 ? (currentTiers[currentTierIndex]) : null;

    const handleNextPersonal = () => {
        if (personalStepIndex < PERSONAL_STEPS.length - 1) {
            setPersonalStepIndex(prev => prev + 1); 
        } else {
            setUserData({
                ...userData,
                ...personalInfo, 
                weightHistory: [{ weight: personalInfo.weight, date: new Date() }],
            });
            setCurrentStageIndex(1); 
            setMode('selection');    
        }
    };

    const handleYes = () => {
        if (currentTierIndex < currentTiers.length - 1) {
            setTierIndex(prev => prev + 1);
        } else {
            setMode('input');
        }
    };

    const handleNo = () => {
        if (currentTierIndex > 0) setTierIndex(prev => prev - 1); 
        setMode('input');
    };

const handleSubmitExercise = async () => {
        const newDraft = {
            ...evaluationDraft, 
            [currentStageName]: {      
                variationID: currentTier,
                variationName: EXERCISE_DB[currentTier].name,
                maxReps: maxReps
            }          
        };
        
        setEvaluationDraft(newDraft);

        if (currentStageIndex < STAGES.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
            setTierIndex(0); 
            setMode('selection'); 
            setMaxReps(0); 
        } else {
            
            const initialProgress = initialExerciseUnlock(newDraft);
            const stats = calculatePlayerStats(initialProgress);

            setUserData({
                ...userData,
                ...personalInfo, 
                stats: stats,
                userEvaluation: newDraft, 
                exerciseProgress: initialProgress,
                isConfigured: true,
            });
            await syncUser();

            navigate('/awakening');
        }
    };

    if (mode === 'personal') {
        const currentField = PERSONAL_STEPS[personalStepIndex]; 

        return (
            <div className='input-screen'>
                <div className="btn-close" onClick={() => document.querySelector('.input-screen').remove()}>X</div>
                <h2>System Calibration: PERSONAL DETAILS</h2>
                <p>{currentField.label}</p>
                
                <input 
                    className={`${currentField.key}-input`}
                    type={currentField.type}
                    placeholder={currentField.placeholder}
                    value={personalInfo[currentField.key]} 
                    onChange={(e) => setPersonalInfo({ 
                        ...personalInfo, 
                        [currentField.key]: e.target.value 
                    })}
                    required 
                    autoFocus
                />
                
                <button 
                    className='btn-green' 
                    onClick={handleNextPersonal}
                    disabled={!personalInfo[currentField.key]} 
                >
                    Next
                </button>
            </div>
        );
    }

    if (mode === 'input' && currentTier) {
        return (
            <div className="input-screen">
                <div className="generic-btn" onClick={() => setMode('selection')}>Back to Selection</div>
                <h2>System Calibration: {currentStageName.toUpperCase()}</h2>
                
                {EXERCISE_DB[currentTier].animation && <Hologram videoSrc={currentTier.animation} />}
                
                <p className="highlight-text">Technique: {EXERCISE_DB[currentTier].name}</p>
                <label>Max Reps until failure:</label>
                
                <input 
                    type="number" 
                    value={maxReps || ''} 
                    onChange={(e) => setMaxReps(parseInt(e.target.value) || 0)} 
                    autoFocus
                />
                
                <button onClick={handleSubmitExercise} className="btn-green">
                    CONFIRM DATA
                </button>
            </div>
        );
    }

    if (mode === 'selection' && currentTier) {
        return (
            <div className="selection-screen">
                <div className="generic-btn" onClick={() => setMode('personal')}>Back to Selection</div>
                <h2>Can you perform at least 1 rep?</h2>
                <h3 style={{marginTop: '10px'}}>{EXERCISE_DB[currentTier].name}</h3>

                {EXERCISE_DB[currentTier].animation && <Hologram videoSrc={EXERCISE_DB[currentTier].animation} />}
                
                <div className="buttons">
                    <button onClick={handleNo} className="btn-red">No, too hard</button>
                    <button onClick={handleYes} className="btn-green">Yes, easy</button>
                </div>
            </div>
        );
    }

    return null; 
};

export default EvaluationScreen;