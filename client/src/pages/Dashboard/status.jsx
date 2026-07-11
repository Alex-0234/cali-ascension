import useUserStore from "../../store/usePlayerStore"
import Column from "../../components/ui/column";
import Grid from "../../components/ui/grid";
import Card from "../../components/ui/card";
import Profile from "../../components/ui/proflie";
import Evaluation from "../Onboarding/Evaluation";




export default function Status() {
    const { userData } = useUserStore();
    const { isConfigured, isLoggedIn } = userData;
    return (
        <Column>
        {!isConfigured && isLoggedIn && (
            <Card bg={true} contTWCSS="flex w-full h-fit" TWCSS='flex w-fit h-fit' >
                <Evaluation />
            </Card>
        )}
            <Card name='operator_profile' TWCSS='flex flex-col sm:flex-row gap-6'> 
                    <Profile/>
            </Card>
            
        </Column>
    );
}