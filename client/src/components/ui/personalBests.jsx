import useUserStore from "../../store/usePlayerStore";
import { getHighestUnlockedExercises } from "../../utils/workoutSelector";
import Card from "./card";

export default function PersonalBests() {
    const { userData } = useUserStore();
    const personalBests = getHighestUnlockedExercises(userData?.exerciseProgress || {});

    return (
        <Card name='personal_bests' bg={true} contTWCSS='w-full' TWCSS='w-full h-fit relative p-6'>
            {Object.keys(personalBests).length > 0 ? (
                <div className='flex flex-col gap-1'>
                    {Object.entries(personalBests).map(([category, exercise]) => (
                        <div key={category} className='flex items-center justify-between gap-2 text-xs'>
                            <span className='text-text-muted uppercase truncate'>{category}</span>
                            <span className='text-text-bright truncate'>{exercise.name} · T{exercise.tier}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <span className='text-xs text-text-muted'>No exercises unlocked yet</span>
            )}
        </Card>
    );
}
