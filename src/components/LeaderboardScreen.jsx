import { Link } from 'react-router-dom';
import levels from '../data/levels';
import './LeaderboardScreen.css';

const RANK_ICONS = ['🥇', '🥈', '🥉'];
const LEVEL_ICONS = {
  ember: '🌱', blaze: '🔥', storm: '⚡', inferno: '💀', legend: '👑'
};
const LEVEL_WPM_RANGE = {
  ember: '≤ 30 WPM', blaze: '30 – 50 WPM', storm: '50 – 70 WPM',
  inferno: '70 – 90 WPM', legend: '90+ WPM'
};

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

          return (
            <div
              key={`${entry.name}-${i}`}
              className={`lb-row ${isPlayer ? 'lb-row-player' : ''} ${isTop3 ? `lb-row-top lb-row-top-${i + 1}` : ''}`}
            >
              <div className="lb-row-rank">
                {isTop3 ? (
                  <span className="lb-medal">{RANK_ICONS[i]}</span>
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
                  {LEVEL_ICONS[entry.level] || ''} {entry.level?.charAt(0).toUpperCase() + entry.level?.slice(1)} · {entry.accuracy}% acc
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
        ← BACK TO ARENA
      </Link>
    </div>
  );
}
