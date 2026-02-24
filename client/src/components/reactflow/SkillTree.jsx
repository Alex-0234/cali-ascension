
import React, { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { EXERCISE_DB, ALL_EXERCISES } from '../../data/exercise_db'; // Adjust path
import { generateSkillTree } from '../../utils/skillTreeGenerator';
import Navbar from '../layout/Navbar';
import getCompleteProficiencyForExercise from '../../utils/proficiencySystem';
import useUserStore from '../../store/usePlayerStore';

export default function SkillTree() {
    const exerciseProgress = useUserStore((state) => state.userData.exerciseProgress);
    const setUserData = useUserStore((state) => state.setUserData);
    const userData = useUserStore((state) => state.userData);

    const [currentCategory, setCurrentCategory] = useState('pullups');
    const [modalVisibility, setModalVisibility] = useState(false);
    const [exerciseId, setExerciseId] = useState('pushup_00');
    const [proficiency, setProficiency] = useState({ level: 0, progress: 0 });
    const [showVideo, setShowVideo] = useState(false);

    // Automatically recalculate nodes and edges when the category changes
    const { nodes, edges } = useMemo(() => {
        const exerciseList = ALL_EXERCISES[currentCategory];
        return generateSkillTree(EXERCISE_DB, exerciseList);
    }, [currentCategory]);

    const handleClick = async (event, node) => {
        event.preventDefault(); 
        const clickedExerciseId = node.id;  

        setExerciseId(clickedExerciseId);
        setShowVideo(false); 

        const isUnlocked = exerciseProgress.hasOwnProperty(clickedExerciseId);

        if (isUnlocked) {
            const { level, progress } = getCompleteProficiencyForExercise(exerciseProgress, clickedExerciseId);
            setProficiency({ level: level, progress: progress });
        } else {
            setProficiency({ level: 0, progress: 0 });
        }
        
        setModalVisibility(true);
    };

    const handleForceUnlock = () => {
        setUserData({
            ...userData,
            exerciseProgress: {
                ...exerciseProgress,
                [exerciseId]: { totalReps: 0, personalBest: 0 }
            }
        });
        setProficiency({ level: 0, progress: 0 });
    };

    const exerciseData = EXERCISE_DB[exerciseId];
    const isUnlocked = exerciseProgress[exerciseId] !== undefined;
    const style = { padding: '8px 16px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 'calc(100dvh - 75px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '15px', background: '#111', color: 'white', display: 'flex', gap: '15px', zIndex: 10, alignItems: 'center', borderBottom: '1px solid #333' }}>
                <button 
                    onClick={() => setCurrentCategory('pushups')}
                    style={{ ...style, background: currentCategory === 'pushups' ? '#3b82f6' : '#222'}}
                >Push-ups</button>
                <button 
                    onClick={() => setCurrentCategory('pullups')}
                    style={{ ...style, background: currentCategory === 'pullups' ? '#3b82f6' : '#222'}}
                >Pull-ups</button>
                <button 
                    onClick={() => setCurrentCategory('squats')}
                    style={{ ...style, background: currentCategory === 'squats' ? '#3b82f6' : '#222'}}
                >Squats</button>
                <button 
                    onClick={() => setCurrentCategory('core')}
                    style={{ ...style, background: currentCategory === 'core' ? '#3b82f6' : '#222'}}
                >Core</button>

                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#60a5fa' }}>
                    TREE: {currentCategory.toUpperCase()}
                </span>
            </div>

            {/* The React Flow Canvas */}
            <div style={{ flexGrow: 1, backgroundColor: '#0a0a0a', position: 'relative' }}>
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges}
                    fitView 
                    colorMode="dark"
                    onNodeClick={handleClick}
                >
                    <Background color="#333" gap={16} />
                    <Controls />
                </ReactFlow>

                {/* Moderní Popup Okno */}
                {modalVisibility && exerciseData && (
                    <div style={{
                        position: 'absolute', 
                        bottom: '20px', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        background: '#1f2937', 
                        padding: '20px',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                        border: `1px solid ${isUnlocked ? '#3b82f6' : '#4b5563'}`,
                        zIndex: 100,
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h2 style={{ margin: 0, color: isUnlocked ? '#fff' : '#9ca3af' }}>
                                {exerciseData.name}
                            </h2>
                            <button 
                                onClick={() => setModalVisibility(false)}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                            >✕</button>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <span style={{ 
                                display: 'inline-block',
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 'bold',
                                backgroundColor: isUnlocked ? '#065f46' : '#7f1d1d',
                                color: isUnlocked ? '#34d399' : '#fca5a5'
                            }}>
                                {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                            </span>
                            <span style={{ marginLeft: '10px', color: '#9ca3af', fontSize: '0.9rem' }}>
                                Tier {exerciseData.tier}
                            </span>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold', color: '#d1d5db' }}>Proficiency</span>
                                <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Lv. {proficiency.level} / 10</span>
                            </div>
                            {/* Progress Bar */}
                            <div style={{ width: '100%', height: '12px', backgroundColor: '#374151', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${proficiency.progress}%`, 
                                    height: '100%', 
                                    backgroundColor: isUnlocked ? '#3b82f6' : '#4b5563',
                                    transition: 'width 0.3s ease-in-out'
                                }}></div>
                            </div>
                        </div>

                        {/* Tlačítka akcí */}
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            {exerciseData.animation && (
                                <button 
                                    onClick={() => setShowVideo(!showVideo)}
                                    style={{ padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {showVideo ? 'Hide Animation' : 'Watch Animation'}
                                </button>
                            )}

                            {showVideo && exerciseData.animation && (
                                <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginTop: '10px', backgroundColor: 'black' }}>
                                    <video src={exerciseData.animation} controls autoPlay loop muted style={{ width: '100%', display: 'block' }} />
                                </div>
                            )}

                            {!isUnlocked && (
                                <button 
                                    onClick={handleForceUnlock}
                                    style={{ padding: '10px', backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #4b5563', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '5px' }}
                                >
                                    Force Unlock (Start tracking)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Navbar />
        </div>
    );
}