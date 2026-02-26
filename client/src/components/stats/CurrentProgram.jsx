
import useUserStore from "../../store/usePlayerStore";

export default function CurrentProgram() {
    const userData = useUserStore((state) => state.userData);


    return (
        <div className="current-program generic-border">
            <h3>Current Program: [ {userData.currentProgram} ]</h3>
            <select value={userData.currentProgram} onChange={(e) => useUserStore.setState((state) => ({
                userData: {
                    ...state.userData, 
                    currentProgram: e.target.value
                }
            }))}>
                <option value="Full Body">Full Body</option>
            </select>
        </div>
    );
}