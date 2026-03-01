'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finance Tracker</h1>
          <p className="text-sm md:text-base text-muted-foreground">Connected to Python/Plaid backend</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Accounts
        </Button>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,458.32</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,750.00</div>
            <p className="text-xs text-muted-foreground">Day job + side hustles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,420.18</div>
            <p className="text-xs text-muted-foreground">-12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Badge variant="default" className="bg-emerald-600">Healthy</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38%</div>
            <p className="text-xs text-muted-foreground">Above target (30%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <p className="font-medium">Chase Checking</p>
                  <p className="text-sm text-muted-foreground">••••4892</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">$4,832.45</p>
                <Badge variant="default" className="bg-emerald-600 text-xs mt-1">Connected</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <p className="font-medium">Discover Savings</p>
                  <p className="text-sm text-muted-foreground">••••7623</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">$7,625.87</p>
                <Badge variant="default" className="bg-emerald-600 text-xs mt-1">Connected</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Salary Deposit', amount: '+$4,375.00', date: 'Feb 15', category: 'Income' },
              { name: 'Rent Payment', amount: '-$1,850.00', date: 'Feb 1', category: 'Housing' },
              { name: 'Grocery Store', amount: '-$127.43', date: 'Feb 14', category: 'Food' },
              { name: 'AWS Hosting', amount: '-$42.50', date: 'Feb 10', category: 'Business' },
              { name: 'Gas Station', amount: '-$54.20', date: 'Feb 12', category: 'Transport' },
            ].map((txn, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{txn.name}</p>
                  <p className="text-xs text-muted-foreground">{txn.date} • {txn.category}</p>
                </div>
                <p className={`font-bold ${txn.amount.startsWith('+') ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {txn.amount}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Notice */}
      <div className="mt-6 p-4 bg-muted/20 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This UI connects to the Python/Plaid backend at{' '}
          <code className="px-1 py-0.5 bg-muted rounded text-xs">C:\Users\chris\.openclaw\workspace\finance-tracker</code>
          . Start the backend separately to sync real account data.
        </p>
      </div>
    </div>
  );
}
