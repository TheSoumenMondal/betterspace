import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./server/better-auth";

const publicRoutes = ["/", "/auth/login", "/auth/signup"];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	const isPublicRoute = publicRoutes.includes(pathname);

	if (session && isPublicRoute) {
		return NextResponse.redirect(new URL("/space", request.url));
	}

	if (!session && !isPublicRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
