import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import levels from '../data/levels';
import LucideIcon from './LucideIcon';
import './LeaderboardScreen.css';

const RANK_MEDALS = [
  { Icon: 'Medal', color: '#ffd700' },  // gold
  { Icon: 'Medal', color: '#c0c0c0' },  // silver
  { Icon: 'Medal', color: '#cd7f32' },  // bronze
];

const LEVEL_WPM_RANGE = {
  ember: '≤ 30 WPM', blaze: '30 – 50 WPM', storm: '50 – 70 WPM',
  inferno: '70 – 90 WPM', legend: '90+ WPM'
};

// Build a map from level id -> iconName
const LEVEL_ICON_MAP = Object.fromEntries(levels.map(l => [l.id, l.iconName]));
const LEVEL_COLOR_MAP = Object.fromEntries(levels.map(l => [l.id, l.color]));

export default function LeaderboardScreen({ leaderboard, playerName }) {
  const sorted = [...leaderboard].sort((a, b) => b.wpm - a.wpm).slice(0, 10);

  return (
    <div className="leaderboard-screen">
      <div className="lb-header">
        <h2 className="lb-title">LEADERBOARD</h2>
        <p className="lb-subtitle">TOP 10 · BY WPM</p>
      </div>

      <div className="lb-list">
        {sorted.map((entry, i) => {
          const isPlayer = entry.name === playerName && !entry.isBot;
          const isTop3 = i < 3;
          const iconName = LEVEL_ICON_MAP[entry.level];
          const iconColor = LEVEL_COLOR_MAP[entry.level] || '#ff8c00';

          return (
            <div
              key={`${entry.name}-${i}`}
              className={`lb-row ${isPlayer ? 'lb-row-player' : ''} ${isTop3 ? `lb-row-top lb-row-top-${i + 1}` : ''}`}
            >
              <div className="lb-row-rank">
                {isTop3 ? (
                  <span className="lb-medal" style={{ color: RANK_MEDALS[i].color }}>
                    <LucideIcon name="Medal" size={22} color={RANK_MEDALS[i].color} strokeWidth={1.75} />
                  </span>
                ) : (
                  <span className="lb-rank-number">#{i + 1}</span>
                )}
              </div>
              <div className="lb-row-info">
                <span className="lb-name">
                  {entry.name}
                  {isPlayer && <span className="lb-you-tag">YOU</span>}
                </span>
                <span className="lb-meta">
                  {iconName && (
                    <LucideIcon name={iconName} size={13} color={iconColor} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  )}
                  {entry.level?.charAt(0).toUpperCase() + entry.level?.slice(1)} · {entry.accuracy}% acc
                </span>
              </div>
              <div className="lb-row-wpm">
                <span className="lb-wpm-range">{LEVEL_WPM_RANGE[entry.level] || ''}</span>
                <span className="lb-wpm-value">{entry.wpm}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/" className="btn btn-outline-primary lb-back-btn">
        <ArrowLeft size={15} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        BACK TO ARENA
      </Link>
    </div>
  );
}
