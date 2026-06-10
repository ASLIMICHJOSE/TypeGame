import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import FireParticles from './components/FireParticles';
import Navbar from './components/Navbar';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import BadgesScreen from './components/BadgesScreen';
import badgeDefinitions from './data/badges';
import botEntries from './data/botEntries';
import { calculateXP, getLevelLabel } from './utils/gameLogic';

const PLAYER_NAME = 'You';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [lastResult, setLastResult] = useState(null);
  const [newBadge, setNewBadge] = useState(null);

  // Persistent state
  const [totalXP, setTotalXP] = useLocalStorage('typeblaze_xp', 0);
  const [gamesPlayed, setGamesPlayed] = useLocalStorage('typeblaze_games', 0);
  const [bestWpm, setBestWpm] = useLocalStorage('typeblaze_best_wpm', 0);
  const [bestAccuracy, setBestAccuracy] = useLocalStorage('typeblaze_best_accuracy', 0);
  const [bestCombo, setBestCombo] = useLocalStorage('typeblaze_best_combo', 0);
  const [levelsCompleted, setLevelsCompleted] = useLocalStorage('typeblaze_levels', []);
  const [earnedBadgeIds, setEarnedBadgeIds] = useLocalStorage('typeblaze_badges', []);
  const [leaderboard, setLeaderboard] = useLocalStorage('typeblaze_leaderboard', [...botEntries]);

  const handleSelectLevel = useCallback((levelId) => {
    navigate(`/play/${levelId}`);
  }, [navigate]);

  const handleGameFinish = useCallback((result) => {
    const xpEarned = calculateXP(result.wpm, result.accuracy, result.maxCombo);

    const newGamesPlayed = gamesPlayed + 1;
    const newBestWpm = Math.max(bestWpm, result.wpm);
    const newBestAccuracy = Math.max(bestAccuracy, result.accuracy);
    const newBestCombo = Math.max(bestCombo, result.maxCombo);
    const newLevelsCompleted = levelsCompleted.includes(result.levelId)
      ? levelsCompleted
      : [...levelsCompleted, result.levelId];

    setTotalXP(prev => prev + xpEarned);
    setGamesPlayed(newGamesPlayed);
    setBestWpm(newBestWpm);
    setBestAccuracy(newBestAccuracy);
    setBestCombo(newBestCombo);
    setLevelsCompleted(newLevelsCompleted);

    const playerEntry = {
      name: PLAYER_NAME,
      level: getLevelLabel(result.wpm),
      wpm: result.wpm,
      accuracy: result.accuracy,
      isBot: false
    };
    setLeaderboard(prev => {
      const withoutOldPlayer = prev.filter(e => e.isBot || e.wpm > result.wpm);
      return [...withoutOldPlayer, playerEntry]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 20);
    });

    const stats = {
      gamesPlayed: newGamesPlayed,
      bestWpm: newBestWpm,
      bestAccuracy: newBestAccuracy,
      bestCombo: newBestCombo,
      levelsCompleted: newLevelsCompleted
    };

    let firstNewBadge = null;
    const newEarned = [...earnedBadgeIds];
    for (const badge of badgeDefinitions) {
      if (!newEarned.includes(badge.id) && badge.check(stats)) {
        newEarned.push(badge.id);
        if (!firstNewBadge) firstNewBadge = badge;
      }
    }
    setEarnedBadgeIds(newEarned);
    setNewBadge(firstNewBadge);
    setLastResult(result);
    navigate('/result');
  }, [gamesPlayed, bestWpm, bestAccuracy, bestCombo, levelsCompleted, earnedBadgeIds, navigate]);

  const handleRetry = useCallback(() => {
    if (lastResult?.levelId) {
      navigate(`/play/${lastResult.levelId}`);
    } else {
      navigate('/');
    }
  }, [lastResult, navigate]);

  const handleHome = useCallback(() => navigate('/'), [navigate]);
  const handleNavigate = useCallback((target) => {
    if (target === 'home') navigate('/');
    else navigate(`/${target}`);
  }, [navigate]);

  const showNavbar = !location.pathname.startsWith('/play/') && location.pathname !== '/result';

  return (
    <div className="app">
      <FireParticles />

      {showNavbar && (
        <Navbar currentPath={location.pathname} onNavigate={handleNavigate} />
      )}

      <div className="screen-container">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                onSelectLevel={handleSelectLevel}
                onNavigate={handleNavigate}
                totalXP={totalXP}
              />
            }
          />

          <Route
            path="/play/:levelId"
            element={
              <GameScreen
                onFinish={handleGameFinish}
                onQuit={handleHome}
              />
            }
          />

          <Route
            path="/result"
            element={
              <ResultScreen
                result={lastResult}
                newBadge={newBadge}
                onRetry={handleRetry}
                onHome={handleHome}
                onLeaderboard={() => navigate('/leaderboard')}
              />
            }
          />

          <Route
            path="/leaderboard"
            element={
              <LeaderboardScreen
                leaderboard={leaderboard}
                playerName={PLAYER_NAME}
                onHome={handleHome}
              />
            }
          />

          <Route
            path="/badges"
            element={
              <BadgesScreen
                earnedBadgeIds={earnedBadgeIds}
                onHome={handleHome}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

