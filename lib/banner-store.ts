import postgres from "postgres";
export const PROMO_BANNER_TEXT_KEY = "promo_banner_text";
export const DEFAULT_PROMO_BANNER_TEXT =
  "Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM";

const connectionString = process.env.DATABASE_URL;
const sql = connectionString ? postgres(connectionString, { max: 1 }) : null;

export async function getPromoBannerText() {
  if (!sql) {
    return DEFAULT_PROMO_BANNER_TEXT;
  }

  try {
    await ensureBannerTable();
    const rows = await sql<{ value: string }[]>`
      SELECT value
      FROM site_banner_settings
      WHERE key = ${PROMO_BANNER_TEXT_KEY}
      LIMIT 1
    `;

    return rows[0]?.value?.trim() || DEFAULT_PROMO_BANNER_TEXT;
  } catch (error) {
    console.error("Unable to load promo banner text", error);
    return DEFAULT_PROMO_BANNER_TEXT;
  }
}

export async function setPromoBannerText(value: string) {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }

  const text = value.trim();

  if (!text || text.length > 180) {
    throw new Error("Banner text must be between 1 and 180 characters");
  }

  await ensureBannerTable();
  await sql`
    INSERT INTO site_banner_settings (key, value, updated_at)
    VALUES (${PROMO_BANNER_TEXT_KEY}, ${text}, NOW())
    ON CONFLICT (key)
    DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;

  return text;
}

async function ensureBannerTable() {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }

  await sql`
    CREATE TABLE IF NOT EXISTS site_banner_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
