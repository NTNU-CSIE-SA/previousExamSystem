import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "../style/nav.css"

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        師大資工系學會考古題系統
      </Link>
      <ul>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/upload">Upload</CustomLink>
        <CustomLink to="/setting">Setting</CustomLink>
        <CustomLink to="/logout">logout</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}