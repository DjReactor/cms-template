'use client';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FileText } from 'lucide-react';

export function CallLogsTable({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Caller Number</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(log.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{log.caller_number}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDuration(log.duration_seconds)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={log.call_status === 'completed' ? 'success' : 'default'} className="capitalize">
                      {log.call_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No call logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)}
        title="Call Details"
      >
        {selectedLog && (
          <div className="space-y-6">
            {selectedLog.recording_url && (
              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Recording</p>
                <audio controls src={selectedLog.recording_url} className="w-full" />
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-slate-900 mb-2">AI Summary</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-sm text-slate-700">
                {selectedLog.summary || 'No summary available.'}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900 mb-2">Transcript</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 h-64 overflow-y-auto space-y-4">
                {selectedLog.transcript?.length > 0 ? selectedLog.transcript.map((msg: any, i: number) => (
                  <div key={i} className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'agent' ? 'bg-white border border-slate-200 text-slate-800' : 'bg-blue-600 text-white'}`}>
                      <p className="text-xs font-semibold mb-1 opacity-70 uppercase tracking-wider">{msg.role}</p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 text-center py-4">No transcript available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
