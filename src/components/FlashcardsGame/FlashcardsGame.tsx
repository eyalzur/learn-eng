import React, { useState, useEffect, useCallback } from 'react';
import { Word, dictionary } from '../../data/dictionary';
import { speak } from '../../utils/speech';
import { GameLayout } from '../shared/GameLayout';
import { WordTeachingModal } from '../shared/WordTeachingModal';

interface FlashcardsGameProps {
  onBack?: () => void;
}

interface CardState {
  word: Word;
  box: number; // 1-5 spaced repetition box
  lastSeen: number; // timestamp
}

type QuestionLanguage = 'hebrew' | 'english';

const STORAGE_KEY = 'learn-eng-flashcards-progress';
const SETTINGS_KEY = 'learn-eng-flashcards-settings';

// Get initial card states from localStorage or create new ones
const getStoredProgress = (): CardState[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedCards: CardState[] = JSON.parse(stored);
    // Merge stored progress with fresh dictionary data (to get new fields like exampleSentence)
    const dictMap = new Map(dictionary.map(w => [w.id, w]));
    return storedCards.map(card => ({
      ...card,
      word: dictMap.get(card.word.id) || card.word,
    }));
  }
  return dictionary.map((word) => ({
    word,
    box: 1,
    lastSeen: 0,
  }));
};

const getStoredSettings = (): { choiceCount: number; questionLang: QuestionLanguage } => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { choiceCount: 4, questionLang: 'hebrew' };
};

const saveProgress = (cards: CardState[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

const saveSettings = (choiceCount: number, questionLang: QuestionLanguage) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ choiceCount, questionLang }));
};

// Select next card using spaced repetition (lower score = higher priority)
const selectNextCard = (allCards: CardState[], excludeId?: string): CardState => {
  const now = Date.now();
  const candidates = excludeId ? allCards.filter(c => c.word.id !== excludeId) : allCards;
  const scored = candidates.map((card) => {
    const boxWeight = card.box;
    const ageInHours = (now - card.lastSeen) / (1000 * 60 * 60);
    const intervalHours = Math.pow(2, card.box - 1);
    const urgency = ageInHours / intervalHours;
    return { card, score: boxWeight - urgency };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored[0].card;
};

// Get random distractor words (not the correct answer)
const getDistractors = (correctWord: Word, count: number): Word[] => {
  const others = dictionary.filter((w) => w.id !== correctWord.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ onBack }) => {
  const [allCards, setAllCards] = useState<CardState[]>(getStoredProgress);
  const [currentCard, setCurrentCard] = useState<CardState | null>(null);
  const [choices, setChoices] = useState<Word[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Settings
  const storedSettings = getStoredSettings();
  const [choiceCount, setChoiceCount] = useState(storedSettings.choiceCount);
  const [questionLang, setQuestionLang] = useState<QuestionLanguage>(storedSettings.questionLang);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize first card
  useEffect(() => {
    if (!currentCard && allCards.length > 0) {
      setCurrentCard(selectNextCard(allCards));
    }
  }, [allCards]);

  // Generate choices when card changes
  useEffect(() => {
    if (currentCard) {
      const distractors = getDistractors(currentCard.word, choiceCount - 1);
      const allChoices = [currentCard.word, ...distractors];
      // Shuffle choices
      setChoices(allChoices.sort(() => Math.random() - 0.5));
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowModal(false);
    }
  }, [currentCard, choiceCount]);

  const handleSpeak = useCallback((word: Word, lang: 'en' | 'he') => {
    const text = lang === 'en' ? word.english : word.hebrew;
    speak(text, lang);
  }, []);

  const handleAnswer = useCallback((selectedWord: Word) => {
    if (isAnswered || !currentCard) return;

    const correct = selectedWord.id === currentCard.word.id;
    setSelectedAnswer(selectedWord.id);
    setIsAnswered(true);
    setIsCorrect(correct);

    // Speak the correct answer
    const answerLang = questionLang === 'hebrew' ? 'en' : 'he';
    speak(answerLang === 'en' ? currentCard.word.english : currentCard.word.hebrew, answerLang);

    // Update spaced repetition
    const updatedCards = allCards.map((card) => {
      if (card.word.id === currentCard.word.id) {
        const newBox = correct
          ? Math.min(5, card.box + 1)
          : 1;
        return { ...card, box: newBox, lastSeen: Date.now() };
      }
      return card;
    });

    setAllCards(updatedCards);
    saveProgress(updatedCards);

    // Show the teaching modal
    setShowModal(true);
  }, [isAnswered, currentCard, allCards, questionLang]);

  const handleNext = useCallback(() => {
    // Select next card, avoiding the current one
    const nextCard = selectNextCard(allCards, currentCard?.word.id);
    setCurrentCard(nextCard);
  }, [allCards, currentCard]);

  const handleModalClose = () => {
    setShowModal(false);
    handleNext();
  };

  const handleSettingsChange = (newChoiceCount: number, newQuestionLang: QuestionLanguage) => {
    setChoiceCount(newChoiceCount);
    setQuestionLang(newQuestionLang);
    saveSettings(newChoiceCount, newQuestionLang);
  };

  const resetAllProgress = useCallback(() => {
    const reset = dictionary.map((word) => ({
      word,
      box: 1,
      lastSeen: 0,
    }));
    setAllCards(reset);
    saveProgress(reset);
    setCurrentCard(selectNextCard(reset));
    setShowSettings(false);
  }, []);

  // Calculate mastery
  const masteredCount = allCards.filter((c) => c.box >= 4).length;
  const totalCount = allCards.length;
  const masteryPercent = Math.round((masteredCount / totalCount) * 100);

  const progressContent = (
    <span className="stat mastery-stat">
      {masteredCount}/{totalCount} ({masteryPercent}%)
    </span>
  );

  const settingsContent = (
    <div className="flashcards-settings">
      <div className="setting-group">
        <label>מספר אפשרויות:</label>
        <div className="choice-buttons">
          {[2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`choice-btn ${choiceCount === num ? 'active' : ''}`}
              onClick={() => handleSettingsChange(num, questionLang)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <label>שפת השאלה:</label>
        <div className="choice-buttons">
          <button
            className={`choice-btn ${questionLang === 'hebrew' ? 'active' : ''}`}
            onClick={() => handleSettingsChange(choiceCount, 'hebrew')}
          >
            עברית
          </button>
          <button
            className={`choice-btn ${questionLang === 'english' ? 'active' : ''}`}
            onClick={() => handleSettingsChange(choiceCount, 'english')}
          >
            אנגלית
          </button>
        </div>
      </div>

      <div className="mastery-progress">
        <div className="mastery-label">התקדמות כללית</div>
        <div className="mastery-bar">
          <div
            className="mastery-fill"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
        <div className="mastery-text">
          {masteredCount} / {totalCount} מילים נלמדו ({masteryPercent}%)
        </div>
      </div>

      <button className="action-button secondary" onClick={resetAllProgress}>
        אפס התקדמות
      </button>
    </div>
  );

  if (!currentCard) {
    return (
      <GameLayout
        onBack={onBack || (() => {})}
        title="כרטיסיות"
        progress={progressContent}
      >
        <div className="loading">טוען...</div>
      </GameLayout>
    );
  }

  const getStatusMessage = () => {
    if (isAnswered && isCorrect) return 'נכון!';
    if (isAnswered && !isCorrect) return 'לא נכון';
    return undefined;
  };

  const getStatusType = (): 'success' | 'error' | 'neutral' => {
    if (isAnswered && isCorrect) return 'success';
    if (isAnswered && !isCorrect) return 'error';
    return 'neutral';
  };

  const questionText = questionLang === 'hebrew'
    ? currentCard.word.hebrew
    : currentCard.word.english;

  return (
    <>
      <GameLayout
        onBack={onBack || (() => {})}
        title="כרטיסיות"
        progress={progressContent}
        onSettings={() => setShowSettings(!showSettings)}
        settingsOpen={showSettings}
        settingsContent={settingsContent}
        statusMessage={getStatusMessage()}
        statusType={getStatusType()}
        showNext={isAnswered && !showModal}
        onNext={handleNext}
      >
        <div className="flashcards-game__content">
          <div className="flashcard-container">
            <div className="question-card">
              <div className="question-label">
                {questionLang === 'hebrew' ? 'מה המילה באנגלית?' : 'מה המילה בעברית?'}
              </div>
              <div className="question-word">{questionText}</div>
              {questionLang === 'hebrew' && (
                <div className="question-transcription">{currentCard.word.transcription}</div>
              )}
              <button
                className="speak-btn"
                onClick={() => handleSpeak(currentCard.word, 'en')}
              >
                🔊
              </button>
              <div className="box-indicator">
                רמה {currentCard.box}/5
              </div>
            </div>
          </div>

          <div className={`choices-grid choices-${choiceCount}`}>
            {choices.map((choice) => {
              const choiceIsCorrect = choice.id === currentCard.word.id;
              const isSelected = selectedAnswer === choice.id;
              let className = 'choice-button';

              if (isAnswered) {
                if (choiceIsCorrect) {
                  className += ' correct';
                } else if (isSelected) {
                  className += ' incorrect';
                }
              }

              const choiceText = questionLang === 'hebrew'
                ? choice.english
                : choice.hebrew;

              return (
                <button
                  key={choice.id}
                  className={className}
                  onClick={() => handleAnswer(choice)}
                  disabled={isAnswered}
                >
                  <span className="choice-text">{choiceText}</span>
                </button>
              );
            })}
          </div>
        </div>
      </GameLayout>

      {currentCard && (
        <WordTeachingModal
          isOpen={showModal}
          word={currentCard.word}
          isSuccess={isCorrect}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};
