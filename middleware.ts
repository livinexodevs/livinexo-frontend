import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isRoot = pathname === "/";
  const isCookingPage = pathname === "/app-cooking";
  const isApi = pathname.startsWith("/api");
  const isNextAsset = pathname.startsWith("/_next");
  const isPublicFile = /\.[^/]+$/.test(pathname);

  if (isRoot || isCookingPage || isApi || isNextAsset || isPublicFile) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/app-cooking";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/:path*",
};
