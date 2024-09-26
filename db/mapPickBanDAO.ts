import { sql } from "@vercel/postgres";

export interface MapPickBanResult {
  id: number;
  selected_maps: string[];
  banned_map: string;
  created_at: Date;
}

export async function insertMapPickBanResult(selectedMaps: string[], bannedMap: string): Promise<MapPickBanResult> {
  try {
    const result = await sql`
      INSERT INTO map_pick_ban (selected_maps, banned_map)
      VALUES (${selectedMaps}, ${bannedMap})
      RETURNING *
    `;
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting map pick-ban result:', err);
    throw err;
  }
}

export async function getLatestMapPickBanResults(limit: number = 5): Promise<MapPickBanResult[]> {
  try {
    const result = await sql`
      SELECT * FROM map_pick_ban
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows;
  } catch (err) {
    console.error('Error fetching latest map pick-ban results:', err);
    throw err;
  }
}
