// src/utils/skillTreeGenerator.js
//
// Turns EXERCISE_DB entries into React Flow nodes + edges.
// All visuals (spacing, colors, edge type) come from the theme object —
// see components/skilltree/skillTreeTheme.js.

import { canUnlockExercise, getUnlockCost } from "./Progression";
import { getProficiency } from "./proficiencySystem";

// unlocked -> already owned | available -> prereqs met, purchasable | locked
const getNodeState = (exerciseId, userProgress) => {
    if (userProgress[exerciseId]) return "unlocked";
    if (canUnlockExercise(exerciseId, userProgress).ok) return "available";
    return "locked";
};

export const generateSkillTree = (exerciseDB, exerciseList, userProgress, theme) => {
    const nodes = [];
    const edges = [];

    // 1. Filter active exercises
    const activeExercises = exerciseList
        .map(id => exerciseDB[id])
        .filter(Boolean);

    // 2. 🧠 CALCULATE ROW: one tier per row
    // Row = the exercise's tier, so every row holds a single difficulty tier.
    // Guard: if a prerequisite shares the same tier (rare data quirk, e.g.
    // squat_jump -> squat_burpee both T3), push the child one row down so
    // edges always flow downward.
    const nodeLevels = {};
    const calculateRow = (nodeId) => {
        if (nodeLevels[nodeId] !== undefined) return nodeLevels[nodeId];

        const node = exerciseDB[nodeId];
        if (!node) return 0;

        const prereqRows = (node.prerequisites ?? []).map(p => calculateRow(p));
        nodeLevels[nodeId] = Math.max(node.tier ?? 0, ...prereqRows.map(r => r + 1));

        return nodeLevels[nodeId];
    };

    activeExercises.forEach(ex => calculateRow(ex.id));

    // Group exercises by their calculated row
    const nodesByLevel = {};
    activeExercises.forEach(ex => {
        const lvl = nodeLevels[ex.id];
        if (!nodesByLevel[lvl]) nodesByLevel[lvl] = [];
        nodesByLevel[lvl].push(ex);
    });

    // 3. 🗺️ POSITION CALCULATION
    const positions = {}; // Store {x, y} to reference parent locations
    const { xSpacing, ySpacing, rootSpacing, pairSpacing, wideSpacing } = theme.layout;

    const maxLevel = Math.max(0, ...Object.keys(nodesByLevel).map(Number));

    // Go through the tree top-to-bottom (Level 0 to Max Level)
    for (let currentLevel = 0; currentLevel <= maxLevel; currentLevel++) {
        const levelNodes = nodesByLevel[currentLevel];
        if (!levelNodes) continue;

        // Group nodes in this level by their primary Prerequisite (Parent)
        const groupsByPrereq = {};

        levelNodes.forEach(node => {
            let parentId = "root";
            if (node.prerequisites && node.prerequisites.length > 0) {
                // Find a parent that has already been placed on the board
                const validPrereq = node.prerequisites.find(p => positions[p] !== undefined);
                if (validPrereq) parentId = validPrereq;
            }
            if (!groupsByPrereq[parentId]) groupsByPrereq[parentId] = [];
            groupsByPrereq[parentId].push(node);
        });

        // Calculate positions relative to the Parent's X coordinate
        Object.keys(groupsByPrereq).forEach(parentId => {
            const group = groupsByPrereq[parentId];
            const parentX = parentId === "root" ? 0 : positions[parentId].x;

            // Dynamic spacing: separate root trees get pushed far apart so
            // their lower branches never collide; small groups sit tighter.
            let dynamicXSpacing = xSpacing;

            if (parentId === "root") {
                dynamicXSpacing = rootSpacing;
            } else if (group.length === 2) {
                dynamicXSpacing = pairSpacing;
            } else if (group.length >= 3) {
                dynamicXSpacing = wideSpacing;
            }

            group.forEach((node, index) => {
                // ⚖️ THE MAGIC SPLIT FORMULA ⚖️
                // If group size is 1 -> offset is 0 (Straight down!)
                // If group size is 3 -> offsets split evenly around the parent
                const offset = (index - (group.length - 1) / 2) * dynamicXSpacing;
                const xPos = parentX + offset;
                const yPos = currentLevel * ySpacing; // Perfectly even Y

                positions[node.id] = { x: xPos, y: yPos };

                const state = getNodeState(node.id, userProgress);
                const totalReps = userProgress[node.id]?.totalReps ?? 0;

                nodes.push({
                    id: node.id,
                    type: 'skill',
                    data: {
                        label: node.name,
                        branch: node.branch || 'core',
                        tier: node.tier,
                        unit: node.unit,
                        state,
                        cost: getUnlockCost(node.id),
                        proficiency: getProficiency(totalReps),
                        theme,
                    },
                    position: { x: xPos, y: yPos },
                });
            });
        });
    }

    // 4. ⚡ GENERATE EDGES (style follows the target node's state)
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
