import React, { useState, useEffect } from 'react';

export interface CardData {
  id: string;
  wordId: string;
  content: string;
  transcription?: string;
  type: 'english' | 'hebrew';
  isFlipped: boolean;
  isMatched: boolean;
  matchColor?: string;
}

interface CardProps {
  card: CardData;
  onClick: (id: string) => void;
  columnOrder?: number;
}

export const Card: React.FC<CardProps> = ({ card, onClick, columnOrder = 0 }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  const matchStyle = card.isMatched && card.matchColor
    ? { background: card.matchColor }
    : undefined;

  const cardStyle = { order: columnOrder };

  return (
    <div
      className={`card ${isReady ? 'ready' : ''} ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      style={cardStyle}
    >
      <div className="card-inner">
        <div className="card-front">
          <span className="card-icon">?</span>
        </div>
        <div className={`card-back ${card.type}`} style={matchStyle}>
          <span className="card-content">{card.content}</span>
          {card.transcription && (
            <span className="card-transcription">{card.transcription}</span>
          )}
        </div>
      </div>
    </div>
  );
};
