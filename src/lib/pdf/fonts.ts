import path from 'path';
import { Font } from '@react-pdf/renderer';

let registered = false;

export function registerFonts() {
  if (registered) return;

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: path.join(process.cwd(), 'src/lib/pdf/fonts/Roboto-Regular.ttf'),
        fontWeight: 'normal',
      },
      {
        src: path.join(process.cwd(), 'src/lib/pdf/fonts/Roboto-Bold.ttf'),
        fontWeight: 'bold',
      },
    ],
  });

  // Вимкнути перенос слів (щоб не різало слова на склади)
  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
