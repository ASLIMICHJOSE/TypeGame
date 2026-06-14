import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Type, Quote, Code2, Timer, AlertTriangle, Delete, ChevronRight } from 'lucide-react';
import levels from '../data/levels';
import LucideIcon from './LucideIcon';
import { generatePassage, calculateWPM, calculateAccuracy, COMBO_MILESTONES } from '../utils/gameLogic';
import './GameScreen.css';

const DEFAULT_OPTS = { timer: 60, mode: 'words', textLength: 'medium', strict: false };

const MODE_LABELS = {
  words: { label: 'WORDS', Icon: Type },
  quote: { label: 'QUOTE', Icon: Quote },
  code:  { label: 'CODE',  Icon: Code2 },
};
const LENGTH_LABELS = { short: 'SHORT', medium: 'MEDIUM', long: 'LONG' };

export default function GameScreen({ options = DEFAULT_OPTS, onFinish, onQuit }) {
  const { levelId } = useParams();
  const level   = useMemo(() => levels.find(l => l.id === levelId) || levels[0], [levelId]);
  const opts    = useMemo(() => ({ ...DEFAULT_OPTS, ...options }), [options]);
  const passage = useMemo(() => generatePassage(levelId, opts.textLength, opts.mode), [levelId, opts.textLength, opts.mode]);

  /* ── State ── */
  const [cursorIndex,   setCursorIndex]   = useState(0);
  const [correctCount,  setCorrectCount]  = useState(0);
  const [totalTyped,    setTotalTyped]    = useState(0); // total key presses (not counting backspace)
  const [errorCount,    setErrorCount]    = useState(0);
  const [combo,         setCombo]         = useState(0);
  const [maxCombo,      setMaxCombo]      = useState(0);
  const [timeLeft,      setTimeLeft]      = useState(opts.timer);
  const [started,       setStarted]       = useState(false);
  const [finished,      setFinished]      = useState(false);
  const [shaking,       setShaking]       = useState(false);
  const [comboFlash,    setComboFlash]    = useState(null);
  // charStates: 'pending' | 'correct' | 'wrong'
  const [charStates,    setCharStates]    = useState(() => Array(passage.length).fill('pending'));
  // mistakeSet tracks indices where a wrong keystroke ever occurred (for true accuracy)
  const [mistakeSet,    setMistakeSet]    = useState(() => new Set());

  const inputRef       = useRef(null);
  const timerRef       = useRef(null);
  const startTimeRef   = useRef(null);
  const textDisplayRef = useRef(null);

  /* ── Auto-focus ── */
  useEffect(() => { inputRef.current?.focus(); }, []);

  /* ── Timer ── */
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

  /* ── On finish ── */
  useEffect(() => {
    if (finished) {
      const elapsed = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : opts.timer;
      const wpm      = calculateWPM(correctCount, elapsed);
      // Accuracy based on unique mistake positions vs total chars reached
      const trueErrors = mistakeSet.size;
      const accuracy   = calculateAccuracy(correctCount, correctCount + trueErrors);
      onFinish({ wpm, accuracy, maxCombo, errors: trueErrors, charsTyped: correctCount, levelId });
    }
  }, [finished]); // eslint-disable-line

  /* ── Auto-scroll cursor into view ── */
  useEffect(() => {
    if (textDisplayRef.current) {
      const el = textDisplayRef.current.querySelector('.char-current');
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [cursorIndex]);

  /* ── Combo milestone check ── */
  const checkComboMilestone = useCallback((newCombo) => {
    for (const ms of COMBO_MILESTONES) {
      if (newCombo === ms.threshold) {
        setComboFlash(ms);
        setTimeout(() => setComboFlash(null), 1500);
        break;
      }
    }
  }, []);

  /* ── Key handler ── */
  const handleKeyDown = useCallback((e) => {
    if (finished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // ── Backspace ──
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (opts.strict) return; // strict mode: no backspace
      if (cursorIndex === 0) return;

      const prevIdx = cursorIndex - 1;
      const prevState = charStates[prevIdx];

      setCharStates(prev => {
        const next = [...prev];
        next[prevIdx] = 'pending';
        return next;
      });

      if (prevState === 'correct') {
        setCorrectCount(c => Math.max(0, c - 1));
        setCombo(c => Math.max(0, c - 1));
      }
      // We do NOT remove from mistakeSet – errors are permanent for accuracy

      setCursorIndex(i => i - 1);
      return;
    }

    // Only handle printable keys + space
    if (e.key.length !== 1 && e.key !== ' ') return;
    e.preventDefault();

    // Start timer on first keystroke
    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    const expected = passage[cursorIndex];
    const typed    = e.key;
    setTotalTyped(t => t + 1);

    if (typed === expected) {
      setCharStates(prev => { const n = [...prev]; n[cursorIndex] = 'correct'; return n; });
      setCorrectCount(c => c + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      checkComboMilestone(newCombo);
    } else {
      setCharStates(prev => { const n = [...prev]; n[cursorIndex] = 'wrong'; return n; });
      setErrorCount(c => c + 1);
      setMistakeSet(prev => new Set([...prev, cursorIndex]));
      setCombo(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }

    // Advance cursor
    setCursorIndex(prev => {
      const next = prev + 1;
      if (next >= passage.length) setFinished(true);
      return next;
    });
  }, [cursorIndex, passage, started, finished, combo, maxCombo, opts.strict, charStates, checkComboMilestone]);

  /* ── ESC to quit ── */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onQuit(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onQuit]);

  /* ── Live stats ── */
  const elapsed     = started && startTimeRef.current ? Math.max((Date.now() - startTimeRef.current) / 1000, 0.1) : 0.1;
  const liveWPM     = started ? calculateWPM(correctCount, elapsed) : 0;
  const liveAccuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
  const timerPercent = (timeLeft / opts.timer) * 100;
  const timerCritical = timerPercent <= 25;

  const handleEndNow = () => {
    if (started) {
      setFinished(true);
    } else {
      onFinish({ wpm: 0, accuracy: 0, maxCombo: 0, errors: 0, charsTyped: 0, levelId });
    }
  };

  const ModeIcon = MODE_LABELS[opts.mode]?.Icon || Type;

  return (
    <div className="game-screen" onClick={() => inputRef.current?.focus()}>

      {/* ── Settings strip ── */}
      <div className="game-settings-strip">
        <span className="gs-tag">
          <ModeIcon size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
          {MODE_LABELS[opts.mode]?.label}
        </span>
        {opts.mode === 'words' && (
          <span className="gs-tag">{LENGTH_LABELS[opts.textLength]}</span>
        )}
        <span className="gs-tag">
          <Timer size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
          {opts.timer}s
        </span>
        {opts.strict && (
          <span className="gs-tag gs-tag-strict">
            <AlertTriangle size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
            STRICT
          </span>
        )}
        {!opts.strict && (
          <span className="gs-tag gs-tag-backspace">
            <Delete size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
            BACKSPACE ON
          </span>
        )}
      </div>

      {/* ── Stats Header ── */}
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
            <span className="stat-level-icon">
              <LucideIcon name={level.iconName} size={18} color={level.color} strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Timer Bar ── */}
      <div className="timer-section">
        <div className="timer-bar-container">
          <div className={`timer-bar ${timerCritical ? 'timer-critical' : ''}`} style={{ width: `${timerPercent}%` }} />
        </div>
        <div className="timer-info">
          <span className="timer-hint">{started ? '' : 'PRESS A KEY TO BEGIN'}</span>
          <span className={`timer-countdown ${timerCritical ? 'critical' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      {/* ── Text Display ── */}
      <div className={`text-display-box ${started ? 'active' : ''}`} ref={textDisplayRef}>
        {passage.split('').map((char, i) => {
          let cls = 'char char-pending';
          if (i < cursorIndex) {
            cls = charStates[i] === 'correct' ? 'char char-correct' : 'char char-wrong';
          } else if (i === cursorIndex) {
            cls = 'char char-current';
          }
          return (
            <span key={i} className={cls}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>

      {/* ── Hidden input ── */}
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
        placeholder={opts.strict ? 'STRICT MODE — NO BACKSPACE…' : 'START TYPING… (BACKSPACE TO UNDO)'}
      />

      {/* ── Error counter ── */}
      <div className="game-error-row">
        <span className="game-error-label">ERRORS</span>
        <span className="game-error-value">{errorCount}</span>
        {!opts.strict && (
          <span className="game-backspace-hint">
            <Delete size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
            backspace to correct
          </span>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="game-controls">
        <Link to={`/options/${levelId}`} className="btn btn-quit">OPTIONS (ESC)</Link>
        <button className="btn btn-end-now" onClick={handleEndNow}>
          <ChevronRight size={15} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
          END NOW
        </button>
      </div>

      {/* ── Combo Flash ── */}
      {comboFlash && (
        <div className="combo-flash-overlay" style={{ color: comboFlash.color }}>
          {comboFlash.text}
        </div>
      )}
    </div>
  );
}
