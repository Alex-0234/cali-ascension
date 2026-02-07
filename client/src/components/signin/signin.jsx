
import { useState } from "react";
import "./signin.css";
import Notification from "../layout/Notification";

export default function SignIn({ onAction }) {
    const [login, setLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    async function handleRegister() {
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, confirmPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                <Notification message={data.message} />
            }
        } catch (error) {
            console.error("Error during registration:", error);
            <Notification message={error.message} />
        }
    }


        return (
            <>
            {login && (
                <>
                <h2>Log In</h2>
                <div className="login-form">
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" />
                    <button onClick={onAction}>Log In</button>
                </div>
                

                <p>Don't have an account? <a onClick={() => setLogin(false)}>Register</a></p>
                </>
            )}
            {!login && (
                <>
                <h2>Sign Up</h2>
                <div className="signup-form">
                    <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
                    <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                    <input type="password" placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <button onClick={handleRegister}>Sign Up</button>
                </div>

                <p>Already have an account? <a onClick={() => setLogin(true)}>Log In</a></p>
                </>
            )}
            </>
        )}