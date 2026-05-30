'use client';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function TopBar({ userDisplayName, userRole }: { userDisplayName: string, userRole: string }) {
  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        {userRole === 'agency_admin' && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
            Agency Admin Mode
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 ring-2 ring-white shadow-sm">
            <User className="h-4 w-4" />
          </div>
          {userDisplayName}
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <form action="/api/auth/logout" method="POST">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600 hover:bg-red-50" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </form>
      </div>
    </header>
  );
}
