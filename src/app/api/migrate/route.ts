import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

// Safely runs ALTER TABLE ADD COLUMN — ignores "duplicate column" errors (already exists).
async function addColumnIfMissing(
  client: ReturnType<typeof createClient>,
  table: string,
  column: string,
  type: string
) {
  try {
    await client.execute(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type}`);
    return { column, status: "added" };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("duplicate column") || msg.includes("already exists")) {
      return { column, status: "already_exists" };
    }
    throw e;
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    return NextResponse.json(
      { error: "TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set" },
      { status: 500 }
    );
  }

  const client = createClient({ url, authToken });

  try {
    const results = await Promise.all([
      addColumnIfMissing(client, "User", "stripeCustomerId", "TEXT"),
      addColumnIfMissing(client, "User", "stripeSubscriptionId", "TEXT"),
    ]);

    return NextResponse.json({ ok: true, migrations: results });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Migration failed", detail }, { status: 500 });
  }
}
