import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import "../style/footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <ul>
        <CustomLink to="https://github.com/NTNU-CSIE-SA/previousExamSystem/issues">Bugs Report</CustomLink>
        <CustomLink to="/">Policy</CustomLink>
        <CustomLink to="https://ntnucsie.info/">NTNU SA Official Website</CustomLink>
      </ul>
    </footer>
  )
}

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
  [key: string]: any;
}

function CustomLink({ to, children, ...props }: CustomLinkProps) {
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