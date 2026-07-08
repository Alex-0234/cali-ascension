import { useState, useEffect } from 'react';

const playBeep = (freq = 600, duration = 0.1) => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine'; // Try 'square' or 'sawtooth' for a harsher sci-fi sound
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
};

export default function useKeyedTimers() {
    const [times, setTimes] = useState({});
    const [running, setRunning] = useState({});
    const [countdown, setCountdown] = useState({});

    useEffect(() => {
        const timers = Object.keys(running).filter(k => running[k]).map(k => setInterval(() => setTimes(p => ({ ...p, [k]: (p[k] || 0) + 1 })), 1000));
        
        const counts = Object.keys(countdown).filter(k => countdown[k] > 0).map(k => setInterval(() => setCountdown(p => {
            if (p[k] === 1) {
                playBeep(800, 0.4);
                setRunning(r => ({ ...r, [k]: true }));
            } else {
                playBeep(600, 0.1); 
            }
            return { ...p, [k]: p[k] - 1 };
        }), 1000));
        
        return () => [...timers, ...counts].forEach(clearInterval);
    }, [running, countdown]);

    return {
        times, running, countdown,
        toggle: (k) => setRunning(p => ({ ...p, [k]: !p[k] })),
        startTimer: (k) => setCountdown(p => ({ ...p, [k]: 3 }), playBeep(600, 0.1)),
        reset: (k) => { setTimes(p => ({...p, [k]: 0})); setRunning(p => ({...p, [k]: false})); setCountdown(p => ({...p, [k]: 0})), playBeep(300, 0.5)},
        resetAll: () => { setTimes({}); setRunning({}); setCountdown({}); },
        format: (s = 0) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`,
    };
}