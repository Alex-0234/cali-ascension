import { useState } from "react";
import Card from "../card";
import useUserStore, { isLoggedToday, MAX_CUSTOM_TRACKERS, WEIGHT_TRACKER_NAME } from "../../../store/usePlayerStore";
import Tracker from "./tracker";
import NewTrackerModal from "./newTrackerModal";
import LogTrackerModal from "./logTrackerModal";
import useDayRollover from "../../../hooks/useDayRollover";

export default function Trackers() {
    useDayRollover(); // re-renders at midnight so trackers reopen for logging on their own

    const customTrackers = useUserStore(state => state.userData.customTrackers);
    const setCustomTracker = useUserStore(state => state.setCustomTracker);
    const logCustomTracker = useUserStore(state => state.logCustomTracker);
    const removeCustomTracker = useUserStore(state => state.removeCustomTracker);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loggingIndex, setLoggingIndex] = useState<number | null>(null);

    const atLimit = customTrackers.length >= MAX_CUSTOM_TRACKERS;
    const loggedToday = customTrackers.filter(isLoggedToday).length;
    const loggingTracker = loggingIndex !== null ? customTrackers[loggingIndex] : undefined;

    return (
        <Card bg={true} name='operator_trackers' contTWCSS='w-full xl:max-w-6xl xl:mx-auto' TWCSS='flex flex-col gap-3 p-4'>

            <div className="flex items-center gap-3 px-3">
                <span className="text-[10px] tracking-widest text-text-muted uppercase">Active Metrics</span>
                <span className="h-px flex-1 bg-border-subtle" />
                <span className="font-robotomono text-[10px] text-text-muted">
                    {customTrackers.length}/{MAX_CUSTOM_TRACKERS}
                </span>
            </div>

            {customTrackers.length > 0 ? (
                <ul className="flex flex-col">
                    {customTrackers.map((tracker, index) => (
                        <Tracker
                            key={`${tracker.name}-${index}`}
                            tracker={tracker}
                            removable={tracker.name !== WEIGHT_TRACKER_NAME}
                            onLog={() => setLoggingIndex(index)}
                            onRemove={() => removeCustomTracker(index)}
                        />
                    ))}
                </ul>
            ) : (
                <p className="font-robotomono px-3 py-2 text-[11px] text-text-muted">// no trackers configured</p>
            )}

            <button
                type="button"
                disabled={atLimit}
                onClick={() => setIsModalOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-border-main py-2 text-[10px] tracking-widest text-text-muted uppercase transition-colors hover:border-accent/50 hover:text-accent-light disabled:cursor-not-allowed disabled:border-border-subtle disabled:text-text-muted/50 disabled:hover:border-border-subtle"
            >
                {atLimit ? `Limit reached · ${MAX_CUSTOM_TRACKERS} max` : '+ Create new tracker'}
            </button>

            {customTrackers.length > 0 && (
                <p className="font-robotomono px-3 text-[10px] tracking-wider text-text-muted">
                    // {loggedToday}/{customTrackers.length} logged today · resets at midnight
                </p>
            )}

            {isModalOpen && (
                <NewTrackerModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={setCustomTracker}
                    existingNames={customTrackers.map(t => t.name)}
                />
            )}

            {loggingTracker && (
                <LogTrackerModal
                    tracker={loggingTracker}
                    onClose={() => setLoggingIndex(null)}
                    onLog={(value, note) => logCustomTracker(loggingIndex as number, value, note)}
                />
            )}
        </Card>
    );
}
