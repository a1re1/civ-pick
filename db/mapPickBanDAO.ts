"use server";

import { sql } from "@vercel/postgres";

export interface MapPickBanResult {
  id: number;
  selected_maps: string[];
  banned_map: string;
  created_at: Date;
}

export async function insertMapPickBanResult(
  selectedMaps: string[],
  bannedMap: string
): Promise<MapPickBanResult> {
  "use server";
  try {
    const result = await sql`
      INSERT INTO map_pick_ban (selected_maps, banned_map)
      VALUES (${selectedMaps as any}, ${bannedMap})
      RETURNING id, selected_maps, banned_map, created_at
    `;
    return {
      id: result.rows[0].id,
      selected_maps: result.rows[0].selected_maps,
      banned_map: result.rows[0].banned_map,
      created_at: result.rows[0].created_at,
    };
  } catch (err) {
    console.error("Error inserting map pick-ban result:", err);
    throw err;
  }
}

export async function getLatestMapPickBanResults(
  limit: number = 10
): Promise<MapPickBanResult[]> {
  "use server";
  try {
    const result = await sql`
      SELECT * FROM map_pick_ban
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows.map((row) => ({
      id: row.id,
      selected_maps: row.selected_maps,
      banned_map: row.banned_map,
      created_at: row.created_at,
    }));
  } catch (err) {
    console.error("Error fetching latest map pick-ban results:", err);
    throw err;
  }
}
