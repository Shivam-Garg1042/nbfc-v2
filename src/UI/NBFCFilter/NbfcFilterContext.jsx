import React, { createContext, useContext, useState, useCallback } from 'react';

const NbfcFilterContext = createContext(undefined);

export const NbfcFilterProvider = ({ children, initial = null }) => {
  const [selectedNbfc, setSelectedNbfc] = useState(initial);
  const selectNbfc = useCallback((nbfc) => setSelectedNbfc(nbfc), []);
  const clearNbfc = useCallback(() => setSelectedNbfc(null), []);
  return (
    <NbfcFilterContext.Provider value={{ selectedNbfc, selectNbfc, clearNbfc }}>
      {children}
    </NbfcFilterContext.Provider>
  );
};

export const useNbfcFilter = () => {
  const ctx = useContext(NbfcFilterContext);
  if (!ctx) throw new Error('useNbfcFilter must be used within NbfcFilterProvider');
  return ctx;
};
