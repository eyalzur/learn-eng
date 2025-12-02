# Project Context

## Product Vision
An English learning application for Hebrew speakers, focusing on vocabulary acquisition through interactive games.

## Target Audience
- Hebrew speakers learning English
- Beginner level learners
- Focus on vocabulary building

## Core Concept
- Words are presented in English with Hebrew transcription (nikud) to help pronunciation
- Games provide interactive, engaging ways to learn vocabulary
- Hebrew translations help learners connect new English words to their native language

## Key Features
1. **Hebrew Transcription**: Every English word includes phonetic transcription in Hebrew letters with nikud (vowel marks) for clear pronunciation guidance
2. **Game-Based Learning**: Vocabulary is taught through interactive games rather than traditional memorization
3. **Dictionary System**: Central word database with English, Hebrew translation, and Hebrew phonetic transcription
4. **Text-to-Speech**: Words are pronounced using Web Speech API
5. **Progress Tracking**: Streak-based scoring and record tracking per game

## Available Games

### Memory Game
- Match English words with Hebrew translations
- Configurable word count (4-10 pairs)
- Record tracking per word count
- Color-coded matched pairs
- Text-to-speech on card flip

### Spelling Game
- Drag and drop letters to spell English words
- Hebrew word shown as prompt with optional transcription hint
- Streak-based scoring (correct answers in a row)
- Extra decoy letters added for challenge
- Record tracking for best streak

## Current Scope
- Web application (React + Webpack)
- Two playable games: Memory and Spelling
- Beginner vocabulary (20 common nouns)
- RTL support for Hebrew with LTR for English spelling

## Future Direction
- Mobile application using React Native
- Additional learning games (Flashcards, Quiz)
- Word management (add/edit words via AI API)
- Difficulty levels
- More vocabulary categories
