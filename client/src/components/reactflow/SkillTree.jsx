// src/components/reactflow/SkillTree.jsx

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
    const [currentCategory, setCurrentCategory] = useState('pullups');
    const [modalVisibility, setModalVisibility] = useState(false);
    const [exerciseId, setExerciseId] = useState('pushup_00');
    const [proficiency, setProficiency] = useState({level: 0, progress: 0})
    

    // Automatically recalculate nodes and edges when the category changes
    const { nodes, edges } = useMemo(() => {
        const exerciseList = ALL_EXERCISES[currentCategory];
        return generateSkillTree(EXERCISE_DB, exerciseList);
    }, [currentCategory]);

    const handleClick = async (event, node) => {
        event.preventDefault(); 

        const clickedExerciseId = node.id;  

        if (exerciseId === clickedExerciseId) return;


        setExerciseId(clickedExerciseId);
        const {level, progress} = getCompleteProficiencyForExercise(exerciseProgress, exerciseId);
        setProficiency({level: level, progress: progress});
        setModalVisibility(true);
        
        console.log("You clicked on:", clickedExerciseId);

    }

    return (
        <div style={{ width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Control Panel to switch trees */}
            <div style={{ padding: '10px', background: '#111', color: 'white', display: 'flex', gap: '10px', zIndex: 10 }}>
                <button onClick={() => setCurrentCategory('pushups')}>Push-ups Tree</button>
                <button onClick={() => setCurrentCategory('pullups')}>Pull-ups Tree</button>
                <button onClick={() => setCurrentCategory('squats')}>Squats Tree</button>
                <span style={{marginLeft: '20px'}}>Current Tree: {currentCategory.toUpperCase()}</span>
            </div>

            {/* The React Flow Canvas */}
            <div style={{ flexGrow: 1, backgroundColor: '#0a0a0a' }}>
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
                {modalVisibility && (
                    <div className='exercise-info' style={{height: '40%', width: '100%', position: 'absolute', bottom: '5rem', background: '#161616', }}>
                        <p>{EXERCISE_DB[exerciseId].name}</p>
                        <p>Proficiency: {proficiency.level} - Total Reps: {exerciseProgress[exerciseId].totalReps}</p>
                    </div>
                )}
            </div>
            <Navbar />
        </div>
    );
}