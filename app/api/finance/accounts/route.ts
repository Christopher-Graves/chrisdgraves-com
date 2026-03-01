import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'tony_brain',
  user: process.env.DB_USER || 'tony',
  password: process.env.DB_PASSWORD,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.official_name,
        a.type,
        a.subtype,
        a.mask,
        a.current_balance,
        a.available_balance,
        p.institution_name
      FROM accounts a
      JOIN plaid_items p ON a.plaid_item_id = p.id
      ORDER BY a.current_balance DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}
