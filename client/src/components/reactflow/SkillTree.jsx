// src/components/reactflow/SkillTree.jsx

import React, { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { EXERCISE_DB, ALL_EXERCISES } from '../../data/exercise_db'; // Adjust path
import { generateSkillTree } from '../../utils/skillTreeGenerator';

export default function SkillTree() {
    // State to toggle between different skill trees
    const [currentCategory, setCurrentCategory] = useState('pullups');

    // Automatically recalculate nodes and edges when the category changes
    const { nodes, edges } = useMemo(() => {
        const exerciseList = ALL_EXERCISES[currentCategory];
        return generateSkillTree(EXERCISE_DB, exerciseList);
    }, [currentCategory]);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            
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
                >
                    <Background color="#333" gap={16} />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}