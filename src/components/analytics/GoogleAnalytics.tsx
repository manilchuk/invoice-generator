import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Якщо ID не налаштований — не рендеримо (наприклад, локально без .env)
  if (!gaId) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
