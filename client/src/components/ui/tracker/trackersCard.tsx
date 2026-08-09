import { useState } from "react";
import Card from "../card";
import useUserStore, { MAX_CUSTOM_TRACKERS } from "../../../store/usePlayerStore";
import Tracker from "./tracker";
import NewTrackerModal from "./newTrackerModal";

export default function Trackers() {
    const customTrackers = useUserStore(state => state.userData.customTrackers);
    const setCustomTracker = useUserStore(state => state.setCustomTracker);
    const removeCustomTracker = useUserStore(state => state.removeCustomTracker);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const atLimit = customTrackers.length >= MAX_CUSTOM_TRACKERS;

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

            {isModalOpen && (
                <NewTrackerModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={setCustomTracker}
                    existingNames={customTrackers.map(t => t.name)}
                />
            )}
        </Card>
    );
}
