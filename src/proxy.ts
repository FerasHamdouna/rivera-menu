import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Keeps the admin's Supabase session fresh and sends signed-out visitors to the login page.
// This is only an optimistic gate: every admin page and action checks the user again (src/lib/admin/auth.ts).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();

  const isLogin = request.nextUrl.pathname === '/admin/login';
  if (!user === isLogin) return response;

  const redirect = NextResponse.redirect(new URL(user ? '/admin' : '/admin/login', request.url));
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}

export const config = { matcher: ['/admin/:path*'] };
