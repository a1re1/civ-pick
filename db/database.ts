import { Pool } from 'pg';

// Create a new pool instance
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Create the map_pick_ban table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS map_pick_ban (
    id SERIAL PRIMARY KEY,
    selected_maps TEXT[],
    banned_map TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

pool.query(createTableQuery)
  .then(() => console.log('Table created successfully'))
  .catch(err => console.error('Error creating table:', err));

export async function storeMapPickBanResults(selectedMaps: string[], bannedMap: string) {
  const query = 'INSERT INTO map_pick_ban (selected_maps, banned_map) VALUES ($1, $2) RETURNING *';
  const values = [selectedMaps, bannedMap];

  try {
    const result = await pool.query(query, values);
    console.log('Stored map pick-ban results:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('Error storing map pick-ban results:', err);
    throw err;
  }
}
