import pg from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const { Pool } = pg;

const db = new Pool(
    {
        ssl: process.env.SSL_MODE === 'enabled' ? { rejectUnauthorized: false } : false,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    }
);


async function handleDisconnect(signal)
{
    try
    {
        await db.end();
        console.log(`Database disconnected due to ${signal}`);
        process.exit(0);
    }
    catch (err)
    {
        console.error("Error during disconnection:", err);
        process.exit(1);
    }
}

async function shutdownHandler(handleDisconnect)
{
    process.on("SIGINT", async () => { await handleDisconnect("SIGINT");});
    process.on("SIGTERM", async () => { await handleDisconnect("SIGTERM");});
}


export default db;
export { handleDisconnect, shutdownHandler };