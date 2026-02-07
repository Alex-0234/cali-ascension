
import { useState, useEffect } from 'react'
import useUserStore from '../../store/usePlayerStore'
import Configuration from '../configuration/config'
import SignIn from '../signin/signin'
import Header from '../layout/Header'
import Navbar from '../layout/Navbar'


function Home() {
    const userData = useUserStore((state) => state.userData);
    const [loggedIn, setLoggedIn] = useState(false);
    const [Daily, setDaily] = useState(true);

    useEffect(() => {
        // Check if the user has completed their daily challenge
        // if (userData.dailyCompleted) {
        //     setDaily(false);
        // }
    }, [userData.dailyCompleted]);

    function handleLogin() {
        setLoggedIn(true);
    }

    return (
        <div className="home">
            {!loggedIn && (
                <SignIn onAction={handleLogin} />
            )}

            {loggedIn && !userData.isConfigured && (
                <Configuration />
            )}
            
            {loggedIn && userData.isConfigured && (
                <>
                <div>
                    <h1>Welcome, {userData.username}!</h1>
                    <p>Your current level is: {userData.level === null ? 1 : userData.level}</p>
                    <h2>Daily Progress:</h2>
                    {Daily ? <p>Complete your daily challenge!</p> : <p>Daily challenge completed!</p>}
                </div>
                <Navbar />
                </>
                
            )}


        </div>
    )}
    export default Home