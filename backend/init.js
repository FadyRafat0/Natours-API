import dotenv from 'dotenv';

const dirname = import.meta.dirname;
dotenv.config({ path: `${dirname}/config.env` });

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection 🤡, Server Is Shutting Down ...');
    process.exit(1);
});
