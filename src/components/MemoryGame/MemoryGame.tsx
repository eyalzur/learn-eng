import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardData } from './Card';
import { Word, getRandomWords } from '../../data/dictionary';
import { speak } from '../../utils/speech';

interface MemoryGameProps {
  wordCount?: number;
  onBack?: () => void;
}

const MATCH_COLORS = [
  '#FF6B6B', // coral red
  '#4ECDC4', // teal
  '#FFE66D', // yellow
  '#95E1D3', // mint
  '#F38181', // salmon
  '#AA96DA', // lavender
  '#FCBAD3', // pink
  '#A8D8EA', // sky blue
  '#FF9F43', // orange
  '#6C5CE7', // purple
];

const STORAGE_KEY = 'learn-eng-word-count';
const RECORDS_KEY = 'learn-eng-records';

const getStoredWordCount = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const count = stored ? parseInt(stored, 10) : 5;
  return Math.max(4, Math.min(10, count));
};

const getRecords = (): Record<number, number> => {
  const stored = localStorage.getItem(RECORDS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveRecord = (wordCount: number, moves: number): boolean => {
  const records = getRecords();
  if (!records[wordCount] || moves < records[wordCount]) {
    records[wordCount] = moves;
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return true;
  }
  return false;
};

export const MemoryGame: React.FC<MemoryGameProps> = ({ wordCount: defaultWordCount = 5, onBack }) => {
  const [wordCount, setWordCount] = useState<number>(getStoredWordCount);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [colorIndex, setColorIndex] = useState<number>(0);
  const [record, setRecord] = useState<number | null>(getRecords()[getStoredWordCount()] || null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const handleWordCountChange = (newCount: number) => {
    setWordCount(newCount);
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    setRecord(getRecords()[newCount] || null);
    setIsNewRecord(false);
  };

  const initializeGame = useCallback(() => {
    const words = getRandomWords(wordCount);
    const gameCards: CardData[] = [];

    words.forEach((word: Word) => {
      // English card - shows word and transcription
      gameCards.push({
        id: `en-${word.id}`,
        wordId: word.id,
        content: word.english,
        transcription: word.transcription,
        type: 'english',
        isFlipped: false,
        isMatched: false,
      });

      // Hebrew card - shows translation
      gameCards.push({
        id: `he-${word.id}`,
        wordId: word.id,
        content: word.hebrew,
        type: 'hebrew',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsChecking(false);
    setColorIndex(0);
    setIsNewRecord(false);
  }, [wordCount]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Check for new record when game completes
  useEffect(() => {
    if (matchedPairs === wordCount && matchedPairs > 0) {
      const isNew = saveRecord(wordCount, moves);
      if (isNew) {
        setRecord(moves);
        setIsNewRecord(true);
      }
    }
  }, [matchedPairs, wordCount, moves]);

  const handleCardClick = (cardId: string) => {
    if (isChecking || flippedCards.length >= 2) return;

    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    // Read the card text aloud
    const lang = clickedCard.type === 'english' ? 'en' : 'he';
    speak(clickedCard.content, lang);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
        // Match found!
        const matchColor = MATCH_COLORS[colorIndex % MATCH_COLORS.length];
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.wordId === firstCard.wordId ? { ...c, isMatched: true, matchColor } : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setColorIndex((prev) => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const isGameComplete = matchedPairs === wordCount;

  return (
    <div className="memory-game">
      <div className="game-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            → חזרה לתפריט
          </button>
        )}
        <h1>משחק זיכרון</h1>
        <div className="game-stats">
          <span className="stat">
            מהלכים: <strong>{moves}</strong>
          </span>
          <span className="stat">
            זוגות: <strong>{matchedPairs}/{wordCount}</strong>
          </span>
          {record !== null && (
            <span className="stat record">
              שיא: <strong>{record}</strong>
            </span>
          )}
        </div>
        <div className="game-controls">
          <label className="word-count-label">
            מספר מילים:
            <select
              className="word-count-select"
              value={wordCount}
              onChange={(e) => handleWordCountChange(parseInt(e.target.value, 10))}
            >
              {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <button className="restart-button" onClick={initializeGame}>
            משחק חדש
          </button>
        </div>
      </div>

      {isGameComplete && (
        <div className={`game-complete ${isNewRecord ? 'new-record' : ''}`}>
          <h2>{isNewRecord ? 'שיא חדש!' : 'כל הכבוד!'}</h2>
          <p>סיימת את המשחק ב-{moves} מהלכים</p>
        </div>
      )}

      <div className={`cards-grid ${wordCount >= 9 ? 'cols-5' : wordCount >= 6 ? 'cols-4' : wordCount === 5 ? 'cols-3' : ''}`}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <div className="game-instructions">
        <p>מצא את הזוגות התואמים: מילה באנגלית והתרגום שלה בעברית</p>
      </div>
    </div>
  );
};
