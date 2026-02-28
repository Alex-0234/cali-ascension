import { useState, useEffect } from 'react';

export default function ServerWakeup({ onServerReady }) {
    const [status, setStatus] = useState('connecting'); 
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (status === 'connected') return;
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, [status]);

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
    }, [onServerReady]);

    return (
        <>
            <div className="wakeup-overlay">
                <div className={`wakeup-box ${status === 'connecting' ? 'box-red' : 'box-cyan'}`}>
                    
                    <div className="wakeup-scanline"></div>

                    <div className="wakeup-header">
                        {status === 'connecting' ? '⚠ [ SYSTEM BOOTING ]' : '✓ [ SYSTEM ONLINE ]'}
                    </div>
                    
                    <div className="wakeup-content">
                        {status === 'connecting' ? (
                            <>
                                <h2 className="pulse-text">Connecting to the server{dots}</h2>
                                <p>System is waking up... Estimated time 50 seconds.</p>
                            </>
                        ) : (
                            <>
                                <h2 className="success-text">ACCESS GRANTED</h2>
                                <p>Mana link established. Welcome back, Hunter.</p>
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
        </>
    );
}