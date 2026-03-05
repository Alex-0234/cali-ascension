// src/utils/skillTreeGenerator.js


// COMPLETELY GENERATED...

export const generateSkillTree = (exerciseDB, exerciseList) => {
    const nodes = [];
    const edges = [];
    
    // 1. Filter active exercises
    const activeExercises = exerciseList
        .map(id => exerciseDB[id])
        .filter(Boolean);

    // 2. 🧠 CALCULATE TOPOLOGICAL DEPTH (LEVEL) 
    // This ignores decimal tiers and guarantees perfectly EVEN Y-spacing!
    const nodeLevels = {};
    const calculateLevel = (nodeId) => {
        if (nodeLevels[nodeId] !== undefined) return nodeLevels[nodeId];
        
        const node = exerciseDB[nodeId];
        // If it's a root node (no prereqs)
        if (!node || !node.prerequisites || node.prerequisites.length === 0) {
            nodeLevels[nodeId] = 0;
            return 0;
        }
        
        // Find the maximum level of all its parents and add 1
        const prereqLevels = node.prerequisites.map(p => calculateLevel(p));
        const maxPrereqLevel = Math.max(0, ...prereqLevels);
        nodeLevels[nodeId] = maxPrereqLevel + 1;
        
        return nodeLevels[nodeId];
    };

    activeExercises.forEach(ex => calculateLevel(ex.id));

    // Group exercises by their calculated Level
    const nodesByLevel = {};
    activeExercises.forEach(ex => {
        const lvl = nodeLevels[ex.id];
        if (!nodesByLevel[lvl]) nodesByLevel[lvl] = [];
        nodesByLevel[lvl].push(ex);
    });

    // 3. 🗺️ POSITION CALCULATION
    const positions = {}; // Store {x, y} to reference parent locations
    const X_SPACING = 320;
    const Y_SPACING = 150; // The fixed gap between vertical tiers

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

            // 🌟 ZDE JE TA MAGICKÁ OPRAVA: Dynamické rozestupy 🌟
            let dynamicXSpacing = X_SPACING;

            if (parentId === "root") {
                // HLAVNÍ STROMY (Plank vs Crunches) odhodíme OBŘÍ kus od sebe (800px).
                // Tím zajistíme, že jejich spodní větve do sebe nenarazí.
                dynamicXSpacing = 600; 
            } else if (group.length === 2) {
                // Pokud má cvik jen dvě větve, držíme je trochu víc u sebe
                dynamicXSpacing = 240; 
            } else if (group.length >= 3) {
                // Pokud má cvik 3 a více větví (Crunches -> visení, rotace, extenze)
                dynamicXSpacing = 280; 
            }

            group.forEach((node, index) => {
                // ⚖️ THE MAGIC SPLIT FORMULA ⚖️
                // If group size is 1 -> offset is 0 (Straight down!)
                // If group size is 3 -> offsets are -280, 0, 280 (Split evenly!)
                const offset = (index - (group.length - 1) / 2) * dynamicXSpacing;
                const xPos = parentX + offset;
                const yPos = currentLevel * Y_SPACING; // Perfectly even Y

                positions[node.id] = { x: xPos, y: yPos };

                nodes.push({
                    id: node.id,
                    type: 'default', // Až budeš mít Custom Node, změníš to tady
                    data: { 
                        label: node.name,
                        branch: node.branch || 'core',
                    },
                    position: { x: xPos, y: yPos },
                });
            });
        });
    }

    // 4. ⚡ GENERATE SQUARE EDGES
    activeExercises.forEach((exercise) => {
        if (exercise.prerequisites && exercise.prerequisites.length > 0) {
            exercise.prerequisites.forEach((prereqId) => {
                edges.push({
                    id: `edge-${prereqId}-${exercise.id}`,
                    source: prereqId,
                    target: exercise.id,
                    type: 'smoothstep', // 🟥 THIS MAKES THE EDGES SQUARE
                    animated: true,
                    style: { stroke: '#00ffcc', strokeWidth: 2 },
                });
            });
        }
    });

    return { nodes, edges };
};