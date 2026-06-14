import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Type, Quote, Code2, Zap, Flame, Skull, Timer, AlignLeft, Play, ArrowLeft, AlertTriangle } from 'lucide-react';
import levels from '../data/levels';
import LucideIcon from './LucideIcon';
import './GameOptions.css';

const TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];
const MODE_OPTIONS = [
  { id: 'words', label: 'Words', Icon: Type,   desc: 'Random word bank' },
  { id: 'quote', label: 'Quote', Icon: Quote,  desc: 'Famous quotes' },
  { id: 'code',  label: 'Code',  Icon: Code2,  desc: 'Code snippets' },
];
const LENGTH_OPTIONS = [
  { id: 'short',  label: 'Short',  Icon: Zap,       desc: '~120 chars' },
  { id: 'medium', label: 'Medium', Icon: Flame,      desc: '~280 chars' },
  { id: 'long',   label: 'Long',   Icon: AlignLeft,  desc: '~480 chars' },
];

export default function GameOptions({ onStart }) {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = useMemo(() => levels.find(l => l.id === levelId) || levels[0], [levelId]);

  const [timer, setTimer]       = useState(level.time);
  const [mode, setMode]         = useState('words');
  const [textLength, setLength] = useState('medium');
  const [strict, setStrict]     = useState(false);

  const handleStart = () => {
    onStart({ timer, mode, textLength, strict });
    navigate(`/play/${levelId}`);
  };

  return (
    <div className="options-screen">
      {/* Back link */}
      <Link to="/" className="options-back-link">
        <ArrowLeft size={15} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        BACK
      </Link>

      {/* Level badge */}
      <div className="options-level-badge" style={{ '--lc': level.color }}>
        <span className="options-level-icon">
          <LucideIcon name={level.iconName} size={28} color={level.color} strokeWidth={2} />
        </span>
        <div>
          <span className="options-level-name" style={{ color: level.color }}>{level.name.toUpperCase()}</span>
          <span className="options-level-sub">{level.wpmRange}</span>
        </div>
      </div>

      <h1 className="options-title">CONFIGURE YOUR RUN</h1>

      {/* ── Timer ── */}
      <section className="options-section">
        <h2 className="options-section-title">
          <Timer size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          TIMER
        </h2>
        <div className="options-pill-row">
          {TIMER_OPTIONS.map(t => (
            <button
              key={t}
              className={`options-pill ${timer === t ? 'options-pill-active' : ''}`}
              onClick={() => setTimer(t)}
            >
              {t}s
            </button>
          ))}
        </div>
      </section>

      {/* ── Mode ── */}
      <section className="options-section">
        <h2 className="options-section-title">
          <Type size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          MODE
        </h2>
        <div className="options-card-row">
          {MODE_OPTIONS.map(m => (
            <button
              key={m.id}
              className={`options-mode-card ${mode === m.id ? 'options-mode-card-active' : ''}`}
              onClick={() => setMode(m.id)}
            >
              <span className="options-mode-icon">
                <m.Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="options-mode-label">{m.label}</span>
              <span className="options-mode-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Text Length ── */}
      {mode === 'words' && (
        <section className="options-section">
          <h2 className="options-section-title">
            <AlignLeft size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            TEXT LENGTH
          </h2>
          <div className="options-card-row">
            {LENGTH_OPTIONS.map(l => (
              <button
                key={l.id}
                className={`options-mode-card ${textLength === l.id ? 'options-mode-card-active' : ''}`}
                onClick={() => setLength(l.id)}
              >
                <span className="options-mode-icon">
                  <l.Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="options-mode-label">{l.label}</span>
                <span className="options-mode-desc">{l.desc}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Strict Mode ── */}
      <section className="options-section options-section-row">
        <div className="options-strict-info">
          <h2 className="options-section-title" style={{ margin: 0 }}>
            <AlertTriangle size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            STRICT MODE
          </h2>
          <p className="options-strict-desc">Disables backspace. Every key counts.</p>
        </div>
        <button
          className={`options-toggle ${strict ? 'options-toggle-on' : ''}`}
          onClick={() => setStrict(s => !s)}
          aria-label="Toggle strict mode"
        >
          <span className="options-toggle-knob" />
          <span className="options-toggle-label">{strict ? 'ON' : 'OFF'}</span>
        </button>
      </section>

      {/* ── Start Button ── */}
      <button className="options-start-btn" onClick={handleStart}>
        <Play size={18} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
        START GAME
      </button>
    </div>
  );
}
