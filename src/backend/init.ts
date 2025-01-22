import { db, loadSchema } from './db';
import DotenvFlow from 'dotenv-flow';


export const init_server = () => {
    DotenvFlow.config();
    loadSchema();
    
}