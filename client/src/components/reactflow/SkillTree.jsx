import { ReactFlow, Controls, Background, BaseEdge, StepEdge } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { useState } from "react";
import Navbar from "../layout/Navbar";
import Notification from "../notification/Notification";

const edgeTypes = {
    squared: StepEdge,
};

const nodeDefaults = {
  style: { borderRadius: '0px', width: 150, color: '#000000' }, 
};

const Nodes = [
    {
        id: "pushup_00", position: { x: 0, y: 0 }, data: { label: "Wall Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_01", position: { x: 0, y: 100 }, data: { label: "Incline Pushup" }, ...nodeDefaults 
    },
    {
        id: "pushup_02", position: { x: 0, y: 200 }, data: { label: "Standard Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_03", position: { x: -200, y: 300 }, data: { label: "Diamond Pushup" }, ...nodeDefaults  
    },
    {
        id: "pushup_04", position: { x: 0, y: 300 }, data: { label: "Pike Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_05", position: { x: 200, y: 300 }, data: { label: "Explosive Clap Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_06", position: { x: -200, y: 400 }, data: { label: "Archer Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_07", position: { x: 0, y: 400 }, data: { label: "Elevated Pike Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_08", position: { x: -400, y: 400 }, data: { label: "Pseudo Planche Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_09", position: { x: -200, y: 500 }, data: { label: "One-Arm Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_10", position: { x: 0, y: 500 }, data: { label: "Wall Handstand Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_11", position: { x: 0, y: 600 }, data: { label: "Freestanding Handstand Pushup" }, ...nodeDefaults
    },
    {
        id: "pushup_12", position: { x: -400, y: 600 }, data: { label: "Planche Pushup" }, ...nodeDefaults
    },
];  

const Edges = [
    { id: "e0-1", source: "pushup_00", target: "pushup_01", type: "squared" },
    { id: "e1-2", source: "pushup_01", target: "pushup_02", type: "squared" },
    { id: "e2-3", source: "pushup_02", target: "pushup_03", type: "squared" },
    { id: "e2-4", source: "pushup_02", target: "pushup_04", type: "squared" },
    { id: "e2-5", source: "pushup_02", target: "pushup_05", type: "squared" },
    { id: "e3-6", source: "pushup_03", target: "pushup_06", type: "squared" },
    { id: "e4-7", source: "pushup_04", target: "pushup_07", type: "squared" },
    { id: "e3-8", source: "pushup_03", target: "pushup_08", type: "squared" },
    { id: "e6-9", source: "pushup_06", target: "pushup_09", type: "squared" },
    { id: "e7-10", source: "pushup_07", target: "pushup_10", type: "squared" },
    { id: "e8-11", source: "pushup_10", target: "pushup_11", type: "squared" },
    { id: "e9-12", source: "pushup_08", target: "pushup_12", type: "squared" },
];

function SkillTree() {
    const [activeMessage, setActiveMessage] = useState(null);
    
    function onNodeClick(event, node) {
        const nodeId = node.id;
        const nodeLabel = node.data.label;
        // Can later change it for unlocked only
        setActiveMessage(`You clicked on node ${nodeId}: ${nodeLabel}`);
    }

    return (
        <>
        <div className="skill-tree-container" style={{ width: "100vw", height: "95vh" }}>
            <ReactFlow nodes={Nodes} edges={Edges} edgeTypes={edgeTypes} onNodeClick={onNodeClick} fitView>
                <BaseEdge />
                <Background />
            </ReactFlow>
        </div>
        <Notification message={activeMessage} />
        <Navbar />
        </>
    );  
}



export default SkillTree;