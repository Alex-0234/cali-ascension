import { useState } from "react";
import useUserStore from "../../store/usePlayerStore";

function Configuration() {
  const [step, setStep] = useState(1);
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);
  return (
            <div className="configuration">
                <h2>Welcome to Cali Ascension!</h2>
                {step === 1 && (
                    <>
                        <p>Let's find your starting point</p> 
                        <p>What is your username ?</p>
                        <input type="text" value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} />

                        <p>What is your gender ?</p> 
                        <button onClick={() => {setUserData({...userData, gender: "male"}); setStep(step + 1)}}>Male</button>
                        <button onClick={() => {setUserData({...userData, gender: "female"}); setStep(step + 1)}}>Female</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <p>What is your age ?</p> 
                        <input type="number" value={userData.age} onChange={(e) => setUserData({...userData, age: e.target.value})} />
                    </>
                )}
                    {step === 3 && (
                    <>
                        <p>What is your weight (kg) ?</p> 
                        <input type="number" value={userData.weight} onChange={(e) => setUserData({...userData, weight: e.target.value})} />
                    </>
                )}
                    {step === 4 && (
                    <>
                        <p>What is your height (cm) ?</p>
                        <input type="number" value={userData.height} onChange={(e) => setUserData({...userData, height: e.target.value})} />
                    </>
                )}
                    {step === 5 && (
                    <>
                        <p>What is your pushup experience level ?</p>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, pushup: "beginner"}}); setStep(step + 1)}}>Beginner (0-5)</button>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, pushup: "intermediate"}}); setStep(step + 1)}}>Intermediate (5-25)</button>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, pushup: "advanced"}}); setStep(step + 1)}}>Advanced (25+)</button>
                    </>
                )}
                    {step === 6 && (
                    <>
                        <p>What is your squat experience level ?</p>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, squat: "beginner"}}); setStep(step + 1)}}>Beginner (0-10)</button>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, squat: "intermediate"}}); setStep(step + 1)}}>Intermediate (10-30)</button>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, squat: "advanced"}}); setStep(step + 1)}}>Advanced (30+)</button>
                    </>
                )}  
                    {step === 7 && (
                    <>
                        <p>What is your plank experience level ?</p>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, plank: "beginner"}}); setStep(step + 1)}}>Beginner (0-30s)</button>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, plank: "intermediate"}}); setStep(step + 1)}}>Intermediate (30s-1m)</button>
                        <button onClick={() => {setUserData({experienceLevel: {...userData.experienceLevel, plank: "advanced"}}); setStep(step + 1)}}>Advanced (1m+)</button>
                    </>
                )}
                    {step === 8 && (
                        <>
                            <p>Great! You're all set to start your Cali Ascension journey!</p>
                            <p>Here's a summary of your information:</p>
                            <ul>
                                <li>Username: {userData.username}</li>
                                <li>Gender: {userData.gender}</li>
                                <li>Age: {userData.age}</li>
                                <li>Weight: {userData.weight} kg</li>
                                <li>Height: {userData.height} cm</li>
                                <li>Pushup Experience: {userData.experienceLevel.pushup}</li>
                                <li>Squat Experience: {userData.experienceLevel.squat}</li>
                                <li>Plank Experience: {userData.experienceLevel.plank}</li>
                            </ul>
                            <button onClick={() => setUserData({...userData, isConfigured: true})}>Start Ascension</button>
                        </>
                    )}

                <p>Configuration Step {step}</p>
                <button onClick={() => setStep(step => Math.max(1, step - 1))}>Back</button>
                <button onClick={() => setStep(step => Math.min(step + 1, 8))}>Next</button>
            </div>  
        )
    }
export default Configuration;