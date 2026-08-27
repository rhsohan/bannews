const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export async function fetchTransactions() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function addTransaction(transactionData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'ADD',
        data: transactionData,
      }),
    });
    
    // Sometimes Google Apps Script returns an opaque response in no-cors mode,
    // but with our apps script returning JSON, standard fetch works if we handle redirects correctly.
    // fetch follows redirects by default which is what GAS uses.
    
    if (!response.ok) throw new Error('Failed to add transaction');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

export async function updateTransaction(transactionData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'UPDATE',
        data: transactionData,
      }),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(id) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'DELETE',
        data: { id },
      }),
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
