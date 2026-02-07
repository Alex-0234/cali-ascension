const skillTree = {
    // --- TIER 0: THE BASICS ---
    "pushup_00": {
        id: "pushup_00",
        name: "Wall Pushup",
        tier: 0,
        xpreward: 10,
        proficiency: 0,
        prerequisites: [], // No requirements
    },
    "pushup_01": {
        id: "pushup_01",
        name: "Incline Pushup",
        tier: 0,
        xpreward: 15,
        proficiency: 0,
        prerequisites: ["pushup_00"],
    },

    // --- TIER 1: FOUNDATION ---
    "pushup_02": {
        id: "pushup_02",
        name: "Standard Pushup",
        tier: 1,
        xpreward: 20,
        proficiency: 0,
        prerequisites: ["pushup_01"],
    },

    // --- TIER 2: SPECIALIZATION (The Split) ---
    "pushup_03": {
        id: "pushup_03",
        name: "Diamond Pushup",
        tier: 2,
        xpreward: 25,
        proficiency: 0,
        prerequisites: ["pushup_02"], // Path A: Tricep/One-Arm focus
    },
    "pushup_04": {
        id: "pushup_04",
        name: "Pike Pushup",
        tier: 2,
        xpreward: 25,
        proficiency: 0,
        prerequisites: ["pushup_02"], // Path B: Shoulder/Handstand focus
    },
    "pushup_05": {
        id: "pushup_05",
        name: "Explosive Clap Pushup",
        tier: 2,
        xpreward: 30,
        proficiency: 0,
        prerequisites: ["pushup_02"], // Path C: Power focus
    },

    // --- TIER 3: ADVANCED STRENGTH ---
    "pushup_06": {
        id: "pushup_06",
        name: "Archer Pushup",
        tier: 3,
        xpreward: 40,
        proficiency: 0,
        prerequisites: ["pushup_03"], // Requires Diamond
    },
    "pushup_07": {
        id: "pushup_07",
        name: "Elevated Pike Pushup",
        tier: 3,
        xpreward: 40,
        proficiency: 0,
        prerequisites: ["pushup_04"], // Requires Pike
    },
    "pushup_08": {
        id: "pushup_08",
        name: "Pseudo Planche Pushup",
        tier: 3,
        xpreward: 45,
        proficiency: 0,
        prerequisites: ["pushup_03"], // Requires Diamond (Heavy shoulder lean)
    },

    // --- TIER 4: ELITE ---
    "pushup_09": {
        id: "pushup_09",
        name: "One-Arm Pushup",
        tier: 4,
        xpreward: 100,
        proficiency: 0,
        prerequisites: ["pushup_06"], // Requires Archer
    },
    "pushup_10": {
        id: "pushup_10",
        name: "Wall Handstand Pushup",
        tier: 4,
        xpreward: 100,
        proficiency: 0,
        prerequisites: ["pushup_07"], // Requires Elevated Pike
    },

    // --- TIER 5: LEGENDARY ---
    "pushup_11": {
        id: "pushup_11",
        name: "Freestanding Handstand Pushup",
        tier: 5,
        xpreward: 500,
        proficiency: 0,
        prerequisites: ["pushup_10"], // Requires Wall HSPU
    },
    "pushup_12": {
        id: "pushup_12",
        name: "Planche Pushup",
        tier: 5,
        xpreward: 500,
        proficiency: 0,
        prerequisites: ["pushup_08"], // Requires Pseudo Planche
    }
}
export default skillTree;