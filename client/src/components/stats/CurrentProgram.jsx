
import useUserStore from "../../store/usePlayerStore";

export default function CurrentProgram() {
    const userData = useUserStore((state) => state.userData);
    const syncUser = useUserStore((state) => state.syncUser);

    const handleProgramChange = (e) => {
        const newProgram = e.target.value;
        console.log("Selected program:", newProgram);
        useUserStore.setState((state) => ({
            userData: {
                ...state.userData,
                currentProgram: newProgram
            }
        }));
        syncUser();
    };

    return (
        <div className="current-program generic-border">
            <h3>Workout Window</h3>
            <h4>Current Program: [ {userData.currentProgram || "None Selected"} ]</h4>
            <select value={userData.currentProgram} onChange={handleProgramChange}>
                <option value="">Select a program</option>
                <option value="Push/Pull/Legs">Push/Pull/Legs</option>
                <option value="Upper/Lower Split">Upper/Lower Split</option>
                <option value="Bro Split">Bro Split</option>
                <option value="Full Body">Full Body</option>
            </select>
            <button className="generic-btn">Workout History</button>
            <p>Working on this...</p>
        </div>
    );
}