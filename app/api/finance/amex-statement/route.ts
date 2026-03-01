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
    // Get current Amex statement transactions
    const transactionsResult = await pool.query(`
      SELECT 
        id,
        name,
        merchant_name,
        amount,
        date,
        category,
        icon,
        statement_start,
        statement_end
      FROM current_amex_statement
      ORDER BY date DESC
    `);

    // Get statement period summary
    const summaryResult = await pool.query(`
      WITH amex_account AS (
        SELECT a.id, a.name, am.statement_close_day
        FROM accounts a
        JOIN account_metadata am ON a.id = am.account_id
        WHERE am.is_primary_amex = TRUE
        LIMIT 1
      ),
      statement_period AS (
        SELECT * FROM get_current_statement_period((SELECT statement_close_day FROM amex_account))
      ),
      total_spend AS (
        SELECT COALESCE(SUM(ABS(amount)), 0) as total
        FROM transactions t
        CROSS JOIN amex_account aa
        CROSS JOIN statement_period sp
        WHERE t.account_id = aa.id
          AND t.date >= sp.start_date
          AND t.date <= sp.end_date
          AND t.amount < 0
          AND NOT t.pending
      )
      SELECT 
        aa.name as account_name,
        sp.start_date,
        sp.end_date,
        ts.total as total_spent,
        2500.00 as budget_target,
        2500.00 - ts.total as remaining,
        ROUND((ts.total / 2500.00) * 100, 2) as percent_used
      FROM amex_account aa
      CROSS JOIN statement_period sp
      CROSS JOIN total_spend ts
    `);

    const summary = summaryResult.rows[0] || {
      account_name: 'American Express',
      start_date: new Date(),
      end_date: new Date(),
      total_spent: 0,
      budget_target: 2500,
      remaining: 2500,
      percent_used: 0
    };

    return NextResponse.json({
      summary,
      transactions: transactionsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching Amex statement:', error);
    return NextResponse.json({ error: 'Failed to fetch Amex statement' }, { status: 500 });
  }
}
