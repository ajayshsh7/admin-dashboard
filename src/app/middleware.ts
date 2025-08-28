// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Example: Only allow this admin email
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; 
  const email = req.cookies.get("email")?.value;

  const { pathname } = req.nextUrl;

  // Protect /dashboard route
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // no token → redirect to signin
      const signinUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }

    // If you want ONLY admin access:
    if (email !== ADMIN_EMAIL) {
      const unauthorizedUrl = new URL("/unauthorized", req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

// Apply middleware only on dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
