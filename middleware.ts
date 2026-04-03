import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
    if (!request.auth) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
});

export const config = {
    matcher: ["/", "/members/:path*"],
};
