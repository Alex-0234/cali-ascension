import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { EXERCISE_DB, ALL_EXERCISES } from '../../data/exercise_db';
import useUserStore from '../../store/usePlayerStore';
import { canUnlockExercise, unlockExercise } from '../../utils/Progression';
import { getProficiency } from '../../utils/proficiencySystem';
import { generateSkillTree } from '../../utils/skillTreeGenerator.ts';
import { mergeTheme } from './skillTreeTheme';
import SkillNode from './SkillNode';

const nodeTypes = { skill: SkillNode };

const BG_VARIANTS = {
    dots: BackgroundVariant.Dots,
    lines: BackgroundVariant.Lines,
    cross: BackgroundVariant.Cross,
};

// Optional `theme` prop deep-merges over SKILL_TREE_THEME — override any
// background / edge / node / layout value without touching the defaults.
const SkillTree = ({ categories, category, selectedId, onSelect, theme: themeOverrides }) => {
    const { userData, setUserData, syncUser } = useUserStore();

    // Remember which clip failed rather than resetting a boolean on every
    // selection change — the flag then follows the node with no effect involved.
    const [failedVideoId, setFailedVideoId] = useState(null);
    const videoOk = failedVideoId !== selectedId;

    const theme = useMemo(() => mergeTheme(themeOverrides), [themeOverrides]);
    const progress = useMemo(() => userData.exerciseProgress ?? {}, [userData.exerciseProgress]);

    const { nodes, edges } = useMemo(
        () => generateSkillTree(ALL_EXERCISES[category] ?? [], progress, theme),
        [category, progress, theme]
    );

    // A ?node= from another category has no node here — ignore it rather than
    // rendering a detail panel with no state.
    const selectedNode = selectedId ? nodes.find(n => n.id === selectedId) : null;
    const selected = selectedNode ? EXERCISE_DB[selectedId] : null;
    const selectedState = selectedNode?.data.state ?? null;
    const selectedCheck = selected ? canUnlockExercise(selectedId, progress) : null;

    const handleUnlock = () => {
        const result = unlockExercise(selectedId, userData.ep, progress);
        if (!result) return;
        setUserData({ ep: result.ep, exerciseProgress: result.exerciseProgress });
        syncUser();
    };

    const stateColor = selectedState ? theme.node.states[selectedState] : null;
    const selectedProficiency = selectedState === 'unlocked'
        ? getProficiency(progress[selectedId]?.totalReps ?? 0)
        : null;

    return (
        // The canvas needs a real height: viewport minus the app header, and minus
        // the mobile tab bar the shell reserves space for below.
        <div className="flex flex-col w-full font-robotomono h-[calc(100dvh-8.5rem)] md:h-[calc(100dvh-3.5rem)]">

            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 border-b border-accent/20 bg-panel/20">
                <div className="flex gap-1 overflow-x-auto">
                    {categories.map((id) => (
                        <NavLink
                            key={id}
                            to={`/skills/${id}`}
                            className={({ isActive }) =>
                                `px-3 py-2.5 text-xs tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors ${
                                    isActive
                                        ? 'text-accent-light border-accent-glow'
                                        : 'text-text-muted border-transparent hover:text-text-main'
                                }`
                            }
                        >
                            {id}
                        </NavLink>
                    ))}
                </div>
                <span className="hidden sm:inline text-xs text-text-muted whitespace-nowrap">
                    EP <b className="text-accent-light">{userData.ep ?? 0}</b>
                </span>
            </div>

            <div className="relative flex-1 min-h-0">
                <ReactFlow
                    key={category}
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    colorMode="dark"
                    fitView
                    fitViewOptions={{ padding: 0.15 }}
                    minZoom={0.1}
                    maxZoom={1.6}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    zoomOnDoubleClick={false}
                    onNodeClick={(_, node) => onSelect(node.id)}
                    onPaneClick={() => onSelect(null)}
                    style={{ background: theme.background.color }}
                >
                    {theme.background.variant && (
                        <Background
                            variant={BG_VARIANTS[theme.background.variant]}
                            gap={theme.background.gap}
                            size={theme.background.size}
                            color={theme.background.patternColor}
                        />
                    )}
                    {theme.controls.show && <Controls showInteractive={false} />}
                    {theme.controls.showMiniMap && (
                        <MiniMap
                            maskColor={theme.minimap.maskColor}
                            nodeColor={theme.minimap.nodeColor}
                            style={{ background: theme.minimap.background }}
                            pannable
                            zoomable
                        />
                    )}
                </ReactFlow>

                {selected && (
                    <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:w-80 bg-card/95 border rounded-[6px] p-4 backdrop-blur-sm"
                        style={{ borderColor: stateColor?.border }}
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                                <p className="text-[10px] tracking-widest uppercase" style={{ color: stateColor?.subtitle }}>
                                    Tier {selected.tier} // {selected.branch}
                                </p>
                                <p className="text-sm uppercase tracking-wider text-text-bright">{selected.name}</p>
                            </div>
                            <button
                                onClick={() => onSelect(null)}
                                className="text-text-muted hover:text-text-bright text-xs cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {selected.animation && videoOk && (
                            <video
                                key={selectedId}
                                src={selected.animation}
                                autoPlay
                                loop
                                muted
                                playsInline
                                onError={() => setFailedVideoId(selectedId)}
                                className="w-full h-32 object-cover rounded-sm border border-border-subtle mb-3"
                                style={selectedState === 'locked' ? { filter: 'grayscale(1) brightness(0.5)' } : undefined}
                            />
                        )}

                        {selectedState === 'unlocked' && (
                            <div className="text-xs text-text-main space-y-2">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] tracking-widest uppercase text-text-muted">Proficiency</span>
                                        <span className="text-[10px] text-accent-light">
                                            P{selectedProficiency.currentLevel} — {Math.floor(selectedProficiency.currentProgress)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: stateColor?.barTrack }}>
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${selectedProficiency.currentProgress}%`, background: stateColor?.bar }}
                                        />
                                    </div>
                                </div>
                                <p>Personal best: <b className="text-accent-light">
                                    {progress[selectedId]?.personalBest ?? 0} {selected.unit}
                                </b></p>
                                <p>Total volume: <b className="text-accent-light">
                                    {progress[selectedId]?.totalReps ?? 0} {selected.unit}
                                </b></p>
                            </div>
                        )}

                        {selectedState === 'available' && (
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs text-text-main">
                                    Cost: <b className="text-warning">{selectedCheck?.cost} EP</b>
                                    <span className="text-text-muted"> / owned {userData.ep ?? 0}</span>
                                </p>
                                <button
                                    onClick={handleUnlock}
                                    disabled={(userData.ep ?? 0) < (selectedCheck?.cost ?? Infinity)}
                                    className="text-xs tracking-wider uppercase px-3 py-1.5 border border-warning/60 bg-warning/10 text-warning rounded-sm hover:bg-warning/20 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Unlock
                                </button>
                            </div>
                        )}

                        {selectedState === 'locked' && (
                            <p className="text-xs text-text-muted">
                                Requires:{' '}
                                <span className="text-text-main">
                                    {(selected.prerequisites ?? [])
                                        .map((id) => EXERCISE_DB[id]?.name ?? id)
                                        .join(', ')}
                                </span>
                                {selectedCheck?.reason === 'Prerequisite proficiency too low' && (
                                    <span className="block mt-1 text-warning/80">
                                        Prerequisite personal best too low.
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillTree;
