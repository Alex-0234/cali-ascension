import { useState, useEffect } from 'react';
import Terminal from '../../pages/Dashboard/terminal';
import StatusPanel from '../../components/ui/terminal_status';

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
            <Terminal content={<div></div>}/>
        </>
    );
}