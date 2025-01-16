import { env } from "$env/dynamic/private";
import { sql } from "kysely";
import { DB } from "sveltekit-db";
import SQL from "../../../../d1/schema.sql?raw";
import type { Database } from "./schema";

export const db = DB<Database>();

//Hello World! OuO

if (env.DB_COMPONENT === "sqlite") {
    const tables = await db.introspection.getTables();
    if (!tables.map((t) => t.name).includes("Document")) {
        const stmts = SQL.split(";")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        for (const stmt of stmts) {
            console.log(stmt);
            await sql`${sql.raw(stmt)}`.execute(db);
        }
    }
}