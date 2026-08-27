import { useState, useEffect, useCallback } from 'react';
import { fetchTransactions, addTransaction as addApi, updateTransaction as updateApi, deleteTransaction as deleteApi } from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactions();
      // Ensure date strings are properly parsed, or we can just keep them as strings.
      // Sort by date descending
      const sortedData = data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      setTransactions(sortedData);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTransaction = async (data) => {
    try {
      const res = await addApi(data);
      if (res.error) throw new Error(res.error);
      await loadData(); // Reload to get fresh data with IDs
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTransaction = async (data) => {
    try {
      const res = await updateApi(data);
      if (res.error) throw new Error(res.error);
      await loadData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await deleteApi(id);
      if (res.error) throw new Error(res.error);
      await loadData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: loadData
  };
}
