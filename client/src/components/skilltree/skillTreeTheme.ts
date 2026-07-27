interface layout {
    xSpacing: number
    ySpacing: number
    rootSpacing: number
    pairSpacing: number
    wideSpacing: number
}
interface background {
    color: string
    variant: string
    gap: number
    size: number
    patternColor: string
}
interface controls {
    show: boolean
    showMiniMap: boolean
}
interface minimap {
    maskColor: string
    nodeColor: string
    background: string
}
interface node {
    width: number 
    radius: number
    states: Record<string, object>
}
interface edgeStates {
    stroke: string
    width: number
    animated: boolean
}
interface edge {
    type: string
    states: Record<string, edgeStates>
}
export interface theme {
    layout: layout
    background: background
    controls: controls
    minimap: minimap
    node: node
    edge: edge
}


export const SKILL_TREE_THEME: theme = {

    layout: {
        xSpacing: 500,      // default horizontal gap inside a sibling group
        ySpacing: 200,      // vertical gap between tiers
        rootSpacing: 800,   // gap between separate root trees (e.g. Plank vs Crunches)
        pairSpacing: 400,   // gap when a node has exactly 2 children
        wideSpacing: 400,   // gap when a node has 3+ children
    },

    background: {
        color: 'transparent',    // canvas color ('transparent' lets the panel show through)
        variant: 'null',         // 'dots' | 'lines' | 'cross' | null (no pattern)
        gap: 28,                 // pattern spacing
        size: 0,               // dot size / line width
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
        type: 'step',  // 'smoothstep' | 'step' | 'straight' | 'default' (bezier)
        states: {
            unlocked:  { stroke: '#06b6d4',   width: 2,   animated: false },
            available: { stroke: '#fbbf24',   width: 2,   animated: true  },
            locked:    { stroke: '#33415588', width: 1.5, animated: false },
        },
    },
};

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

function deepMerge<T extends object>(base: T, overrides?: DeepPartial<T>): T {
    const out = { ...base } as T;

    (Object.keys(overrides ?? {}) as (keyof T)[]).forEach((key) => {
        const baseValue = base[key];
        const overrideValue = overrides![key];

        out[key] = (isObject(baseValue) && isObject(overrideValue)
            ? deepMerge(baseValue, overrideValue)
            : overrideValue) as T[typeof key];
    });

    return out;
}

export const mergeTheme = (overrides?: DeepPartial<theme>): theme => deepMerge(SKILL_TREE_THEME, overrides);
