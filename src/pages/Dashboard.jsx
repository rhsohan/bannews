import React, { useState } from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { useTransactions } from '../hooks/useTransactions';
import { Button } from '../components/ui/Button';
import { Plus, Download, RefreshCw, Loader2, X, LayoutDashboard, List } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { formatDate, formatCurrency } from '../utils';

export function Dashboard() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, refresh } = useTransactions();
  const { addToast } = useToast();
  
  const [modalState, setModalState] = useState({ isOpen: false, type: 'Invest', transaction: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleOpenModal = (type, transaction = null) => {
    setModalState({ isOpen: true, type, transaction });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: 'Invest', transaction: null });
  };

  const handleSaveTransaction = async (data) => {
    const isEdit = !!modalState.transaction;
    
    let result;
    if (isEdit) {
      console.log('Editing transaction:', { ...data, id: modalState.transaction.ID });
      result = await updateTransaction({ ...data, id: modalState.transaction.ID });
    } else {
      console.log('Adding transaction:', data);
      result = await addTransaction(data);
    }

    if (result.success) {
      addToast({
        title: 'Success',
        description: `Transaction ${isEdit ? 'updated' : 'added'} successfully.`,
        type: 'success'
      });
    } else {
      addToast({
        title: 'Error',
        description: result.error || 'Failed to save transaction.',
        type: 'error'
      });
    }
  };

  const handleDelete = (t) => {
    setDeleteConfirm(t);
    setPinInput('');
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    const result = await deleteTransaction(deleteConfirm.ID);
    if (result.success) {
      addToast({
        title: 'Success',
        description: 'Transaction deleted successfully.',
        type: 'success'
      });
    } else {
      addToast({
        title: 'Error',
        description: result.error || 'Failed to delete transaction.',
        type: 'error'
      });
    }
    setDeleteConfirm(null);
    setPinInput('');
  };

  const exportCSV = () => {
    if (!transactions.length) return;
    
    const headers = ['ID', 'Date', 'Type', 'Amount', 'Description', 'Reference'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.ID, 
        t.Date, 
        t.Type, 
        t.Amount, 
        `"${t.Description || ''}"`, 
        `"${t.Reference || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BanNews_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    addToast({ title: 'Exported', description: 'CSV downloaded successfully.', type: 'info' });
  };

  if (error && !transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 max-w-md">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={refresh} variant="outline" className="bg-white">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-brand-bg font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 lg:gap-8">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="BanNews Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
              <h1 className="text-xl font-bold text-brand-navy hidden lg:block whitespace-nowrap">BanNews Tracker</h1>
            </div>
            
            <div className="inline-flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 shadow-inner">
              <button 
                onClick={() => setActiveTab('home')}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'home' ? 'text-brand-blue bg-white shadow-sm ring-1 ring-slate-900/5 scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'transactions' ? 'text-brand-blue bg-white shadow-sm ring-1 ring-slate-900/5 scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95'}`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Transactions</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-full sm:w-auto gap-2 sm:gap-3">
            <Button variant="outline" size="icon" onClick={refresh} disabled={loading} title="Refresh Data">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-blue' : 'text-slate-600'}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={exportCSV} title="Export CSV" className="hidden sm:flex">
              <Download className="w-4 h-4 text-slate-600" />
            </Button>
            <Button variant="primary" onClick={() => handleOpenModal('Invest')} className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-1" /> Add Invest
            </Button>
            <Button variant="success" onClick={() => handleOpenModal('Profit')} className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-1" /> Add Profit
            </Button>
            {/* Mobile Actions */}
            <Button variant="primary" onClick={() => handleOpenModal('Invest')} className="sm:hidden flex-1 flex justify-center">
              <Plus className="w-4 h-4 mr-1" /> Invest
            </Button>
            <Button variant="success" onClick={() => handleOpenModal('Profit')} className="sm:hidden flex-1 flex justify-center">
              <Plus className="w-4 h-4 mr-1" /> Profit
            </Button>
          </div>
        </div>

      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading && !transactions.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-blue" />
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' ? (
              <>
                <DashboardStats transactions={transactions} />
                <DashboardCharts transactions={transactions} />
              </>
            ) : (
              <TransactionTable 
                transactions={transactions} 
                onEdit={(t) => handleOpenModal(t.Type, t)} 
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </main>

      <TransactionModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        transaction={modalState.transaction}
        type={modalState.type}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Transaction?</h3>
            <p className="text-slate-600 text-sm mb-4">
              Are you sure you want to delete {deleteConfirm.ID} ({formatCurrency(deleteConfirm.Amount)})? This action cannot be undone.
            </p>
            
            <div className="mb-6 text-left">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Admin PIN Required
              </label>
              <input
                type="password"
                placeholder="Enter 4-digit PIN"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={4}
              />
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="ghost" onClick={() => { setDeleteConfirm(null); setPinInput(''); }}>Cancel</Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
                disabled={pinInput !== import.meta.env.VITE_ADMIN_PIN}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
