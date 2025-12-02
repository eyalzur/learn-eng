import React, { useState } from 'react';
import { MemoryGame } from './components/MemoryGame';
import { SpellingGame } from './components/SpellingGame';
import { GameMenu, GameType } from './components/GameMenu';
import './styles/main.css';

export const App: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <div className="app">
      {currentGame === null && (
        <GameMenu onSelectGame={setCurrentGame} />
      )}
      {currentGame === 'memory' && (
        <MemoryGame onBack={handleBackToMenu} />
      )}
      {currentGame === 'spelling' && (
        <SpellingGame onBack={handleBackToMenu} />
      )}
    </div>
  );
};
