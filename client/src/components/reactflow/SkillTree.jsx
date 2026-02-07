import { ReactFlow, Controls, Background, BaseEdge } from "@xyflow/react";
import '@xyflow/react/dist/style.css';



const Nodes = [
    {
        id: "pushup_00", position: { x: 0, y: 0 }, data: { label: "Wall Pushup" }
    },
    {
        id: "pushup_01", position: { x: 0, y: 100 }, data: { label: "Incline Pushup" }
    },
    {
        id: "pushup_02", position: { x: 0, y: 200 }, data: { label: "Standard Pushup" }
    },
    {
        id: "pushup_03", position: { x: -200, y: 300 }, data: { label: "Diamond Pushup" }
    },
    {
        id: "pushup_04", position: { x: 0, y: 300 }, data: { label: "Pike Pushup" }
    },
    {
        id: "pushup_05", position: { x: 200, y: 300 }, data: { label: "Explosive Clap Pushup" }
    }
];  

const Edges = [
    { id: "e0-1", source: "pushup_00", target: "pushup_01" },
    { id: "e1-2", source: "pushup_01", target: "pushup_02" },
    { id: "e2-3", source: "pushup_02", target: "pushup_03" },
    { id: "e2-4", source: "pushup_02", target: "pushup_04" },
    { id: "e2-5", source: "pushup_02", target: "pushup_05" }
];

function PushupSkillTree() {
    return (
        <div className="skill-tree-container" style={{ width: "100%", height: "500px" }}>
            <ReactFlow nodes={Nodes} edges={Edges}>
                <BaseEdge />
                <Background />
            </ReactFlow>
        </div>
    );  
}

export default PushupSkillTree;