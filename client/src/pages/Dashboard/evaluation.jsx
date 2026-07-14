import { useState, useEffect } from "react";
import useUserStore from "../../store/usePlayerStore";
import { EXERCISE_DB, EVALUATION_EXERCISES } from "../../data/exercise_db";
import { initialExerciseUnlock } from "../../utils/initialExerciseUnlock";
import { calculatePlayerStats } from "../../utils/statCalculator";

import CloseButton from "../../components/ui/closeBtn";
import BackButton from "../../components/ui/backBtn";
import Card from "../../components/ui/card";

const PERSONAL_STEPS = [
    { key: 'visibleName', label: 'Choose your username', type: 'text', placeholder: 'name' },
    { key: 'age', label: 'Enter your age', type: 'number', placeholder: '25' },
    { key: 'gender', label: 'Select your gender', type: 'select' }, 
    { key: 'height', label: 'Enter your height (cm)', type: 'number', placeholder: '180' },
    { key: 'weight', label: 'Enter your weight (kg)', type: 'number', placeholder: '75' }
];

const EXERCISE_STAGES = ['pushups', 'squats', 'core', 'pullups'];

export default function Evaluation() {
    const {setUserData, syncUser, userData} = useUserStore();
    const { userInfo } = userData;

    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [mode, setMode] = useState('quest'); // quest | personal | selection | input
    
    const [currentTierIndex, setTierIndex] = useState(0); 
    const [maxReps, setMaxReps] = useState(0);
    const [personalStepIndex, setPersonalStepIndex] = useState(0);
    
    const [personalInfo, setPersonalInfo] = useState(userInfo);
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
                setMode('quest');
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
            setCurrentStageIndex(prev => prev + 1);
            setTierIndex(0);
            setMode('selection');
            setMaxReps(0);
        } else {
            const cleanInfo = {
                ...personalInfo,
                age: Number(personalInfo.age) || 0,
                height: Number(personalInfo.height) || 0,
                weight: Number(personalInfo.weight) || 0,
            };
    
            const { progress: initialProgress, bonusEP } = initialExerciseUnlock(newDraft);

            const newUserData = {
                ...userData,
                userInfo: cleanInfo,
                weightHistory: [{ weight: cleanInfo.weight, date: new Date() }],
                exerciseProgress: initialProgress,
                ep: (userData.ep || 0) + bonusEP,
                isConfigured: true,
            };
    
            const stats = calculatePlayerStats(newUserData);
    
            setUserData({ ...newUserData, stats });
            await syncUser();
        }
    };

    const containerClasses = "relative min-w-full h-auto max-w-3xl mx-auto text-green-400 font-mono p-6 flex flex-col rounded-xl overflow-hidden";
    const inputClasses = "w-full bg-slate-800 border border-slate-600 text-white p-3 rounded focus:outline-none focus:border-green-500 transition-colors mt-2";
    const buttonClasses = "w-full bg-green-700 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded transition-colors mt-auto uppercase tracking-wide";

    // --- RENDER BLOCK 1: QUEST ---
    if (mode === 'quest') {
        return (
                <div className={containerClasses}>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <h1 className="text-2xl font-bold text-white uppercase">Initial Evaluation Required</h1>
                        <p className="text-slate-400">Calibrate your system to begin.</p>
                        <button 
                            className={buttonClasses} 
                            onClick={() => setMode('personal')}
                        >
                            INITIATE_CALIBRATION
                        </button>
                    </div>
                </div>
        )
    }

    // --- RENDER BLOCK 2: PERSONAL ---
    if (mode === 'personal') {
        const currentField = PERSONAL_STEPS[personalStepIndex]; 

        return (
            <div className={containerClasses}>
                <CloseButton position='absolute' top='16px' right='16px' />
                <BackButton stroke={'white'} position='absolute' top='16px' left='16px' onClick={handleReturn} />
                
                <div className="mt-12 mb-6 border-b border-slate-700 pb-2">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">System.Calibration</h2>
                    <span className="text-sm text-slate-400">// Personal_Details [{personalStepIndex + 1}/{PERSONAL_STEPS.length}]</span>
                </div>

                <div className="flex-1 flex flex-col">
                    <p className="text-lg text-slate-300">&gt; {currentField.label}_</p>
                    
                    {currentField.key === 'gender' ? (
                        <select 
                            className={inputClasses}
                            value={personalInfo[currentField.key]}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, [currentField.key]: e.target.value })}
                            autoFocus
                        >
                            <option value="" disabled>Select from database...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <input 
                            className={inputClasses}
                            type={currentField.type}
                            placeholder={currentField.placeholder}
                            value={personalInfo[currentField.key]} 
                            onChange={(e) => setPersonalInfo({ ...personalInfo, [currentField.key]: e.target.value })}
                            required 
                            autoFocus
                        />
                    )}
                    
                    <button 
                        className={buttonClasses}
                        onClick={handleNextPersonal}
                        disabled={!personalInfo[currentField.key]} 
                    >
                        CONFIRM_DATA
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER BLOCK 3: INPUT ---
    if (mode === 'input' && currentTier) {
        return (
            <div className={containerClasses}>
                <BackButton position='absolute' top='16px' left='16px' onClick={handleReturn}/>
                
                <div className="mt-12 mb-4 border-b border-slate-700 pb-2">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">System.Calibration</h2>
                    <span className="text-sm text-slate-400">// {currentStageName.toUpperCase()}</span>
                </div>
                
                <div className="flex-1 flex flex-col overflow-y-auto pb-4">
                    {EXERCISE_DB[currentTier]?.animation && (
                        <div className="w-full h-40 bg-black rounded-lg border border-slate-600 overflow-hidden mb-4 flex-shrink-0">
                            <video 
                                src={EXERCISE_DB[currentTier].animation} 
                                className="w-full h-full object-cover opacity-80"
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                            />
                        </div>
                    )}
                    
                    <p className="text-slate-300 mb-4">Target Technique: <span className="font-bold text-white">{EXERCISE_DB[currentTier]?.name}</span></p>
                    
                    <p className="text-slate-300">&gt; Enter Max Reps until failure:_</p>
                    <input 
                        className={inputClasses}
                        type="number" 
                        value={maxReps || ''} 
                        onChange={(e) => setMaxReps(parseInt(e.target.value) || 0)} 
                        autoFocus
                    />
                    
                    <button 
                        className={`${buttonClasses} mt-6`} 
                        onClick={handleSubmitExercise} 
                        disabled={maxReps <= 0}
                    >
                        LOG_PERFORMANCE
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER BLOCK 4: EXERCISE SELECTION ---
    if (mode === 'selection' && currentTier) {
        return (
            <div className={containerClasses}>
                <BackButton position='absolute' top='16px' left='16px' onClick={handleReturn}/>
                
                <div className="mt-12 mb-4 border-b border-slate-700 pb-2">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">System.Calibration</h2>
                    <span className="text-sm text-slate-400">// {currentStageName.toUpperCase()}</span>
                </div>

                <div className="flex-1 flex flex-col">
                    <p className="text-slate-300 mb-2">&gt; Can you perform at least 1 rep?_</p>
                    <h3 className="text-xl font-bold text-white mb-4">{EXERCISE_DB[currentTier]?.name}</h3>

                    {EXERCISE_DB[currentTier]?.animation && (
                        <div className="w-full h-40 bg-black rounded-lg border border-slate-600 overflow-hidden mb-6 flex-shrink-0">
                            <video 
                                src={EXERCISE_DB[currentTier].animation} 
                                className="w-full h-full object-cover opacity-80"
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                            />
                        </div>
                    )}
                    
                    <div className="flex gap-4 mt-auto">
                        <button 
                            className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-700 font-bold py-3 px-4 rounded transition-colors"
                            onClick={handleNo} 
                        >
                            NO [TOO HARD]
                        </button>
                        <button 
                            className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors"
                            onClick={handleYes} 
                        >
                            YES [EASY]
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}