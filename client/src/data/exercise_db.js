// ==========================================
// EXERCISE DATABASE
// ==========================================
// Schema:
//   id                 - immutable slug, never changes once shipped
//   branch             - single curated branch (replaces old free-form tags)
//   tier               - hand-assigned difficulty rank, freely editable
//   isExplosive        - native power-branch exercise, always feeds power stat
//   supportedModifiers - keys from MODIFIERS the UI may offer for this exercise
//
// Modifiers live on logged sets, not in this DB:
//   { exerciseId: "pushup_standard", reps: 12, modifiers: ["incline"] }

export const MODIFIERS = {
    incline:   { label: "Incline",       effect: "easier" },
    decline:   { label: "Decline",       effect: "harder" },
    band:      { label: "Band Assisted", effect: "easier" },
    explosive: { label: "Explosive",     effect: "power"  },
};

export const EXERCISE_DB = {

    // |||||||   PUSHUPS   |||||||
    "pushup_knee": { id: "pushup_knee", name: "Knee Push-up", unit: "reps", category: "pushups", branch: "standard", tier: 1, isExplosive: false, supportedModifiers: ["incline"], prerequisites: [], animation: "/videos/knee_pushup.mp4" },
    "pushup_standard": { id: "pushup_standard", name: "Standard Push-up", unit: "reps", category: "pushups", branch: "standard", tier: 2, isExplosive: false, supportedModifiers: ["incline", "decline"], prerequisites: ["pushup_knee"], animation: "/videos/standard_pushup.mp4" },
    "pushup_diamond": { id: "pushup_diamond", name: "Diamond Push-up", unit: "reps", category: "pushups", branch: "asymmetry", tier: 4, isExplosive: false, supportedModifiers: ["incline", "decline", "explosive"], prerequisites: ["pushup_standard"], animation: "/videos/diamond_pushup.mp4" },
    "pushup_archer": { id: "pushup_archer", name: "Archer Push-up", unit: "reps", category: "pushups", branch: "asymmetry", tier: 5, isExplosive: false, supportedModifiers: ["incline", "decline"], prerequisites: ["pushup_diamond"], animation: "/videos/archer_pushup.mp4" },
    "pushup_onearm_assisted": { id: "pushup_onearm_assisted", name: "One-Arm Assisted Push-up", unit: "reps", category: "pushups", branch: "asymmetry", tier: 7, isExplosive: false, supportedModifiers: ["incline", "band"], prerequisites: ["pushup_archer"], animation: "/videos/onearm_assisted_pushup.mp4" },
    "pushup_onearm": { id: "pushup_onearm", name: "One-Arm Push-up", unit: "reps", category: "pushups", branch: "asymmetry", tier: 8, isExplosive: false, supportedModifiers: ["incline", "decline"], prerequisites: ["pushup_onearm_assisted"], animation: "/videos/onearm_pushup.mp4" },
    "pushup_explosive": { id: "pushup_explosive", name: "Explosive Push-up", unit: "reps", category: "pushups", branch: "power", tier: 4, isExplosive: true, supportedModifiers: ["incline"], prerequisites: ["pushup_standard"], animation: "/videos/explosive_pushup.mp4" },
    "pushup_clapping": { id: "pushup_clapping", name: "Clapping Push-up", unit: "reps", category: "pushups", branch: "power", tier: 5, isExplosive: true, supportedModifiers: ["incline"], prerequisites: ["pushup_explosive"], animation: "/videos/clapping_pushup.mp4" },
    "pushup_superman": { id: "pushup_superman", name: "Superman Push-up", unit: "reps", category: "pushups", branch: "power", tier: 7, isExplosive: true, supportedModifiers: [], prerequisites: ["pushup_clapping"], animation: "/videos/superman_pushup.mp4" },
    "pushup_pseudo_planche": { id: "pushup_pseudo_planche", name: "Pseudo Planche Push-up", unit: "reps", category: "pushups", branch: "planche", tier: 6, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pushup_standard"], animation: "/videos/pseudo_planche_pushup.mp4" },
    "pushup_planche_tuck": { id: "pushup_planche_tuck", name: "Tuck Planche Push-up", unit: "reps", category: "pushups", branch: "planche", tier: 8, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pushup_pseudo_planche"], animation: "/videos/tuck_planche_pushup.mp4" },
    "pushup_planche_straddle": { id: "pushup_planche_straddle", name: "Straddle Planche Push-up", unit: "reps", category: "pushups", branch: "planche", tier: 9, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pushup_planche_tuck"], animation: "/videos/straddle_planche_pushup.mp4" },
    "pushup_planche_full": { id: "pushup_planche_full", name: "Full Planche Push-up", unit: "reps", category: "pushups", branch: "planche", tier: 10, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pushup_planche_straddle"], animation: "/videos/full_planche_pushup.mp4" },
    "pushup_pike": { id: "pushup_pike", name: "Pike Push-up", unit: "reps", category: "pushups", branch: "shoulders", tier: 4, isExplosive: false, supportedModifiers: ["decline"], prerequisites: ["pushup_standard"], animation: "/videos/pike_pushup.mp4" },
    "pushup_hspu_wall": { id: "pushup_hspu_wall", name: "Wall Handstand Push-up", unit: "reps", category: "pushups", branch: "shoulders", tier: 7, isExplosive: false, supportedModifiers: [], prerequisites: ["pushup_pike"], animation: "/videos/wall_handstand_pushup.mp4" },
    "pushup_hspu_free": { id: "pushup_hspu_free", name: "Freestanding HSPU", unit: "reps", category: "pushups", branch: "shoulders", tier: 9, isExplosive: false, supportedModifiers: [], prerequisites: ["pushup_hspu_wall"], animation: "/videos/freestanding_hspu.mp4" },
    "pushup_ring": { id: "pushup_ring", name: "Ring Push-up", unit: "reps", category: "pushups", branch: "stability", tier: 4, isExplosive: false, supportedModifiers: ["incline", "decline"], prerequisites: ["pushup_standard"], animation: "/videos/ring_pushup.mp4" },

    // |||||||   PULLUPS   |||||||
    "pullup_australian": { id: "pullup_australian", name: "Australian Pull-up", unit: "reps", category: "pullups", branch: "standard", tier: 1, isExplosive: false, supportedModifiers: ["incline", "decline"], prerequisites: [], animation: "/videos/australian_pullup.mp4" },
    "pullup_scapular": { id: "pullup_scapular", name: "Scapular Pulls", unit: "reps", category: "pullups", branch: "standard", tier: 1, isExplosive: false, supportedModifiers: ["band"], prerequisites: [], animation: "/videos/scapular_pulls.mp4" },
    "pullup_jackknife": { id: "pullup_jackknife", name: "Jackknife Pull-up", unit: "reps", category: "pullups", branch: "standard", tier: 2, isExplosive: false, supportedModifiers: [], prerequisites: ["pullup_australian"], animation: "/videos/jackknife_pullup.mp4" },
    "pullup_iso_hold": { id: "pullup_iso_hold", name: "Isometric Hold Pull-up", unit: "seconds", category: "pullups", branch: "standard", tier: 3, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_jackknife", "pullup_scapular"], animation: "/videos/isometric_hold_pullup.mp4" },
    "pullup_negative": { id: "pullup_negative", name: "Negative Pull-up", unit: "reps", category: "pullups", branch: "standard", tier: 3, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_iso_hold"], animation: "/videos/negative_pullup.mp4" },
    "pullup_chin": { id: "pullup_chin", name: "Chin-up", unit: "reps", category: "pullups", branch: "standard", tier: 4, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_negative"], animation: "/videos/chin_up.mp4" },
    "pullup_standard": { id: "pullup_standard", name: "Standard Pull-up", unit: "reps", category: "pullups", branch: "standard", tier: 5, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_chin"], animation: "/videos/standard_pullup.mp4" },
    "pullup_archer": { id: "pullup_archer", name: "Archer Pull-up", unit: "reps", category: "pullups", branch: "asymmetry", tier: 7, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_standard"], animation: "/videos/archer_pullup.mp4" },
    "pullup_commando": { id: "pullup_commando", name: "Commando Pull-up", unit: "reps", category: "pullups", branch: "power", tier: 6, isExplosive: true, supportedModifiers: ["band"], prerequisites: ["pullup_standard"], animation: "/videos/commando_pullup.mp4" },
    "pullup_wide": { id: "pullup_wide", name: "Wide Grip Pull-up", unit: "reps", category: "pullups", branch: "core", tier: 6, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_standard"], animation: "/videos/wide_grip_pullup.mp4" },
    "pullup_close": { id: "pullup_close", name: "Close Grip Pull-up", unit: "reps", category: "pullups", branch: "core", tier: 6, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_standard"], animation: "/videos/close_grip_pullup.mp4" },
    "pullup_typewriter": { id: "pullup_typewriter", name: "Typewriter Pull-up", unit: "reps", category: "pullups", branch: "asymmetry", tier: 7, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_archer"], animation: "/videos/typewriter_pullup.mp4" },
    "pullup_explosive": { id: "pullup_explosive", name: "Explosive Pull-up", unit: "reps", category: "pullups", branch: "power", tier: 7, isExplosive: true, supportedModifiers: ["band"], prerequisites: ["pullup_commando"], animation: "/videos/explosive_pullup.mp4" },
    "pullup_lsit": { id: "pullup_lsit", name: "L-Sit Pull-up", unit: "reps", category: "pullups", branch: "core", tier: 7, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_wide", "pullup_close"], animation: "/videos/l_sit_pullup.mp4" },
    "pullup_onearm_assisted": { id: "pullup_onearm_assisted", name: "One-Arm Assisted Pull-up", unit: "reps", category: "pullups", branch: "asymmetry", tier: 8, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_typewriter"], animation: "/videos/one_arm_assisted_pullup.mp4" },
    "pullup_clapping": { id: "pullup_clapping", name: "Clapping Pull-up", unit: "reps", category: "pullups", branch: "power", tier: 8, isExplosive: true, supportedModifiers: ["band"], prerequisites: ["pullup_explosive"], animation: "/videos/clapping_pullup.mp4" },
    "pullup_behind_neck": { id: "pullup_behind_neck", name: "Behind the Neck Pull-up", unit: "reps", category: "pullups", branch: "core", tier: 7, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_lsit"], animation: "/videos/behind_neck_pullup.mp4" },
    "pullup_onearm_chin": { id: "pullup_onearm_chin", name: "One-Arm Chin-up", unit: "reps", category: "pullups", branch: "asymmetry", tier: 10, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_onearm_assisted"], animation: "/videos/one_arm_chinup.mp4" },
    "pullup_muscleup": { id: "pullup_muscleup", name: "Muscle-up", unit: "reps", category: "pullups", branch: "power", tier: 9, isExplosive: true, supportedModifiers: ["band"], prerequisites: ["pullup_clapping"], animation: "/videos/muscle_up.mp4" },
    "pullup_front_lever": { id: "pullup_front_lever", name: "Front Lever Pull-up", unit: "reps", category: "pullups", branch: "core", tier: 10, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_behind_neck"], animation: "/videos/front_lever_pullup.mp4" },
    "pullup_onearm": { id: "pullup_onearm", name: "One-Arm Pull-up", unit: "reps", category: "pullups", branch: "asymmetry", tier: 11, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["pullup_onearm_chin"], animation: "/videos/one_arm_pullup.mp4" },

    // |||||||   SQUATS   |||||||
    "squat_half": { id: "squat_half", name: "Half Squat", unit: "reps", category: "squats", branch: "standard", tier: 1, isExplosive: false, supportedModifiers: [], prerequisites: [], animation: "/videos/half_squat.mp4" },
    "squat_standard": { id: "squat_standard", name: "Standard Squat", unit: "reps", category: "squats", branch: "standard", tier: 2, isExplosive: false, supportedModifiers: [], prerequisites: ["squat_half"], animation: "/videos/standard_squat.mp4" },
    "squat_lunge": { id: "squat_lunge", name: "Forward Lunge", unit: "reps", category: "squats", branch: "unilateral", tier: 3, isExplosive: false, supportedModifiers: ["explosive"], prerequisites: ["squat_standard"], animation: "/videos/forward_lunge.mp4" },
    "squat_bulgarian": { id: "squat_bulgarian", name: "Bulgarian Split Squat", unit: "reps", category: "squats", branch: "unilateral", tier: 4, isExplosive: false, supportedModifiers: ["explosive"], prerequisites: ["squat_lunge"], animation: "/videos/bulgarian_split_squat.mp4" },
    "squat_pistol_assisted": { id: "squat_pistol_assisted", name: "Assisted Pistol Squat", unit: "reps", category: "squats", branch: "unilateral", tier: 5, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["squat_bulgarian"], animation: "/videos/assisted_pistol_squat.mp4" },
    "squat_pistol": { id: "squat_pistol", name: "Pistol Squat", unit: "reps", category: "squats", branch: "unilateral", tier: 6, isExplosive: false, supportedModifiers: ["band", "explosive"], prerequisites: ["squat_pistol_assisted"], animation: "/videos/pistol_squat.mp4" },
    "squat_pistol_dragon": { id: "squat_pistol_dragon", name: "Dragon Pistol Squat", unit: "reps", category: "squats", branch: "unilateral", tier: 7, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["squat_pistol"], animation: "/videos/dragon_pistol_squat.mp4" },
    "squat_jump": { id: "squat_jump", name: "Jumping Squat", unit: "reps", category: "squats", branch: "power", tier: 3, isExplosive: true, supportedModifiers: [], prerequisites: ["squat_standard"], animation: "/videos/jumping_squat.mp4" },
    "squat_box_jump": { id: "squat_box_jump", name: "Box Jump", unit: "reps", category: "squats", branch: "power", tier: 4, isExplosive: true, supportedModifiers: [], prerequisites: ["squat_jump"], animation: "/videos/box_jump.mp4" },
    "squat_broad_jump": { id: "squat_broad_jump", name: "Broad Jump", unit: "reps", category: "squats", branch: "power", tier: 5, isExplosive: true, supportedModifiers: [], prerequisites: ["squat_box_jump"], animation: "/videos/broad_jump.mp4" },
    "squat_lunge_side": { id: "squat_lunge_side", name: "Side Lunge", unit: "reps", category: "squats", branch: "mobility", tier: 3, isExplosive: false, supportedModifiers: [], prerequisites: ["squat_standard"], animation: "/videos/side_lunge.mp4" },
    "squat_cossack": { id: "squat_cossack", name: "Cossack Squat", unit: "reps", category: "squats", branch: "mobility", tier: 4, isExplosive: false, supportedModifiers: [], prerequisites: ["squat_lunge_side"], animation: "/videos/cossack_squat.mp4" },
    "squat_skater": { id: "squat_skater", name: "Skater Squat", unit: "reps", category: "squats", branch: "mobility", tier: 5, isExplosive: false, supportedModifiers: ["explosive"], prerequisites: ["squat_cossack"], animation: "/videos/skater_squat.mp4" },
    "squat_shrimp": { id: "squat_shrimp", name: "Shrimp Squat", unit: "reps", category: "squats", branch: "mobility", tier: 6, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["squat_skater"], animation: "/videos/shrimp_squat.mp4" },

    // |||||||   DIPS   |||||||
    "dip_bench": { id: "dip_bench", name: "Bench Dips", unit: "reps", category: "dips", branch: "standard", tier: 1, isExplosive: false, supportedModifiers: ["decline"], prerequisites: [], animation: "/videos/bench_dips.mp4" },
    "dip_bar": { id: "dip_bar", name: "Straight Bar Dips", unit: "reps", category: "dips", branch: "standard", tier: 2, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["dip_bench"], animation: "/videos/straight_bar_dips.mp4" },
    "dip_parallel": { id: "dip_parallel", name: "Parallel Bar Dips", unit: "reps", category: "dips", branch: "standard", tier: 3, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["dip_bar"], animation: "/videos/parallel_bar_dips.mp4" },
    "dip_ring": { id: "dip_ring", name: "Ring Dips", unit: "reps", category: "dips", branch: "stability", tier: 4, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["dip_parallel"], animation: "/videos/ring_dips.mp4" },
    "dip_ring_bulgarian": { id: "dip_ring_bulgarian", name: "Bulgarian Ring Dips", unit: "reps", category: "dips", branch: "stability", tier: 5, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["dip_ring"], animation: "/videos/bulgarian_ring_dips.mp4" },
    "dip_korean": { id: "dip_korean", name: "Korean Dips", unit: "reps", category: "dips", branch: "standard", tier: 5, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["dip_parallel"], animation: "/videos/korean_dips.mp4" },
    "dip_explosive": { id: "dip_explosive", name: "Explosive Dips", unit: "reps", category: "dips", branch: "power", tier: 4, isExplosive: true, supportedModifiers: ["band"], prerequisites: ["dip_parallel"], animation: "/videos/explosive_dips.mp4" },

    // |||||||   CORE   |||||||
    "core_plank": { id: "core_plank", name: "Plank", unit: "seconds", category: "core", branch: "isometric", tier: 1, isExplosive: false, supportedModifiers: ["incline", "decline"], prerequisites: [], animation: "/videos/plank.mp4" },
    "core_plank_side": { id: "core_plank_side", name: "Side Plank", unit: "seconds", category: "core", branch: "isometric", tier: 2, isExplosive: false, supportedModifiers: [], prerequisites: ["core_plank"], animation: "/videos/side_plank.mp4" },
    "core_hollow": { id: "core_hollow", name: "Hollow Body Hold", unit: "seconds", category: "core", branch: "isometric", tier: 3, isExplosive: false, supportedModifiers: [], prerequisites: ["core_plank"], animation: "/videos/hollow_body_hold.mp4" },
    "core_lsit": { id: "core_lsit", name: "L-Sit", unit: "seconds", category: "core", branch: "isometric", tier: 6, isExplosive: false, supportedModifiers: [], prerequisites: ["core_hollow"], animation: "/videos/l_sit.mp4" },
    "core_vsit": { id: "core_vsit", name: "V-Sit", unit: "seconds", category: "core", branch: "isometric", tier: 8, isExplosive: false, supportedModifiers: [], prerequisites: ["core_lsit"], animation: "/videos/v_sit.mp4" },
    "core_front_lever_hold": { id: "core_front_lever_hold", name: "Front Lever Hold", unit: "seconds", category: "core", branch: "isometric", tier: 9, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["core_vsit"], animation: "/videos/front_lever_hold.mp4" },
    "core_human_flag": { id: "core_human_flag", name: "Human Flag", unit: "seconds", category: "core", branch: "isometric", tier: 10, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["core_front_lever_hold"], animation: "/videos/human_flag.mp4" },
    "core_crunch": { id: "core_crunch", name: "Crunches", unit: "reps", category: "core", branch: "standard", tier: 1, isExplosive: false, supportedModifiers: [], prerequisites: [], animation: "/videos/crunches.mp4" },
    "core_leg_raise": { id: "core_leg_raise", name: "Lying Leg Raises", unit: "reps", category: "core", branch: "standard", tier: 2, isExplosive: false, supportedModifiers: ["incline"], prerequisites: ["core_crunch"], animation: "/videos/lying_leg_raises.mp4" },
    "core_knee_raise_hanging": { id: "core_knee_raise_hanging", name: "Hanging Knee Raises", unit: "reps", category: "core", branch: "hanging", tier: 3, isExplosive: false, supportedModifiers: [], prerequisites: ["core_leg_raise"], animation: "/videos/hanging_knee_raises.mp4" },
    "core_leg_raise_hanging": { id: "core_leg_raise_hanging", name: "Hanging Leg Raises", unit: "reps", category: "core", branch: "hanging", tier: 5, isExplosive: false, supportedModifiers: [], prerequisites: ["core_knee_raise_hanging"], animation: "/videos/hanging_leg_raises.mp4" },
    "core_toes_to_bar": { id: "core_toes_to_bar", name: "Toes to Bar", unit: "reps", category: "core", branch: "hanging", tier: 6, isExplosive: false, supportedModifiers: [], prerequisites: ["core_leg_raise_hanging"], animation: "/videos/toes_to_bar.mp4" },
    "core_russian_twist": { id: "core_russian_twist", name: "Russian Twists", unit: "reps", category: "core", branch: "rotation", tier: 2, isExplosive: false, supportedModifiers: [], prerequisites: ["core_leg_raise"], animation: "/videos/russian_twists.mp4" },
    "core_wipers": { id: "core_wipers", name: "Windshield Wipers", unit: "reps", category: "core", branch: "rotation", tier: 5, isExplosive: false, supportedModifiers: [], prerequisites: ["core_russian_twist"], animation: "/videos/windshield_wipers.mp4" },
    "core_ab_wheel": { id: "core_ab_wheel", name: "Ab Wheel Rollout", unit: "reps", category: "core", branch: "extension", tier: 5, isExplosive: false, supportedModifiers: [], prerequisites: ["core_leg_raise"], animation: "/videos/ab_wheel_rollout.mp4" },
    "core_dragon_flag": { id: "core_dragon_flag", name: "Dragon Flag", unit: "reps", category: "core", branch: "extension", tier: 7, isExplosive: false, supportedModifiers: ["band"], prerequisites: ["core_ab_wheel"], animation: "/videos/dragon_flag.mp4" },
};

export const ALL_EXERCISES = Object.values(EXERCISE_DB).reduce((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex.id);
    return acc;
}, {});

export const EVALUATION_EXERCISES = {
    pushups: ["pushup_knee", "pushup_standard", "pushup_diamond", "pushup_archer", "pushup_onearm_assisted", "pushup_onearm"],
    squats: ["squat_half", "squat_standard", "squat_lunge", "squat_bulgarian", "squat_pistol_assisted", "squat_pistol", "squat_pistol_dragon"],
    core: ["core_crunch", "core_leg_raise", "core_knee_raise_hanging", "core_leg_raise_hanging", "core_toes_to_bar"],
    pullups: ["pullup_australian", "pullup_jackknife", "pullup_negative", "pullup_standard", "pullup_archer", "pullup_typewriter", "pullup_onearm_assisted", "pullup_onearm_chin", "pullup_onearm"],
};