import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function TransactionModal({ isOpen, onClose, onSave, transaction, type = 'Invest' }) {
  const isEdit = !!transaction;
  
  const [formData, setFormData] = useState({
    Date: '',
    Type: type,
    Amount: '',
    Description: '',
    Reference: '',
    Proof: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setFormData({ 
          ...transaction,
          Proof: transaction['Proof Link'] || ''
        });
      } else {
        // Default to today
        const today = new Date().toISOString().split('T')[0];
        // Ensure format DD-MMM-YYYY if we wanted, but standard input type="date" uses YYYY-MM-DD
        // So we will keep it as YYYY-MM-DD for the form, then convert it before saving
        
        let initialDate = '';
        if (transaction?.Date) {
          // parse DD-MMM-YYYY back to YYYY-MM-DD for input
          const d = new Date(transaction.Date);
          if (!isNaN(d)) initialDate = d.toISOString().split('T')[0];
        } else {
          initialDate = today;
        }

        setFormData({
          Date: initialDate,
          Type: type,
          Amount: '',
          Description: '',
          Reference: '',
          Proof: ''
        });
      }
      setError('');
      setPinInput('');
    }
  }, [isOpen, transaction, type, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.Date || !formData.Amount) {
      setError('Date and Amount are required.');
      return;
    }

    if (Number(formData.Amount) <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    try {
      setLoading(true);
      
      // format date to DD-MMM-YYYY before saving
      const d = new Date(formData.Date);
      const formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
      
      const payload = {
        ...formData,
        Date: formattedDate,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, Date: e.target.value }));
  };

  // Convert for input value
  let inputValueDate = formData.Date;
  if (inputValueDate) {
    const d = new Date(inputValueDate);
    if (!isNaN(d)) {
      inputValueDate = d.toISOString().split('T')[0];
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Edit Transaction' : `Add ${type}`}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                <input 
                  type="date"
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  value={inputValueDate}
                  onChange={handleDateChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (৳) *</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={formData.Amount}
                  onChange={e => setFormData(prev => ({ ...prev, Amount: e.target.value }))}
                />
              </div>
            </div>
            
            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue bg-slate-50"
                  value={formData.Type}
                  disabled
                >
                  <option value="Invest">Invest</option>
                  <option value="Profit">Profit</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input 
                type="text"
                placeholder="Brief description"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                value={formData.Description}
                onChange={e => setFormData(prev => ({ ...prev, Description: e.target.value }))}
              />
            </div>
            

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proof Link (Google Drive)</label>
              <input 
                type="url"
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                value={formData.Proof || ''}
                onChange={e => setFormData(prev => ({ ...prev, Proof: e.target.value }))}
              />
            </div>
            
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Admin PIN Required to Save
              </label>
              <input
                type="password"
                placeholder="Enter 4-digit PIN"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={4}
                required
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || pinInput !== import.meta.env.VITE_ADMIN_PIN} 
              className="min-w-[100px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
