"use server";

import { sql } from "@vercel/postgres";

export interface LeaderPickBanResult {
  id: number;
  selected_leaders: string[];
  banned_leaders: string[];
  created_at: Date;
}

export async function insertLeaderPickBanResult(
  selectedLeaders: string[],
  bannedLeaders: string[]
): Promise<LeaderPickBanResult> {
  "use server";
  try {
    const result = await sql`
      INSERT INTO leader_pick_ban (selected_leaders, banned_leaders)
      VALUES (${selectedLeaders as any}, ${bannedLeaders as any})
      RETURNING id, selected_leaders, banned_leaders, created_at
    `;
    return {
      id: result.rows[0].id,
      selected_leaders: result.rows[0].selected_leaders,
      banned_leaders: result.rows[0].banned_leaders,
      created_at: result.rows[0].created_at,
    };
  } catch (err) {
    console.error("Error inserting leader pick-ban result:", err);
    throw err;
  }
}

export async function getLatestLeaderPickBanResults(
  limit: number = 10
): Promise<LeaderPickBanResult[]> {
  "use server";
  try {
    const result = await sql`
      SELECT * FROM leader_pick_ban
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows.map((row) => ({
      id: row.id,
      selected_leaders: row.selected_leaders,
      banned_leaders: row.banned_leaders,
      created_at: row.created_at,
    }));
  } catch (err) {
    console.error("Error fetching latest leader pick-ban results:", err);
    throw err;
  }
}
