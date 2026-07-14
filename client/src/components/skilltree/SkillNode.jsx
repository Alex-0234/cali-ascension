import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const STATE_ICON = {
    unlocked: '◆',
    available: '◈',
    locked: '🔒',
};

const hiddenHandle = { opacity: 0, pointerEvents: 'none' };

const SkillNode = ({ data, selected }) => {
    const { theme, state } = data;
    const s = theme.node.states[state] ?? theme.node.states.locked;

    return (
        <div
            className="px-3 py-2.5 font-robotomono cursor-pointer transition-shadow"
            style={{
                width: theme.node.width,
                background: s.background,
                border: `1px solid ${s.border}`,
                borderRadius: theme.node.radius,
                boxShadow: selected ? `0 0 0 1px ${s.border}, ${s.glow}` : s.glow,
            }}
        >
            <Handle type="target" position={Position.Top} style={hiddenHandle} />

            <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] tracking-widest uppercase" style={{ color: s.subtitle }}>
                    T{data.tier} // {data.branch}
                </span>
                <span className="text-[10px]" style={{ color: s.subtitle }}>
                    {STATE_ICON[state]}
                </span>
            </div>

            <p className="text-[11px] uppercase tracking-wider leading-tight mb-1.5" style={{ color: s.title }}>
                {data.label}
            </p>

            {state === 'unlocked' && (
                <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: s.barTrack }}>
                        <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${data.proficiency.currentProgress}%`, background: s.bar }}
                        />
                    </div>
                    <span className="text-[9px]" style={{ color: s.subtitle }}>
                        P{data.proficiency.currentLevel}
                    </span>
                </div>
            )}
            {state === 'available' && (
                <p className="text-[9px] tracking-widest uppercase" style={{ color: s.subtitle }}>
                    {data.cost} EP to unlock
                </p>
            )}
            {state === 'locked' && (
                <p className="text-[9px] tracking-widest uppercase" style={{ color: s.subtitle }}>
                    Locked
                </p>
            )}

            <Handle type="source" position={Position.Bottom} style={hiddenHandle} />
        </div>
    );
};

export default memo(SkillNode);
