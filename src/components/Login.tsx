import "../style/login.css"
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { basicURL } from '../App'

//TODO : connect with backend and backend should return a token
interface Credentials {
    school_id: string;
    password: string;
}

interface LoginProps {
    setToken: React.Dispatch<React.SetStateAction<string>>;
}

async function loginUser(credentials: Credentials) {
    return fetch(basicURL + 'api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
    })
        .then(res => {
            if (res.status === 200) {
                window.location.href = "/";
                alert("登入成功！")
                return res.json()
            } else if (res.status === 400) {
                alert('登入失敗！')
                console.error('Error:', res);
            } else {
                alert("登入失敗！")
                throw new Error('Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export default function Login({ setToken }: LoginProps) {
    const [username, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await loginUser({
            school_id: username,
            password
        });
    }
    return (
        <>
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="login-header">
                    <header>Login</header>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="StudentID" autoComplete="on" required onChange={e => setUserName(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="checkbox-label">
                    <section>
                        <input className="checkbox" type="checkbox" id="check-terms-of-use" required />
                        <label htmlFor="check">Accept <a href='./terms-of-use'>Terms Of Use</a></label>
                    </section>
                </div>
                <div className="checkbox-label">
                    <section>
                        <input className="checkbox" type="checkbox" id="check-privacy-policy" required />
                        <label htmlFor="check">Accept <a href='./privacy-policy'>Privacy Policy</a></label>
                    </section>
                </div>
                <div className="checkbox-label">
                    <section>
                        <label>&emsp;&emsp;&emsp;Forget Password?&ensp;<a href="https://discord.gg/byydwBR2Hc">Contact NTNU CSIE SA</a></label>
                    </section>
                </div>
                <div className="input-submit">
                    <button type="submit" className="submit-btn" id="submit">
                        <label htmlFor="submit">Sign In</label>
                    </button>
                </div>
            </form>
        </>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}