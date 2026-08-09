import { useEffect, useState } from 'react';
import { dayKey } from '../store/usePlayerStore';

/**
 * Returns the current local calendar day, re-rendering the moment it rolls over.
 * Keeps day-scoped UI (like trackers) honest when a tab is left open past midnight.
 */
export default function useDayRollover(): string {
    const [today, setToday] = useState(() => dayKey(new Date()));

    useEffect(() => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);

        const timeoutId = setTimeout(() => setToday(dayKey(new Date())), midnight.getTime() - now.getTime() + 500);
        return () => clearTimeout(timeoutId);
    }, [today]);

    return today;
}
