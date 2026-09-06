import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth; 
  const userRole = (req.auth?.user as any)?.role;
  const { pathname } = req.nextUrl;

  let response = NextResponse.next();
  let shouldRedirect = false;
  let redirectUrl = "";

  const protectedRoutes = ["/dashboard"];
  const isAuthPage = pathname.startsWith("/sign-in");
  const isProtectedPage = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isAuthPage && isLoggedIn) {
    shouldRedirect = true;
    redirectUrl = "/dashboard";
  } else if (isProtectedPage && !isLoggedIn) {
    shouldRedirect = true;
    redirectUrl = "/sign-in";
  }

  if (shouldRedirect) {
    response = NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
  }

  return response;
});

export const config = {
  matcher: [ 
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};