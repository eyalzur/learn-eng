export function speak(text: string, lang: 'en' | 'he'): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : 'he-IL';
  utterance.rate = 0.8; // Slower for learning
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find((voice) =>
    voice.lang.startsWith(lang === 'en' ? 'en' : 'he')
  );

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.speak(utterance);
}
