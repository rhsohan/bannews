import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency, formatDate } from '../../utils';
import { Button } from '../ui/Button';
import { Edit2, Trash2, Search, Filter, ChevronDown, ChevronUp, ExternalLink, Inbox } from 'lucide-react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function TransactionTable({ transactions, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState('Date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = transactions;

    if (typeFilter !== 'All') {
      result = result.filter(t => t.Type === typeFilter);
    }

    if (debouncedSearchTerm) {
      const lowerTerm = debouncedSearchTerm.toLowerCase();
      result = result.filter(t => 
        t.ID?.toLowerCase().includes(lowerTerm) ||
        t.Description?.toLowerCase().includes(lowerTerm) ||
        t.Reference?.toLowerCase().includes(lowerTerm)
      );
    }

    result = [...result].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'Date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortField === 'Amount') {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, debouncedSearchTerm, typeFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 text-brand-blue" /> : <ChevronDown className="w-4 h-4 text-brand-blue" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>Recent Transactions</CardTitle>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="text-slate-400 w-4 h-4" />
            <select 
              className="w-full sm:w-auto px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Types</option>
              <option value="Invest">Invest</option>
              <option value="Profit">Profit</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-medium cursor-pointer group" onClick={() => handleSort('ID')}>
                <div className="flex items-center gap-1">ID <SortIcon field="ID" /></div>
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer group" onClick={() => handleSort('Date')}>
                <div className="flex items-center gap-1">Date <SortIcon field="Date" /></div>
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer group" onClick={() => handleSort('Type')}>
                <div className="flex items-center gap-1">Type <SortIcon field="Type" /></div>
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer group" onClick={() => handleSort('Amount')}>
                <div className="flex items-center gap-1">Amount <SortIcon field="Amount" /></div>
              </th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium text-center">Proof</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((t) => (
                <tr key={t.ID} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{t.ID}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(t.Date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      t.Type === 'Invest' ? 'bg-brand-navy text-white' : 'bg-brand-green text-white'
                    }`}>
                      {t.Type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold ${t.Type === 'Invest' ? 'text-brand-navy' : 'text-brand-green'}`}>
                    {t.Type === 'Invest' ? '-' : '+'}{formatCurrency(t.Amount)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{t.Description}</td>
                  <td className="px-6 py-4 text-center">
                    {t['Proof Link'] ? (
                      <a 
                        href={t['Proof Link']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-1.5 text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Proof"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(t)} className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(t)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Inbox className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-lg font-medium text-slate-600 mb-1">No transactions found</p>
                    <p className="text-sm text-slate-400">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} entries
          </span>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
