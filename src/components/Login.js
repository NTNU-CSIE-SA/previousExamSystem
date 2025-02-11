import "../style/login.css"
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { basicURL } from "./Home"

//TODO : connect with backend and backend should return a token
async function loginUser(credentials) {
    return fetch(basicURL + 'api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        withCredntials: true,
        credentials: 'include'
    })
        .then(response => {
            if (response.status === 200) {
                window.location.href = "/";

                return response.json()
            } else if (response.status === 400) {
                console.error('Error:', response.json().message);
            } else {
                throw new Error('Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
export default function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            school_id: username,
            password
        });
        //TODO : save and load token, the function loginUser should be the function 
        // that connect with backend and backend should return a token.
        console.log(response.message)
    }
    return (
        <>
            <form class="login-box" onSubmit={handleSubmit}>
                <div class="login-header">
                    <header>Login</header>
                </div>
                <div class="input-box">
                    <input type="text" class="input-field" placeholder="StudentID" autocomplete="off" required onChange={e => setUserName(e.target.value)} />
                </div>
                <div class="input-box">
                    <input type="password" class="input-field" placeholder="Password" autocomplete="off" required onChange={e => setPassword(e.target.value)} />
                </div>
                <div class="forgot">
                    <section>
                        <input type="checkbox" id="check" />
                        <label for="check">Remember me</label>
                    </section>
                </div>
                <div class="input-submit">
                    <button type="submit" class="submit-btn" id="submit"></button>
                    <label for="submit">Sign In</label>
                </div>
            </form>
        </>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}