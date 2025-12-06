import React from 'react';

export interface GameFooterProps {
  statusMessage?: string;
  statusType?: 'success' | 'error' | 'neutral';
  showNext?: boolean;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
}

export const GameFooter: React.FC<GameFooterProps> = ({
  statusMessage,
  statusType = 'neutral',
  showNext = false,
  nextLabel = 'הבא',
  onNext,
  nextDisabled = false,
}) => {
  return (
    <div className="game-layout__footer">
      <div className={`game-layout__status game-layout__status--${statusType}`}>
        {statusMessage && (
          <>
            {statusType === 'success' && <span className="game-layout__status-icon">&#10003;</span>}
            {statusType === 'error' && <span className="game-layout__status-icon">&#10007;</span>}
            <span className="game-layout__status-text">{statusMessage}</span>
          </>
        )}
      </div>

      <div className="game-layout__actions">
        {showNext && onNext && (
          <button
            className="game-layout__next-btn"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
};
