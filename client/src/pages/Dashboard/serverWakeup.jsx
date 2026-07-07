import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ServerWakeup({ onServerReady }) {
    const wakeupSectionRef = useRef();
    const frameRef = useRef();     
    const contentRef = useRef();    
    const loaderRef = useRef();    

    const [animationFinished, setAnimationFinished] = useState(false);
    const [status, setStatus] = useState('connecting');

    useGSAP(() => {
        const loaderSpin = gsap.to(loaderRef.current, {
            rotate: 360,
            duration: 1.1,
            repeat: -1,
            ease: 'linear'
        });

        const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => setTimeout(() => setAnimationFinished(true), 1500)
        });

        tl.set(frameRef.current, { scaleX: 0, scaleY: 0.04, opacity: 0, transformOrigin: 'center' })
          .set(contentRef.current, { opacity: 0, y: 6 })

          .to(loaderRef.current, { scale: 1.15, duration: 0.35, ease: 'power1.inOut', yoyo: true, repeat: 1 })
          .to(loaderRef.current, {
              opacity: 0,
              scale: 0.5,
              duration: 0.25,
              ease: 'power2.in',
              onComplete: () => loaderSpin.kill()
          }, '+=0.05')

          .to(frameRef.current, { opacity: 1, scaleY: 0.04, duration: 0.15, ease: 'power1.out' }, '<')
          .to(frameRef.current, { scaleX: 1, duration: 0.45, ease: 'power2.out' })
          .to(frameRef.current, { scaleY: 1, duration: 0.45, ease: 'power2.out' })
          .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1');

    }, { scope: wakeupSectionRef, dependencies: [] });

    useEffect(() => {
        let isMounted = true;

        const pingServer = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);

                if (response.ok && isMounted) {
                    setStatus('connected');
                    setTimeout(() => {
                        if (isMounted && onServerReady) onServerReady();
                    }, 2000);
                } else {
                    if (isMounted) setTimeout(pingServer, 3000);
                }
            } catch (error) {
                if (isMounted) setTimeout(pingServer, 3000);
            }
        };

        pingServer();

        return () => { isMounted = false; };
    }, [animationFinished]);

    return (
        <section ref={wakeupSectionRef} className='flex h-screen w-full justify-center bg-dark items-center'>
            <div className='relative flex items-center justify-center h-1/3 w-1/2'>

                <div
                    ref={loaderRef}
                    className='absolute w-6 h-6 border-2 border-blue rounded-xs'
                />

                <div
                    ref={frameRef}
                    className='absolute inset-0 flex flex-col bg-dark-blue border border-blue rounded-xs p-4'
                >
                    <div className="wakeup-scanline"></div>
                </div>

                <div
                    ref={contentRef}
                    className='relative z-10 flex flex-col items-center text-center px-6 gap-2'
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
    );
}