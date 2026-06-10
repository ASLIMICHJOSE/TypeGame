import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getRank, calculateXP } from '../utils/gameLogic';
import levels from '../data/levels';
import './ResultScreen.css';

export default function ResultScreen({ result, newBadge, onRetry }) {
  const [animatedWPM, setAnimatedWPM] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  // Safe redirect if navigated directly
  if (!result) {
    return <Navigate to="/" replace />;
  }

  const rank = getRank(result.wpm);
  const xpEarned = calculateXP(result.wpm, result.accuracy, result.maxCombo);
  const level = levels.find(l => l.id === result.levelId) || levels[0];

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = result.wpm / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), result.wpm);
      setAnimatedWPM(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [result.wpm]);

  useEffect(() => {
    if (newBadge) {
      const timeout = setTimeout(() => setShowBadge(true), 1800);
      return () => clearTimeout(timeout);
    }
  }, [newBadge]);

  return (
    <div className="result-screen">
      {/* Level Complete Header */}
      <div className="result-header">
        <span className="result-level-complete">{level.icon} {level.name.toUpperCase()} RUN COMPLETE</span>
      </div>

      {/* Giant WPM Display */}
      <div className="result-wpm-container pop-in">
        <div className="result-wpm-icon-box">
          <span className="result-wpm-number">{animatedWPM}</span>
        </div>
        <span className="result-wpm-label">WORDS PER MINUTE</span>
      </div>

      {/* Rank Badge */}
      <div className="result-rank-badge" style={{ borderColor: rank.color, color: rank.color }}>
        {rank.label}
      </div>

      {/* Stats Grid */}
      <div className="result-stats-grid">
        <div className="result-stat-box">
          <span className="result-stat-label">ACCURACY</span>
          <span className="result-stat-value" style={{ color: '#ff8c00' }}>{result.accuracy}%</span>
        </div>
        <div className="result-stat-box">
          <span className="result-stat-label">MAX COMBO</span>
          <span className="result-stat-value" style={{ color: '#ffd700' }}>{result.maxCombo}x</span>
        </div>
        <div className="result-stat-box">
          <span className="result-stat-label">ERRORS</span>
          <span className="result-stat-value" style={{ color: '#ff4e00' }}>{result.errors}</span>
        </div>
        <div className="result-stat-box">
          <span className="result-stat-label">XP EARNED</span>
          <span className="result-stat-value" style={{ color: '#ffd700' }}>+{xpEarned}</span>
        </div>
      </div>

      {/* Badge Unlock */}
      {newBadge && showBadge && (
        <div className="badge-unlock-card slide-in">
          <span className="badge-unlock-title">NEW BADGE UNLOCKED</span>
          <div className="badge-unlock-content">
            <div className="badge-unlock-icon-box">
              <span className="badge-unlock-icon">{newBadge.icon}</span>
            </div>
            <span className="badge-unlock-name">{newBadge.name}</span>
            <span className="badge-unlock-desc">{newBadge.description}.</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="result-buttons">
        <button className="btn-primary-gradient" onClick={onRetry}>🔁 RETRY</button>
        <Link to="/" className="btn-outline">HOME</Link>
        <Link to="/leaderboard" className="btn-outline">🏆 LEADERBOARD</Link>
      </div>
    </div>
  );
}

