'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Account {
  id: number;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string;
  mask: string;
  current_balance: number;
  available_balance: number | null;
  institution_name: string;
}

interface BudgetAlert {
  category: string;
  icon: string;
  target_amount: number;
  spent: number;
  remaining: number;
  percent_used: number;
  status: 'OK' | 'WARNING' | 'OVER_BUDGET';
}

interface Transaction {
  id: number;
  name: string;
  merchant_name: string | null;
  amount: number;
  date: string;
  category: string;
  icon: string;
  pending: boolean;
}

interface SpendingByCategory {
  category: string;
  icon: string;
  total_spent: number;
  transaction_count: number;
}

export default function FinancePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<BudgetAlert[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spending, setSpending] = useState<SpendingByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to safely parse numeric values
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use environment variable for finance API URL, default to local proxy
        const financeApiUrl = process.env.NEXT_PUBLIC_FINANCE_API_URL || '/api/finance';
        
        const [accountsRes, budgetsRes, transactionsRes, spendingRes] = await Promise.all([
          fetch(`${financeApiUrl}/accounts`),
          fetch(`${financeApiUrl}/budgets`),
          fetch(`${financeApiUrl}/transactions?limit=10`),
          fetch(`${financeApiUrl}/spending`),
        ]);

        if (!accountsRes.ok || !budgetsRes.ok || !transactionsRes.ok || !spendingRes.ok) {
          throw new Error('Failed to fetch finance data');
        }

        const [accountsData, budgetsData, transactionsData, spendingData] = await Promise.all([
          accountsRes.json(),
          budgetsRes.json(),
          transactionsRes.json(),
          spendingRes.json(),
        ]);

        setAccounts(accountsData);
        setBudgets(budgetsData);
        setTransactions(transactionsData);
        setSpending(spendingData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate total balance (assets - liabilities)
  const totalBalance = accounts.reduce((sum, acc) => sum + safeNumber(acc.current_balance), 0);
  const totalBudget = budgets.reduce((sum, b) => sum + safeNumber(b.target_amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + safeNumber(b.spent), 0);

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
            Make sure the finance tracker database is set up and the API routes are configured.
          </p>
        </div>
      </div>
    );
  }

  const handleConnectBank = () => {
    window.open('https://api.chrisdgraves.com', '_blank', 'width=600,height=800');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">💰 Finance</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Track your spending, budgets, and accounts
          </p>
        </div>
        <Button onClick={handleConnectBank} variant="default">
          🏦 Connect Bank
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{accounts.length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {' '}({totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {budgets.filter(b => b.status === 'OVER_BUDGET').length > 0 ? (
                <Badge variant="destructive" className="text-sm">
                  {budgets.filter(b => b.status === 'OVER_BUDGET').length} Over Budget
                </Badge>
              ) : budgets.filter(b => b.status === 'WARNING').length > 0 ? (
                <Badge className="bg-orange-600 text-sm">
                  {budgets.filter(b => b.status === 'WARNING').length} Warning
                </Badge>
              ) : (
                <Badge className="bg-emerald-600 text-sm">All Good</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>🏦 Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No accounts connected. Run the Plaid Link server to connect accounts.
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => {
                  const balance = safeNumber(account.current_balance);
                  const isDebt = account.type === 'credit' || balance < 0;
                  
                  return (
                    <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div>
                        <div className="font-medium">
                          {account.name}
                          {isDebt && <span className="ml-2 text-xs text-red-400">(Debt)</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {account.institution_name} •••• {account.mask}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${isDebt ? 'text-red-400' : ''}`}>
                          ${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {account.available_balance !== null && (
                          <div className="text-xs text-muted-foreground">
                            ${Math.abs(safeNumber(account.available_balance)).toLocaleString('en-US', { minimumFractionDigits: 2 })} available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget vs Actual */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No budgets set for this month.
              </p>
            ) : (
              <div className="space-y-3">
                {budgets.slice(0, 6).map((budget) => (
                  <div key={budget.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {budget.icon} {budget.category}
                      </span>
                      <span className="font-medium">
                        ${safeNumber(budget.spent).toFixed(2)} / ${safeNumber(budget.target_amount).toFixed(2)}
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
                        style={{ width: `${Math.min(safeNumber(budget.percent_used), 100)}%` }}
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
            <CardTitle>📝 Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No transactions found.
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {txn.merchant_name || txn.name}
                        {txn.pending && (
                          <Badge variant="secondary" className="ml-2 text-xs">Pending</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {txn.icon} {txn.category} • {new Date(txn.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`font-semibold ${safeNumber(txn.amount) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {safeNumber(txn.amount) < 0 ? '-' : '+'}${Math.abs(safeNumber(txn.amount)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            {spending.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No spending data for this month.
              </p>
            ) : (
              <div className="space-y-3">
                {spending.slice(0, 6).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {cat.icon} {cat.category}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cat.transaction_count} transactions
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${safeNumber(cat.total_spent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
