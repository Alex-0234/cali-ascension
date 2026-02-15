export const EXERCISE_DB = {
    // --- PUSH-UPS ---
    "pushup_00": {
        id: "pushup_00",
        name: "Wall Pushup",
        animation: "/videos/wall_pushup.mp4",
        tier: 0,
        totalReps: 0,
        maxReps: 0,
        prerequisites: [], 
    },
    "pushup_01": {
        id: "pushup_01",
        name: "Incline Pushup",
        animation: "/videos/incline_pushup.mp4",
        tier: 1,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_00"],
    },
    "pushup_02": {
        id: "pushup_02",
        name: "Standard Pushup",
        animation: "/videos/standard_pushup.mp4",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_01"],
    },
    "pushup_03": {
        id: "pushup_03",
        name: "Diamond Pushup",
        animation: "/videos/diamond_pushup.mp4",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_02"], // Path A: Tricep/One-Arm focus
    },
    "pushup_04": {
        id: "pushup_04",
        name: "Pike Pushup",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_02"], 
    },
    "pushup_05": {
        id: "pushup_05",
        name: "Explosive Clap Pushup",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_02"], // Path C: Power focus
    },
    "pushup_06": {
        id: "pushup_06",
        name: "Archer Pushup",
        animation: "",
        tier: 4,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_03"], // Requires Diamond
    },
    "pushup_07": {
        id: "pushup_07",
        name: "Elevated Pike Pushup",
        animation: "",
        tier: 5,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_04"], // Requires Pike
    },
    "pushup_08": {
        id: "pushup_08",
        name: "Pseudo Planche Pushup",
        animation: "",
        tier: 5,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_03"], // Requires Diamond (Heavy shoulder lean)
    },
    "pushup_09": {
        id: "pushup_09",
        name: "One-Arm Pushup",
        animation: "",
        tier: 6,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_06"], // Requires Archer
    },
    "pushup_10": {
        id: "pushup_10",
        name: "Wall Handstand Pushup",
        animation: "",
        tier: 7,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_07"], // Requires Elevated Pike
    },
    "pushup_11": {
        id: "pushup_11",
        name: "Freestanding Handstand Pushup",
        animation: "",
        tier: 8,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_10"], // Requires Wall HSPU
    },
    "pushup_12": {
        id: "pushup_12",
        name: "Planche Pushup",
        animation: "",
        tier: 9,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_08"], // Requires Pseudo Planche
    },

    // --- SQUATS -- 
    "squat_00": {
        id: "squat_00",
        name: "Chair Squat",
        animation: "",
        tier: 0,
        totalReps: 0,
        maxReps: 0,
        prerequisites: [], 
    },
        "squat_01": {
        id: "squat_01",
        name: "Hand Assisted Squat",
        animation: "",
        tier: 0,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['squat_00'], 
    },
        "squat_02": {
        id: "squat_02",
        name: "Standard Squat",
        animation: "",
        tier: 1,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['squat_01'], 
    },
        "squat_03": {
        id: "squat_03",
        name: "Hand Assisted Pistol Squat",
        animation: "",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['squat_02'], 
    },
        "squat_04": {
        id: "squat_04",
        name: "Pistol Squat",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['squat_03'], 
    },

/*         "squat_00": {
        id: "squat_00",
        name: " Squat",
        animation: "",
        tier: 0,
        reward: 1, // xp
        xp: 0, // accumulated
        proficiency: 0,
        prerequisites: [], 
    }, */

    // --- PULL-UPS --

    "pullup_00": {
        id: "pullup_00",
        name: "Scapular Pullup",
        animation: "",
        tier: 0,
        totalReps: 0,
        maxReps: 0,
        prerequisites: [], 
    },
        "pullup_01": {
        id: "pullup_01",
        name: "Negative Pullup",
        animation: "",
        tier: 0,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['pullup_00'], 
    },
        "pullup_02": {
        id: "pullup_00",
        name: "Band Assisted Pullup",
        animation: "",
        tier: 1,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['pullup_01'], 
    },
        "pullup_03": {
        id: "pullup_03",
        name: "Standard Pullup",
        animation: "",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['pullup_02'], 
    },
        "pullup_04": {
        id: "pullup_04",
        name: "Archer Pullup",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['pullup_03'], 
    },
        "pullup_05": {
        id: "pullup_05",
        name: "One-Armed Pullup",
        animation: "",
        tier: 4,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ['pullup_04'], 
    },

}
export const ALL_EXERCISES = {
    pushups: ['pushup_00','pushup_01','pushup_02','pushup_03','pushup_04','pushup_05','pushup_06','pushup_07','pushup_08','pushup_09','pushup_10','pushup_11','pushup_12'],
    squats: ['squat_00','squat_01','squat_02','squat_03','squat_04'],
    pullups: ['pullup_00','pullup_01','pullup_02','pullup_03','pullup_04','pullup_05'],

}
export const EVALUATION_EXERCISES = {
    pushups: ['pushup_00','pushup_01','pushup_02','pushup_04','pushup_06','pushup_08','pushup_09','pushup_10','pushup_11','pushup_12'],
    squats: ['squat_00','squat_01','squat_02','squat_03','squat_04'],
    pullups: ['pullup_00','pullup_01','pullup_02','pullup_03','pullup_04','pullup_05'],
}
