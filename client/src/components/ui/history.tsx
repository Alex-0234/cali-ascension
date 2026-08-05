import { useMemo } from "react";
import useUserStore from "../../store/usePlayerStore.ts";
import HistoryCard from "./historyCard.tsx";


export default function History() {
    const { workoutHistory } = useUserStore(state => state.userData);

    const entries = useMemo(() => {
        if (!workoutHistory || Array.isArray(workoutHistory)) return [];
        return Object.entries(workoutHistory).sort(([a], [b]) => b.localeCompare(a));
    }, [workoutHistory]);

    if (entries.length === 0) {
        return (
            <p className="font-robotomono text-xs text-text-muted">// no sessions on record</p>
        );
    }

    return (
        <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-2">
            {entries.map(([date, workout]) => (
                <HistoryCard key={date} date={date} workout={workout} />
            ))}
        </div>
    );
}
