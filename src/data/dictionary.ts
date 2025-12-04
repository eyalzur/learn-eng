export type Category =
  | 'animals'
  | 'food'
  | 'colors'
  | 'numbers'
  | 'bodyParts'
  | 'household'
  | 'nature'
  | 'verbs';

export interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string; // Hebrew phonetic transcription with nikud
  category: Category;
}

// Category display names (Hebrew)
export const categoryNames: Record<Category, string> = {
  animals: 'חיות',
  food: 'אוכל',
  colors: 'צבעים',
  numbers: 'מספרים',
  bodyParts: 'חלקי גוף',
  household: 'בית',
  nature: 'טבע',
  verbs: 'פעלים',
};

// Full dictionary organized by category
export const dictionary: Word[] = [
  // ============ ANIMALS ============
  { id: 'animal-1', english: 'cat', hebrew: 'חָתוּל', transcription: 'קֶט', category: 'animals' },
  { id: 'animal-2', english: 'dog', hebrew: 'כֶּלֶב', transcription: 'דּוֹג', category: 'animals' },
  { id: 'animal-3', english: 'bird', hebrew: 'צִפּוֹר', transcription: 'בֶּרְד', category: 'animals' },
  { id: 'animal-4', english: 'fish', hebrew: 'דָּג', transcription: 'פִישׁ', category: 'animals' },
  { id: 'animal-5', english: 'horse', hebrew: 'סוּס', transcription: 'הוֹרְס', category: 'animals' },
  { id: 'animal-6', english: 'cow', hebrew: 'פָּרָה', transcription: 'קָאוּ', category: 'animals' },
  { id: 'animal-7', english: 'pig', hebrew: 'חֲזִיר', transcription: 'פִּיג', category: 'animals' },
  { id: 'animal-8', english: 'sheep', hebrew: 'כֶּבֶשׂ', transcription: 'שִׁיפּ', category: 'animals' },
  { id: 'animal-9', english: 'chicken', hebrew: 'תַּרְנְגוֹלֶת', transcription: 'צִ׳יקֶן', category: 'animals' },
  { id: 'animal-10', english: 'duck', hebrew: 'בַּרְוָז', transcription: 'דַּאק', category: 'animals' },
  { id: 'animal-11', english: 'rabbit', hebrew: 'אַרְנָב', transcription: 'רַבִּיט', category: 'animals' },
  { id: 'animal-12', english: 'lion', hebrew: 'אַרְיֵה', transcription: 'לַיְאָן', category: 'animals' },
  { id: 'animal-13', english: 'elephant', hebrew: 'פִּיל', transcription: 'אֶלֶפַנְט', category: 'animals' },
  { id: 'animal-14', english: 'monkey', hebrew: 'קוֹף', transcription: 'מַאנְקִי', category: 'animals' },
  { id: 'animal-15', english: 'bear', hebrew: 'דֹּב', transcription: 'בֵּר', category: 'animals' },

  // ============ FOOD ============
  { id: 'food-1', english: 'food', hebrew: 'אֹכֶל', transcription: 'פוּד', category: 'food' },
  { id: 'food-2', english: 'water', hebrew: 'מַיִם', transcription: 'ווֹטֶר', category: 'food' },
  { id: 'food-3', english: 'milk', hebrew: 'חָלָב', transcription: 'מִילְק', category: 'food' },
  { id: 'food-4', english: 'bread', hebrew: 'לֶחֶם', transcription: 'בְּרֶד', category: 'food' },
  { id: 'food-5', english: 'apple', hebrew: 'תַּפּוּחַ', transcription: 'אֶפֶּל', category: 'food' },
  { id: 'food-6', english: 'banana', hebrew: 'בָּנָנָה', transcription: 'בַּנַנָה', category: 'food' },
  { id: 'food-7', english: 'orange', hebrew: 'תַּפּוּז', transcription: 'אוֹרֶנְג׳', category: 'food' },
  { id: 'food-8', english: 'egg', hebrew: 'בֵּיצָה', transcription: 'אֶג', category: 'food' },
  { id: 'food-9', english: 'cheese', hebrew: 'גְּבִינָה', transcription: 'צִ׳יז', category: 'food' },
  { id: 'food-10', english: 'rice', hebrew: 'אוֹרֶז', transcription: 'רַייְס', category: 'food' },
  { id: 'food-11', english: 'meat', hebrew: 'בָּשָׂר', transcription: 'מִיט', category: 'food' },
  { id: 'food-12', english: 'soup', hebrew: 'מָרָק', transcription: 'סוּפּ', category: 'food' },
  { id: 'food-13', english: 'cake', hebrew: 'עוּגָה', transcription: 'קֵייְק', category: 'food' },
  { id: 'food-14', english: 'cookie', hebrew: 'עוּגִיָּה', transcription: 'קוּקִי', category: 'food' },
  { id: 'food-15', english: 'juice', hebrew: 'מִיץ', transcription: 'ג׳וּס', category: 'food' },

  // ============ COLORS ============
  { id: 'color-1', english: 'red', hebrew: 'אָדֹם', transcription: 'רֶד', category: 'colors' },
  { id: 'color-2', english: 'blue', hebrew: 'כָּחֹל', transcription: 'בְּלוּ', category: 'colors' },
  { id: 'color-3', english: 'green', hebrew: 'יָרֹק', transcription: 'גְּרִין', category: 'colors' },
  { id: 'color-4', english: 'yellow', hebrew: 'צָהֹב', transcription: 'יֶלוֹ', category: 'colors' },
  { id: 'color-5', english: 'orange', hebrew: 'כָּתֹם', transcription: 'אוֹרֶנְג׳', category: 'colors' },
  { id: 'color-6', english: 'purple', hebrew: 'סָגֹל', transcription: 'פֶּרְפֶּל', category: 'colors' },
  { id: 'color-7', english: 'pink', hebrew: 'וָרֹד', transcription: 'פִּינְק', category: 'colors' },
  { id: 'color-8', english: 'black', hebrew: 'שָׁחֹר', transcription: 'בְּלַק', category: 'colors' },
  { id: 'color-9', english: 'white', hebrew: 'לָבָן', transcription: 'ווַייְט', category: 'colors' },
  { id: 'color-10', english: 'brown', hebrew: 'חוּם', transcription: 'בְּרַאוּן', category: 'colors' },
  { id: 'color-11', english: 'gray', hebrew: 'אָפֹר', transcription: 'גְּרֵיי', category: 'colors' },
  { id: 'color-12', english: 'gold', hebrew: 'זָהָב', transcription: 'גּוֹלְד', category: 'colors' },

  // ============ NUMBERS ============
  { id: 'number-1', english: 'one', hebrew: 'אֶחָד', transcription: 'וַואַן', category: 'numbers' },
  { id: 'number-2', english: 'two', hebrew: 'שְׁנַיִם', transcription: 'טוּ', category: 'numbers' },
  { id: 'number-3', english: 'three', hebrew: 'שָׁלוֹשׁ', transcription: 'תְּרִי', category: 'numbers' },
  { id: 'number-4', english: 'four', hebrew: 'אַרְבַּע', transcription: 'פוֹר', category: 'numbers' },
  { id: 'number-5', english: 'five', hebrew: 'חָמֵשׁ', transcription: 'פַייְב', category: 'numbers' },
  { id: 'number-6', english: 'six', hebrew: 'שֵׁשׁ', transcription: 'סִיקְס', category: 'numbers' },
  { id: 'number-7', english: 'seven', hebrew: 'שֶׁבַע', transcription: 'סֶבֶן', category: 'numbers' },
  { id: 'number-8', english: 'eight', hebrew: 'שְׁמוֹנֶה', transcription: 'אֵייְט', category: 'numbers' },
  { id: 'number-9', english: 'nine', hebrew: 'תֵּשַׁע', transcription: 'נַייְן', category: 'numbers' },
  { id: 'number-10', english: 'ten', hebrew: 'עֶשֶׂר', transcription: 'טֶן', category: 'numbers' },
  { id: 'number-11', english: 'eleven', hebrew: 'אַחַד עָשָׂר', transcription: 'אִילֶבֶן', category: 'numbers' },
  { id: 'number-12', english: 'twelve', hebrew: 'שְׁנֵים עָשָׂר', transcription: 'טְוֶלְב', category: 'numbers' },
  { id: 'number-13', english: 'thirteen', hebrew: 'שְׁלוֹשָׁה עָשָׂר', transcription: 'תֵ׳רְטִין', category: 'numbers' },
  { id: 'number-14', english: 'fourteen', hebrew: 'אַרְבָּעָה עָשָׂר', transcription: 'פוֹרְטִין', category: 'numbers' },
  { id: 'number-15', english: 'fifteen', hebrew: 'חֲמִשָּׁה עָשָׂר', transcription: 'פִיפְטִין', category: 'numbers' },
  { id: 'number-16', english: 'sixteen', hebrew: 'שִׁשָּׁה עָשָׂר', transcription: 'סִיקְסְטִין', category: 'numbers' },
  { id: 'number-17', english: 'seventeen', hebrew: 'שִׁבְעָה עָשָׂר', transcription: 'סֶבֶנְטִין', category: 'numbers' },
  { id: 'number-18', english: 'eighteen', hebrew: 'שְׁמוֹנָה עָשָׂר', transcription: 'אֵייְטִין', category: 'numbers' },
  { id: 'number-19', english: 'nineteen', hebrew: 'תִּשְׁעָה עָשָׂר', transcription: 'נַייְנְטִין', category: 'numbers' },
  { id: 'number-20', english: 'twenty', hebrew: 'עֶשְׂרִים', transcription: 'טְוֶנְטִי', category: 'numbers' },

  // ============ BODY PARTS ============
  { id: 'body-1', english: 'head', hebrew: 'רֹאשׁ', transcription: 'הֶד', category: 'bodyParts' },
  { id: 'body-2', english: 'eye', hebrew: 'עַיִן', transcription: 'אַיי', category: 'bodyParts' },
  { id: 'body-3', english: 'ear', hebrew: 'אֹזֶן', transcription: 'אִיר', category: 'bodyParts' },
  { id: 'body-4', english: 'nose', hebrew: 'אַף', transcription: 'נוֹז', category: 'bodyParts' },
  { id: 'body-5', english: 'mouth', hebrew: 'פֶּה', transcription: 'מַאוּת׳', category: 'bodyParts' },
  { id: 'body-6', english: 'hand', hebrew: 'יָד', transcription: 'הַנְד', category: 'bodyParts' },
  { id: 'body-7', english: 'foot', hebrew: 'רֶגֶל', transcription: 'פוּט', category: 'bodyParts' },
  { id: 'body-8', english: 'arm', hebrew: 'זְרוֹעַ', transcription: 'אַרְם', category: 'bodyParts' },
  { id: 'body-9', english: 'leg', hebrew: 'רֶגֶל', transcription: 'לֶג', category: 'bodyParts' },
  { id: 'body-10', english: 'finger', hebrew: 'אֶצְבַּע', transcription: 'פִינְגֶר', category: 'bodyParts' },
  { id: 'body-11', english: 'hair', hebrew: 'שֵׂעָר', transcription: 'הֵיר', category: 'bodyParts' },
  { id: 'body-12', english: 'tooth', hebrew: 'שֵׁן', transcription: 'טוּת׳', category: 'bodyParts' },

  // ============ HOUSEHOLD ============
  { id: 'house-1', english: 'house', hebrew: 'בַּיִת', transcription: 'הַאוּס', category: 'household' },
  { id: 'house-2', english: 'door', hebrew: 'דֶּלֶת', transcription: 'דוֹר', category: 'household' },
  { id: 'house-3', english: 'table', hebrew: 'שֻׁלְחָן', transcription: 'טֵייבֶּל', category: 'household' },
  { id: 'house-4', english: 'chair', hebrew: 'כִּסֵּא', transcription: 'צֶ׳יר', category: 'household' },
  { id: 'house-5', english: 'bed', hebrew: 'מִיטָה', transcription: 'בֶּד', category: 'household' },
  { id: 'house-6', english: 'window', hebrew: 'חַלּוֹן', transcription: 'וִוינְדוֹ', category: 'household' },
  { id: 'house-7', english: 'room', hebrew: 'חֶדֶר', transcription: 'רוּם', category: 'household' },
  { id: 'house-8', english: 'kitchen', hebrew: 'מִטְבָּח', transcription: 'קִיטְשֶׁן', category: 'household' },
  { id: 'house-9', english: 'bathroom', hebrew: 'חֲדַר אַמְבַּטְיָה', transcription: 'בַּאתְרוּם', category: 'household' },
  { id: 'house-10', english: 'car', hebrew: 'מְכוֹנִית', transcription: 'קָאר', category: 'household' },
  { id: 'house-11', english: 'book', hebrew: 'סֵפֶר', transcription: 'בּוּק', category: 'household' },
  { id: 'house-12', english: 'ball', hebrew: 'כַּדּוּר', transcription: 'בּוֹל', category: 'household' },

  // ============ NATURE ============
  { id: 'nature-1', english: 'sun', hebrew: 'שֶׁמֶשׁ', transcription: 'סַן', category: 'nature' },
  { id: 'nature-2', english: 'moon', hebrew: 'יָרֵחַ', transcription: 'מוּן', category: 'nature' },
  { id: 'nature-3', english: 'tree', hebrew: 'עֵץ', transcription: 'טְרִי', category: 'nature' },
  { id: 'nature-4', english: 'flower', hebrew: 'פֶּרַח', transcription: 'פְלַאוֶר', category: 'nature' },
  { id: 'nature-5', english: 'sky', hebrew: 'שָׁמַיִם', transcription: 'סְקַיי', category: 'nature' },
  { id: 'nature-6', english: 'cloud', hebrew: 'עָנָן', transcription: 'קְלַאוּד', category: 'nature' },
  { id: 'nature-7', english: 'rain', hebrew: 'גֶּשֶׁם', transcription: 'רֵיין', category: 'nature' },
  { id: 'nature-8', english: 'snow', hebrew: 'שֶׁלֶג', transcription: 'סְנוֹ', category: 'nature' },
  { id: 'nature-9', english: 'star', hebrew: 'כּוֹכָב', transcription: 'סְטָאר', category: 'nature' },
  { id: 'nature-10', english: 'sea', hebrew: 'יָם', transcription: 'סִי', category: 'nature' },
  { id: 'nature-11', english: 'river', hebrew: 'נָהָר', transcription: 'רִיבֶר', category: 'nature' },
  { id: 'nature-12', english: 'mountain', hebrew: 'הַר', transcription: 'מַאוּנְטֶן', category: 'nature' },

  // ============ VERBS ============
  { id: 'verb-1', english: 'go', hebrew: 'לָלֶכֶת', transcription: 'גּוֹ', category: 'verbs' },
  { id: 'verb-2', english: 'come', hebrew: 'לָבוֹא', transcription: 'קַאם', category: 'verbs' },
  { id: 'verb-3', english: 'eat', hebrew: 'לֶאֱכֹל', transcription: 'אִיט', category: 'verbs' },
  { id: 'verb-4', english: 'drink', hebrew: 'לִשְׁתּוֹת', transcription: 'דְּרִינְק', category: 'verbs' },
  { id: 'verb-5', english: 'sleep', hebrew: 'לִישׁוֹן', transcription: 'סְלִיפּ', category: 'verbs' },
  { id: 'verb-6', english: 'run', hebrew: 'לָרוּץ', transcription: 'רַאן', category: 'verbs' },
  { id: 'verb-7', english: 'walk', hebrew: 'לָלֶכֶת', transcription: 'ווֹק', category: 'verbs' },
  { id: 'verb-8', english: 'play', hebrew: 'לְשַׂחֵק', transcription: 'פְּלֵיי', category: 'verbs' },
  { id: 'verb-9', english: 'read', hebrew: 'לִקְרֹא', transcription: 'רִיד', category: 'verbs' },
  { id: 'verb-10', english: 'write', hebrew: 'לִכְתֹּב', transcription: 'רַייְט', category: 'verbs' },
  { id: 'verb-11', english: 'see', hebrew: 'לִרְאוֹת', transcription: 'סִי', category: 'verbs' },
  { id: 'verb-12', english: 'hear', hebrew: 'לִשְׁמֹעַ', transcription: 'הִיר', category: 'verbs' },
];

// Get all available categories
export function getCategories(): Category[] {
  return [...new Set(dictionary.map(word => word.category))];
}

// Get words by category
export function getWordsByCategory(category: Category): Word[] {
  return dictionary.filter(word => word.category === category);
}

// Utility function to get random words from dictionary
export function getRandomWords(count: number, category?: Category): Word[] {
  const source = category ? getWordsByCategory(category) : dictionary;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
