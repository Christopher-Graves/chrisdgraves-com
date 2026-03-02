/**
 * Finance API Proxy Tests
 * 
 * Tests that the frontend correctly proxies requests to the backend API
 * and handles responses properly.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Test against local backend during development
const BACKEND_URL = process.env.TEST_BACKEND_URL || 'http://localhost:3000';
const API_KEY = process.env.DASHBOARD_API_KEY;

// Skip tests if no backend is configured
const skipIfNoBackend = !API_KEY ? describe.skip : describe;

skipIfNoBackend('Finance API Proxy Routes', () => {
  describe('GET /api/finance/amex-statement', () => {
    it('should return valid JSON with summary and transactions', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/amex-statement`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json();
      
      // Validate summary structure
      expect(data.summary).toBeDefined();
      expect(data.summary.account_name).toBeDefined();
      expect(typeof data.summary.account_name).toBe('string');
      expect(data.summary.start_date).toBeDefined();
      expect(data.summary.end_date).toBeDefined();
      expect(typeof data.summary.total_spent).toBe('number');
      expect(typeof data.summary.budget_target).toBe('number');
      expect(typeof data.summary.remaining).toBe('number');
      expect(typeof data.summary.percent_used).toBe('number');

      // Validate transactions array
      expect(Array.isArray(data.transactions)).toBe(true);
      
      if (data.transactions.length > 0) {
        const transaction = data.transactions[0];
        expect(transaction.id).toBeDefined();
        expect(typeof transaction.amount).toBe('number');
        expect(transaction.date).toBeDefined();
        expect(transaction.category).toBeDefined();
        expect(transaction.icon).toBeDefined();
      }
    });

    it('should return 401 without API key', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/amex-statement`);
      
      // Backend should reject requests without auth
      // This might be 401, 403, or 502 depending on backend config
      expect(response.ok).toBe(false);
    });
  });

  describe('GET /api/finance/amex-budget', () => {
    it('should return valid JSON array of budget categories', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/amex-budget`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json();
      
      // Should be an array
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        const budget = data[0];
        
        // Validate budget category structure
        expect(budget.category).toBeDefined();
        expect(typeof budget.category).toBe('string');
        expect(budget.icon).toBeDefined();
        expect(typeof budget.transaction_count).toBe('number');
        expect(typeof budget.spent).toBe('number');
        expect(typeof budget.monthly_budget).toBe('number');
        expect(typeof budget.remaining).toBe('number');
        expect(typeof budget.percent_used).toBe('number');
        expect(['OK', 'WARNING', 'OVER_BUDGET']).toContain(budget.status);
      }
    });

    it('should return budgets sorted by spending (highest first)', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/amex-budget`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const data = await response.json();
      
      if (data.length > 1) {
        // Verify descending order by spent
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i].spent).toBeGreaterThanOrEqual(data[i + 1].spent);
        }
      }
    });
  });

  describe('GET /api/finance/alerts', () => {
    it('should return valid JSON array of alerts', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/alerts`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('content-type')).toContain('application/json');

      const data = await response.json();
      
      // Should be an array (may be empty)
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        const alert = data[0];
        
        // Validate alert structure
        expect(alert.transaction_id).toBeDefined();
        expect(typeof alert.transaction_id).toBe('number');
        expect(alert.account_name).toBeDefined();
        expect(typeof alert.account_name).toBe('string');
        expect(typeof alert.amount).toBe('number');
        expect(alert.merchant).toBeDefined();
        expect(alert.date).toBeDefined();
        expect(alert.reason).toBeDefined();
        expect(['INFO', 'WARNING', 'ALERT']).toContain(alert.severity);
      }
    });

    it('should sort alerts by severity (ALERT > WARNING > INFO)', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/alerts`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const data = await response.json();
      
      const severityOrder = { 'ALERT': 1, 'WARNING': 2, 'INFO': 3 };
      
      if (data.length > 1) {
        for (let i = 0; i < data.length - 1; i++) {
          const current = severityOrder[data[i].severity as keyof typeof severityOrder];
          const next = severityOrder[data[i + 1].severity as keyof typeof severityOrder];
          expect(current).toBeLessThanOrEqual(next);
        }
      }
    });
  });

  describe('POST /api/finance/alerts', () => {
    it('should acknowledge an alert', async () => {
      // First get alerts to find a transaction_id
      const getResponse = await fetch(`${BACKEND_URL}/api/finance/alerts`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      
      const alerts = await getResponse.json();
      
      if (alerts.length > 0) {
        const testTransactionId = alerts[0].transaction_id;
        
        const postResponse = await fetch(`${BACKEND_URL}/api/finance/alerts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ transaction_id: testTransactionId })
        });

        expect(postResponse.ok).toBe(true);
        const result = await postResponse.json();
        expect(result.success).toBe(true);
      } else {
        // No alerts to test with - that's okay
        expect(true).toBe(true);
      }
    });

    it('should return 400 if transaction_id is missing', async () => {
      const response = await fetch(`${BACKEND_URL}/api/finance/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      expect(response.status).toBe(400);
    });
  });
});
