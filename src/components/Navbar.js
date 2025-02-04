import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "../style/nav.css"

export default function Navbar({isAdmin}) {

  function logoutFunction(){
    //ToDo : tell backend the token should be expired and clear cookie locally
    //maybe you'll need to pass the token to NavBar({}), not sure your design.
  }

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        師大資工系學會考古題系統
      </Link>
      <ul>
        {
          isAdmin ? <CustomLink to="/management">Management</CustomLink> : <></>
        }
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/upload">Upload</CustomLink>
        <CustomLink to="/setting">Setting</CustomLink>
        <CustomLink to="/" onClick={logoutFunction}>logout</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, onClick, ...props }) {
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