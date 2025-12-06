import React from 'react';

export interface GameHeaderProps {
  onBack: () => void;
  title?: string;
  progress?: React.ReactNode;
  onSettings?: () => void;
  settingsOpen?: boolean;
  settingsContent?: React.ReactNode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onBack,
  title,
  progress,
  onSettings,
  settingsOpen,
  settingsContent,
}) => {
  return (
    <div className="game-layout__header">
      <button className="game-layout__back-btn" onClick={onBack} aria-label="Back to menu">
        <span className="game-layout__back-icon">&#8594;</span>
      </button>

      <div className="game-layout__header-center">
        {title && <h1 className="game-layout__title">{title}</h1>}
        {progress && <div className="game-layout__progress">{progress}</div>}
      </div>

      <div className="game-layout__header-end">
        {onSettings && (
          <button
            className={`game-layout__settings-btn ${settingsOpen ? 'active' : ''}`}
            onClick={onSettings}
            aria-label="Settings"
          >
            &#9881;
          </button>
        )}
      </div>

      {settingsOpen && settingsContent && (
        <div className="game-layout__settings-panel">
          {settingsContent}
        </div>
      )}
    </div>
  );
};
