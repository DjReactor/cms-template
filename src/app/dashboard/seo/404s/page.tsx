import { get404Logs } from '../actions';
import { LogsTable } from './LogsTable';

export default async function NotFoundLogsPage() {
  const logs = await get404Logs();
  
  return (
    <div className="space-y-6">
      <LogsTable initialData={logs} />
    </div>
  );
}
