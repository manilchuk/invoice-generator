import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ВАЖЛИВО: не роби нічого між createServerClient і getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // === Публічні шляхи (сторінки, доступні без логіну) ===
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/auth'];
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // === Статичні файли (sitemap.xml, robots.txt, favicon.ico, opengraph-image.png, тощо) ===
  const isStaticFile = /\.[a-zA-Z0-9]+$/.test(request.nextUrl.pathname);

  // === Якщо не залогований і на захищеній сторінці — редірект на /login ===
  if (!user && !isPublicPath && !isStaticFile) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // === Якщо залогований і на /login або /register — редірект на /dashboard ===
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
