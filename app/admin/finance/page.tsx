'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, AlertTriangle, CreditCard } from 'lucide-react';

interface AmexStatementSummary {
  account_name: string;
  start_date: string;
  end_date: string;
  total_spent: number;
  budget_target: number;
  remaining: number;
  percent_used: number;
}

interface AmexTransaction {
  id: number;
  name: string;
  merchant_name: string | null;
  amount: number;
  date: string;
  category: string;
  icon: string;
}

interface AmexBudget {
  category: string;
  icon: string;
  transaction_count: number;
  spent: number;
  monthly_budget: number;
  remaining: number;
  percent_used: number;
  status: 'OK' | 'WARNING' | 'OVER_BUDGET';
}

interface Alert {
  transaction_id: number;
  account_name: string;
  amount: number;
  merchant: string;
  date: string;
  reason: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
}

export default function FinancePage() {
  const [summary, setSummary] = useState<AmexStatementSummary | null>(null);
  const [transactions, setTransactions] = useState<AmexTransaction[]>([]);
  const [budgets, setBudgets] = useState<AmexBudget[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const safeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const fetchData = async () => {
    try {
      const financeApiUrl = process.env.NEXT_PUBLIC_FINANCE_API_URL || '/api/finance';

      const [statementRes, budgetRes, alertsRes] = await Promise.all([
        fetch(`${financeApiUrl}/amex-statement`),
        fetch(`${financeApiUrl}/amex-budget`),
        fetch(`${financeApiUrl}/alerts`),
      ]);

      if (!statementRes.ok || !budgetRes.ok || !alertsRes.ok) {
        throw new Error('Failed to fetch finance data');
      }

      const [statementData, budgetData, alertsData] = await Promise.all([
        statementRes.json(),
        budgetRes.json(),
        alertsRes.json(),
      ]);

      setSummary(statementData.summary);
      setTransactions(statementData.transactions);
      setBudgets(budgetData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = async (transactionId: number) => {
    try {
      const financeApiUrl = process.env.NEXT_PUBLIC_FINANCE_API_URL || '/api/finance';
      await fetch(`${financeApiUrl}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      setAlerts(alerts.filter((a) => a.transaction_id !== transactionId));
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading finance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <p className="text-sm text-muted-foreground">
            Make sure the finance tracker is configured and the Amex card is marked as primary.
          </p>
        </div>
      </div>
    );
  }

  const budgetStatus = summary
    ? summary.percent_used >= 100
      ? 'over'
      : summary.percent_used >= 90
      ? 'warning'
      : 'ok'
    : 'ok';

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Amex Expense Monitor
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          {summary && (
            <>
              Statement Period: {new Date(summary.start_date).toLocaleDateString()} —{' '}
              {new Date(summary.end_date).toLocaleDateString()}
            </>
          )}
        </p>
      </div>

      {/* Budget Progress - Prominently displayed */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle className="text-xl">Monthly Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Statement Spend</p>
                <p className="text-4xl font-bold">
                  ${safeNumber(summary?.total_spent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Budget Target</p>
                <p className="text-2xl font-semibold text-muted-foreground">
                  ${safeNumber(summary?.budget_target).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{safeNumber(summary?.percent_used).toFixed(1)}% used</span>
                <span
                  className={
                    budgetStatus === 'over'
                      ? 'text-red-500 font-semibold'
                      : budgetStatus === 'warning'
                      ? 'text-orange-500 font-semibold'
                      : 'text-emerald-500'
                  }
                >
                  ${safeNumber(summary?.remaining).toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining
                </span>
              </div>
              <div className="h-4 bg-accent rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    budgetStatus === 'over'
                      ? 'bg-red-500'
                      : budgetStatus === 'warning'
                      ? 'bg-orange-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(safeNumber(summary?.percent_used), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.transaction_id}
                  className="flex items-start justify-between p-3 rounded-lg bg-background border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {alert.severity === 'ALERT' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : alert.severity === 'WARNING' ? (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-medium text-sm">{alert.reason}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.merchant} • {alert.account_name} • {new Date(alert.date).toLocaleDateString()} • $
                      {Math.abs(safeNumber(alert.amount)).toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.transaction_id)}
                    className="ml-2"
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No spending data for this statement period.</p>
            ) : (
              <div className="space-y-3">
                {budgets.map((budget) => (
                  <div key={budget.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {budget.icon} {budget.category}
                      </span>
                      <span className="font-medium">
                        ${safeNumber(budget.spent).toFixed(2)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({budget.transaction_count})
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          budget.status === 'OVER_BUDGET'
                            ? 'bg-red-500'
                            : budget.status === 'WARNING'
                            ? 'bg-orange-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min((safeNumber(budget.spent) / safeNumber(summary?.total_spent)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Current Statement Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No transactions for this statement period.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.slice(0, 20).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{txn.merchant_name || txn.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {txn.icon} {txn.category} • {new Date(txn.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-semibold text-sm text-red-400">
                      ${Math.abs(safeNumber(txn.amount)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
