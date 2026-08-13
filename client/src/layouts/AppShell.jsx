import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import useUserStore from '../store/usePlayerStore';
import calculateLevel from '../utils/levelUpSystem';
import { calculateStreakFromObject } from '../utils/calculateStreak';
import {
    BoltIcon,
    DashboardIcon,
    FlameIcon,
    HistoryIcon,
    LogoutIcon,
    SettingsIcon,
    SkillsIcon,
    WorkoutIcon,
} from '../components/ui/icons';

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', Icon: DashboardIcon, end: true },
    { to: '/workout', label: 'Workout', Icon: WorkoutIcon },
    { to: '/skills', label: 'Skills', Icon: SkillsIcon },
    { to: '/history', label: 'History', Icon: HistoryIcon },
];

function AccountMenu() {
    const navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    const userData = useUserStore((state) => state.userData);

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) setOpen(false);
        };
        const onKeyDown = (event) => { if (event.key === 'Escape') setOpen(false); };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const handleLogout = async () => {
        setOpen(false);
        // Logging out clears the store, so flush anything still queued first.
        const { isDirty, syncUser } = useUserStore.getState();
        if (isDirty) await syncUser();
        await logout();
        navigate('/login', { replace: true });
    };

    const name = userData.userInfo?.visibleName || userData.username || 'operator';

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Account menu"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-card text-sm transition-colors hover:border-accent-glow"
                style={{ borderColor: userData.color || 'var(--color-accent-glow)' }}
            >
                {name.slice(0, 1).toUpperCase()}
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-sm border border-border-main bg-panel shadow-[0_8px_30px_-12px_#000]"
                >
                    <div className="border-b border-border-subtle px-3 py-2.5">
                        <p className="truncate text-sm text-text-bright">{name}</p>
                        <p className="truncate font-robotomono text-[10px] tracking-wider text-text-muted uppercase">
                            {userData.title || 'Rookie'}
                        </p>
                    </div>

                    <Link
                        to="/settings"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs tracking-wider text-text-main uppercase transition-colors hover:bg-accent/10 hover:text-accent-light"
                    >
                        <SettingsIcon /> Settings
                    </Link>

                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-2.5 border-t border-border-subtle px-3 py-2.5 text-xs tracking-wider text-text-main uppercase transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                        <LogoutIcon /> Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

function StatChip({ icon, value, label, tone = 'text-text-bright' }) {
    return (
        <div className="hidden items-center gap-2 rounded-md border border-border-subtle bg-panel px-2.5 py-1.5 sm:flex">
            {icon}
            <span className={`font-robotomono text-xs tabular-nums ${tone}`}>{value}</span>
            <span className="font-robotomono text-[10px] tracking-wider text-text-muted uppercase">{label}</span>
        </div>
    );
}

/**
 * The chrome every signed-in page sits inside: identity + vitals up top, primary
 * navigation as tabs on desktop and a thumb-reachable bar on mobile. Page content
 * scrolls with the document so the browser can restore position on back/forward.
 */
export default function AppShell() {
    const userData = useUserStore((state) => state.userData);

    const { level } = calculateLevel(userData);
    const { current: streak } = calculateStreakFromObject(userData.workoutHistory);

    return (
        <div className="flex min-h-dvh flex-col bg-dark font-robotomono">

            <header className="sticky top-0 z-40 border-b border-accent/20 bg-panel/80 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
                    <Link to="/" className="flex shrink-0 items-center gap-2.5">
                        <span className="h-2 w-2 rotate-45 bg-accent-glow shadow-[0_0_8px_#22d3ee99]" />
                        <span className="text-sm tracking-widest text-text-bright uppercase">System</span>
                        <span className="hidden text-xs tracking-widest text-text-muted uppercase lg:inline">
                            // Calisthenics Protocol
                        </span>
                    </Link>

                    <nav className="ml-auto hidden items-center gap-1 md:flex">
                        {NAV_ITEMS.map(({ to, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `rounded-sm px-3 py-2 text-xs tracking-wider uppercase transition-colors ${
                                        isActive
                                            ? 'bg-accent/10 text-accent-light'
                                            : 'text-text-muted hover:text-text-main'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-2 md:ml-4">
                        <StatChip
                            icon={<FlameIcon className="h-3.5 w-3.5 text-accent" />}
                            value={streak}
                            label="day"
                        />
                        <StatChip
                            icon={<BoltIcon className="h-3.5 w-3.5 text-accent" />}
                            value={userData.ep ?? 0}
                            label="ep"
                            tone="text-accent-light"
                        />
                        <span className="font-robotomono text-xs text-text-muted">
                            LV <b className="text-text-bright tabular-nums">{level}</b>
                        </span>
                        <AccountMenu />
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-20 md:pb-0">
                <Outlet />
            </main>

            <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-accent/20 bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-wider uppercase transition-colors ${
                                isActive ? 'text-accent-light' : 'text-text-muted'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.Icon className={`h-5 w-5 ${isActive ? 'drop-shadow-[0_0_6px_#22d3ee80]' : ''}`} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
