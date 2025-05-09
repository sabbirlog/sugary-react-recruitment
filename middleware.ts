import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const publicPages = [
    "/",
];

const authMiddleware = withAuth(() => {
    return NextResponse.next();
}, {
    pages: {
        signIn: '/'
    },
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {

    const publicPathnameRegex = RegExp(
        `^(${publicPages
            .flatMap((p) =>
                p === "/" ? ["", "/"] : p.replace(/:\w+/g, "[^/]+")
            )
            .join("|")})/?$`,
        "i"
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
        return NextResponse.next();
    }

    return authMiddleware(req as NextRequestWithAuth, event);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
