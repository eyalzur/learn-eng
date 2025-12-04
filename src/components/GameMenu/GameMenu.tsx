import React from 'react';
import { APP_VERSION } from '../../constants/version';

export type GameType = 'memory' | 'spelling' | 'flashcards' | 'hangman' | null;

interface GameInfo {
  id: GameType;
  name: string;
  nameHe: string;
  description: string;
  icon: string;
  available: boolean;
}

const GAMES: GameInfo[] = [
  {
    id: 'memory',
    name: 'Memory Game',
    nameHe: 'משחק זיכרון',
    description: 'התאם מילים באנגלית לתרגום בעברית',
    icon: '🎴',
    available: true,
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    nameHe: 'כרטיסיות',
    description: 'למד מילים עם כרטיסיות',
    icon: '📇',
    available: true,
  },
  {
    id: 'spelling',
    name: 'Spelling',
    nameHe: 'איות',
    description: 'תרגל כתיבת מילים באנגלית',
    icon: '✏️',
    available: true,
  },
  {
    id: 'hangman',
    name: 'Hangman',
    nameHe: 'תליין',
    description: 'נחש את המילה אות אחר אות',
    icon: '👤',
    available: true,
  },
  {
    id: null,
    name: 'Quiz',
    nameHe: 'חידון',
    description: 'בחר את התרגום הנכון',
    icon: '❓',
    available: false,
  },
];

interface GameMenuProps {
  onSelectGame: (game: GameType) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="game-menu">
      <div className="menu-header">
        <h1>לומדים אנגלית</h1>
        <p>בחר משחק להתחיל</p>
      </div>

      <div className="games-grid">
        {GAMES.map((game, index) => (
          <button
            key={index}
            className={`game-card ${!game.available ? 'disabled' : ''}`}
            onClick={() => game.available && game.id && onSelectGame(game.id)}
            disabled={!game.available}
          >
            <span className="game-icon">{game.icon}</span>
            <span className="game-name">{game.nameHe}</span>
            <span className="game-name-en">{game.name}</span>
            <span className="game-description">{game.description}</span>
            {!game.available && <span className="coming-soon">בקרוב</span>}
          </button>
        ))}
      </div>

      <div className="app-version">v{APP_VERSION}</div>
    </div>
  );
};
