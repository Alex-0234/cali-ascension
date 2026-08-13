/**
 * The app's icon set. All icons share one 24×24 stroked frame and inherit
 * `currentColor`, so they can be sized and coloured purely from the parent.
 */

const base = 'shrink-0';

function Icon({ className = 'w-4 h-4', children, filled = false, ...rest }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`${base} ${className}`}
            fill={filled ? 'currentColor' : 'none'}
            stroke={filled ? 'none' : 'currentColor'}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...rest}
        >
            {children}
        </svg>
    );
}

export const DashboardIcon = (props) => (
    <Icon {...props}>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
    </Icon>
);

export const WorkoutIcon = (props) => (
    <Icon {...props}>
        <path d="M4 9v6M20 9v6M7 6v12M17 6v12M7 12h10" />
    </Icon>
);

export const SkillsIcon = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="4.5" r="2.5" />
        <circle cx="5.5" cy="19" r="2.5" />
        <circle cx="18.5" cy="19" r="2.5" />
        <path d="M12 7v4M12 11 6.5 16.5M12 11l5.5 5.5" />
    </Icon>
);

export const HistoryIcon = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
    </Icon>
);

export const SettingsIcon = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
);

export const LogoutIcon = (props) => (
    <Icon {...props}>
        <path d="M15 17l5-5-5-5M20 12H9M12 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
    </Icon>
);

export const FlameIcon = (props) => (
    <Icon filled {...props}>
        <path d="M12.5 2c1 3-1.5 4.5-2.5 6.5C8.5 10.8 8 12.5 9 14c-1.5-.3-3-1.8-3-4C4.5 12 4 15 4 16.5 4 20 7.2 22 11 22c4.5 0 8-3 8-7.3 0-3.4-2.3-6-4.5-8-.3 1.8-1 2.6-2 3.3-.2-3-1-6-4-8z" />
    </Icon>
);

export const BoltIcon = (props) => (
    <Icon filled {...props}>
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </Icon>
);

export const ChevronIcon = (props) => (
    <Icon {...props}>
        <path d="M9 6l6 6-6 6" />
    </Icon>
);

export const PlusIcon = (props) => (
    <Icon {...props}>
        <path d="M12 5v14M5 12h14" />
    </Icon>
);

export const CloseIcon = (props) => (
    <Icon {...props}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
);

export const AlertIcon = (props) => (
    <Icon {...props}>
        <path d="M12 3 2 20h20L12 3z" />
        <path d="M12 10v4M12 17.5v.01" />
    </Icon>
);

export default Icon;
