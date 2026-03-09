
import { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { EXERCISE_DB, ALL_EXERCISES } from '../../data/exercise_db'; 
import { generateSkillTree } from '../../utils/skillTreeGenerator';

import getCompleteProficiencyForExercise from '../../utils/proficiencySystem';
import useUserStore from '../../store/usePlayerStore';

import styles from '../../styles/skilltree.module.css';

export default function SkillTree() {
    const exerciseProgress = useUserStore((state) => state.userData.exerciseProgress);
    const { userData, setUserData } = useUserStore();

    const [currentCategory, setCurrentCategory] = useState('pushups');
    const [modalVisibility, setModalVisibility] = useState(false);
    const [exerciseId, setExerciseId] = useState('pushup_00');
    const [proficiency, setProficiency] = useState({ level: 0, progress: 0 });
    const [showVideo, setShowVideo] = useState(false);

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

    const isUnlocked = exerciseData ? exerciseProgress[exerciseId] !== undefined : false;

    return (
        <div className={styles.treeContainer}>
            
            <div className={styles.headerArea}>
                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tabBtn} ${currentCategory === 'pushups' ? styles.active : ''}`}
                        onClick={() => setCurrentCategory('pushups')}
                    >Push-ups</button>
                    <button 
                        className={`${styles.tabBtn} ${currentCategory === 'pullups' ? styles.active : ''}`}
                        onClick={() => setCurrentCategory('pullups')}
                    >Pull-ups</button>
                    <button 
                        className={`${styles.tabBtn} ${currentCategory === 'squats' ? styles.active : ''}`}
                        onClick={() => setCurrentCategory('squats')}
                    >Squats</button>
                    <button 
                        className={`${styles.tabBtn} ${currentCategory === 'core' ? styles.active : ''}`}
                        onClick={() => setCurrentCategory('core')}
                    >Core</button>
                </div>

                <div className={styles.treeLabel}>
                    TREE: {currentCategory}
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.flowWrapper}>
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges}
                    fitView 
                    minZoom={0.2}
                    maxZoom={1.5}
                    zoomOnDoubleClick={false}
                    colorMode="dark"
                    onNodeClick={handleClick}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Background color='#1e293b' gap={16} size={1} />
                    <Controls showInteractive={false} />
                </ReactFlow>

                {modalVisibility && exerciseData && (
                    <div className={styles.modalOverlay} onClick={(e) => {

                        if (e.target.className === styles.modalOverlay) setModalVisibility(false);
                    }}>
                        <div className={styles.modalBox}>

                            <div className={styles.modalHeader}>
                                <h2 className={`${styles.modalTitle} ${!isUnlocked ? styles.locked : ''}`}>
                                    {exerciseData.name}
                                </h2>
                                <button className={styles.closeBtn} onClick={() => setModalVisibility(false)}>
                                    ✕
                                </button>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <span className={`${styles.badge} ${isUnlocked ? styles.unlocked : styles.locked}`}>
                                    {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                                </span>
                                <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                                    Tier {exerciseData.tier}
                                </span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div className={styles.progressHeader}>
                                    <span style={{ color: '#94a3b8' }}>Proficiency</span>
                                    <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Lv. {proficiency.level} / 10</span>
                                </div>
                                <div className={styles.progressBarBg}>
                                    <div 
                                        className={styles.progressBarFill} 
                                        style={{ 
                                            width: `${proficiency.progress}%`, 
                                            background: isUnlocked ? 'var(--cyan, #00e5ff)' : '#4b5563',
                                            boxShadow: isUnlocked ? '0 0 10px rgba(0, 229, 255, 0.5)' : 'none'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                {exerciseData.animation && (
                                    <button 
                                        className={styles.actionBtn}
                                        onClick={() => setShowVideo(!showVideo)}
                                    >
                                        {showVideo ? '[- HIDE ANIMATION -]' : '[+ WATCH ANIMATION +]'}
                                    </button>
                                )}

                                {showVideo && exerciseData.animation && (
                                    <div style={{ width: '100%', borderRadius: '4px', overflow: 'hidden', marginTop: '10px', border: '1px solid #334155' }}>
                                        <video src={exerciseData.animation} controls autoPlay loop muted style={{ width: '100%', display: 'block' }} />
                                    </div>
                                )}

                                {!isUnlocked && (
                                    <button 
                                        className={`${styles.actionBtn} ${styles.forceUnlockBtn}`}
                                        onClick={handleForceUnlock}
                                    >
                                        FORCE UNLOCK (START TRACKING)
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
}