// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwtToken")?.value;

  const protectedRoutes = ["/dashboard", "/inventory", "/add-inventory", "/add-to-department", "/department", "/department-view", "/logs", "/orders", "purchase", "/reports", "settings", "/supliers", "/user-management"];
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/inventory/:path*", "/add-inventory/:path*", "/add-to-department/:path*", "/department/:path*", "/department-view/:path*", "/logs/:path*", "/orders/:path*", "purchase/:path*", "/reports/:path*", "settings/:path*", "/supliers/:path*", "/user-management/:path*"],
};
