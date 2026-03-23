import { useState } from "react";
import useUserStore from "../../store/usePlayerStore";
import Hologram from "../../components/ui/hologram";
import { useNavigate } from 'react-router-dom';
import { EXERCISE_DB, EVALUATION_EXERCISES } from "../../data/exercise_db";
import { initialExerciseUnlock } from "../../utils/initialExerciseUnlock";
import { calculatePlayerStats } from "../../utils/statSystem";

import CloseButton from "../../components/ui/closeBtn";
import BackButton from "../../components/ui/backBtn";

import styles from '../../styles/evaluation.module.css';

const PERSONAL_STEPS = [
    { key: 'shownName', label: 'Choose your username', type: 'text', placeholder: 'Hunter Name' },
    { key: 'age', label: 'Enter your age', type: 'number', placeholder: '25' },
    { key: 'gender', label: 'Select your gender', type: 'select' }, 
    { key: 'height', label: 'Enter your height (cm)', type: 'number', placeholder: '180' },
    { key: 'weight', label: 'Enter your weight (kg)', type: 'number', placeholder: '75' }
];

const EXERCISE_STAGES = ['pushups', 'squats', 'core', 'pullups'];

const EvaluationScreen = () => {
    const navigate = useNavigate();
    const setUserData = useUserStore((state) => state.setUserData);
    const syncUser = useUserStore((state) => state.syncUser)
    const userData = useUserStore((state) => state.userData);

    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [mode, setMode] = useState('quest'); // quest | personal | selection | input
    
    const [currentTierIndex, setTierIndex] = useState(0); 
    const [maxReps, setMaxReps] = useState(0);
    const [personalStepIndex, setPersonalStepIndex] = useState(0);
    
    const [personalInfo, setPersonalInfo] = useState({
        shownName: '', age: '', gender: '', height: '', weight: ''
    });
    const [evaluationDraft, setEvaluationDraft] = useState({});

    const currentStageName = EXERCISE_STAGES[currentStageIndex];

    let currentTiers = [];
    if (currentStageName === 'pushups') currentTiers = EVALUATION_EXERCISES.pushups || [];
    if (currentStageName === 'squats') currentTiers = EVALUATION_EXERCISES.squats || [];
    if (currentStageName === 'core') currentTiers = EVALUATION_EXERCISES.core || [];
    if (currentStageName === 'pullups') currentTiers = EVALUATION_EXERCISES.pullups || [];

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
            setCurrentStageIndex(0); 
            setTierIndex(0);
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

    const handleReturn = () => {
        if (mode === 'personal') {
            if (personalStepIndex > 0) {
                setPersonalStepIndex(prev => prev - 1); 
            } else {
                navigate('/status');
            }
        } 
        else if (mode === 'selection') {
            if (currentTierIndex > 0) {
                setTierIndex(prev => prev - 1); 
            } else {
                if (currentStageIndex > 0) {

                    setCurrentStageIndex(prev => prev - 1); 
                    setTierIndex(0); 
                } else {

                    setMode('personal');
                    setPersonalStepIndex(PERSONAL_STEPS.length - 1); 
                }
            }
        } 
        else if (mode === 'input') {
            setMode('selection');
            setMaxReps(0);
        }
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

        if (currentStageIndex < EXERCISE_STAGES.length - 1) {
            // Posun na ďalšiu kategóriu cviku
            setCurrentStageIndex(prev => prev + 1);
            setTierIndex(0); 
            setMode('selection'); 
            setMaxReps(0); 
        } else {
            // Koniec evaluácie
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

    // --- RENDER BLOCK 1: URGENT QUEST WARNING ---
    if (mode === 'quest') {
        return (
            <div className="mock-body">
                <div className={styles.questContainer}>
                    <div className={styles.warningBox}>
                        <div className={styles.warningHeader}>
                            <span className={styles.blinkIcon}>⚠</span> SYSTEM ALERT
                        </div>
                        <h2 className={styles.warningTitle}>Initial Calibration Required</h2>
                        <p className={styles.warningText}>
                            Hunter profile is incomplete. To unlock system features, a full biometric and physical evaluation must be completed immediately.
                        </p>
                        
                        <button className={styles.btnUrgent} onClick={() => setMode('personal')}>
                            ACCEPT EVALUATION
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // --- RENDER BLOCK 2: PERSONAL DETAILS ---
    if (mode === 'personal') {
        const currentField = PERSONAL_STEPS[personalStepIndex]; 

        return (
            <div className="mock-body">
                <div className={styles.sysWindow}>
                    <CloseButton position='absolute' top='20px' right='20px' onClose={() => navigate('/status')}/>
                    <BackButton position='absolute' top='20px' left='20px' onClick={handleReturn}/>
                    
                    <div className={styles.sysHeader}>
                        <h2 className={styles.sysTitle}>System.Calibration</h2>
                        <span className={styles.sysSubtitle}>// Personal_Details [{personalStepIndex + 1}/{PERSONAL_STEPS.length}]</span>
                    </div>

                    <div className={styles.inputBody}>
                        <p className={styles.sysLabel}>&gt; {currentField.label}_</p>
                        
                        {currentField.key === 'gender' ? (
                            <select 
                                className={styles.sysInput}
                                value={personalInfo[currentField.key]}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, [currentField.key]: e.target.value })}
                                autoFocus
                            >
                                <option value="" disabled>Select from database...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Solo Leveler">Solo Leveler</option>
                            </select>
                        ) : (
                            <input 
                                className={styles.sysInput}
                                type={currentField.type}
                                placeholder={currentField.placeholder}
                                value={personalInfo[currentField.key]} 
                                onChange={(e) => setPersonalInfo({ ...personalInfo, [currentField.key]: e.target.value })}
                                required 
                                autoFocus
                            />
                        )}
                        
                        <button 
                            className={styles.btnGreen} 
                            onClick={handleNextPersonal}
                            disabled={!personalInfo[currentField.key]} 
                        >
                            CONFIRM_DATA
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER BLOCK 3: EXERCISE INPUT ---
    if (mode === 'input' && currentTier) {
        return (
            <div className="mock-body">
                <div className={styles.sysWindow}>
                    <BackButton position='absolute' top='20px' left='20px' onClick={handleReturn}/>
                    
                    <div className={styles.sysHeader}>
                        <h2 className={styles.sysTitle}>System.Calibration</h2>
                        <span className={styles.sysSubtitle}>// {currentStageName.toUpperCase()}</span>
                    </div>
                    
                    <div className={styles.inputBody}>
                        {EXERCISE_DB[currentTier]?.animation && (
                            <div className={styles.hologramWrapper}>
                                <Hologram videoSrc={EXERCISE_DB[currentTier].animation} />
                            </div>
                        )}
                        
                        <p className={styles.highlightText}>Target Technique: <span>{EXERCISE_DB[currentTier]?.name}</span></p>
                        
                        <p className={styles.sysLabel}>&gt; Enter Max Reps until failure:_</p>
                        <input 
                            className={styles.sysInput}
                            type="number" 
                            value={maxReps || ''} 
                            onChange={(e) => setMaxReps(parseInt(e.target.value) || 0)} 
                            autoFocus
                        />
                        
                        <button onClick={handleSubmitExercise} className={styles.btnGreen} disabled={maxReps <= 0}>
                            LOG_PERFORMANCE
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER BLOCK 4: EXERCISE SELECTION ---
    if (mode === 'selection' && currentTier) {
        return (
            <div className="mock-body">
                <div className={styles.sysWindow}>
                    <BackButton position='absolute' top='20px' left='20px' onClick={handleReturn}/>
                    
                    <div className={styles.sysHeader}>
                        <h2 className={styles.sysTitle}>System.Calibration</h2>
                        <span className={styles.sysSubtitle}>// {currentStageName.toUpperCase()}</span>
                    </div>

                    <div className={styles.inputBody}>
                        <p className={styles.sysLabel}>&gt; Can you perform at least 1 rep?_</p>
                        <h3 className={styles.exerciseName}>{EXERCISE_DB[currentTier]?.name}</h3>

                        {EXERCISE_DB[currentTier]?.animation && (
                            <div className={styles.hologramWrapper}>
                                <Hologram videoSrc={EXERCISE_DB[currentTier].animation} />
                            </div>
                        )}
                        
                        <div className={styles.btnGrid}>
                            <button onClick={handleNo} className={styles.btnRed}>NO [TOO HARD]</button>
                            <button onClick={handleYes} className={styles.btnGreen}>YES [EASY]</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default EvaluationScreen;