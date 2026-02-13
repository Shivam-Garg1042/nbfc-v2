import React, { useState, useMemo } from 'react';
import { useNbfcFilter } from './NbfcFilterContext';

/* Generic floating NBFC filter button
 * Props:
 * - nbfcList: array of { id, name } objects
 * - onChange: (nbfc|null) => void (optional, also fires context update)
 * - position: 'br' | 'bl' | 'tr' | 'tl' (default 'br')
 * - zIndex: number (default 50)
 * - hotkey: string (e.g. 'f') to toggle (optional)
 */
export default function FloatingNbfcFilter({ nbfcList = [], onChange, position = 'br', zIndex = 50 }) {
  const { selectedNbfc, selectNbfc, clearNbfc } = useNbfcFilter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return nbfcList;
    return nbfcList.filter(n => n.name.toLowerCase().includes(query.toLowerCase()));
  }, [nbfcList, query]);

  const apply = (nbfc) => {
    selectNbfc(nbfc);
    onChange && onChange(nbfc);
    setOpen(false);
  };
  const clear = () => {
    clearNbfc();
    onChange && onChange(null);
    setOpen(false);
  };

  const posClass = {
    br: 'bottom-6 right-6',
    bl: 'bottom-6 left-6',
    tr: 'top-6 right-6',
    tl: 'top-6 left-6'
  }[position] || 'bottom-6 right-6';

  return (
    <div className={`fixed ${posClass}`} style={{ zIndex }}>
      {/* Panel */}
      {open && (
        <div className="mb-3 w-52 rounded-4xl border border-gray-200 bg-white p-4 shadow-xl animate-fadeIn rounder-xl">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Filter by NBFC</h4>
            <button onClick={() => setOpen(false)} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
          </div>
          {/* <input
            placeholder="Search NBFC..."
            className="mb-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring"
            value={query}
            onChange={e => setQuery(e.target.value)}
          /> */}
          <div className="max-h-52 overflow-y-auto pr-1 space-y-1">
            {filtered.length === 0 && (
              <div className="py-6 text-center text-xs text-gray-400">No matches</div>
            )}
            {filtered.map(n => {
              const active = selectedNbfc && selectedNbfc.id === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => apply(n)}
                  className={`w-40 rounded-lg border px-3 py-2 text-left text-sm transition ${active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  {n.name}
                </button>
              );
            })}
          </div>
          
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981] text-white shadow-lg transition hover:bg-[#65E1F5] focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Filter by NBFC" 
      >
        <div className="relative flex flex-col items-center">
          <span className="text-lg font-bold"></span>
          <span className="mt-[-2px] text-[10px] font-semibold tracking-wide">NBFC</span>
          
        </div>
      </button>
    </div>
  );
}
