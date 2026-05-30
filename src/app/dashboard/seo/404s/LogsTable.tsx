'use client';
import { useState, useTransition } from 'react';
import { resolve404Log } from '../actions';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2 } from 'lucide-react';

export function LogsTable({ initialData }: { initialData: any[] }) {
  const [logs, setLogs] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const handleResolve = async (id: string) => {
    startTransition(async () => {
      const res = await resolve404Log(id);
      if (res.success) {
        setLogs(prev => prev.map(l => l.id === id ? { ...l, resolved: true } : l));
        addToast({ title: 'Marked as resolved', type: 'success' });
      } else {
        addToast({ title: 'Update failed', description: res.error, type: 'error' });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200/60">
            <tr>
              <th className="px-6 py-4">Missing Path</th>
              <th className="px-6 py-4">Hits</th>
              <th className="px-6 py-4">Last Seen</th>
              <th className="px-6 py-4">Referrer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-900">{log.path}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{log.hit_count}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(log.last_seen).toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]" title={log.referrer}>
                  {log.referrer || '-'}
                </td>
                <td className="px-6 py-4">
                  {log.resolved ? (
                    <Badge variant="success">Resolved</Badge>
                  ) : (
                    <Badge variant="danger">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {!log.resolved && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handleResolve(log.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No 404 errors logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
