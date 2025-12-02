export interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string; // Hebrew phonetic transcription with nikud
}

// Beginner vocabulary - basic words
export const dictionary: Word[] = [
  {
    id: '1',
    english: 'cat',
    hebrew: 'חָתוּל',
    transcription: 'קֶט',
  },
  {
    id: '2',
    english: 'dog',
    hebrew: 'כֶּלֶב',
    transcription: 'דּוֹג',
  },
  {
    id: '3',
    english: 'house',
    hebrew: 'בַּיִת',
    transcription: 'הַאוּס',
  },
  {
    id: '4',
    english: 'book',
    hebrew: 'סֵפֶר',
    transcription: 'בּוּק',
  },
  {
    id: '5',
    english: 'water',
    hebrew: 'מַיִם',
    transcription: 'ווֹטֶר',
  },
  {
    id: '6',
    english: 'food',
    hebrew: 'אֹכֶל',
    transcription: 'פוּד',
  },
  {
    id: '7',
    english: 'sun',
    hebrew: 'שֶׁמֶשׁ',
    transcription: 'סַן',
  },
  {
    id: '8',
    english: 'moon',
    hebrew: 'יָרֵחַ',
    transcription: 'מוּן',
  },
  {
    id: '9',
    english: 'tree',
    hebrew: 'עֵץ',
    transcription: 'טְרִי',
  },
  {
    id: '10',
    english: 'flower',
    hebrew: 'פֶּרַח',
    transcription: 'פְלַאוֶר',
  },
  {
    id: '11',
    english: 'apple',
    hebrew: 'תַּפּוּחַ',
    transcription: 'אֶפֶּל',
  },
  {
    id: '12',
    english: 'car',
    hebrew: 'מְכוֹנִית',
    transcription: 'קָאר',
  },
  {
    id: '13',
    english: 'ball',
    hebrew: 'כַּדּוּר',
    transcription: 'בּוֹל',
  },
  {
    id: '14',
    english: 'bird',
    hebrew: 'צִפּוֹר',
    transcription: 'בֶּרְד',
  },
  {
    id: '15',
    english: 'fish',
    hebrew: 'דָּג',
    transcription: 'פִישׁ',
  },
  {
    id: '16',
    english: 'milk',
    hebrew: 'חָלָב',
    transcription: 'מִילְק',
  },
  {
    id: '17',
    english: 'bread',
    hebrew: 'לֶחֶם',
    transcription: 'בְּרֶד',
  },
  {
    id: '18',
    english: 'chair',
    hebrew: 'כִּסֵּא',
    transcription: 'צֶ׳יר',
  },
  {
    id: '19',
    english: 'table',
    hebrew: 'שֻׁלְחָן',
    transcription: 'טֵייבֶּל',
  },
  {
    id: '20',
    english: 'door',
    hebrew: 'דֶּלֶת',
    transcription: 'דוֹר',
  },
];

// Utility function to get random words from dictionary
export function getRandomWords(count: number): Word[] {
  const shuffled = [...dictionary].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
