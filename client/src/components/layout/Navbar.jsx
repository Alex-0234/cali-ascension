import { Link, useLocation } from 'react-router-dom';

const MockRouterLink = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;
const isCanvas = typeof window !== 'undefined' && window.location.pathname.includes('/artifacts/');

export default function Navbar() {
    const location = !isCanvas ? useLocation() : { pathname: '/' };
    const isActive = (path) => location.pathname === path;

    const RouterLink = isCanvas ? MockRouterLink : Link;

    return (
        <nav className="system-navbar">
            <ul className="nav-list">
                <li className={isActive('/') ? 'active' : ''}>
                    <RouterLink to="/">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Status</span>
                    </RouterLink>
                </li>
                <li className={isActive('/daily') ? 'active' : ''}>
                    <RouterLink to="/daily">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span>Training</span>
                    </RouterLink>
                </li>
                <li className={isActive('/skill-tree') ? 'active' : ''}>
                    <RouterLink to="/skill-tree">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="6" y1="3" x2="6" y2="15"></line>
                            <circle cx="18" cy="6" r="3"></circle>
                            <circle cx="6" cy="18" r="3"></circle>
                            <path d="M18 9a9 9 0 0 1-9 9"></path>
                        </svg>
                        <span>Skill Tree</span>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    );
}