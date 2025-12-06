import React, { useEffect, useCallback } from 'react';
import { Word } from '../../../data/dictionary';
import { speak } from '../../../utils/speech';

export interface WordTeachingModalProps {
  isOpen: boolean;
  word: Word;
  isSuccess: boolean;
  onClose: () => void;
}

export const WordTeachingModal: React.FC<WordTeachingModalProps> = ({
  isOpen,
  word,
  isSuccess,
  onClose,
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handlePlayEnglishWord = () => {
    speak(word.english, 'en');
  };

  const handlePlayHebrewWord = () => {
    speak(word.hebrew, 'he');
  };

  const handlePlayEnglishSentence = () => {
    if (word.exampleSentence) {
      speak(word.exampleSentence.english, 'en');
    }
  };

  const handlePlayHebrewSentence = () => {
    if (word.exampleSentence) {
      speak(word.exampleSentence.hebrew, 'he');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="word-modal__overlay" onClick={onClose}>
      <div className="word-modal" onClick={(e) => e.stopPropagation()}>
        {/* Result indicator */}
        <div className={`word-modal__result ${isSuccess ? 'word-modal__result--success' : 'word-modal__result--error'}`}>
          <span className="word-modal__result-icon">
            {isSuccess ? '\u2713' : '\u2717'}
          </span>
          <span className="word-modal__result-text">
            {isSuccess ? 'נכון!' : 'לא נכון'}
          </span>
        </div>

        {/* Word card */}
        <div className="word-modal__word-card">
          <div className="word-modal__word-row word-modal__word-row--english" dir="ltr">
            <button
              className="word-modal__speaker-btn"
              onClick={handlePlayEnglishWord}
              aria-label="Play English word"
            >
              &#x1F50A;
            </button>
            <span className="word-modal__word-text word-modal__word-text--english">
              {word.english.toUpperCase()}
            </span>
          </div>
          <div className="word-modal__word-row word-modal__word-row--hebrew" dir="rtl">
            <span className="word-modal__word-text word-modal__word-text--hebrew">
              {word.hebrew}
            </span>
            <button
              className="word-modal__speaker-btn"
              onClick={handlePlayHebrewWord}
              aria-label="Play Hebrew word"
            >
              &#x1F50A;
            </button>
          </div>
        </div>

        {/* Example sentence */}
        {word.exampleSentence && (
          <div className="word-modal__sentence-card">
            <div className="word-modal__sentence-header">משפט לדוגמה</div>
            <div className="word-modal__sentence-row" dir="ltr">
              <button
                className="word-modal__speaker-btn"
                onClick={handlePlayEnglishSentence}
                aria-label="Play English sentence"
              >
                &#x1F50A;
              </button>
              <span className="word-modal__sentence-text">
                "{word.exampleSentence.english}"
              </span>
            </div>
            <div className="word-modal__sentence-row" dir="rtl">
              <span className="word-modal__sentence-text">
                "{word.exampleSentence.hebrew}"
              </span>
              <button
                className="word-modal__speaker-btn"
                onClick={handlePlayHebrewSentence}
                aria-label="Play Hebrew sentence"
              >
                &#x1F50A;
              </button>
            </div>
          </div>
        )}

        {/* Close button */}
        <button className="word-modal__close-btn" onClick={onClose}>
          סגור
        </button>
      </div>
    </div>
  );
};
