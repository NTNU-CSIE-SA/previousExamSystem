import bcrypt from 'bcrypt';
import fs from 'fs';
import readline from 'readline';
import sqlite3 from 'better-sqlite3';

const db = new sqlite3('db.sqlite');

const csvFilePath = './src/backend/test/account.csv';

async function importCSVToSQLite() {
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let headers: string[] = [];
    const insertSQL = db.prepare(
        'INSERT INTO Profile (school_id, name, password, ban_until, admin_level) VALUES (?, ?, ?, ?, ?)'
    );

    db.transaction(() => {
        rl.on('line', (line) => {
            const values = line.split(',');

            if (headers.length === 0) {
                headers = values.map(header => header.trim());
            } else {
                const row: any = {};
                headers.forEach((header, index) => {
                    row[header] = values[index]?.trim();
                });

                // don't insert school_id's already in SQL
                if (db.prepare('SELECT * FROM Profile WHERE school_id = ?').get(row.school_id) === undefined) {
                    insertSQL.run(row.school_id, row.name === '' ? null : row.name
                        , bcrypt.hashSync(row.password, 10), row.ban_until === '' ? null : row.ban_until
                        , parseInt(row.admin_level, 10));
                }
            }
        });
    })();
}

importCSVToSQLite().then(() => console.log('CSV 已匯入 SQLite')).catch(console.error);
