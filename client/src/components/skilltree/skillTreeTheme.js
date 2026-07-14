// src/components/skilltree/skillTreeTheme.js
//
// Every visual aspect of the skill tree lives here — background, edges (paths),
// nodes, layout spacing. Tweak values directly, or pass a partial override
// object to <SkillTree theme={{ ... }} /> to customize per-instance.
// Colors mirror the design tokens in index.css (--color-*).

export const SKILL_TREE_THEME = {

    // Spacing used by the generator when positioning nodes
    layout: {
        xSpacing: 320,      // default horizontal gap inside a sibling group
        ySpacing: 170,      // vertical gap between tiers
        rootSpacing: 600,   // gap between separate root trees (e.g. Plank vs Crunches)
        pairSpacing: 260,   // gap when a node has exactly 2 children
        wideSpacing: 300,   // gap when a node has 3+ children
    },

    // Canvas behind the nodes
    background: {
        color: 'transparent',    // canvas color ('transparent' lets the panel show through)
        variant: 'dots',         // 'dots' | 'lines' | 'cross' | null (no pattern)
        gap: 28,                 // pattern spacing
        size: 1.5,               // dot size / line width
        patternColor: '#1e293b', // pattern color (border-subtle)
    },

    controls: {
        show: true,          // zoom / fit-view buttons
        showMiniMap: false,  // overview minimap (bottom right)
    },

    minimap: {
        maskColor: '#020617cc',
        nodeColor: '#0f172a',
        background: '#020617',
    },

    // Node appearance per state: unlocked | available (can be bought) | locked
    node: {
        width: 190,
        radius: 4,
        states: {
            unlocked: {
                background: '#020617',          // card
                border: '#06b6d4',              // accent
                glow: '0 0 14px #22d3ee33',
                title: '#f8fafc',               // text-bright
                subtitle: '#67e8f9',            // accent-light
                bar: '#22d3ee',                 // proficiency bar fill
                barTrack: '#1e293b',
            },
            available: {
                background: '#020617',
                border: '#fbbf24',              // warning — "purchasable"
                glow: '0 0 14px #fbbf2426',
                title: '#f8fafc',
                subtitle: '#fbbf24',
                bar: '#fbbf24',
                barTrack: '#1e293b',
            },
            locked: {
                background: '#02061799',
                border: '#1e293b',
                glow: 'none',
                title: '#64748b',               // text-muted
                subtitle: '#475569',
                bar: '#334155',
                barTrack: '#1e293b',
            },
        },
    },

    // Connection paths between nodes, per target-node state
    edge: {
        type: 'smoothstep',  // 'smoothstep' | 'step' | 'straight' | 'default' (bezier)
        states: {
            unlocked:  { stroke: '#06b6d4',   width: 2,   animated: false },
            available: { stroke: '#fbbf24',   width: 2,   animated: true  },
            locked:    { stroke: '#33415588', width: 1.5, animated: false },
        },
    },
};

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

const deepMerge = (base, overrides) => {
    const out = { ...base };
    Object.keys(overrides ?? {}).forEach((key) => {
        out[key] = isObject(base[key]) && isObject(overrides[key])
            ? deepMerge(base[key], overrides[key])
            : overrides[key];
    });
    return out;
};

export const mergeTheme = (overrides) => deepMerge(SKILL_TREE_THEME, overrides);
