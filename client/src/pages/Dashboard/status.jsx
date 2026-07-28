import useUserStore from "../../store/usePlayerStore"
import Column from "../../components/ui/column";
import Grid from "../../components/ui/grid";
import Card from "../../components/ui/card";
import Profile from "../../components/ui/profile";
import Evaluation from "./evaluation";




export default function Status() {
    const { userData } = useUserStore();
    const { isConfigured, isLoggedIn } = userData;
    return (
        <Column>
        {!isConfigured && isLoggedIn && (
            <Card bg={true} contTWCSS="w-full xl:max-w-6xl xl:mx-auto mb-6" TWCSS='flex w-full h-full' >
                <Evaluation />
            </Card>
        )}
            <Card name='operator_profile' contTWCSS='w-full xl:max-w-6xl xl:mx-auto' TWCSS='flex flex-col md:flex-row gap-6'>
                    <Profile/>
            </Card>
            
        </Column>
    );
}