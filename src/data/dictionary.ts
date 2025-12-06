export type Category =
  | 'animals'
  | 'food'
  | 'colors'
  | 'numbers'
  | 'bodyParts'
  | 'household'
  | 'nature'
  | 'verbs';

export interface ExampleSentence {
  english: string;  // English example sentence
  hebrew: string;   // Hebrew translation of the sentence
}

export interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string; // Hebrew phonetic transcription with nikud
  category: Category;
  exampleSentence?: ExampleSentence;  // Optional example sentence
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
  {
    id: 'animal-1',
    english: 'cat',
    hebrew: 'חָתוּל',
    transcription: 'קֶט',
    category: 'animals',
    exampleSentence: {
      english: 'The cat is sleeping on the sofa.',
      hebrew: 'החתול ישן על הספה.',
    },
  },
  {
    id: 'animal-2',
    english: 'dog',
    hebrew: 'כֶּלֶב',
    transcription: 'דּוֹג',
    category: 'animals',
    exampleSentence: {
      english: 'The dog likes to play in the park.',
      hebrew: 'הכלב אוהב לשחק בפארק.',
    },
  },
  {
    id: 'animal-3',
    english: 'bird',
    hebrew: 'צִפּוֹר',
    transcription: 'בֶּרְד',
    category: 'animals',
    exampleSentence: {
      english: 'The bird is singing in the tree.',
      hebrew: 'הציפור שרה על העץ.',
    },
  },
  {
    id: 'animal-4',
    english: 'fish',
    hebrew: 'דָּג',
    transcription: 'פִישׁ',
    category: 'animals',
    exampleSentence: {
      english: 'The fish swims in the water.',
      hebrew: 'הדג שוחה במים.',
    },
  },
  {
    id: 'animal-5',
    english: 'horse',
    hebrew: 'סוּס',
    transcription: 'הוֹרְס',
    category: 'animals',
    exampleSentence: {
      english: 'The horse runs very fast.',
      hebrew: 'הסוס רץ מהר מאוד.',
    },
  },
  {
    id: 'animal-6',
    english: 'cow',
    hebrew: 'פָּרָה',
    transcription: 'קָאוּ',
    category: 'animals',
    exampleSentence: {
      english: 'The cow gives us milk.',
      hebrew: 'הפרה נותנת לנו חלב.',
    },
  },
  {
    id: 'animal-7',
    english: 'pig',
    hebrew: 'חֲזִיר',
    transcription: 'פִּיג',
    category: 'animals',
    exampleSentence: {
      english: 'The pig lives on the farm.',
      hebrew: 'החזיר חי בחווה.',
    },
  },
  {
    id: 'animal-8',
    english: 'sheep',
    hebrew: 'כֶּבֶשׂ',
    transcription: 'שִׁיפּ',
    category: 'animals',
    exampleSentence: {
      english: 'The sheep has soft wool.',
      hebrew: 'לכבש יש צמר רך.',
    },
  },
  {
    id: 'animal-9',
    english: 'chicken',
    hebrew: 'תַּרְנְגוֹלֶת',
    transcription: 'צִ׳יקֶן',
    category: 'animals',
    exampleSentence: {
      english: 'The chicken lays eggs.',
      hebrew: 'התרנגולת מטילה ביצים.',
    },
  },
  {
    id: 'animal-10',
    english: 'duck',
    hebrew: 'בַּרְוָז',
    transcription: 'דַּאק',
    category: 'animals',
    exampleSentence: {
      english: 'The duck swims in the pond.',
      hebrew: 'הברווז שוחה בבריכה.',
    },
  },
  {
    id: 'animal-11',
    english: 'rabbit',
    hebrew: 'אַרְנָב',
    transcription: 'רַבִּיט',
    category: 'animals',
    exampleSentence: {
      english: 'The rabbit has long ears.',
      hebrew: 'לארנב יש אוזניים ארוכות.',
    },
  },
  {
    id: 'animal-12',
    english: 'lion',
    hebrew: 'אַרְיֵה',
    transcription: 'לַיְאָן',
    category: 'animals',
    exampleSentence: {
      english: 'The lion is the king of animals.',
      hebrew: 'האריה הוא מלך החיות.',
    },
  },
  {
    id: 'animal-13',
    english: 'elephant',
    hebrew: 'פִּיל',
    transcription: 'אֶלֶפַנְט',
    category: 'animals',
    exampleSentence: {
      english: 'The elephant is very big.',
      hebrew: 'הפיל מאוד גדול.',
    },
  },
  {
    id: 'animal-14',
    english: 'monkey',
    hebrew: 'קוֹף',
    transcription: 'מַאנְקִי',
    category: 'animals',
    exampleSentence: {
      english: 'The monkey climbs the tree.',
      hebrew: 'הקוף מטפס על העץ.',
    },
  },
  {
    id: 'animal-15',
    english: 'bear',
    hebrew: 'דֹּב',
    transcription: 'בֵּר',
    category: 'animals',
    exampleSentence: {
      english: 'The bear likes to eat honey.',
      hebrew: 'הדוב אוהב לאכול דבש.',
    },
  },

  // ============ FOOD ============
  {
    id: 'food-1',
    english: 'food',
    hebrew: 'אֹכֶל',
    transcription: 'פוּד',
    category: 'food',
    exampleSentence: {
      english: 'The food is delicious.',
      hebrew: 'האוכל טעים.',
    },
  },
  {
    id: 'food-2',
    english: 'water',
    hebrew: 'מַיִם',
    transcription: 'ווֹטֶר',
    category: 'food',
    exampleSentence: {
      english: 'I drink water every day.',
      hebrew: 'אני שותה מים כל יום.',
    },
  },
  {
    id: 'food-3',
    english: 'milk',
    hebrew: 'חָלָב',
    transcription: 'מִילְק',
    category: 'food',
    exampleSentence: {
      english: 'The milk is in the fridge.',
      hebrew: 'החלב במקרר.',
    },
  },
  {
    id: 'food-4',
    english: 'bread',
    hebrew: 'לֶחֶם',
    transcription: 'בְּרֶד',
    category: 'food',
    exampleSentence: {
      english: 'I eat bread for breakfast.',
      hebrew: 'אני אוכל לחם לארוחת בוקר.',
    },
  },
  {
    id: 'food-5',
    english: 'apple',
    hebrew: 'תַּפּוּחַ',
    transcription: 'אֶפֶּל',
    category: 'food',
    exampleSentence: {
      english: 'The apple is red and sweet.',
      hebrew: 'התפוח אדום ומתוק.',
    },
  },
  {
    id: 'food-6',
    english: 'banana',
    hebrew: 'בָּנָנָה',
    transcription: 'בַּנַנָה',
    category: 'food',
    exampleSentence: {
      english: 'The monkey eats a banana.',
      hebrew: 'הקוף אוכל בננה.',
    },
  },
  {
    id: 'food-7',
    english: 'orange',
    hebrew: 'תַּפּוּז',
    transcription: 'אוֹרֶנְג׳',
    category: 'food',
    exampleSentence: {
      english: 'I like orange juice.',
      hebrew: 'אני אוהב מיץ תפוזים.',
    },
  },
  {
    id: 'food-8',
    english: 'egg',
    hebrew: 'בֵּיצָה',
    transcription: 'אֶג',
    category: 'food',
    exampleSentence: {
      english: 'I eat an egg for breakfast.',
      hebrew: 'אני אוכל ביצה לארוחת בוקר.',
    },
  },
  {
    id: 'food-9',
    english: 'cheese',
    hebrew: 'גְּבִינָה',
    transcription: 'צִ׳יז',
    category: 'food',
    exampleSentence: {
      english: 'The cheese is yellow.',
      hebrew: 'הגבינה צהובה.',
    },
  },
  {
    id: 'food-10',
    english: 'rice',
    hebrew: 'אוֹרֶז',
    transcription: 'רַייְס',
    category: 'food',
    exampleSentence: {
      english: 'We eat rice with chicken.',
      hebrew: 'אנחנו אוכלים אורז עם עוף.',
    },
  },
  {
    id: 'food-11',
    english: 'meat',
    hebrew: 'בָּשָׂר',
    transcription: 'מִיט',
    category: 'food',
    exampleSentence: {
      english: 'The meat is on the grill.',
      hebrew: 'הבשר על הגריל.',
    },
  },
  {
    id: 'food-12',
    english: 'soup',
    hebrew: 'מָרָק',
    transcription: 'סוּפּ',
    category: 'food',
    exampleSentence: {
      english: 'The soup is hot.',
      hebrew: 'המרק חם.',
    },
  },
  {
    id: 'food-13',
    english: 'cake',
    hebrew: 'עוּגָה',
    transcription: 'קֵייְק',
    category: 'food',
    exampleSentence: {
      english: 'I eat cake on my birthday.',
      hebrew: 'אני אוכל עוגה ביום ההולדת.',
    },
  },
  {
    id: 'food-14',
    english: 'cookie',
    hebrew: 'עוּגִיָּה',
    transcription: 'קוּקִי',
    category: 'food',
    exampleSentence: {
      english: 'The cookie is sweet.',
      hebrew: 'העוגייה מתוקה.',
    },
  },
  {
    id: 'food-15',
    english: 'juice',
    hebrew: 'מִיץ',
    transcription: 'ג׳וּס',
    category: 'food',
    exampleSentence: {
      english: 'I drink apple juice.',
      hebrew: 'אני שותה מיץ תפוחים.',
    },
  },

  // ============ COLORS ============
  {
    id: 'color-1',
    english: 'red',
    hebrew: 'אָדֹם',
    transcription: 'רֶד',
    category: 'colors',
    exampleSentence: {
      english: 'The car is red.',
      hebrew: 'המכונית אדומה.',
    },
  },
  {
    id: 'color-2',
    english: 'blue',
    hebrew: 'כָּחֹל',
    transcription: 'בְּלוּ',
    category: 'colors',
    exampleSentence: {
      english: 'The sky is blue today.',
      hebrew: 'השמיים כחולים היום.',
    },
  },
  {
    id: 'color-3',
    english: 'green',
    hebrew: 'יָרֹק',
    transcription: 'גְּרִין',
    category: 'colors',
    exampleSentence: {
      english: 'The grass is green.',
      hebrew: 'הדשא ירוק.',
    },
  },
  {
    id: 'color-4',
    english: 'yellow',
    hebrew: 'צָהֹב',
    transcription: 'יֶלוֹ',
    category: 'colors',
    exampleSentence: {
      english: 'The sun is yellow.',
      hebrew: 'השמש צהובה.',
    },
  },
  {
    id: 'color-5',
    english: 'orange',
    hebrew: 'כָּתֹם',
    transcription: 'אוֹרֶנְג׳',
    category: 'colors',
    exampleSentence: {
      english: 'The orange is orange.',
      hebrew: 'התפוז כתום.',
    },
  },
  {
    id: 'color-6',
    english: 'purple',
    hebrew: 'סָגֹל',
    transcription: 'פֶּרְפֶּל',
    category: 'colors',
    exampleSentence: {
      english: 'The flower is purple.',
      hebrew: 'הפרח סגול.',
    },
  },
  {
    id: 'color-7',
    english: 'pink',
    hebrew: 'וָרֹד',
    transcription: 'פִּינְק',
    category: 'colors',
    exampleSentence: {
      english: 'Her dress is pink.',
      hebrew: 'השמלה שלה ורודה.',
    },
  },
  {
    id: 'color-8',
    english: 'black',
    hebrew: 'שָׁחֹר',
    transcription: 'בְּלַק',
    category: 'colors',
    exampleSentence: {
      english: 'The cat is black.',
      hebrew: 'החתול שחור.',
    },
  },
  {
    id: 'color-9',
    english: 'white',
    hebrew: 'לָבָן',
    transcription: 'ווַייְט',
    category: 'colors',
    exampleSentence: {
      english: 'The snow is white.',
      hebrew: 'השלג לבן.',
    },
  },
  {
    id: 'color-10',
    english: 'brown',
    hebrew: 'חוּם',
    transcription: 'בְּרַאוּן',
    category: 'colors',
    exampleSentence: {
      english: 'The dog is brown.',
      hebrew: 'הכלב חום.',
    },
  },
  {
    id: 'color-11',
    english: 'gray',
    hebrew: 'אָפֹר',
    transcription: 'גְּרֵיי',
    category: 'colors',
    exampleSentence: {
      english: 'The elephant is gray.',
      hebrew: 'הפיל אפור.',
    },
  },
  {
    id: 'color-12',
    english: 'gold',
    hebrew: 'זָהָב',
    transcription: 'גּוֹלְד',
    category: 'colors',
    exampleSentence: {
      english: 'The ring is gold.',
      hebrew: 'הטבעת זהב.',
    },
  },

  // ============ NUMBERS ============
  {
    id: 'number-1',
    english: 'one',
    hebrew: 'אֶחָד',
    transcription: 'וַואַן',
    category: 'numbers',
    exampleSentence: {
      english: 'I have one apple.',
      hebrew: 'יש לי תפוח אחד.',
    },
  },
  {
    id: 'number-2',
    english: 'two',
    hebrew: 'שְׁנַיִם',
    transcription: 'טוּ',
    category: 'numbers',
    exampleSentence: {
      english: 'I have two hands.',
      hebrew: 'יש לי שתי ידיים.',
    },
  },
  {
    id: 'number-3',
    english: 'three',
    hebrew: 'שָׁלוֹשׁ',
    transcription: 'תְּרִי',
    category: 'numbers',
    exampleSentence: {
      english: 'There are three cats.',
      hebrew: 'יש שלושה חתולים.',
    },
  },
  {
    id: 'number-4',
    english: 'four',
    hebrew: 'אַרְבַּע',
    transcription: 'פוֹר',
    category: 'numbers',
    exampleSentence: {
      english: 'A dog has four legs.',
      hebrew: 'לכלב יש ארבע רגליים.',
    },
  },
  {
    id: 'number-5',
    english: 'five',
    hebrew: 'חָמֵשׁ',
    transcription: 'פַייְב',
    category: 'numbers',
    exampleSentence: {
      english: 'I have five fingers.',
      hebrew: 'יש לי חמש אצבעות.',
    },
  },
  {
    id: 'number-6',
    english: 'six',
    hebrew: 'שֵׁשׁ',
    transcription: 'סִיקְס',
    category: 'numbers',
    exampleSentence: {
      english: 'There are six eggs.',
      hebrew: 'יש שש ביצים.',
    },
  },
  {
    id: 'number-7',
    english: 'seven',
    hebrew: 'שֶׁבַע',
    transcription: 'סֶבֶן',
    category: 'numbers',
    exampleSentence: {
      english: 'There are seven days in a week.',
      hebrew: 'יש שבעה ימים בשבוע.',
    },
  },
  {
    id: 'number-8',
    english: 'eight',
    hebrew: 'שְׁמוֹנֶה',
    transcription: 'אֵייְט',
    category: 'numbers',
    exampleSentence: {
      english: 'The spider has eight legs.',
      hebrew: 'לעכביש יש שמונה רגליים.',
    },
  },
  {
    id: 'number-9',
    english: 'nine',
    hebrew: 'תֵּשַׁע',
    transcription: 'נַייְן',
    category: 'numbers',
    exampleSentence: {
      english: 'I go to sleep at nine.',
      hebrew: 'אני הולך לישון בתשע.',
    },
  },
  {
    id: 'number-10',
    english: 'ten',
    hebrew: 'עֶשֶׂר',
    transcription: 'טֶן',
    category: 'numbers',
    exampleSentence: {
      english: 'I have ten toes.',
      hebrew: 'יש לי עשר אצבעות רגל.',
    },
  },
  {
    id: 'number-11',
    english: 'eleven',
    hebrew: 'אַחַד עָשָׂר',
    transcription: 'אִילֶבֶן',
    category: 'numbers',
    exampleSentence: {
      english: 'There are eleven players on the team.',
      hebrew: 'יש אחד עשר שחקנים בקבוצה.',
    },
  },
  {
    id: 'number-12',
    english: 'twelve',
    hebrew: 'שְׁנֵים עָשָׂר',
    transcription: 'טְוֶלְב',
    category: 'numbers',
    exampleSentence: {
      english: 'There are twelve months in a year.',
      hebrew: 'יש שנים עשר חודשים בשנה.',
    },
  },
  {
    id: 'number-13',
    english: 'thirteen',
    hebrew: 'שְׁלוֹשָׁה עָשָׂר',
    transcription: 'תֵ׳רְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'I am thirteen years old.',
      hebrew: 'אני בן שלוש עשרה.',
    },
  },
  {
    id: 'number-14',
    english: 'fourteen',
    hebrew: 'אַרְבָּעָה עָשָׂר',
    transcription: 'פוֹרְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'February has fourteen days.',
      hebrew: 'לפברואר יש ארבעה עשר ימים.',
    },
  },
  {
    id: 'number-15',
    english: 'fifteen',
    hebrew: 'חֲמִשָּׁה עָשָׂר',
    transcription: 'פִיפְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'The break is fifteen minutes.',
      hebrew: 'ההפסקה היא חמש עשרה דקות.',
    },
  },
  {
    id: 'number-16',
    english: 'sixteen',
    hebrew: 'שִׁשָּׁה עָשָׂר',
    transcription: 'סִיקְסְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'She is sixteen years old.',
      hebrew: 'היא בת שש עשרה.',
    },
  },
  {
    id: 'number-17',
    english: 'seventeen',
    hebrew: 'שִׁבְעָה עָשָׂר',
    transcription: 'סֶבֶנְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'There are seventeen students.',
      hebrew: 'יש שבעה עשר תלמידים.',
    },
  },
  {
    id: 'number-18',
    english: 'eighteen',
    hebrew: 'שְׁמוֹנָה עָשָׂר',
    transcription: 'אֵייְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'He is eighteen years old.',
      hebrew: 'הוא בן שמונה עשרה.',
    },
  },
  {
    id: 'number-19',
    english: 'nineteen',
    hebrew: 'תִּשְׁעָה עָשָׂר',
    transcription: 'נַייְנְטִין',
    category: 'numbers',
    exampleSentence: {
      english: 'There are nineteen apples.',
      hebrew: 'יש תשעה עשר תפוחים.',
    },
  },
  {
    id: 'number-20',
    english: 'twenty',
    hebrew: 'עֶשְׂרִים',
    transcription: 'טְוֶנְטִי',
    category: 'numbers',
    exampleSentence: {
      english: 'I count to twenty.',
      hebrew: 'אני סופר עד עשרים.',
    },
  },

  // ============ BODY PARTS ============
  {
    id: 'body-1',
    english: 'head',
    hebrew: 'רֹאשׁ',
    transcription: 'הֶד',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I wear a hat on my head.',
      hebrew: 'אני חובש כובע על הראש.',
    },
  },
  {
    id: 'body-2',
    english: 'eye',
    hebrew: 'עַיִן',
    transcription: 'אַיי',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I have two eyes.',
      hebrew: 'יש לי שתי עיניים.',
    },
  },
  {
    id: 'body-3',
    english: 'ear',
    hebrew: 'אֹזֶן',
    transcription: 'אִיר',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I hear with my ears.',
      hebrew: 'אני שומע עם האוזניים.',
    },
  },
  {
    id: 'body-4',
    english: 'nose',
    hebrew: 'אַף',
    transcription: 'נוֹז',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I smell with my nose.',
      hebrew: 'אני מריח עם האף.',
    },
  },
  {
    id: 'body-5',
    english: 'mouth',
    hebrew: 'פֶּה',
    transcription: 'מַאוּת׳',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I eat with my mouth.',
      hebrew: 'אני אוכל עם הפה.',
    },
  },
  {
    id: 'body-6',
    english: 'hand',
    hebrew: 'יָד',
    transcription: 'הַנְד',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I wash my hands before eating.',
      hebrew: 'אני שוטף ידיים לפני אוכל.',
    },
  },
  {
    id: 'body-7',
    english: 'foot',
    hebrew: 'רֶגֶל',
    transcription: 'פוּט',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I walk with my feet.',
      hebrew: 'אני הולך עם הרגליים.',
    },
  },
  {
    id: 'body-8',
    english: 'arm',
    hebrew: 'זְרוֹעַ',
    transcription: 'אַרְם',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I raise my arm.',
      hebrew: 'אני מרים את הזרוע.',
    },
  },
  {
    id: 'body-9',
    english: 'leg',
    hebrew: 'רֶגֶל',
    transcription: 'לֶג',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I run with my legs.',
      hebrew: 'אני רץ עם הרגליים.',
    },
  },
  {
    id: 'body-10',
    english: 'finger',
    hebrew: 'אֶצְבַּע',
    transcription: 'פִינְגֶר',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I point with my finger.',
      hebrew: 'אני מצביע עם האצבע.',
    },
  },
  {
    id: 'body-11',
    english: 'hair',
    hebrew: 'שֵׂעָר',
    transcription: 'הֵיר',
    category: 'bodyParts',
    exampleSentence: {
      english: 'Her hair is long.',
      hebrew: 'השיער שלה ארוך.',
    },
  },
  {
    id: 'body-12',
    english: 'tooth',
    hebrew: 'שֵׁן',
    transcription: 'טוּת׳',
    category: 'bodyParts',
    exampleSentence: {
      english: 'I brush my teeth.',
      hebrew: 'אני מצחצח שיניים.',
    },
  },

  // ============ HOUSEHOLD ============
  {
    id: 'house-1',
    english: 'house',
    hebrew: 'בַּיִת',
    transcription: 'הַאוּס',
    category: 'household',
    exampleSentence: {
      english: 'I live in a big house.',
      hebrew: 'אני גר בבית גדול.',
    },
  },
  {
    id: 'house-2',
    english: 'door',
    hebrew: 'דֶּלֶת',
    transcription: 'דוֹר',
    category: 'household',
    exampleSentence: {
      english: 'Please close the door.',
      hebrew: 'בבקשה סגור את הדלת.',
    },
  },
  {
    id: 'house-3',
    english: 'table',
    hebrew: 'שֻׁלְחָן',
    transcription: 'טֵייבֶּל',
    category: 'household',
    exampleSentence: {
      english: 'The food is on the table.',
      hebrew: 'האוכל על השולחן.',
    },
  },
  {
    id: 'house-4',
    english: 'chair',
    hebrew: 'כִּסֵּא',
    transcription: 'צֶ׳יר',
    category: 'household',
    exampleSentence: {
      english: 'I sit on a chair.',
      hebrew: 'אני יושב על כיסא.',
    },
  },
  {
    id: 'house-5',
    english: 'bed',
    hebrew: 'מִיטָה',
    transcription: 'בֶּד',
    category: 'household',
    exampleSentence: {
      english: 'I sleep in my bed.',
      hebrew: 'אני ישן במיטה.',
    },
  },
  {
    id: 'house-6',
    english: 'window',
    hebrew: 'חַלּוֹן',
    transcription: 'וִוינְדוֹ',
    category: 'household',
    exampleSentence: {
      english: 'I look out the window.',
      hebrew: 'אני מסתכל מהחלון.',
    },
  },
  {
    id: 'house-7',
    english: 'room',
    hebrew: 'חֶדֶר',
    transcription: 'רוּם',
    category: 'household',
    exampleSentence: {
      english: 'My room is clean.',
      hebrew: 'החדר שלי נקי.',
    },
  },
  {
    id: 'house-8',
    english: 'kitchen',
    hebrew: 'מִטְבָּח',
    transcription: 'קִיטְשֶׁן',
    category: 'household',
    exampleSentence: {
      english: 'I cook in the kitchen.',
      hebrew: 'אני מבשל במטבח.',
    },
  },
  {
    id: 'house-9',
    english: 'bathroom',
    hebrew: 'חֲדַר אַמְבַּטְיָה',
    transcription: 'בַּאתְרוּם',
    category: 'household',
    exampleSentence: {
      english: 'I take a shower in the bathroom.',
      hebrew: 'אני מתקלח בחדר האמבטיה.',
    },
  },
  {
    id: 'house-10',
    english: 'car',
    hebrew: 'מְכוֹנִית',
    transcription: 'קָאר',
    category: 'household',
    exampleSentence: {
      english: 'Dad drives the car.',
      hebrew: 'אבא נוהג במכונית.',
    },
  },
  {
    id: 'house-11',
    english: 'book',
    hebrew: 'סֵפֶר',
    transcription: 'בּוּק',
    category: 'household',
    exampleSentence: {
      english: 'I love to read a good book.',
      hebrew: 'אני אוהב לקרוא ספר טוב.',
    },
  },
  {
    id: 'house-12',
    english: 'ball',
    hebrew: 'כַּדּוּר',
    transcription: 'בּוֹל',
    category: 'household',
    exampleSentence: {
      english: 'The ball is round.',
      hebrew: 'הכדור עגול.',
    },
  },

  // ============ NATURE ============
  {
    id: 'nature-1',
    english: 'sun',
    hebrew: 'שֶׁמֶשׁ',
    transcription: 'סַן',
    category: 'nature',
    exampleSentence: {
      english: 'The sun is hot.',
      hebrew: 'השמש חמה.',
    },
  },
  {
    id: 'nature-2',
    english: 'moon',
    hebrew: 'יָרֵחַ',
    transcription: 'מוּן',
    category: 'nature',
    exampleSentence: {
      english: 'The moon shines at night.',
      hebrew: 'הירח זורח בלילה.',
    },
  },
  {
    id: 'nature-3',
    english: 'tree',
    hebrew: 'עֵץ',
    transcription: 'טְרִי',
    category: 'nature',
    exampleSentence: {
      english: 'The tree is tall.',
      hebrew: 'העץ גבוה.',
    },
  },
  {
    id: 'nature-4',
    english: 'flower',
    hebrew: 'פֶּרַח',
    transcription: 'פְלַאוֶר',
    category: 'nature',
    exampleSentence: {
      english: 'The flower smells good.',
      hebrew: 'הפרח מריח טוב.',
    },
  },
  {
    id: 'nature-5',
    english: 'sky',
    hebrew: 'שָׁמַיִם',
    transcription: 'סְקַיי',
    category: 'nature',
    exampleSentence: {
      english: 'The sky is blue.',
      hebrew: 'השמיים כחולים.',
    },
  },
  {
    id: 'nature-6',
    english: 'cloud',
    hebrew: 'עָנָן',
    transcription: 'קְלַאוּד',
    category: 'nature',
    exampleSentence: {
      english: 'The cloud is white.',
      hebrew: 'הענן לבן.',
    },
  },
  {
    id: 'nature-7',
    english: 'rain',
    hebrew: 'גֶּשֶׁם',
    transcription: 'רֵיין',
    category: 'nature',
    exampleSentence: {
      english: 'I love the rain.',
      hebrew: 'אני אוהב את הגשם.',
    },
  },
  {
    id: 'nature-8',
    english: 'snow',
    hebrew: 'שֶׁלֶג',
    transcription: 'סְנוֹ',
    category: 'nature',
    exampleSentence: {
      english: 'The snow is cold.',
      hebrew: 'השלג קר.',
    },
  },
  {
    id: 'nature-9',
    english: 'star',
    hebrew: 'כּוֹכָב',
    transcription: 'סְטָאר',
    category: 'nature',
    exampleSentence: {
      english: 'The star shines bright.',
      hebrew: 'הכוכב זורח בהיר.',
    },
  },
  {
    id: 'nature-10',
    english: 'sea',
    hebrew: 'יָם',
    transcription: 'סִי',
    category: 'nature',
    exampleSentence: {
      english: 'I swim in the sea.',
      hebrew: 'אני שוחה בים.',
    },
  },
  {
    id: 'nature-11',
    english: 'river',
    hebrew: 'נָהָר',
    transcription: 'רִיבֶר',
    category: 'nature',
    exampleSentence: {
      english: 'The river flows to the sea.',
      hebrew: 'הנהר זורם לים.',
    },
  },
  {
    id: 'nature-12',
    english: 'mountain',
    hebrew: 'הַר',
    transcription: 'מַאוּנְטֶן',
    category: 'nature',
    exampleSentence: {
      english: 'The mountain is very high.',
      hebrew: 'ההר מאוד גבוה.',
    },
  },

  // ============ VERBS ============
  {
    id: 'verb-1',
    english: 'go',
    hebrew: 'לָלֶכֶת',
    transcription: 'גּוֹ',
    category: 'verbs',
    exampleSentence: {
      english: 'I go to school.',
      hebrew: 'אני הולך לבית הספר.',
    },
  },
  {
    id: 'verb-2',
    english: 'come',
    hebrew: 'לָבוֹא',
    transcription: 'קַאם',
    category: 'verbs',
    exampleSentence: {
      english: 'Come here please.',
      hebrew: 'בוא הנה בבקשה.',
    },
  },
  {
    id: 'verb-3',
    english: 'eat',
    hebrew: 'לֶאֱכֹל',
    transcription: 'אִיט',
    category: 'verbs',
    exampleSentence: {
      english: 'I eat breakfast.',
      hebrew: 'אני אוכל ארוחת בוקר.',
    },
  },
  {
    id: 'verb-4',
    english: 'drink',
    hebrew: 'לִשְׁתּוֹת',
    transcription: 'דְּרִינְק',
    category: 'verbs',
    exampleSentence: {
      english: 'I drink water.',
      hebrew: 'אני שותה מים.',
    },
  },
  {
    id: 'verb-5',
    english: 'sleep',
    hebrew: 'לִישׁוֹן',
    transcription: 'סְלִיפּ',
    category: 'verbs',
    exampleSentence: {
      english: 'I sleep at night.',
      hebrew: 'אני ישן בלילה.',
    },
  },
  {
    id: 'verb-6',
    english: 'run',
    hebrew: 'לָרוּץ',
    transcription: 'רַאן',
    category: 'verbs',
    exampleSentence: {
      english: 'I run fast.',
      hebrew: 'אני רץ מהר.',
    },
  },
  {
    id: 'verb-7',
    english: 'walk',
    hebrew: 'לָלֶכֶת',
    transcription: 'ווֹק',
    category: 'verbs',
    exampleSentence: {
      english: 'I walk to school.',
      hebrew: 'אני הולך לבית הספר.',
    },
  },
  {
    id: 'verb-8',
    english: 'play',
    hebrew: 'לְשַׂחֵק',
    transcription: 'פְּלֵיי',
    category: 'verbs',
    exampleSentence: {
      english: 'I play with my friends.',
      hebrew: 'אני משחק עם החברים.',
    },
  },
  {
    id: 'verb-9',
    english: 'read',
    hebrew: 'לִקְרֹא',
    transcription: 'רִיד',
    category: 'verbs',
    exampleSentence: {
      english: 'I read a book.',
      hebrew: 'אני קורא ספר.',
    },
  },
  {
    id: 'verb-10',
    english: 'write',
    hebrew: 'לִכְתֹּב',
    transcription: 'רַייְט',
    category: 'verbs',
    exampleSentence: {
      english: 'I write my name.',
      hebrew: 'אני כותב את השם שלי.',
    },
  },
  {
    id: 'verb-11',
    english: 'see',
    hebrew: 'לִרְאוֹת',
    transcription: 'סִי',
    category: 'verbs',
    exampleSentence: {
      english: 'I see the bird.',
      hebrew: 'אני רואה את הציפור.',
    },
  },
  {
    id: 'verb-12',
    english: 'hear',
    hebrew: 'לִשְׁמֹעַ',
    transcription: 'הִיר',
    category: 'verbs',
    exampleSentence: {
      english: 'I hear music.',
      hebrew: 'אני שומע מוזיקה.',
    },
  },
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
