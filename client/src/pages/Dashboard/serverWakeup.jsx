import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ServerWakeup({ onServerReady }) {
    const wakeupSectionRef = useRef();
    const frameRef = useRef();
    const contentRef = useRef();
    const loaderRef = useRef();
    const headerRef = useRef();
    const tl2Ref = useRef();
    const tl2PlayedRef = useRef(false);

    const [animationFinished, setAnimationFinished] = useState(false);
    const [serverReady, setServerReady] = useState(false);
    const [status, setStatus] = useState('connecting');

    // Intro: loader pulses → fades → frame draws in as a horizontal line then expands → content appears
    useGSAP(() => {
        const loaderSpin = gsap.to(loaderRef.current, {
            rotate: 360,
            duration: 1.1,
            repeat: -1,
            ease: 'linear'
        });

        const tl1 = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => setAnimationFinished(true)
        });

        tl1
            .set(frameRef.current,  { scaleX: 0, scaleY: 0.015, opacity: 0, transformOrigin: 'center' })
            .set(contentRef.current, { opacity: 0, y: 10 })
            .set(headerRef.current,  { opacity: 0 })

            .to(loaderRef.current, { scale: 1.2, duration: 0.3, ease: 'power1.inOut', yoyo: true, repeat: 1 })
            .to(loaderRef.current, { opacity: 0, scale: 0.2, duration: 0.2, ease: 'power2.in', onComplete: () => loaderSpin.kill() }, '+=0.05')

            // line appears, stretches wide, then tall
            .to(frameRef.current, { opacity: 1, duration: 0.1 }, '<')
            .to(frameRef.current, { scaleX: 1, duration: 0.5, ease: 'power3.out' })
            .to(frameRef.current, { scaleY: 1, duration: 0.5, ease: 'power3.out' })

            .to(headerRef.current,  { opacity: 1, duration: 0.3 }, '-=0.15')
            .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

    }, { scope: wakeupSectionRef, dependencies: [] });

    // Exit: content fades out → frame expands past viewport → fades to black → onServerReady
    useGSAP(() => {
        const tl2 = gsap.timeline({
            paused: true,
            onComplete: () => {
                setTimeout(() => { if (onServerReady) onServerReady(); }, 150);
            }
        });

        tl2
            .to(headerRef.current,  { opacity: 0, duration: 0.2, ease: 'power2.out' })
            .to(contentRef.current, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.out' }, '<')
            .to(frameRef.current,   { scale: 1.08, duration: 0.45, ease: 'power2.in' }, '+=0.15')
            .to(frameRef.current,   { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15')
            .to(frameRef.current,   { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15');

        tl2Ref.current = tl2;
    }, { scope: wakeupSectionRef, dependencies: [] });

    // Show "Connected" briefly, then play exit
    useEffect(() => {
        if (animationFinished && serverReady && !tl2PlayedRef.current) {
            tl2PlayedRef.current = true;
            setStatus('connected');
            setTimeout(() => tl2Ref.current?.play(), 750);
        }
    }, [animationFinished, serverReady]);

    useEffect(() => {
        let isMounted = true;

        const pingServer = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);
                if (response.ok && isMounted) {
                    setServerReady(true);
                } else if (isMounted) {
                    setTimeout(pingServer, 3000);
                }
            } catch {
                if (isMounted) setTimeout(pingServer, 3000);
            }
        };

        pingServer();
        return () => { isMounted = false; };
    }, []);

    return (
        <section
            ref={wakeupSectionRef}
            className="relative flex justify-center items-center h-screen w-full bg-dark font-robotomono overflow-hidden"
        >
            {/* Loader lives outside the frame so it isn't clipped during the scale-in */}
            <div
                ref={loaderRef}
                className="absolute w-7 h-7 border-2 border-accent/60 rounded-sm"
            />

            {/* Terminal frame — inset-[1%] gives the 98% viewport feel at scale(1) */}
            <div
                ref={frameRef}
                className="absolute inset-[1%] flex flex-col bg-panel/60 border border-accent/20 rounded-[6px] overflow-hidden"
            >
                {/* Header bar */}
                <div
                    ref={headerRef}
                    className="flex items-center gap-2.5 px-6 py-4 border-b border-accent/20 bg-panel/40 shrink-0"
                >
                    <span className="w-2 h-2 bg-accent-glow rotate-45 shadow-[0_0_8px_#22d3ee99]" />
                    <span className="text-sm tracking-widest text-text-bright uppercase">System</span>
                    <span className="text-xs tracking-widest text-text-muted uppercase hidden sm:inline">
                        // Calisthenics Protocol
                    </span>
                </div>

                {/* Content */}
                <div ref={contentRef} className="flex flex-col gap-3 px-8 py-10">
                    <span className="text-xs tracking-[0.2em] uppercase text-text-muted">
                        {status === 'connecting' ? 'Status: Starting' : 'Status: Ready'}
                    </span>

                    {status === 'connecting' ? (
                        <>
                            <h2 className="text-2xl font-semibold text-text-bright tracking-wide">
                                Waking server
                            </h2>
                            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                                Cold start in progress — usually under a minute.
                            </p>
                            <div className="mt-3 h-px w-48 bg-border-subtle rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-accent/50 rounded-full animate-pulse" />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-success tracking-wide">
                                Connected
                            </h2>
                            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                                Ready to continue.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
