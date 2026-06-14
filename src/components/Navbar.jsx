import { Link, NavLink } from 'react-router-dom';
import { Home, Trophy, Medal } from 'lucide-react';
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
          <Home size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          HOME
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
        >
          <Trophy size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          LEADERBOARD
        </NavLink>
        <NavLink
          to="/badges"
          className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
        >
          <Medal size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
          BADGES
        </NavLink>
      </div>
    </nav>
  );
}
