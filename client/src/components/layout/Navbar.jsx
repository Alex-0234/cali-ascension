import './Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/">Daily</Link></li>
                <li><Link to="/skill-tree">Skill Tree</Link></li>
            </ul>
        </nav>
    )
}
