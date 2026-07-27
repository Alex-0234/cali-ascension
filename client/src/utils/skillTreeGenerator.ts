import { EXERCISE_DB } from "../data/exercise_db";
import { exerciseProgress } from "../store/usePlayerStore";
import { canUnlockExercise, getUnlockCost } from "./Progression";
import { getProficiency } from "./proficiencySystem";
import { Exercise } from "../data/exercise_db";
import { theme } from "../components/skilltree/skillTreeTheme";

// NODES
interface nodeData {
    label: string
    branch: string
    tier: number
    unit: string
    state: string
    cost: number
    proficiency: object
    theme: object
}
interface NodePos {
    x: number 
    y: number 
}
interface node {
    id: string
    type: string
    data: nodeData
    position: NodePos
}

// EDGES
interface edgeStyle {
    stroke: string
    strokeWidth: number
    transition: string
}
interface edge {
    id: string
    source: string
    target: string
    type: string
    animated: boolean
    style: edgeStyle
}



// [UNLOCKED, PREREQ ? AVAILABLE : LOCKED]
const getNodeState = (exerciseId: string, userProgress: Record<string, exerciseProgress>) => {
    if (userProgress[exerciseId]) return "unlocked";
    if (canUnlockExercise(exerciseId, userProgress).ok) return "available";
    return "locked";
};

export const generateSkillTree = (exerciseIdList: string[], userProgress: Record<string, exerciseProgress>, theme: theme) => {
    const nodes: node[] = [];
    const edges: edge[] = [];

    const activeExercises = exerciseIdList.map(id => EXERCISE_DB[id]).filter(Boolean);

    const nodeTiers: Record<string, number> = {};  // Basically rows / ex.tier
    const calculateRow = (nodeId: string) => {
        if (nodeTiers[nodeId] !== undefined) return nodeTiers[nodeId];

        const exercise = EXERCISE_DB[nodeId];    // Soon to be visible node
        if (!exercise) return 0;

        const prereqRows = (exercise.prerequisites ?? []).map(p => calculateRow(p));
        nodeTiers[nodeId] = Math.max(exercise.tier ?? 0, ...prereqRows.map(r => r + 1));

        return nodeTiers[nodeId];
    };

    activeExercises.forEach(ex => calculateRow(ex.id));

    const nodesByTier: Record<number, Exercise[]> = {};
    activeExercises.forEach(ex => {
        const tier = nodeTiers[ex.id];  //node row
        if (!nodesByTier[tier]) nodesByTier[tier] = [];
        nodesByTier[tier].push(ex);
    });

    const positions: Record<string, NodePos> = {}
    const { xSpacing, ySpacing, rootSpacing, pairSpacing, wideSpacing } = theme.layout;

    const maxTier = Math.max(0, ...Object.keys(nodesByTier).map(Number));

    for (let currentTier = 0; currentTier <= maxTier; currentTier++) {
        const sameRowNodes = nodesByTier[currentTier];
        if (!sameRowNodes) continue;

        const groupsPerParent: Record<string, Exercise[]> = {};

        sameRowNodes.forEach(exercise => {
            let parentId = "root";
            if (exercise.prerequisites && exercise.prerequisites.length > 0) {
                const validParent = exercise.prerequisites.find(p => positions[p] !== undefined);
                if (validParent) parentId = validParent;
            }
            if (!groupsPerParent[parentId]) groupsPerParent[parentId] = [];
            groupsPerParent[parentId].push(exercise);
        });

        Object.keys(groupsPerParent).forEach(parentId => {
            const group = groupsPerParent[parentId];
            const parentX = parentId === "root" ? 0 : positions[parentId].x;

            let dynamicXSpacing = xSpacing;

            if (parentId === "root") {
                dynamicXSpacing = rootSpacing;
            } else if (group.length === 2) {
                dynamicXSpacing = pairSpacing;
            } else if (group.length >= 3) {
                dynamicXSpacing = wideSpacing;
            }

            group.forEach((exercise, index) => {
                const offset = (index - (group.length - 1) / 2) * dynamicXSpacing;
                const xPos = parentX + offset;
                const yPos = currentTier * ySpacing; 

                positions[exercise.id] = { x: xPos, y: yPos };

                const state = getNodeState(exercise.id, userProgress);
                const totalReps = userProgress[exercise.id]?.totalReps ?? 0;

                nodes.push({
                    id: exercise.id,
                    type: 'skill',
                    data: {
                        label: exercise.name,
                        branch: exercise.branch || 'core',
                        tier: exercise.tier,
                        unit: exercise.unit,
                        state,
                        cost: getUnlockCost(exercise.id),
                        proficiency: getProficiency(totalReps),
                        theme,
                    },
                    position: { x: xPos, y: yPos },
                });
            });
        });
    }

    activeExercises.forEach((exercise) => {
        if (!exercise.prerequisites || exercise.prerequisites.length === 0) return;

        const state = getNodeState(exercise.id, userProgress);
        const edgeStyle = theme.edge.states[state];

        exercise.prerequisites.forEach((prereqId) => {
            edges.push({
                id: `edge-${prereqId}-${exercise.id}`,
                source: prereqId,
                target: exercise.id,
                type: theme.edge.type,
                animated: edgeStyle.animated,
                style: {
                    stroke: edgeStyle.stroke,
                    strokeWidth: edgeStyle.width,
                    transition: 'stroke 0.3s ease',
                },
            });
        });
    });

    return { nodes, edges };
};
