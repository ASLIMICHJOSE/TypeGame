import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import levels from '../data/levels';
import { generatePassage, calculateWPM, calculateAccuracy, COMBO_MILESTONES } from '../utils/gameLogic';
import './GameScreen.css';

export default function GameScreen({ onFinish, onQuit }) {
  const { levelId } = useParams();
  const level = useMemo(() => levels.find(l => l.id === levelId) || levels[0], [levelId]);
  const passage = useMemo(() => generatePassage(levelId), [levelId]);

  const [cursorIndex, setCursorIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.time);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [comboFlash, setComboFlash] = useState(null);
  const [charStates, setCharStates] = useState(() => Array(passage.length).fill('pending'));

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const textDisplayRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  useEffect(() => {
    if (finished) {
      const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : level.time;
      const wpm = calculateWPM(correctCount, elapsed);
      const accuracy = calculateAccuracy(correctCount, totalAttempts);
      onFinish({ wpm, accuracy, maxCombo, errors: errorCount, charsTyped: correctCount, levelId });
    }
  }, [finished]);

  useEffect(() => {
    if (textDisplayRef.current) {
      const currentChar = textDisplayRef.current.querySelector('.char-current');
      if (currentChar) {
        currentChar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [cursorIndex]);

  const checkComboMilestone = useCallback((newCombo) => {
    for (const milestone of COMBO_MILESTONES) {
      if (newCombo === milestone.threshold) {
        setComboFlash(milestone);
        setTimeout(() => setComboFlash(null), 1500);
        break;
      }
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (finished) return;
    if (e.key.length !== 1 && e.key !== ' ') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();

    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    const expectedChar = passage[cursorIndex];
    const typedChar = e.key;
    setTotalAttempts(prev => prev + 1);

    if (typedChar === expectedChar) {
      setCharStates(prev => { const next = [...prev]; next[cursorIndex] = 'correct'; return next; });
      setCorrectCount(prev => prev + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      checkComboMilestone(newCombo);
      setCursorIndex(prev => { const next = prev + 1; if (next >= passage.length) setFinished(true); return next; });
    } else {
      setCharStates(prev => { const next = [...prev]; next[cursorIndex] = 'wrong'; return next; });
      setErrorCount(prev => prev + 1);
      setCombo(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      setCursorIndex(prev => { const next = prev + 1; if (next >= passage.length) setFinished(true); return next; });
    }
  }, [cursorIndex, passage, started, finished, combo, maxCombo, checkComboMilestone]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onQuit(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onQuit]);

  const elapsed = started && startTimeRef.current ? Math.max((Date.now() - startTimeRef.current) / 1000, 0.1) : 0.1;
  const liveWPM = started ? calculateWPM(correctCount, elapsed) : 0;
  const liveAccuracy = totalAttempts > 0 ? calculateAccuracy(correctCount, totalAttempts) : 100;
  const timerPercent = (timeLeft / level.time) * 100;
  const timerCritical = timerPercent <= 25;
  const wordsTyped = passage.slice(0, cursorIndex).split(' ').filter(w => w).length;

  const handleEndNow = () => {
    if (started) {
      setFinished(true);
    } else {
      onFinish({ wpm: 0, accuracy: 0, maxCombo: 0, errors: 0, charsTyped: 0, levelId });
    }
  };

  return (
    <div className="game-screen" onClick={() => inputRef.current?.focus()}>
      {/* Stats Header */}
      <div className="game-header">
        <div className="stat-box">
          <span className="stat-label">WPM</span>
          <span className="stat-value stat-wpm">{liveWPM}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">ACC</span>
          <span className="stat-value stat-acc">{liveAccuracy}%</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">COMBO</span>
          <span className="stat-value stat-combo">{combo}x</span>
        </div>
        <div className="stat-box stat-level-box">
          <span className="stat-label">LEVEL</span>
          <div className="stat-level-content">
            <span className="stat-value" style={{ color: level.color }}>{level.name.toUpperCase()}</span>
            <span className="stat-level-icon">{level.icon}</span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="timer-section">
        <div className="timer-bar-container">
          <div className={`timer-bar ${timerCritical ? 'timer-critical' : ''}`} style={{ width: `${timerPercent}%` }}></div>
        </div>
        <div className="timer-info">
          <span className="timer-hint">{started ? '' : 'PRESS A KEY TO BEGIN'}</span>
          <span className="timer-countdown">{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      {/* Text Display */}
      <div className="text-display-box" ref={textDisplayRef}>
        {passage.split('').map((char, i) => {
          let cls = 'char char-pending';
          if (i < cursorIndex) {
            cls = charStates[i] === 'correct' ? 'char char-correct' : 'char char-wrong';
          } else if (i === cursorIndex) {
            cls = 'char char-current';
          }
          return <span key={i} className={cls}>{char === ' ' ? '\u00A0' : char}</span>;
        })}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        className={`typing-input ${shaking ? 'shake' : ''}`}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onKeyDown={handleKeyDown}
        value=""
        onChange={() => {}}
        placeholder="START TYPING…"
      />

      {/* Mini Stats Row */}
      <div className="mini-stats-row">
        <div className="mini-stat-box">
          <span className="mini-stat-label">TIME LEFT</span>
          <span className="mini-stat-value">{timeLeft.toFixed(1)}s</span>
        </div>
        <div className="mini-stat-box">
          <span className="mini-stat-label">WORDS</span>
          <span className="mini-stat-value">{wordsTyped}</span>
        </div>
        <div className="mini-stat-box">
          <span className="mini-stat-label">ERRORS</span>
          <span className="mini-stat-value mini-stat-errors">{errorCount}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="game-controls">
        <Link to="/" className="btn btn-quit">QUIT (ESC)</Link>
        <button className="btn btn-end-now" onClick={handleEndNow}>END NOW</button>
      </div>

      {/* Combo Flash */}
      {comboFlash && (
        <div className="combo-flash-overlay" style={{ color: comboFlash.color }}>
          {comboFlash.text}
        </div>
      )}
    </div>
  );
}
