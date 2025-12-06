import React, { useState, useEffect, useCallback } from 'react';
import { Word, getRandomWords } from '../../data/dictionary';
import { speak } from '../../utils/speech';
import { GameLayout } from '../shared/GameLayout';
import { WordTeachingModal } from '../shared/WordTeachingModal';

interface HangmanGameProps {
  onBack?: () => void;
}

const STORAGE_KEY = 'learn-eng-hangman-streak-record';
const MAX_WRONG_GUESSES = 6;

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

// Generate extra random letters to add as decoys
const getExtraLetters = (count: number, excludeLetters: Set<string>): string[] => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const available = alphabet.split('').filter(l => !excludeLetters.has(l));
  const extras: string[] = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    extras.push(available.splice(idx, 1)[0]);
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

// Hangman figure stages (7 stages: 0-6 wrong guesses)
const getHangmanFigure = (wrongCount: number): string => {
  const stages = [
    // Stage 0: Empty
    `
    ┌───────┐
    │       │
    │
    │
    │
    │━━━
    └───────┘
    `,
    // Stage 1: Head
    `
    ┌───────┐
    │       │
    │       ○
    │
    │
    │━━━
    └───────┘
    `,
    // Stage 2: Body
    `
    ┌───────┐
    │       │
    │       ○
    │       │
    │       │
    │━━━
    └───────┘
    `,
    // Stage 3: Left arm
    `
    ┌───────┐
    │       │
    │       ○
    │      ╱│
    │       │
    │━━━
    └───────┘
    `,
    // Stage 4: Right arm
    `
    ┌───────┐
    │       │
    │       ○
    │      ╱│╲
    │       │
    │━━━
    └───────┘
    `,
    // Stage 5: Left leg
    `
    ┌───────┐
    │       │
    │       ○
    │      ╱│╲
    │       │
    │━━━  ╱
    └───────┘
    `,
    // Stage 6: Right leg (game over)
    `
    ┌───────┐
    │       │
    │       ○
    │      ╱│╲
    │       │
    │━━━  ╱ ╲
    └───────┘
    `,
  ];

  return stages[Math.min(wrongCount, 6)];
};

export const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [streak, setStreak] = useState<number>(0);
  const [record, setRecord] = useState<number>(getRecord());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const setupWord = useCallback((word: Word) => {
    // Get unique letters from the word
    const wordLetters = new Set(word.english.toLowerCase().split('').filter(c => c !== ' '));
    // Add at least 8 extra decoy letters (to allow 6 wrong guesses + buffer)
    const extraCount = Math.max(8, Math.floor(wordLetters.size * 0.5));
    const extraLetters = getExtraLetters(extraCount, wordLetters);
    // Combine and shuffle
    const allLetters = shuffleArray([...wordLetters, ...extraLetters]);
    setAvailableLetters(allLetters);

    setGuessedLetters(new Set());
    setWrongGuesses([]);
    setGameStatus('playing');
    setShowModal(false);
  }, []);

  const initializeGame = useCallback(() => {
    const gameWords = getRandomWords(20);
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

  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    const targetWord = currentWord.english.toLowerCase();
    const isCorrect = targetWord.includes(letter);

    if (!isCorrect) {
      const newWrongGuesses = [...wrongGuesses, letter];
      setWrongGuesses(newWrongGuesses);

      // Check if lost
      if (newWrongGuesses.length >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
        // Save record if current streak is a record before resetting
        if (streak > 0) {
          saveRecord(streak);
        }
        speak(currentWord.english, 'en');
        setShowModal(true);
      }
    } else {
      // Check if won (all letters guessed)
      const allLettersGuessed = targetWord.split('').every(char =>
        newGuessedLetters.has(char) || char === ' '
      );

      if (allLettersGuessed) {
        setGameStatus('won');
        const newStreak = streak + 1;
        setStreak(newStreak);
        speak(currentWord.english, 'en');

        const isNew = saveRecord(newStreak);
        if (isNew) {
          setRecord(newStreak);
          setIsNewRecord(true);
        }
        setShowModal(true);
      }
    }
  };

  const handleNextWord = () => {
    if (gameStatus === 'lost') {
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

  const handleModalClose = () => {
    setShowModal(false);
    handleNextWord();
  };

  const handleHint = () => {
    if (currentWord) {
      speak(currentWord.english, 'en');
    }
  };

  // Get the displayed word with guessed letters revealed (or all letters on loss)
  const getDisplayWord = (): string[] => {
    if (!currentWord) return [];
    return currentWord.english.toLowerCase().split('').map(char => {
      if (char === ' ') return ' ';
      // Show all letters when game is lost
      if (gameStatus === 'lost') return char.toUpperCase();
      return guessedLetters.has(char) ? char.toUpperCase() : '_';
    });
  };

  const displayWord = getDisplayWord();
  const wrongGuessCount = wrongGuesses.length;

  const progressContent = (
    <>
      <span className="stat">
        רצף: <strong>{streak}</strong>
      </span>
      <span className={`stat record ${isNewRecord ? 'new-record-glow' : ''}`}>
        שיא: <strong>{record}</strong>
      </span>
    </>
  );

  const getStatusMessage = () => {
    if (gameStatus === 'won') return 'ניצחת!';
    if (gameStatus === 'lost') return 'הפסדת';
    return undefined;
  };

  const getStatusType = (): 'success' | 'error' | 'neutral' => {
    if (gameStatus === 'won') return 'success';
    if (gameStatus === 'lost') return 'error';
    return 'neutral';
  };

  return (
    <>
      <GameLayout
        onBack={onBack || (() => {})}
        title="משחק תליין"
        progress={progressContent}
        statusMessage={getStatusMessage()}
        statusType={getStatusType()}
        showNext={gameStatus !== 'playing' && !showModal}
        onNext={handleNextWord}
      >
        {currentWord && (
          <div className="hangman-game__content">
            <div className="hangman-figure">
              <pre>{getHangmanFigure(wrongGuessCount)}</pre>
            </div>

            <div className="word-display">
              <div className="hebrew-hint">
                <button className="speak-btn" onClick={handleHint} title="השמע">
                  🔊
                </button>
                {currentWord.hebrew}
                <span className="transcription-hint">({currentWord.transcription})</span>
              </div>
              <div className={`word-blanks ${gameStatus === 'lost' ? 'revealed-lost' : ''} ${gameStatus === 'won' ? 'revealed-won' : ''}`}>
                {displayWord.map((char, index) => (
                  <span key={index} className="letter-blank">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {gameStatus === 'playing' && (
              <>
                <div className="letter-keyboard">
                  {availableLetters.map(letter => {
                    const isGuessed = guessedLetters.has(letter);
                    const isCorrect = isGuessed && currentWord.english.toLowerCase().includes(letter);
                    const isIncorrect = isGuessed && !currentWord.english.toLowerCase().includes(letter);

                    return (
                      <button
                        key={letter}
                        className={`letter-button ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                        onClick={() => handleLetterGuess(letter)}
                        disabled={isGuessed}
                      >
                        {letter.toUpperCase()}
                      </button>
                    );
                  })}
                </div>

                {wrongGuesses.length > 0 && (
                  <div className="wrong-guesses">
                    שגויים: {wrongGuesses.map(l => l.toUpperCase()).join(', ')}
                    <span className="count"> ({wrongGuessCount}/{MAX_WRONG_GUESSES})</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </GameLayout>

      {currentWord && (
        <WordTeachingModal
          isOpen={showModal}
          word={currentWord}
          isSuccess={gameStatus === 'won'}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};
