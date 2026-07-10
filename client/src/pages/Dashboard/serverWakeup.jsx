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

        tl1.set(frameRef.current, { scaleX: 0, scaleY: 0.04, opacity: 0, transformOrigin: 'center' })
          .set(contentRef.current, { opacity: 0, y: 6 })

          .to(loaderRef.current, { scale: 1.15, duration: 0.35, ease: 'power1.inOut', yoyo: true, repeat: 1 })
          .to(loaderRef.current, {
              opacity: 0,
              scale: 0.25,
              duration: 0.25,
              ease: 'power2.in',
              onComplete: () => loaderSpin.kill()
          }, '+=0.05')

          .to(frameRef.current, { opacity: 1, scaleY: 0.02, duration: 0.15, ease: 'power1.out' }, '<')
          .to(frameRef.current, { scaleX: 0.5, duration: 0.45, ease: 'power2.out' })
          .to(frameRef.current, { scaleY: 0.5, duration: 0.45, ease: 'power2.out' })
          .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1')
          .to(headerRef.current, { opacity: 1, duration: 0.15, ease: 'power2.out' }, '-=0.1');

    }, { scope: wakeupSectionRef, dependencies: [] });

    useGSAP(() => {
        const tl2 = gsap.timeline({
            paused: true,
            defaults: { ease: 'power2.out' },
            onComplete: () => {
                setTimeout(() => {
                    if (onServerReady) onServerReady();
                }, 1500);
            }
        });

        tl2
            .to(headerRef.current, { opacity: 0, duration: 0.15, ease: 'power2.out' })
            .to(contentRef.current, { opacity: 0, y: 0, duration: 0.15, ease: 'power2.out' }, '-=0.1')
            .to(frameRef.current, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, 1)
            .to(frameRef.current, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 1);

        tl2Ref.current = tl2;

    }, { scope: wakeupSectionRef, dependencies: [] });

    useEffect(() => {
        if (animationFinished && serverReady && !tl2PlayedRef.current) {
            tl2PlayedRef.current = true;
            setStatus('connected');
            tl2Ref.current?.play();
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
            } catch (error) {
                if (isMounted) setTimeout(pingServer, 3000);
            }
        };

        pingServer();

        return () => { isMounted = false; };
    }, []);
    return (
         <section ref={wakeupSectionRef} className="flex justify-center items-center h-screen w-full bg-dark font-robotomono">
            <div ref={frameRef} className="flex flex-col h-[98%] w-[98%] sm:w-[90%] sm:h-[90%] bg-panel/60 border border-accent/20 rounded-[6px] overflow-hidden">

                <div
                    ref={loaderRef}
                    className='absolute w-6 h-6 border-2 border-cyan-400/70 rounded-xs'
                ></div>
                <div ref={headerRef} className="opacity-0 flex items-center justify-between px-6 py-4 border-b border-accent/20 bg-panel/40">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 bg-accent-glow rotate-45 shadow-[0_0_8px_#22d3ee99]"></span>
                        <span className="text-2xl tracking-widest text-text-bright uppercase">System</span>
                        <span className="text-2xl text-text-muted uppercase hidden sm:inline">// Calisthenics Protocol</span>
                    </div>
                </div>
                 <div
                    ref={contentRef}
                    className='relative z-10 flex flex-col items-center text-start px-6 gap-2 text-xl mt-8'
                >
                   <div className="wakeup-header">
                        {status === 'connecting' ? 'STATUS: STARTING' : 'STATUS: READY'}
                    </div>

                    <div className="wakeup-content">
                        {status === 'connecting' ? (
                            <>
                                <h2 className="pulse-text">Waking server</h2>
                                <p>Cold start in progress — usually under a minute.</p>
                            </>
                        ) : (
                            <>
                                <h2 className="success-text">Connected</h2>
                                <p>Ready to continue.</p>
                            </>
                        )}
                    </div>

                    {status === 'connecting' && (
                        <div className="wakeup-progress-bar">
                            <div className="wakeup-progress-fill"></div>
                        </div>
                    )}
                </div>
            </div>
        </section>

    /*     <section ref={wakeupSectionRef} className='flex justify-center items-center h-screen w-full bg-dark font-robotomono'>
            <div className='flex flex-col h-[98%] w-[98%] sm:w-[90%] sm:h-[90%] bg-panel/60 border border-accent/20 rounded-[6px] overflow-hidden'>
                <div
                    ref={loaderRef}
                    className='absolute w-6 h-6 border-2 border-cyan-400/70 rounded-xs'
                ></div>

                    <div ref={frameRef} className="flex items-center justify-between px-6 py-4 border-b border-accent/20 bg-panel/40">
                        <span className="w-2 h-2 bg-accent-glow rotate-45 shadow-[0_0_8px_#22d3ee99]"></span>
                        <span className="text-sm tracking-widest text-text-bright uppercase">System</span>
                        <span className="text-xs tracking-widest text-text-muted uppercase hidden sm:inline">// Calisthenics Protocol</span>
                    </div>
              

               
            </div>
        </section> */
    );
}