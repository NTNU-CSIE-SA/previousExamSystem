import type { Database } from './schema';
import SQLite from 'better-sqlite3'
import express from 'express';
import fs from 'fs';
import { Kysely, SqliteDialect ,sql} from 'kysely'

const app = express();
const dialect = new SqliteDialect({
  database: new SQLite('db.sqlite'),
})
export const db = new Kysely<Database>({dialect});


export const loadSchema = () => {
    try {
      const SQL:string = fs.readFileSync('./d1/schema.sql', 'utf-8');
      const stmts = SQL.split(';')
			  .map((s) => s.trim())
			  .filter((s) => s.length > 0);
		  for (const stmt of stmts) {
      sql`${sql.raw(stmt)}`.execute(db);
		}
      console.log('SQL executed successfully');
    } catch (error) {
      console.error('Error executing SQL', error);
    }
};

export const clearExpiredTokens = async () => {
  try{
    const expired = new Date();
    const all_tokens = await db
        .selectFrom('Login')
        .select(['token', 'expired_time'])
        .execute();
    let clear_count = 0;
    for (const token of all_tokens) {
        if (new Date(token.expired_time) < expired) {
            await db
                .deleteFrom('Login')
                .where('token', '=', token.token)
                .execute();
            clear_count++;
        }
    }
    console.log(`Cleared ${clear_count} expired tokens.`);
  }
  catch (err) {
    console.error(err);
  }
}

export const checkBan = async () => {
  try{
    const ban = await db
        .selectFrom('Profile')
        .select(['school_id', 'ban_until'])
        .where('ban_until', 'is not', null)
        .execute();
    const now = new Date();
    for (const ban_user of ban) {
      if (ban_user.ban_until !== null) {
        if (new Date(ban_user.ban_until) > now) {
          await db
              .updateTable('Profile')
              .set({ban_until: null})
              .where('school_id', '=', ban_user.school_id)
              .execute();
        }
      }
    }
  }
  catch (err) {
    console.error(err);
  }
}