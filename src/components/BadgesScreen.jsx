import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import badgeDefinitions from '../data/badges';
import LucideIcon from './LucideIcon';
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
                {earned ? (
                  <LucideIcon name={badge.iconName} size={28} strokeWidth={1.75} />
                ) : (
                  <Lock size={24} strokeWidth={2} opacity={0.5} />
                )}
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
        <ArrowLeft size={15} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        BACK TO ARENA
      </Link>
    </div>
  );
}
