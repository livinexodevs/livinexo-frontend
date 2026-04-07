import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/app-cooking")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace("/app-cooking", "/onboarding");
    return NextResponse.redirect(url);
  }

  const isRoot = pathname === "/";
  const isOnboardingPage = pathname.startsWith("/onboarding");
  const isApi = pathname.startsWith("/api");
  const isNextAsset = pathname.startsWith("/_next");
  const isPublicFile = /\.[^/]+$/.test(pathname);

  if (isRoot || isOnboardingPage || isApi || isNextAsset || isPublicFile) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/onboarding";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/:path*",
};
