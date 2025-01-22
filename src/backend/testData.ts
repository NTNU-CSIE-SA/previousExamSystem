import { db } from './db';
import bcrypt from 'bcrypt';

(async () => {
    const hashedPassword = await bcrypt.hash('mypassword', 10);

    await db
        .insertInto('Profile')
        .values({
            school_id: '123456',
            name: 'Test User',
            password: hashedPassword,
            ban_until: '',
            admin_level: 1,
        })
        .execute();

    console.log('Test user inserted');
})();