import './Navbar.css'
export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><button>Home</button></li>
                <li><button>Daily</button></li>
                <li><button>Workouts</button></li>
                <li><button>Profile</button></li>
            </ul>
        </nav>
    )
}
