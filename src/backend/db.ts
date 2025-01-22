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
      // 讀取 SQL 檔案
      const SQL:string = fs.readFileSync('../../../d1/schema.sql', 'utf-8');
      const stmts = SQL.split(';')
			  .map((s) => s.trim())
			  .filter((s) => s.length > 0);
		  for (const stmt of stmts) {
			console.log(stmt);
      sql`${sql.raw(stmt)}`.execute(db);
		}
      console.log('SQL executed successfully');
    } catch (error) {
      console.error('Error executing SQL', error);
    }
  };
  
  