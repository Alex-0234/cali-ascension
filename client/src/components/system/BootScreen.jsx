import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The screen that covers the app until it can actually be used.
 *
 * Purely presentational: RootLayout owns the boot sequence and flips `status` to
 * 'ready' once the server answered *and* the session was resolved. Only then does
 * the exit animation run, so the user never sees the shell pop in half-empty.
 */
export default function BootScreen({ status = 'connecting', message, onExited }) {
    const rootRef = useRef(null);
    const frameRef = useRef(null);
    const contentRef = useRef(null);
    const loaderRef = useRef(null);
    const headerRef = useRef(null);
    const exitRef = useRef(null);

    const [introDone, setIntroDone] = useState(false);

    useGSAP(() => {
        const loaderSpin = gsap.to(loaderRef.current, {
            rotate: 360,
            duration: 1.1,
            repeat: -1,
            ease: 'linear',
        });

        const intro = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => setIntroDone(true),
        });

        intro
            .set(frameRef.current, { scaleX: 0, scaleY: 0.015, opacity: 0, transformOrigin: 'center' })
            .set(contentRef.current, { opacity: 0, y: 10 })
            .set(headerRef.current, { opacity: 0 })

            .to(loaderRef.current, { scale: 1.2, duration: 0.3, ease: 'power1.inOut', yoyo: true, repeat: 1 })
            .to(loaderRef.current, { opacity: 0, scale: 0.2, duration: 0.2, ease: 'power2.in', onComplete: () => loaderSpin.kill() }, '+=0.05')

            // line appears, stretches wide, then tall
            .to(frameRef.current, { opacity: 1, duration: 0.1 }, '<')
            .to(frameRef.current, { scaleX: 1, duration: 0.5, ease: 'power3.out' })
            .to(frameRef.current, { scaleY: 1, duration: 0.5, ease: 'power3.out' })

            .to(headerRef.current, { opacity: 1, duration: 0.3 }, '-=0.15')
            .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
    }, { scope: rootRef, dependencies: [] });

    useGSAP(() => {
        exitRef.current = gsap.timeline({
            paused: true,
            onComplete: () => onExited?.(),
        })
            .to(headerRef.current, { opacity: 0, duration: 0.2, ease: 'power2.out' })
            .to(contentRef.current, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.out' }, '<')
            .to(frameRef.current, { scale: 1.08, duration: 0.45, ease: 'power2.in' }, '+=0.15')
            .to(frameRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2');
    }, { scope: rootRef, dependencies: [] });

    // Hold "Connected" on screen for a beat so the state change is readable.
    // Deliberately no "already played" ref: StrictMode's double-invoke would
    // trip it on the discarded first run and the exit would never fire.
    useEffect(() => {
        if (!introDone || status !== 'ready') return;
        const timeoutId = setTimeout(() => exitRef.current?.play(), 600);
        return () => clearTimeout(timeoutId);
    }, [introDone, status]);

    const connecting = status !== 'ready';

    return (
        <section
            ref={rootRef}
            className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-dark font-robotomono"
        >
            {/* Loader sits outside the frame so the scale-in doesn't clip it */}
            <div ref={loaderRef} className="absolute h-7 w-7 rounded-sm border-2 border-accent/60" />

            <div
                ref={frameRef}
                className="absolute inset-[5%] flex flex-col overflow-hidden rounded-[6px] border border-accent/20 bg-panel/60"
            >
                <div
                    ref={headerRef}
                    className="flex shrink-0 items-center gap-2.5 border-b border-accent/20 bg-panel/40 px-6 py-4"
                >
                    <span className="h-2 w-2 rotate-45 bg-accent-glow shadow-[0_0_8px_#22d3ee99]" />
                    <span className="text-sm tracking-widest text-text-bright uppercase">System</span>
                    <span className="hidden text-xs tracking-widest text-text-muted uppercase sm:inline">
                        // Calisthenics Protocol
                    </span>
                </div>

                <div ref={contentRef} className="flex flex-col gap-3 px-8 py-10">
                    <span className="text-xs tracking-[0.2em] text-text-muted uppercase">
                        {connecting ? 'Status: Starting' : 'Status: Ready'}
                    </span>

                    {connecting ? (
                        <>
                            <h2 className="text-2xl font-semibold tracking-wide text-text-bright">
                                {message || 'Waking server'}
                            </h2>
                            <p className="max-w-sm text-sm leading-relaxed text-text-muted">
                                Cold start in progress — usually under a minute.
                            </p>
                            <div className="mt-3 h-px w-48 overflow-hidden rounded-full bg-border-subtle">
                                <div className="h-full w-1/3 animate-pulse rounded-full bg-accent/50" />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold tracking-wide text-success">Connected</h2>
                            <p className="max-w-sm text-sm leading-relaxed text-text-muted">Ready to continue.</p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
