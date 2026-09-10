const BASE_URL = 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('finlens_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Analyzers
  analyzeText: async (text, productType) => {
    const res = await fetch(`${BASE_URL}/analyze/text`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, productType })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Text analysis failed');
    }
    return res.json();
  },

  analyzeManual: async (formData) => {
    const res = await fetch(`${BASE_URL}/analyze/manual`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error('Manual analysis failed');
    return res.json();
  },

  analyzeOCR: async (file) => {
    const data = new FormData();
    data.append('image', file);
    const token = localStorage.getItem('finlens_token');
    const res = await fetch(`${BASE_URL}/analyze/ocr`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'OCR recognition failed');
    }
    return res.json();
  },

  // Comparison
  compareOffers: async (offerA, offerB, productName) => {
    const res = await fetch(`${BASE_URL}/compare`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ offerA, offerB, productName })
    });
    if (!res.ok) throw new Error('Comparison failed');
    return res.json();
  },

  // Interactive Tools
  simulateCreditCard: async (payload) => {
    const res = await fetch(`${BASE_URL}/tools/credit-card`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  simulateBNPL: async (payload) => {
    const res = await fetch(`${BASE_URL}/tools/bnpl`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  calculateSubscriptions: async (subscriptions) => {
    const res = await fetch(`${BASE_URL}/tools/subscriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ subscriptions })
    });
    return res.json();
  },

  calculateOpportunity: async (dailyExpense, returnPct) => {
    const res = await fetch(`${BASE_URL}/tools/opportunity-cost`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ dailyExpense, returnPct })
    });
    return res.json();
  },

  saveQuizScore: async (payload) => {
    const res = await fetch(`${BASE_URL}/tools/quiz-score`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // History
  getHistory: async () => {
    const res = await fetch(`${BASE_URL}/history`, { headers: getHeaders() });
    return res.json();
  },

  deleteHistoryItem: async (id) => {
    const res = await fetch(`${BASE_URL}/history/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};
