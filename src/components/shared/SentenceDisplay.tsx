import React from 'react';
import { speak } from '../../utils/speech';

export interface SentenceDisplayProps {
  sentence: {
    english: string;
    hebrew: string;
  };
  onPlayEnglish?: () => void;
  onPlayHebrew?: () => void;
  showSpeakerButtons?: boolean;
  className?: string;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = ({
  sentence,
  onPlayEnglish,
  onPlayHebrew,
  showSpeakerButtons = true,
  className = '',
}) => {
  const handlePlayEnglish = () => {
    speak(sentence.english, 'en');
    onPlayEnglish?.();
  };

  const handlePlayHebrew = () => {
    speak(sentence.hebrew, 'he');
    onPlayHebrew?.();
  };

  return (
    <div className={`sentence-display ${className}`}>
      <div className="sentence-header">משפט לדוגמה</div>
      <div className="sentence-row english" dir="ltr">
        <span className="sentence-text">"{sentence.english}"</span>
        {showSpeakerButtons && (
          <button
            className="speaker-btn"
            onClick={handlePlayEnglish}
            aria-label="Play English sentence"
          >
            <span role="img" aria-hidden="true">&#x1F50A;</span>
          </button>
        )}
      </div>
      <div className="sentence-row hebrew" dir="rtl">
        <span className="sentence-text">"{sentence.hebrew}"</span>
        {showSpeakerButtons && (
          <button
            className="speaker-btn"
            onClick={handlePlayHebrew}
            aria-label="Play Hebrew sentence"
          >
            <span role="img" aria-hidden="true">&#x1F50A;</span>
          </button>
        )}
      </div>
    </div>
  );
};
