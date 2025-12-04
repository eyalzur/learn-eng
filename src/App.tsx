import React, { useState, useEffect } from 'react';
import { MemoryGame } from './components/MemoryGame';
import { SpellingGame } from './components/SpellingGame';
import { FlashcardsGame } from './components/FlashcardsGame';
import { HangmanGame } from './components/HangmanGame';
import { GameMenu, GameType } from './components/GameMenu';
import './styles/main.css';

export const App: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  // Fix iOS Safari viewport height issue for browsers that don't support dvh
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

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
      {currentGame === 'flashcards' && (
        <FlashcardsGame onBack={handleBackToMenu} />
      )}
      {currentGame === 'hangman' && (
        <HangmanGame onBack={handleBackToMenu} />
      )}
    </div>
  );
};
