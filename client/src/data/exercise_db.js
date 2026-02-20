export const EXERCISE_DB = {
    // --- PUSH-UPS ---
    "pushup_00": {
        id: "pushup_00",
        name: "Wall Push-up",
        animation: "/videos/wall_pushup.mp4",
        tier: 0,
        totalReps: 0,
        maxReps: 0,
        prerequisites: [], 
    },
    "pushup_01": {
        id: "pushup_01",
        name: "Incline Push-up",
        animation: "/videos/incline_pushup.mp4",
        tier: 1,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_00"],
    },
    "pushup_02": {
        id: "pushup_02",
        name: "Knee Push-up",
        animation: "/videos/knee_pushup.mp4",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_01"],
    },
    "pushup_03": {
        id: "pushup_03",
        name: "Standard Push-up",
        animation: "/videos/standard_pushup.mp4",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_02"], // Path A: Tricep/One-Arm focus
    },
    "pushup_04": {
        id: "pushup_04",
        name: "Wide Pushup",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_02"], 
    },
    "pushup_05": {
        id: "pushup_05",
        name: "Narrow Pushup",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        prerequisites: ["pushup_02"], // Path C: Power focus
    },
    "pushup_06": {
        id: "pushup_06",
        name: "Diamond Pushup",
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

    // |||||||   PULL-UPS   |||||||

    // --- BEGINNER --
    "pullup_00": {
        id: "pullup_00",
        name: "Wall Pull",
        animation: "",
        tier: 0.2,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_01'],
        prerequisites: [], 
    },
    "pullup_01": {
        id: "pullup_01",
        name: "Australian Pull-up",
        animation: "",
        tier: 0.8,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_02'],
        prerequisites: ['pullup_00'], 
    },

    // --- INTERMIDIATE --
    "pullup_02": {
        id: "pullup_02",
        name: "Jackknife Pull-up",
        animation: "",
        tier: 1,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_03'],
        prerequisites: ['pullup_01'], 
    },
    "pullup_03": {
        id: "pullup_03",
        name: "Isometric Hold Pull-up",
        animation: "",
        tier: 1.5,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_04'],
        prerequisites: ['pullup_02'], 
    },
    "pullup_04": {
        id: "pullup_04",
        name: "Negative Pull-up",
        animation: "",
        tier: 1.8,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_05'],
        prerequisites: ['pullup_03'], 
    },

    // --- ADVANCED --
    "pullup_05": {
        id: "pullup_05",
        name: "Chin-up",
        animation: "",
        tier: 2,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_06'],
        prerequisites: ['pullup_04'], 
    },
    "pullup_06": {
        id: "pullup_06",
        name: "Standard Pull-up",
        animation: "",
        tier: 2.8,
        totalReps: 0,
        maxReps: 0,
        unlocks: ['pullup_07A','pullup_07B','pullup_07C'],
        prerequisites: ['pullup_05'], 
    },

    // 1. START OF BRANCHES 
    "pullup_07A": {
        id: "pullup_07A",
        name: "Archer Pull-up",
        animation: "",
        tier: 3,
        totalReps: 0,
        maxReps: 0,
        branch: 'asymmetry',
        unlocks: ['pullup_08A'],
        prerequisites: ['pullup_06'], 
    },
    "pullup_07B": {
        id: "pullup_07B",
        name: "Commando Pull-up",
        animation: "",
        tier: 3.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'power',
        unlocks: ['pullup_08B'],
        prerequisites: ['pullup_06'], 
    },
    "pullup_07C1": {
        id: "pullup_07C1",
        name: "Wide Grip Pull-up",
        animation: "",
        tier: 3.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'core',
        unlocks: ['pullup_08C'],
        prerequisites: ['pullup_06'], 
    },
    "pullup_07C2": {
        id: "pullup_07C2",
        name: "Wide Grip Pull-up",
        animation: "",
        tier: 3.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'core',
        unlocks: ['pullup_08C'],
        prerequisites: ['pullup_06'], 
    },

    // 2.
    "pullup_08A": {
        id: "pullup_08A",
        name: "Typewriter Pull-up",
        animation: "",
        tier: 3.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'asymmetry',
        unlocks: ['pullup_06'],
        prerequisites: ['pullup_07A'], 
    },
    "pullup_08B": {
        id: "pullup_08B",
        name: "Explosive Pull-up",
        animation: "",
        tier: 3.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'power',
        unlocks: ['pullup_06'],
        prerequisites: ['pullup_07B'], 
    },
    "pullup_08C": {
        id: "pullup_08C",
        name: "L-Sit Pull-up",
        animation: "",
        tier: 3.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'core',
        unlocks: ['pullup_06'],
        prerequisites: ['pullup_07C1','pullup_07C2'], 
    },

    // 3.
    "pullup_09A": {
        id: "pullup_09A",
        name: "One-Arm Assisted Pull-up",
        animation: "",
        tier: 4,
        totalReps: 0,
        maxReps: 0,
        branch: 'asymmetry',
        unlocks: ['pullup_10A'],
        prerequisites: ['pullup_08A'], 
    },
    "pullup_09B": {
        id: "pullup_09B",
        name: "Clapping Pull-up",
        animation: "",
        tier: 4,
        totalReps: 0,
        maxReps: 0,
        branch: 'power',
        unlocks: ['pullup_10B'],
        prerequisites: ['pullup_08B'], 
    },
    "pullup_09C": {
        id: "pullup_09C",
        name: "Behind the Neck Pull-up",
        animation: "",
        tier: 4,
        totalReps: 0,
        maxReps: 0,
        branch: 'core',
        unlocks: ['pullup_10C'],
        prerequisites: ['pullup_08C'], 
    },

    // 4.
    "pullup_10A": {
        id: "pullup_10A",
        name: "One-Arm Chin-up",
        animation: "",
        tier: 5,
        totalReps: 0,
        maxReps: 0,
        branch: 'asymmetry',
        unlocks: ['pushup_11A'],
        prerequisites: ['pullup_09A'], 
    },
    "pullup_10B": {
        id: "pullup_10B",
        name: "Muscle-up",
        animation: "",
        tier: 5,
        totalReps: 0,
        maxReps: 0,
        branch: 'power',
        unlocks: [],
        prerequisites: ['pullup_09B'], 
    },
    "pullup_10C": {
        id: "pullup_10C",
        name: "Front Lever Pull-up",
        animation: "",
        tier: 5.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'core',
        unlocks: [],
        prerequisites: ['pullup_09C'], 
    },

    //5.
    "pullup_11A": {
        id: "pullup_11A",
        name: "One-Arm Pull-up",
        animation: "",
        tier: 5.5,
        totalReps: 0,
        maxReps: 0,
        branch: 'core',
        unlocks: [],
        prerequisites: ['pullup_10C'], 
    },

}
export const ALL_EXERCISES = {
    pushups: ['pushup_00','pushup_01','pushup_02','pushup_03','pushup_04','pushup_05','pushup_06','pushup_07','pushup_08','pushup_09','pushup_10','pushup_11','pushup_12'],
    squats: ['squat_00','squat_01','squat_02','squat_03','squat_04'],
    pullups: ['pullup_00','pullup_01','pullup_02','pullup_03','pullup_04','pullup_05','pullup_06','pullup_07A','pullup_07B','pullup_07C1','pullup_07C2','pullup_08A','pullup_08B','pullup_08C','pullup_09A','pullup_09B','pullup_09C','pullup_10A','pullup_10B','pullup_10C','pullup_11A'],

}
export const EVALUATION_EXERCISES = {
    pushups: ['pushup_00','pushup_01','pushup_02','pushup_04','pushup_06','pushup_08','pushup_09','pushup_10','pushup_11','pushup_12'],
    squats: ['squat_00','squat_01','squat_02','squat_03','squat_04'],
    pullups: ['pullup_00','pullup_01','pullup_02','pullup_03','pullup_04','pullup_05'],
}
export const SPLIT_MODES = {
    'Push & Pull': ['pushups', 'pullups','squats'],
    'Legs & Core': ['squats', 'core'],
    'Full Body': ['pushups', 'pullups', 'squats', 'core']
};

/* PUSHUPS (Kliky)
Wall Pushup (X)
Incline Pushup (X)
Knee Pushup (X)
Standard Pushup (X)
Wide Pushup (X)
Narrow / Close-grip Pushup (X)
Diamond Pushup ( )
Knuckle Pushup ( )
Fingertip Pushup ( )
Decline Pushup ( ) 
Pike Pushup ( )
Hindu Pushup ( )
Divebomber Pushup ( )
Spiderman Pushup ( )
Typewriter Pushup ( )
Archer Pushup ( )
Clapping Pushup
Explosive / Jumping Pushup
Superman Pushup
Aztec Pushup
One-Arm Assisted Pushup X
One-Arm Pushup X
Planche Lean Pushup X
Straddle Planche Pushup ( )
Full Planche Pushup ( )
90-Degree Pushup (Hollowback)




PULLUPS (Shyby a tahy)
Wall Pull (X)
Horizontal Pull / Australian Pullup (X)
Jackknife Pullup (X)
Negative Pullup (X)
Isometric Hold Pullup (X)
Chin-up (X)
Standard Pullup (X)
Wide Grip Pullup (X)
Close Grip Pullup (X)
Commando Pullup (X)
Behind the Neck Pullup (X)
L-Sit Pullup (X)
Archer Pullup (X)
Typewriter Pullup (X)
Explosive / Clapping Pullup (X)
Muscle-up
One-Arm Assisted Pullup / Mantle Pullup (X)
One-Arm Chin-up
One-Arm Pullup
Front Lever Pullup

SQUATS (Dřepy a nohy)
Assisted Squat
Half Squat
Standard Bodyweight Squat
Narrow Squat
Sumo Squat
Forward Lunge
Reverse Lunge
Side Lunge
Bulgarian Split Squat
Jumping Squat
Box Jump
Cossack Squat
Shrimp Squat
Skater Squat
Assisted Pistol Squat
Pistol Squat
Dragon Pistol Squat
Sissy Squat
Nordic Hamstring Curl

CORE / ABS (Břicho a střed těla)
Plank
Side Plank
Crunches
Sit-ups
Lying Leg Raises
Flutter Kicks
Russian Twists
Hollow Body hold
V-Ups
Jackknife Crunches
Bicycle Crunches
Hanging Knee Raises
Hanging Leg Raises
L-Sit
V-Sit
Windshield Wipers
Dragon Flag
Ab Wheel Rollout
Front Lever Hold
Human Flag (Human Flag)

DIPS (Kliky na bradlech / Triceps)
Bench Dips
Assisted Parallel Bar Dips
Straight Bar Dips
Parallel Bar Dips
L-Sit Dips
Ring Dips
Bulgarian Ring Dips
Korean Dips
Russian Dips
Impossible Dips

HANDSTAND / SHOULDERS (Stojky a ramena)
Pike Hold
Wall Walk / Wall Climb
Chest-to-Wall Handstand
Back-to-Wall Handstand
Freestanding Handstand
Frog Stand / Crow Pose
Tuck Planche
Handstand Shoulder Taps
Wall-Assisted Handstand Pushup (HSPU)
Freestanding Handstand Pushup
Tiger Bend Pushup */