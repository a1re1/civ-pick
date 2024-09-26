import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

export interface MapPickBanResult {
  id: number;
  selected_maps: string[];
  banned_map: string;
  created_at: Date;
}

export async function insertMapPickBanResult(selectedMaps: string[], bannedMap: string): Promise<MapPickBanResult> {
  const query = 'INSERT INTO map_pick_ban (selected_maps, banned_map) VALUES ($1, $2) RETURNING *';
  const values = [selectedMaps, bannedMap];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting map pick-ban result:', err);
    throw err;
  }
}

export async function getLatestMapPickBanResults(limit: number = 5): Promise<MapPickBanResult[]> {
  const query = 'SELECT * FROM map_pick_ban ORDER BY created_at DESC LIMIT $1';
  const values = [limit];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    console.error('Error fetching latest map pick-ban results:', err);
    throw err;
  }
}
