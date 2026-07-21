import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = ({ children, lastUpdated, isSyncing }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-dark text-slate-900 font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar lastUpdated={lastUpdated} isSyncing={isSyncing} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-8 space-y-8 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
