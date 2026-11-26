import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const NoticeContext = createContext(null);
export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState('');
  const showNotice = useCallback((text) => setNotice({ text, id: Math.random() }), []);
  useEffect(() => { if (!notice) return undefined; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer); }, [notice]);
  const value = useMemo(() => ({ showNotice }), [showNotice]);
  return <NoticeContext.Provider value={value}>{children}{notice && <div key={notice.id} className="notice" role="status">{notice.text}</div>}</NoticeContext.Provider>;
}
export function useNotice() {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('useNotice phải được dùng bên trong NoticeProvider');
  return context.showNotice;
}
