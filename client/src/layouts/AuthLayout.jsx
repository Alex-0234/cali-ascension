import { Outlet } from 'react-router-dom';

/**
 * Frame for the signed-out routes. Keeps the terminal identity of the app while
 * giving the form the whole viewport, instead of stacking it inside the dashboard.
 */
export default function AuthLayout() {
    return (
        <div className="flex min-h-dvh flex-col bg-dark font-robotomono">
            <header className="border-b border-accent/20 bg-panel/40">
                <div className="mx-auto flex w-full max-w-6xl items-center gap-2.5 px-4 py-4 sm:px-6">
                    <span className="h-2 w-2 rotate-45 bg-accent-glow shadow-[0_0_8px_#22d3ee99]" />
                    <span className="text-sm tracking-widest text-text-bright uppercase">System</span>
                    <span className="hidden text-xs tracking-widest text-text-muted uppercase sm:inline">
                        // Calisthenics Protocol
                    </span>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>

            <footer className="px-4 py-6 text-center">
                <p className="font-robotomono text-[10px] tracking-wider text-text-muted uppercase">
                    // stats are earned, not awarded
                </p>
            </footer>
        </div>
    );
}
