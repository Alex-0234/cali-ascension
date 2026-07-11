import useUserStore from "../../store/usePlayerStore"
import Column from "../../components/ui/column";
import Grid from "../../components/ui/grid";
import Card from "../../components/ui/card";
import Profile from "../../components/ui/proflie";




export default function Status() {

    return (
        <Column>
            <Card name='operator_profile' TWCSS='flex flex-col sm:flex-row gap-3'> 
                    <Profile />

            </Card>
        </Column>
    );
}