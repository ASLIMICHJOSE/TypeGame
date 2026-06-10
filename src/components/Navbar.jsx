import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        TYPEBLAZE
      </Link>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
        >
          HOME
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
        >
          LEADERBOARD
        </NavLink>
        <NavLink
          to="/badges"
          className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
        >
          BADGES
        </NavLink>
      </div>
    </nav>
  );
}

