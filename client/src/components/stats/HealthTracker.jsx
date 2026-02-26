
import useUserStore from "../../store/usePlayerStore";
import { calculateBMR } from "../../utils/calculateBMI";

export default function HealthTracker() {

    const userData = useUserStore((state) => state.userData);
    const { BMR, BMI } = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);

    return (
        <div className="health-tracker">
            <h3>Health Tracker</h3>
                <p>[ BMR ]: {BMR} kcal</p>
                <p>[ BMI ]: {BMI} </p>
        </div>
    );
}