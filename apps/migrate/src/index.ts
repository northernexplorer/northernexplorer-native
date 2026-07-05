import { Pool } from 'pg';
import dotenv from 'dotenv';
import { migrationsRegistry } from './migrations';

dotenv.config();

const pool = new Pool({
    database: process.env.DB_NAME || 'northernexplorer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

async function runIncrementalMigrations() {
    console.log('🚀 Initializing Native SQL Migration Service...');
    const client = await pool.connect();

    try {
        const renameCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'migrations'
      );
    `);

        if (renameCheck.rows[0].exists) {
            console.log('🔄 Renaming tracking table from "migrations" to "migration"...');
            await client.query('ALTER TABLE "migrations" RENAME TO "migration"');
        }

        // Ensure tracking table exists
        await client.query(`
        CREATE TABLE IF NOT EXISTS "migration" (
                                                           "migration_key" VARCHAR(255) PRIMARY KEY,
            "executed_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
                                        );
    `);

        // Query already executed migrations
        const { rows } = await client.query('SELECT migration_key FROM migration');
        const executedKeys = new Set(rows.map((row) => row.migration_key));

        const pendingKeys = Object.keys(migrationsRegistry).filter((key) => !executedKeys.has(key));

        if (pendingKeys.length === 0) {
            console.log('✨ Database schema is up to date. No pending migrations found.');
            return;
        }

        console.log(`📥 Found ${pendingKeys.length} pending migration batches to execute.`);

        // Process each missing migration file sequentially
        for (const key of pendingKeys) {
            console.log(`\n⚡ Processing batch: [${key}]`);
            const sqlLines = migrationsRegistry[key];

            // Start transaction
            await client.query('BEGIN');

            try {
                // Run every line in the array
                for (let i = 0; i < sqlLines.length; i++) {
                    const sqlLine = sqlLines[i].trim();
                    if (!sqlLine) continue;

                    await client.query(sqlLine);
                }

                // Log this key so it skips next time (using standard $1 token placeholder for pg)
                await client.query(
                    'INSERT INTO migration (migration_key, executed_at) VALUES ($1, CURRENT_TIMESTAMP)',
                    [key],
                );
                await client.query('COMMIT');
                console.log(`✅ Completed and recorded migration: [${key}]`);
            } catch (txError) {
                await client.query('ROLLBACK');
                throw txError;
            }
        }

        console.log('\n🎉 All structural updates applied cleanly!');
    } catch (error) {
        console.error('\n❌ Migration batch aborted due to execution error. Changes rolled back.');
        console.error(error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
        console.log('🔌 Connection pool released cleanly.');
        process.exit(0);
    }
}

runIncrementalMigrations();
