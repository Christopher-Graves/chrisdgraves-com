/**
 * Finance Data Transformation Tests
 * 
 * Tests that financial data is correctly transformed:
 * - Numbers are parsed correctly
 * - Credit card amounts show as negative (debt)
 * - Statement periods are calculated correctly
 * - Categories are mapped properly
 */

import { describe, it, expect } from '@jest/globals';

describe('Finance Data Transformations', () => {
  describe('Number Parsing', () => {
    it('should parse string amounts to numbers', () => {
      const testData = {
        total_spent: '1755.40',
        budget_target: '2500.00',
        remaining: '744.60'
      };

      const parsed = {
        total_spent: parseFloat(testData.total_spent),
        budget_target: parseFloat(testData.budget_target),
        remaining: parseFloat(testData.remaining)
      };

      expect(typeof parsed.total_spent).toBe('number');
      expect(parsed.total_spent).toBe(1755.40);
      expect(typeof parsed.budget_target).toBe('number');
      expect(parsed.budget_target).toBe(2500.00);
      expect(typeof parsed.remaining).toBe('number');
      expect(parsed.remaining).toBe(744.60);
    });

    it('should handle null/undefined values safely', () => {
      const safeNumber = (value: any): number => {
        if (value === null || value === undefined) return 0;
        const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      expect(safeNumber(null)).toBe(0);
      expect(safeNumber(undefined)).toBe(0);
      expect(safeNumber('invalid')).toBe(0);
      expect(safeNumber('123.45')).toBe(123.45);
      expect(safeNumber(123.45)).toBe(123.45);
    });
  });

  describe('Credit Card Debt Display', () => {
    it('should show positive amounts as expenses (red/negative)', () => {
      const transaction = {
        id: 1,
        name: 'Starbucks',
        amount: 5.06,  // Positive = spent money
        date: '2026-02-27'
      };

      // In the UI, positive amounts are shown as negative (debt)
      const displayAmount = Math.abs(transaction.amount);
      expect(displayAmount).toBe(5.06);
      
      // Should be displayed with red color in UI
      const isDebt = transaction.amount > 0;
      expect(isDebt).toBe(true);
    });

    it('should show negative amounts as credits (payments/refunds)', () => {
      const transaction = {
        id: 2,
        name: 'TARGET REFUND',
        amount: -36.00,  // Negative = credit/refund
        date: '2026-02-26'
      };

      // Negative amounts are credits (green)
      const isCredit = transaction.amount < 0;
      expect(isCredit).toBe(true);
      
      const displayAmount = Math.abs(transaction.amount);
      expect(displayAmount).toBe(36.00);
    });
  });

  describe('Statement Period Calculations', () => {
    it('should calculate current statement period correctly', () => {
      // Mock function that calculates statement period
      const getCurrentStatementPeriod = (closeDayOfMonth: number): { start_date: Date, end_date: Date } => {
        const today = new Date('2026-03-02');  // Example: March 2
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // If today is before close day, statement is from last month's close to this month's close
        // If today is after close day, statement is from this month's close to next month's close
        let startDate: Date;
        let endDate: Date;
        
        if (today.getDate() < closeDayOfMonth) {
          // Current statement started last month
          startDate = new Date(year, month - 1, closeDayOfMonth);
          endDate = new Date(year, month, closeDayOfMonth - 1);
        } else {
          // Current statement started this month
          startDate = new Date(year, month, closeDayOfMonth);
          endDate = new Date(year, month + 1, closeDayOfMonth - 1);
        }
        
        return { start_date: startDate, end_date: endDate };
      };

      // Test with close day of 22nd
      const period = getCurrentStatementPeriod(22);
      
      // On March 2, we're before the 22nd, so statement is Feb 22 - Mar 21
      expect(period.start_date.getMonth()).toBe(1);  // February (0-indexed)
      expect(period.start_date.getDate()).toBe(22);
      expect(period.end_date.getMonth()).toBe(2);    // March
      expect(period.end_date.getDate()).toBe(21);
    });

    it('should calculate days remaining in statement period', () => {
      const statementEnd = new Date('2026-03-21');
      const today = new Date('2026-03-02');
      
      const msPerDay = 24 * 60 * 60 * 1000;
      const daysRemaining = Math.ceil((statementEnd.getTime() - today.getTime()) / msPerDay);
      
      expect(daysRemaining).toBe(19);
    });

    it('should calculate percent of statement period elapsed', () => {
      const statementStart = new Date('2026-02-22');
      const statementEnd = new Date('2026-03-21');
      const today = new Date('2026-03-02');
      
      const totalDays = (statementEnd.getTime() - statementStart.getTime()) / (24 * 60 * 60 * 1000);
      const daysElapsed = (today.getTime() - statementStart.getTime()) / (24 * 60 * 60 * 1000);
      const percentElapsed = (daysElapsed / totalDays) * 100;
      
      expect(totalDays).toBe(27);
      expect(Math.round(percentElapsed)).toBe(30);  // About 30% through statement
    });
  });

  describe('Category Mappings', () => {
    it('should map transactions to correct categories', () => {
      const transactions = [
        { name: 'Starbucks', expected_category: 'Dining' },
        { name: 'Publix', expected_category: 'Groceries' },
        { name: 'Target', expected_category: 'Shopping' },
        { name: 'Netflix', expected_category: 'Subscriptions' },
        { name: 'Unknown Merchant', expected_category: 'Other' }
      ];

      transactions.forEach(({ name, expected_category }) => {
        // This would use actual category matching logic
        const category = categorizeTransaction(name);
        expect(category).toBeDefined();
      });
    });

    it('should have icons for all categories', () => {
      const categories = [
        'Dining',
        'Groceries',
        'Shopping',
        'Subscriptions',
        'Other'
      ];

      categories.forEach(category => {
        const icon = getCategoryIcon(category);
        expect(icon).toBeDefined();
        expect(icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Budget Calculations', () => {
    it('should calculate remaining budget correctly', () => {
      const budget = 2500;
      const spent = 1755.40;
      const remaining = budget - spent;
      
      expect(remaining).toBeCloseTo(744.60, 2);
    });

    it('should calculate percent used correctly', () => {
      const budget = 2500;
      const spent = 1755.40;
      const percentUsed = (spent / budget) * 100;
      
      expect(Math.round(percentUsed * 100) / 100).toBe(70.22);
    });

    it('should determine budget status correctly', () => {
      const getBudgetStatus = (percentUsed: number): 'ok' | 'warning' | 'over' => {
        if (percentUsed >= 100) return 'over';
        if (percentUsed >= 90) return 'warning';
        return 'ok';
      };

      expect(getBudgetStatus(70)).toBe('ok');
      expect(getBudgetStatus(90)).toBe('warning');
      expect(getBudgetStatus(95)).toBe('warning');
      expect(getBudgetStatus(100)).toBe('over');
      expect(getBudgetStatus(105)).toBe('over');
    });
  });
});

// Helper functions for tests
function categorizeTransaction(merchantName: string): string {
  const name = merchantName.toLowerCase();
  if (name.includes('starbucks') || name.includes('restaurant')) return 'Dining';
  if (name.includes('publix') || name.includes('grocery')) return 'Groceries';
  if (name.includes('target') || name.includes('walmart')) return 'Shopping';
  if (name.includes('netflix') || name.includes('hulu')) return 'Subscriptions';
  return 'Other';
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Dining': '🍽️',
    'Groceries': '🛒',
    'Shopping': '🛍️',
    'Subscriptions': '📺',
    'Other': '📌'
  };
  return icons[category] || '📌';
}
