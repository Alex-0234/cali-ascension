
import { useState } from "react";
import "./signin.css";

export default function SignIn({ onAction }) {
    const [state, setState] = useState(true);

        return (
            <>
            {state && (
                <>
                <h2>Log In</h2>
                <div className="login-form">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button onClick={onAction}>Log In</button>
                </div>
                

                <p>Don't have an account? <a onClick={() => setState(false)}>Register</a></p>
                </>
            )}
            {!state && (
                <>
                <h2>Sign Up</h2>
                <div className="signup-form">
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Confirm Password" />
                    <button onClick={onAction}>Sign Up</button>
                </div>

                <p>Already have an account? <a onClick={() => setState(true)}>Log In</a></p>
                </>
            )}
            </>
        )}