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
    // Get Amex budget progress by category
    const result = await pool.query(`
      SELECT 
        category,
        icon,
        transaction_count,
        spent,
        monthly_budget,
        remaining,
        percent_used,
        status
      FROM amex_budget_progress
      ORDER BY spent DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching Amex budget:', error);
    return NextResponse.json({ error: 'Failed to fetch Amex budget' }, { status: 500 });
  }
}
