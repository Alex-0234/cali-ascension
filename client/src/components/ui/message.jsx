import Typewriter from "./typewriter";

const Message = ({ scenario }) => {
    const scenarios = {
        'introduceTerminal': ">   Hello user, I'm GENESIS. I'm a tool that can help you manage your workouts by allowing you to choose from selected exercises and storing your workouts in a database to review later. I will notify you when it's time to move on to a harder exercises and show you your progress through stats. Stats are being calculated from hardest exercises, biggest extra wight load, and time of consistent workouts. You can always ask me certain terms.",
        'alertLogin': ">   Make sure to login or create an account to continue."
    }
    for (let key in scenarios) {
        if (key === scenario) {
            return <Typewriter text={scenarios[scenario]} speed={30} />
        }
        else {
            return <Typewriter text={'ERROR. Wrong message'} speed={15} />
        }
    }

};

export default Message;