import { client } from './src/lib/db';

async function migrate() {
  console.log('Creating fix_list_scripts table...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS fix_list_scripts (
      id TEXT PRIMARY KEY,
      script TEXT NOT NULL,
      filename_pattern TEXT,
      created_at INTEGER
    )
  `);
  console.log('Done!');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
