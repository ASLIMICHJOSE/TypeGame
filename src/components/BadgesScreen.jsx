import { Link } from 'react-router-dom';
import badgeDefinitions from '../data/badges';
import './BadgesScreen.css';

export default function BadgesScreen({ earnedBadgeIds }) {
  const earnedCount = earnedBadgeIds.length;
  const totalCount = badgeDefinitions.length;

  return (
    <div className="badges-screen">
      <div className="badges-header">
        <h2 className="badges-title">BADGES</h2>
        <p className="badges-counter">BADGES {earnedCount} / {totalCount} EARNED</p>
      </div>

      <div className="badges-grid">
        {badgeDefinitions.map((badge) => {
          const earned = earnedBadgeIds.includes(badge.id);

          return (
            <div key={badge.id} className={`badge-card ${earned ? 'badge-earned' : 'badge-locked'}`}>
              <div className={`badge-icon-circle ${earned ? 'badge-icon-earned' : 'badge-icon-locked'}`}>
                <span className="badge-icon-emoji">{badge.icon}</span>
              </div>
              <span className="badge-name">{badge.name.toUpperCase()}</span>
              <span className="badge-description">{badge.description}.</span>
              <span className={`badge-tag ${earned ? 'badge-tag-earned' : 'badge-tag-locked'}`}>
                {earned ? 'EARNED' : 'LOCKED'}
              </span>
            </div>
          );
        })}
      </div>

      <Link to="/" className="btn btn-outline-primary badges-back-btn">
        ← BACK TO ARENA
      </Link>
    </div>
  );
}

