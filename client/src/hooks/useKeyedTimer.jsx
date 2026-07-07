import { useState, useEffect } from 'react';

export default function useKeyedTimers() {
    const [times, setTimes] = useState({});
    const [running, setRunning] = useState({});

    useEffect(() => {
        const intervals = Object.keys(running)
            .filter(key => running[key])
            .map(key => setInterval(() => setTimes(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 })), 1000));
        return () => intervals.forEach(clearInterval);
    }, [running]);

    return {
        times, running,
        toggle: (key) => setRunning(prev => ({ ...prev, [key]: !prev[key] })),
        reset: (key) => { setTimes(prev => ({ ...prev, [key]: 0 })); setRunning(prev => ({ ...prev, [key]: false })); },
        resetAll: () => { setTimes({}); setRunning({}); },
        format: (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`,
    };
}