import { db, loadSchema } from './db';
import DotenvFlow from 'dotenv-flow';

export const init_server = async () => {
    try {
        //加載環境變數
        DotenvFlow.config();
        console.log('Environment variables loaded successfully.');

        //加載資料庫架構
        await loadSchema();
        console.log('Database schema loaded successfully.');
    } catch (error) {
        console.error('Error initializing server:', error);
        process.exit(1); //無法初始化時退出進程
    }
};
