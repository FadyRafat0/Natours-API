import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/config.env` });

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection 🤡, Server Is Shutting Down ...');
    process.exit(1);
});
