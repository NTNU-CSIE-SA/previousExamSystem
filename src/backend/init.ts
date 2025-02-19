import { db, loadSchema, clearExpiredTokens, checkBan } from './db';
import DotenvFlow from 'dotenv-flow';
import corn from 'node-cron';

export const init_server = async () => {
    try {
        //加載環境變數
        DotenvFlow.config();
        console.log('Environment variables loaded successfully.');

        //加載資料庫架構
        await loadSchema();
        corn.schedule('0 8 * * *', async () => {
            try {
                console.log(`${new Date().toISOString()}: Clearing expired tokens...`);
                await clearExpiredTokens();
                console.log(`${new Date().toISOString()}: Finished clearing expired tokens.`);
                console.log(`${new Date().toISOString()}: Checking ban status...`);
                await checkBan();
                console.log(`${new Date().toISOString()}: Finished checking ban status.`);
            } catch (error) {
                console.error('Error clearing expired tokens:', error);
            }
        });

        console.log('Database schema loaded successfully.');
    } catch (error) {
        console.error('Error initializing server:', error);
        process.exit(1); //無法初始化時退出進程
    }
};
