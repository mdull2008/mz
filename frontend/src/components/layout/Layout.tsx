import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface Props {
  children: ReactNode;
  rightPanel?: ReactNode;
  wide?: boolean;
}

export default function Layout({ children, rightPanel, wide }: Props) {
  return (
    <div className="min-h-screen bg-surface-950 flex">
      <Sidebar />
      <main className={`ml-64 flex-1 flex ${wide ? '' : 'max-w-5xl mx-auto'}`}>
        <div className={`flex-1 min-h-screen border-r border-white/5 ${wide ? 'max-w-3xl' : ''}`}>
          {children}
        </div>
        {rightPanel && (
          <div className="w-80 xl:w-96 hidden lg:block">
            <div className="sticky top-0 p-4 space-y-4">
              {rightPanel}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
