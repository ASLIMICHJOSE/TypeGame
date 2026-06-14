import { Link } from 'react-router-dom';
import { Trophy, Medal, Flame } from 'lucide-react';
import levels from '../data/levels';
import LucideIcon from './LucideIcon';
import './HomeScreen.css';

export default function HomeScreen({ onSelectLevel, totalXP }) {
  const xpInCurrentLevel = totalXP % 1000;
  const xpPercent = Math.min((xpInCurrentLevel / 1000) * 100, 100);
  const tier = Math.floor(totalXP / 1000);

  return (
    <div className="home-screen">
      {/* Hero */}
      <div className="hero-section">
        <h1 className="hero-logo">TYPEBLAZE</h1>
        <p className="hero-tagline">MASTER THE KEYS. BECOME THE LEGEND.</p>
      </div>

      {/* Arena Selection */}
      <div className="arena-section">
        <h2 className="arena-title">CHOOSE YOUR ARENA</h2>

        <div className="level-grid">
          {levels.map((level) => (
            <button
              key={level.id}
              className="level-card"
              onClick={() => onSelectLevel(level.id)}
              style={{ '--level-color': level.color, '--level-border': level.borderColor }}
            >
              <span className="level-icon">
                <LucideIcon name={level.iconName} size={28} color={level.color} strokeWidth={2} />
              </span>
              <div className="level-info">
                <span className="level-name" style={{ color: level.color }}>{level.name}</span>
                <span className="level-wpm">{level.wpmRange}</span>
                <span className="level-desc">{level.description}.</span>
              </div>
              <span className="level-time">{level.time}s</span>
              <div className="level-bottom-bar"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Nav Buttons */}
      <div className="home-nav-buttons">
        <Link to="/leaderboard" className="btn-outline-leaderboard">
          <Trophy size={16} strokeWidth={2} /> LEADERBOARD
        </Link>
        <Link to="/badges" className="btn-outline-badges">
          <Medal size={16} strokeWidth={2} /> BADGES
        </Link>
      </div>

      {/* XP Footer */}
      <div className="xp-footer">
        <span className="xp-tier">TIER {tier}</span>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }}></div>
        </div>
        <span className="xp-amount">
          <Flame size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
          {totalXP.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
}
