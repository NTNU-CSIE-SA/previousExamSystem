import React from "react"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "../style/nav.css"
import { basicURL } from '../App'
export default function Navbar({ isAdmin }: { isAdmin: { ban: boolean, modify: boolean } }) {

    function logoutFunction() {
        //TODO : tell backend the token should be expired and clear cookie locally
        //maybe you'll need to pass the token to NavBar({}), not sure your design.
        fetch(basicURL + 'api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(document),
            credentials: 'include'
        })
            .then(res => {
                if (res.status === 200) {
                    window.location.href = "/login";
                } else if (res.status === 400) {
                    console.error('Error:', res);
                } else {
                    throw new Error('Login failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                師大資工系學會考古題系統
            </Link>
            <ul>
                {
                    isAdmin.ban ? <CustomLink to="/user-management">User Management</CustomLink> : <></>
                }
                {
                    isAdmin.modify ? <CustomLink to="/db-management">DB Management</CustomLink> : <></>
                }
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/upload">Upload</CustomLink>
                <CustomLink to="/setting">Setting</CustomLink>
                <CustomLink to="/" onClick={logoutFunction}>logout</CustomLink>
            </ul>
        </nav>
    )
}

function CustomLink({ to, children, onClick = () => { }, ...props }: { to: string, children: React.ReactNode, onClick?: () => void }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""} onClick={onClick}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}