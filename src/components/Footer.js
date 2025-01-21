import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "../style/footer.css"

export default function Footer() {
  return (
    <footer className="footer">
        
      <ul>
        <CustomLink to="https://ntnucsie.info/">NTNU SA Official Website</CustomLink>
      </ul>
    </footer>
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