import { useState, useEffect } from 'react';

export default function useTimer(autoStart = false) {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(autoStart);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [isRunning]);

    const format = (s = time) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return { time, isRunning, toggle: () => setIsRunning(r => !r), reset: () => { setTime(0); setIsRunning(false); }, setTime, format };
}