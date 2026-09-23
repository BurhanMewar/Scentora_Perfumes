import { NextRequest, NextResponse } from "next/server";
import { getPromoBannerText, setPromoBannerText } from "@/lib/banner-store";

export async function GET() {
  return NextResponse.json({ text: await getPromoBannerText() });
}

export async function PATCH(request: NextRequest) {
  const expectedToken = process.env.BANNER_ADMIN_TOKEN;
  const providedToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!expectedToken || !providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const text =
    body && typeof body === "object" && "text" in body && typeof body.text === "string"
      ? body.text
      : "";

  try {
    return NextResponse.json({ text: await setPromoBannerText(text) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save banner text";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
