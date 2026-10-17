// ============================================
// СУМА ПРОПИСОМ (українською)
// ============================================

const ONES_MASCULINE = [
  '',
  'один',
  'два',
  'три',
  'чотири',
  "п'ять",
  'шість',
  'сім',
  'вісім',
  "дев'ять",
];

const ONES_FEMININE = [
  '',
  'одна',
  'дві',
  'три',
  'чотири',
  "п'ять",
  'шість',
  'сім',
  'вісім',
  "дев'ять",
];

const TEENS = [
  'десять',
  'одинадцять',
  'дванадцять',
  'тринадцять',
  'чотирнадцять',
  "п'ятнадцять",
  'шістнадцять',
  'сімнадцять',
  'вісімнадцять',
  "дев'ятнадцять",
];

const TENS = [
  '',
  '',
  'двадцять',
  'тридцять',
  'сорок',
  "п'ятдесят",
  'шістдесят',
  'сімдесят',
  'вісімдесят',
  "дев'яносто",
];

const HUNDREDS = [
  '',
  'сто',
  'двісті',
  'триста',
  'чотириста',
  "п'ятсот",
  'шістсот',
  'сімсот',
  'вісімсот',
  "дев'ятсот",
];

// Функція для відмінювання слова залежно від числа
function pluralize(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0]; // 1, 21, 31...
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]; // 2-4, 22-24...
  return forms[2]; // 5-20, 25-30...
}

// Розбиває число на тріади (тисячі, мільйони тощо)
function tripletToWords(num: number, isFeminine: boolean = false): string {
  if (num === 0) return '';

  const ones = isFeminine ? ONES_FEMININE : ONES_MASCULINE;
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  const tens = Math.floor(remainder / 10);
  const units = remainder % 10;

  const parts: string[] = [];

  if (hundreds > 0) parts.push(HUNDREDS[hundreds]);

  if (remainder >= 10 && remainder < 20) {
    parts.push(TEENS[remainder - 10]);
  } else {
    if (tens > 0) parts.push(TENS[tens]);
    if (units > 0) parts.push(ones[units]);
  }

  return parts.join(' ').trim();
}

// Основна функція
export function amountToWords(amount: number): string {
  // Округлюємо до копійок
  amount = Math.round(amount * 100) / 100;

  const hryvnia = Math.floor(amount);
  const kopiyka = Math.round((amount - hryvnia) * 100);

  // ============================================
  // 1. Сума гривень прописом
  // ============================================
  let hryvniaText = '';

  if (hryvnia === 0) {
    hryvniaText = 'нуль';
  } else {
    const billions = Math.floor(hryvnia / 1_000_000_000);
    const millions = Math.floor((hryvnia % 1_000_000_000) / 1_000_000);
    const thousands = Math.floor((hryvnia % 1_000_000) / 1_000);
    const units = hryvnia % 1_000;

    if (billions > 0) {
      hryvniaText += tripletToWords(billions);
      hryvniaText += ' ';
      hryvniaText += pluralize(billions, ['мільярд', 'мільярди', 'мільярдів']);
      hryvniaText += ' ';
    }

    if (millions > 0) {
      hryvniaText += tripletToWords(millions);
      hryvniaText += ' ';
      hryvniaText += pluralize(millions, ['мільйон', 'мільйони', 'мільйонів']);
      hryvniaText += ' ';
    }

    if (thousands > 0) {
      hryvniaText += tripletToWords(thousands, true); // жіночий рід
      hryvniaText += ' ';
      hryvniaText += pluralize(thousands, ['тисяча', 'тисячі', 'тисяч']);
      hryvniaText += ' ';
    }

    if (units > 0) {
      hryvniaText += tripletToWords(units, true); // жіночий рід
    }

    hryvniaText = hryvniaText.trim();
  }

  // Відмінювання слова "гривня"
  const hryvniaWord = pluralize(hryvnia, ['гривня', 'гривні', 'гривень']);

  // ============================================
  // 2. Копійки
  // ============================================
  const kopiykaText = String(kopiyka).padStart(2, '0');
  const kopiykaWord = pluralize(kopiyka, ['копійка', 'копійки', 'копійок']);

  // ============================================
  // 3. Формуємо фінальний рядок
  // ============================================
  // Перше слово — з великої літери
  const firstChar = hryvniaText.charAt(0).toUpperCase();
  const rest = hryvniaText.slice(1);

  return `${firstChar}${rest} ${hryvniaWord} ${kopiykaText} ${kopiykaWord}`;
}
