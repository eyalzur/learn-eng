import React from 'react';
import { GameHeader, GameHeaderProps } from '../GameHeader/GameHeader';
import { GameFooter, GameFooterProps } from '../GameFooter/GameFooter';

export interface GameLayoutProps extends GameHeaderProps, GameFooterProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  // Header props
  onBack,
  title,
  progress,
  onSettings,
  settingsOpen,
  settingsContent,

  // Footer props
  statusMessage,
  statusType,
  showNext,
  nextLabel,
  onNext,
  nextDisabled,

  // Children
  children,
}) => {
  return (
    <div className="game-layout">
      <GameHeader
        onBack={onBack}
        title={title}
        progress={progress}
        onSettings={onSettings}
        settingsOpen={settingsOpen}
        settingsContent={settingsContent}
      />

      <div className="game-layout__content">
        {children}
      </div>

      <GameFooter
        statusMessage={statusMessage}
        statusType={statusType}
        showNext={showNext}
        nextLabel={nextLabel}
        onNext={onNext}
        nextDisabled={nextDisabled}
      />
    </div>
  );
};
