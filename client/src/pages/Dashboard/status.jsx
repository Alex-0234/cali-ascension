import useUserStore from "../../store/usePlayerStore"
import Column from "../../components/ui/column";
import Grid from "../../components/ui/grid";
import Card from "../../components/ui/card";
import Profile from "../../components/ui/profile";
import Evaluation from "./evaluation";
import History from "../../components/ui/history";
import Trackers from "../../components/ui/tracker/trackersCard";




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
            <Card name='operator_history' contTWCSS='w-full xl:max-w-6xl xl:mx-auto' TWCSS='flex flex-col md:flex-row gap-6 p-8' bg={true}>
                <History />
            </Card>
            <Trackers />
            
            
        </Column>
    );
}