// ==========================================
// EXERCISE DATABASE
// ==========================================
// tags: leftover free-form classification from the old skill-tree branches
// (e.g. "asymmetry", "planche", "isometric", "hanging"). Not used by the
// stat calculator right now - safe to ignore, extend, or delete per exercise.
// isExplosive: the one branch that DID feed the stat calculator (branch:"power")
// now lives here as a plain boolean.

export const EXERCISE_DB = {

    // |||||||   PUSHUPS   |||||||
    "pushup_01": { id: "pushup_01", name: "Incline Push-up", unit: "reps", category: "pushups", tier: 1, isExplosive: false, tags: [], prerequisites: [], animation: "/videos/incline_pushup.mp4" },
    "pushup_02": { id: "pushup_02", name: "Knee Push-up", unit: "reps", category: "pushups", tier: 2, isExplosive: false, tags: [], prerequisites: ["pushup_01"], animation: "/videos/knee_pushup.mp4" },
    "pushup_03": { id: "pushup_03", name: "Standard Push-up", unit: "reps", category: "pushups", tier: 3, isExplosive: false, tags: [], prerequisites: ["pushup_02"], animation: "/videos/standard_pushup.mp4" },
    "pushup_04D": { id: "pushup_04D", name: "Decline Push-up", unit: "reps", category: "pushups", tier: 4, isExplosive: false, tags: ["shoulders"], prerequisites: ["pushup_03"], animation: "/videos/decline_pushup.mp4" },
    "pushup_04A": { id: "pushup_04A", name: "Diamond Push-up", unit: "reps", category: "pushups", tier: 4, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pushup_03"], animation: "/videos/diamond_pushup.mp4" },
    "pushup_05A": { id: "pushup_05A", name: "Archer Push-up", unit: "reps", category: "pushups", tier: 5, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pushup_04A"], animation: "/videos/archer_pushup.mp4" },
    "pushup_06A": { id: "pushup_06A", name: "One-Arm Assisted Push-up", unit: "reps", category: "pushups", tier: 7, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pushup_05A"], animation: "/videos/onearm_assisted_pushup.mp4" },
    "pushup_07A": { id: "pushup_07A", name: "One-Arm Push-up", unit: "reps", category: "pushups", tier: 8, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pushup_06A"], animation: "/videos/onearm_pushup.mp4" },
    "pushup_04B": { id: "pushup_04B", name: "Explosive Push-up", unit: "reps", category: "pushups", tier: 4, isExplosive: true, tags: [], prerequisites: ["pushup_03"], animation: "/videos/explosive_pushup.mp4" },
    "pushup_05B": { id: "pushup_05B", name: "Clapping Push-up", unit: "reps", category: "pushups", tier: 5, isExplosive: true, tags: [], prerequisites: ["pushup_04B"], animation: "/videos/clapping_pushup.mp4" },
    "pushup_06B": { id: "pushup_06B", name: "Superman Push-up", unit: "reps", category: "pushups", tier: 7, isExplosive: true, tags: [], prerequisites: ["pushup_05B"], animation: "/videos/superman_pushup.mp4" },
    "pushup_04C": { id: "pushup_04C", name: "Pseudo Planche Push-up", unit: "reps", category: "pushups", tier: 6, isExplosive: false, tags: ["planche"], prerequisites: ["pushup_03"], animation: "/videos/pseudo_planche_pushup.mp4" },
    "pushup_05C": { id: "pushup_05C", name: "Tuck Planche Push-up", unit: "reps", category: "pushups", tier: 8, isExplosive: false, tags: ["planche"], prerequisites: ["pushup_04C"], animation: "/videos/tuck_planche_pushup.mp4" },
    "pushup_06C": { id: "pushup_06C", name: "Straddle Planche Push-up", unit: "reps", category: "pushups", tier: 9, isExplosive: false, tags: ["planche"], prerequisites: ["pushup_05C"], animation: "/videos/straddle_planche_pushup.mp4" },
    "pushup_07C": { id: "pushup_07C", name: "Full Planche Push-up", unit: "reps", category: "pushups", tier: 10, isExplosive: false, tags: ["planche"], prerequisites: ["pushup_06C"], animation: "/videos/full_planche_pushup.mp4" },
    "pushup_05D": { id: "pushup_05D", name: "Pike Push-up", unit: "reps", category: "pushups", tier: 4, isExplosive: false, tags: ["shoulders"], prerequisites: ["pushup_04D"], animation: "/videos/pike_pushup.mp4" },
    "pushup_06D": { id: "pushup_06D", name: "Elevated Pike Push-up", unit: "reps", category: "pushups", tier: 5, isExplosive: false, tags: ["shoulders"], prerequisites: ["pushup_05D"], animation: "/videos/elevated_pike_pushup.mp4" },
    "pushup_07D": { id: "pushup_07D", name: "Wall Handstand Push-up", unit: "reps", category: "pushups", tier: 7, isExplosive: false, tags: ["shoulders"], prerequisites: ["pushup_06D"], animation: "/videos/wall_handstand_pushup.mp4" },
    "pushup_08D": { id: "pushup_08D", name: "Freestanding HSPU", unit: "reps", category: "pushups", tier: 9, isExplosive: false, tags: ["shoulders"], prerequisites: ["pushup_07D"], animation: "/videos/freestanding_hspu.mp4" },

    // |||||||   PULLUPS   |||||||
    "pullup_00": { id: "pullup_00", name: "Australian Pull-up", unit: "reps", category: "pullups", tier: 1, isExplosive: false, tags: [], prerequisites: [], animation: "/videos/australian_pullup.mp4" },
    "pullup_01": { id: "pullup_01", name: "Decline Australian Pull-up", unit: "reps", category: "pullups", tier: 2, isExplosive: false, tags: ["horizontal"], prerequisites: ["pullup_00"], animation: "/videos/decline_australian_pullup.mp4" },
    "pullup_02": { id: "pullup_02", name: "Jackknife Pull-up", unit: "reps", category: "pullups", tier: 2, isExplosive: false, tags: [], prerequisites: ["pullup_01"], animation: "/videos/jackknife_pullup.mp4" },
    "pullup_03": { id: "pullup_03", name: "Isometric Hold Pull-up", unit: "seconds", category: "pullups", tier: 3, isExplosive: false, tags: [], prerequisites: ["pullup_02"], animation: "/videos/isometric_hold_pullup.mp4" },
    "pullup_04": { id: "pullup_04", name: "Negative Pull-up", unit: "reps", category: "pullups", tier: 3, isExplosive: false, tags: [], prerequisites: ["pullup_03"], animation: "/videos/negative_pullup.mp4" },
    "pullup_05": { id: "pullup_05", name: "Chin-up", unit: "reps", category: "pullups", tier: 4, isExplosive: false, tags: [], prerequisites: ["pullup_04"], animation: "/videos/chin_up.mp4" },
    "pullup_06": { id: "pullup_06", name: "Standard Pull-up", unit: "reps", category: "pullups", tier: 5, isExplosive: false, tags: [], prerequisites: ["pullup_05"], animation: "/videos/standard_pullup.mp4" },
    "pullup_07A": { id: "pullup_07A", name: "Archer Pull-up", unit: "reps", category: "pullups", tier: 7, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pullup_06"], animation: "/videos/archer_pullup.mp4" },
    "pullup_07B": { id: "pullup_07B", name: "Commando Pull-up", unit: "reps", category: "pullups", tier: 6, isExplosive: true, tags: [], prerequisites: ["pullup_06"], animation: "/videos/commando_pullup.mp4" },
    "pullup_07C1": { id: "pullup_07C1", name: "Wide Grip Pull-up", unit: "reps", category: "pullups", tier: 6, isExplosive: false, tags: ["core"], prerequisites: ["pullup_06"], animation: "/videos/wide_grip_pullup.mp4" },
    "pullup_07C2": { id: "pullup_07C2", name: "Close Grip Pull-up", unit: "reps", category: "pullups", tier: 6, isExplosive: false, tags: ["core"], prerequisites: ["pullup_06"], animation: "/videos/close_grip_pullup.mp4" },
    "pullup_08A": { id: "pullup_08A", name: "Typewriter Pull-up", unit: "reps", category: "pullups", tier: 7, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pullup_07A"], animation: "/videos/typewriter_pullup.mp4" },
    "pullup_08B": { id: "pullup_08B", name: "Explosive Pull-up", unit: "reps", category: "pullups", tier: 7, isExplosive: true, tags: [], prerequisites: ["pullup_07B"], animation: "/videos/explosive_pullup.mp4" },
    "pullup_08C": { id: "pullup_08C", name: "L-Sit Pull-up", unit: "reps", category: "pullups", tier: 7, isExplosive: false, tags: ["core"], prerequisites: ["pullup_07C1","pullup_07C2"], animation: "/videos/l_sit_pullup.mp4" },
    "pullup_09A": { id: "pullup_09A", name: "One-Arm Assisted Pull-up", unit: "reps", category: "pullups", tier: 8, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pullup_08A"], animation: "/videos/one_arm_assisted_pullup.mp4" },
    "pullup_09B": { id: "pullup_09B", name: "Clapping Pull-up", unit: "reps", category: "pullups", tier: 8, isExplosive: true, tags: [], prerequisites: ["pullup_08B"], animation: "/videos/clapping_pullup.mp4" },
    "pullup_09C": { id: "pullup_09C", name: "Behind the Neck Pull-up", unit: "reps", category: "pullups", tier: 7, isExplosive: false, tags: ["core"], prerequisites: ["pullup_08C"], animation: "/videos/behind_neck_pullup.mp4" },
    "pullup_10A": { id: "pullup_10A", name: "One-Arm Chin-up", unit: "reps", category: "pullups", tier: 10, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pullup_09A"], animation: "/videos/one_arm_chinup.mp4" },
    "pullup_10B": { id: "pullup_10B", name: "Muscle-up", unit: "reps", category: "pullups", tier: 9, isExplosive: true, tags: [], prerequisites: ["pullup_09B"], animation: "/videos/muscle_up.mp4" },
    "pullup_10C": { id: "pullup_10C", name: "Front Lever Pull-up", unit: "reps", category: "pullups", tier: 10, isExplosive: false, tags: ["core"], prerequisites: ["pullup_09C"], animation: "/videos/front_lever_pullup.mp4" },
    "pullup_11A": { id: "pullup_11A", name: "One-Arm Pull-up", unit: "reps", category: "pullups", tier: 11, isExplosive: false, tags: ["asymmetry"], prerequisites: ["pullup_10A"], animation: "/videos/one_arm_pullup.mp4" },

    // |||||||   SQUATS   |||||||
    "squat_01": { id: "squat_01", name: "Half Squat", unit: "reps", category: "squats", tier: 1, isExplosive: false, tags: [], prerequisites: [], animation: "/videos/half_squat.mp4" },
    "squat_02": { id: "squat_02", name: "Standard Squat", unit: "reps", category: "squats", tier: 2, isExplosive: false, tags: [], prerequisites: ["squat_01"], animation: "/videos/standard_squat.mp4" },
    "squat_03A": { id: "squat_03A", name: "Forward Lunge", unit: "reps", category: "squats", tier: 3, isExplosive: false, tags: ["unilateral"], prerequisites: ["squat_02"], animation: "/videos/forward_lunge.mp4" },
    "squat_04A": { id: "squat_04A", name: "Bulgarian Split Squat", unit: "reps", category: "squats", tier: 4, isExplosive: false, tags: ["unilateral"], prerequisites: ["squat_03A"], animation: "/videos/bulgarian_split_squat.mp4" },
    "squat_05A": { id: "squat_05A", name: "Assisted Pistol Squat", unit: "reps", category: "squats", tier: 5, isExplosive: false, tags: ["unilateral"], prerequisites: ["squat_04A"], animation: "/videos/assisted_pistol_squat.mp4" },
    "squat_06A": { id: "squat_06A", name: "Pistol Squat", unit: "reps", category: "squats", tier: 6, isExplosive: false, tags: ["unilateral"], prerequisites: ["squat_05A"], animation: "/videos/pistol_squat.mp4" },
    "squat_07A": { id: "squat_07A", name: "Dragon Pistol Squat", unit: "reps", category: "squats", tier: 7, isExplosive: false, tags: ["unilateral"], prerequisites: ["squat_06A"], animation: "/videos/dragon_pistol_squat.mp4" },
    "squat_03B": { id: "squat_03B", name: "Jumping Squat", unit: "reps", category: "squats", tier: 3, isExplosive: true, tags: [], prerequisites: ["squat_02"], animation: "/videos/jumping_squat.mp4" },
    "squat_04B": { id: "squat_04B", name: "Box Jump", unit: "reps", category: "squats", tier: 4, isExplosive: true, tags: [], prerequisites: ["squat_03B"], animation: "/videos/box_jump.mp4" },
    "squat_03C": { id: "squat_03C", name: "Side Lunge", unit: "reps", category: "squats", tier: 3, isExplosive: false, tags: ["mobility"], prerequisites: ["squat_02"], animation: "/videos/side_lunge.mp4" },
    "squat_04C": { id: "squat_04C", name: "Cossack Squat", unit: "reps", category: "squats", tier: 4, isExplosive: false, tags: ["mobility"], prerequisites: ["squat_03C"], animation: "/videos/cossack_squat.mp4" },
    "squat_05C": { id: "squat_05C", name: "Skater Squat", unit: "reps", category: "squats", tier: 5, isExplosive: false, tags: ["mobility"], prerequisites: ["squat_04C"], animation: "/videos/skater_squat.mp4" },

    // |||||||   DIPS   |||||||
    "dip_01": { id: "dip_01", name: "Bench Dips", unit: "reps", category: "dips", tier: 1, isExplosive: false, tags: [], prerequisites: [], animation: "/videos/bench_dips.mp4" },
    "dip_02": { id: "dip_02", name: "Straight Bar Dips", unit: "reps", category: "dips", tier: 2, isExplosive: false, tags: [], prerequisites: ["dip_01"], animation: "/videos/straight_bar_dips.mp4" },
    "dip_03": { id: "dip_03", name: "Parallel Bar Dips", unit: "reps", category: "dips", tier: 3, isExplosive: false, tags: [], prerequisites: ["dip_02"], animation: "/videos/parallel_bar_dips.mp4" },
    "dip_04A": { id: "dip_04A", name: "Ring Dips", unit: "reps", category: "dips", tier: 4, isExplosive: false, tags: ["stability"], prerequisites: ["dip_03"], animation: "/videos/ring_dips.mp4" },
    "dip_05A": { id: "dip_05A", name: "Bulgarian Ring Dips", unit: "reps", category: "dips", tier: 5, isExplosive: false, tags: ["stability"], prerequisites: ["dip_04A"], animation: "/videos/bulgarian_ring_dips.mp4" },

    // |||||||   CORE   |||||||
    "core_00A": { id: "core_00A", name: "Plank", unit: "seconds", category: "core", tier: 1, isExplosive: false, tags: ["isometric"], prerequisites: [], animation: "/videos/plank.mp4" },
    "core_01A": { id: "core_01A", name: "Hollow Body Hold", unit: "seconds", category: "core", tier: 3, isExplosive: false, tags: ["isometric"], prerequisites: ["core_00A"], animation: "/videos/hollow_body_hold.mp4" },
    "core_02A": { id: "core_02A", name: "L-Sit", unit: "seconds", category: "core", tier: 6, isExplosive: false, tags: ["isometric"], prerequisites: ["core_01A"], animation: "/videos/l_sit.mp4" },
    "core_03A": { id: "core_03A", name: "V-Sit", unit: "seconds", category: "core", tier: 8, isExplosive: false, tags: ["isometric"], prerequisites: ["core_02A"], animation: "/videos/v_sit.mp4" },
    "core_04A": { id: "core_04A", name: "Front Lever Hold", unit: "seconds", category: "core", tier: 9, isExplosive: false, tags: ["isometric"], prerequisites: ["core_03A"], animation: "/videos/front_lever_hold.mp4" },
    "core_05A": { id: "core_05A", name: "Human Flag", unit: "seconds", category: "core", tier: 10, isExplosive: false, tags: ["isometric"], prerequisites: ["core_04A"], animation: "/videos/human_flag.mp4" },
    "core_00": { id: "core_00", name: "Crunches", unit: "reps", category: "core", tier: 1, isExplosive: false, tags: [], prerequisites: [], animation: "/videos/crunches.mp4" },
    "core_01": { id: "core_01", name: "Lying Leg Raises", unit: "reps", category: "core", tier: 2, isExplosive: false, tags: [], prerequisites: ["core_00"], animation: "/videos/lying_leg_raises.mp4" },
    "core_02B": { id: "core_02B", name: "Hanging Knee Raises", unit: "reps", category: "core", tier: 3, isExplosive: false, tags: ["hanging"], prerequisites: ["core_01"], animation: "/videos/hanging_knee_raises.mp4" },
    "core_03B": { id: "core_03B", name: "Hanging Leg Raises", unit: "reps", category: "core", tier: 5, isExplosive: false, tags: ["hanging"], prerequisites: ["core_02B"], animation: "/videos/hanging_leg_raises.mp4" },
    "core_04B": { id: "core_04B", name: "Toes to Bar", unit: "reps", category: "core", tier: 6, isExplosive: false, tags: ["hanging"], prerequisites: ["core_03B"], animation: "/videos/toes_to_bar.mp4" },
    "core_02C": { id: "core_02C", name: "Russian Twists", unit: "reps", category: "core", tier: 2, isExplosive: false, tags: ["rotation"], prerequisites: ["core_01"], animation: "/videos/russian_twists.mp4" },
    "core_03C": { id: "core_03C", name: "Windshield Wipers", unit: "reps", category: "core", tier: 5, isExplosive: false, tags: ["rotation"], prerequisites: ["core_02C"], animation: "/videos/windshield_wipers.mp4" },
    "core_02D": { id: "core_02D", name: "Ab Wheel Rollout", unit: "reps", category: "core", tier: 5, isExplosive: false, tags: ["extension"], prerequisites: ["core_01"], animation: "/videos/ab_wheel_rollout.mp4" },
    "core_03D": { id: "core_03D", name: "Dragon Flag", unit: "reps", category: "core", tier: 7, isExplosive: false, tags: ["extension"], prerequisites: ["core_02D"], animation: "/videos/dragon_flag.mp4" },
};

export const ALL_EXERCISES = Object.values(EXERCISE_DB).reduce((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex.id);
    return acc;
}, {});

export const EVALUATION_EXERCISES = {
    pushups: ['pushup_01', 'pushup_02', 'pushup_03', 'pushup_04A', 'pushup_05A', 'pushup_06A', 'pushup_07A'],
    squats: ['squat_01', 'squat_02', 'squat_03A', 'squat_04A', 'squat_05A', 'squat_06A', 'squat_07A'],
    core: ['core_00', 'core_01', 'core_02B', 'core_03B', 'core_04B'],
    pullups: ['pullup_00', 'pullup_01', 'pullup_02', 'pullup_04', 'pullup_06', 'pullup_07A', 'pullup_08A', 'pullup_09A', 'pullup_10A', 'pullup_11A']
};