import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "changeme_access_secret",
);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/seller/:path*"],
};
