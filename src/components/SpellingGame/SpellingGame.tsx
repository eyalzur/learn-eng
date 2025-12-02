import React, { useState, useEffect, useCallback } from 'react';
import { Word, getRandomWords } from '../../data/dictionary';
import { speak } from '../../utils/speech';

interface SpellingGameProps {
  onBack?: () => void;
}

const STORAGE_KEY = 'learn-eng-spelling-streak-record';

const getRecord = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const saveRecord = (streak: number): boolean => {
  const currentRecord = getRecord();
  if (streak > currentRecord) {
    localStorage.setItem(STORAGE_KEY, streak.toString());
    return true;
  }
  return false;
};

// Generate extra random letters to add to the basket
const getExtraLetters = (count: number): string[] => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const extras: string[] = [];
  for (let i = 0; i < count; i++) {
    extras.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  return extras;
};

// Shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [letterBoxes, setLetterBoxes] = useState<(string | null)[]>([]);
  const [letterBasket, setLetterBasket] = useState<{ letter: string; id: string }[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<{ letter: string; id: string } | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [record, setRecord] = useState<number>(getRecord());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [justDropped, setJustDropped] = useState<boolean>(false);

  const setupWord = useCallback((word: Word) => {
    const letters = word.english.toLowerCase().split('');
    const extraCount = Math.max(2, Math.floor(letters.length * 0.5)); // Add 50% extra letters, min 2
    const extraLetters = getExtraLetters(extraCount);
    const allLetters = shuffleArray([...letters, ...extraLetters]);

    setLetterBoxes(new Array(letters.length).fill(null));
    setLetterBasket(allLetters.map((letter, i) => ({ letter, id: `${letter}-${i}-${Date.now()}` })));
    setFeedback(null);
    setShowHint(false);
  }, []);

  const initializeGame = useCallback(() => {
    const gameWords = getRandomWords(20); // Get more words for endless play
    setWords(gameWords);
    setCurrentIndex(0);
    setStreak(0);
    setIsNewRecord(false);
    if (gameWords.length > 0) {
      setupWord(gameWords[0]);
    }
  }, [setupWord]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const currentWord = words[currentIndex];

  const handleDragStart = (letter: { letter: string; id: string }) => {
    setDraggedLetter(letter);
  };

  const handleDragEnd = () => {
    setDraggedLetter(null);
  };

  const handleDropOnBox = (boxIndex: number) => {
    if (!draggedLetter || feedback) return;

    // If box already has a letter, return it to basket
    if (letterBoxes[boxIndex] !== null) {
      const oldLetter = letterBoxes[boxIndex]!;
      setLetterBasket(prev => [...prev, { letter: oldLetter, id: `${oldLetter}-returned-${Date.now()}` }]);
    }

    // Place dragged letter in box
    const newBoxes = [...letterBoxes];
    newBoxes[boxIndex] = draggedLetter.letter;
    setLetterBoxes(newBoxes);

    // Remove letter from basket
    setLetterBasket(prev => prev.filter(l => l.id !== draggedLetter.id));
    setDraggedLetter(null);

    // Prevent onClick from firing immediately after drop
    setJustDropped(true);
    setTimeout(() => setJustDropped(false), 100);
  };

  const handleRemoveFromBox = (boxIndex: number) => {
    if (feedback || justDropped) return;

    const letter = letterBoxes[boxIndex];
    if (letter) {
      // Return letter to basket
      setLetterBasket(prev => [...prev, { letter, id: `${letter}-returned-${Date.now()}` }]);

      // Clear the box
      const newBoxes = [...letterBoxes];
      newBoxes[boxIndex] = null;
      setLetterBoxes(newBoxes);
    }
  };

  const checkAnswer = () => {
    if (!currentWord || feedback) return;
    if (letterBoxes.some(box => box === null)) return; // Not all boxes filled

    const answer = letterBoxes.join('').toLowerCase().trim();
    const correct = currentWord.english.toLowerCase().trim();

    const isCorrect = answer === correct;

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      speak(currentWord.english, 'en');

      const isNew = saveRecord(newStreak);
      if (isNew) {
        setRecord(newStreak);
        setIsNewRecord(true);
      }
    } else {
      setFeedback('incorrect');
      // Check if current streak was a record before resetting
      if (streak > 0) {
        saveRecord(streak);
      }
    }
  };

  const nextWord = () => {
    if (feedback === 'incorrect') {
      // Reset streak on wrong answer
      setStreak(0);
      setIsNewRecord(false);
    }

    const nextIndex = (currentIndex + 1) % words.length;
    if (nextIndex === 0) {
      // Reshuffle words when we've gone through all
      const newWords = getRandomWords(20);
      setWords(newWords);
      setCurrentIndex(0);
      setupWord(newWords[0]);
    } else {
      setCurrentIndex(nextIndex);
      setupWord(words[nextIndex]);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    speak(currentWord.english, 'en');
  };

  const allBoxesFilled = letterBoxes.every(box => box !== null);

  return (
    <div className="spelling-game">
      <div className="game-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            → חזרה לתפריט
          </button>
        )}
        <h1>משחק איות</h1>
        <div className="game-stats">
          <span className="stat">
            רצף: <strong>{streak}</strong>
          </span>
          <span className={`stat record ${isNewRecord ? 'new-record-glow' : ''}`}>
            שיא: <strong>{record}</strong>
          </span>
        </div>
        <div className="game-controls">
          <button className="restart-button" onClick={initializeGame}>
            משחק חדש
          </button>
        </div>
      </div>

      {currentWord && (
        <div className="spelling-card">
          <div className="word-display">
            <span className="hebrew-word">{currentWord.hebrew}</span>
            {showHint && (
              <span className="transcription-hint">{currentWord.transcription}</span>
            )}
          </div>

          <div className="letter-boxes">
            {letterBoxes.map((letter, index) => (
              <div
                key={index}
                className={`letter-box ${letter ? 'filled' : ''} ${feedback || ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnBox(index)}
                onClick={() => handleRemoveFromBox(index)}
              >
                {letter?.toUpperCase()}
              </div>
            ))}
          </div>

          {feedback === 'incorrect' && (
            <div className="correct-answer">
              התשובה הנכונה: <strong>{currentWord.english.toUpperCase()}</strong>
            </div>
          )}

          <div className="action-buttons">
            {!feedback ? (
              <>
                <button
                  className="hint-button"
                  onClick={handleHint}
                  disabled={showHint}
                >
                  רמז (הגייה)
                </button>
                <button
                  className="check-button"
                  onClick={checkAnswer}
                  disabled={!allBoxesFilled}
                >
                  בדוק
                </button>
              </>
            ) : (
              <button className="next-button" onClick={nextWord}>
                הבא
              </button>
            )}
          </div>

          <div className="letter-basket">
            {letterBasket.map((item) => (
              <div
                key={item.id}
                className={`basket-letter ${draggedLetter?.id === item.id ? 'dragging' : ''}`}
                draggable={!feedback}
                onDragStart={() => handleDragStart(item)}
                onDragEnd={handleDragEnd}
              >
                {item.letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="game-instructions">
        <p>גרור אותיות מהסל למשבצות כדי לאיית את המילה באנגלית. לחץ על משבצת להחזיר אות.</p>
      </div>
    </div>
  );
};
