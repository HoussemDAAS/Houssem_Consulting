'use client';
import StatusColumn from './StatusColumn';

interface Client {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  email: string;
  company: string;
  phone: string;
}
export default function ClientBoard({ clients, onClientClick }: {
    clients: Client[];
    onClientClick: (client: Client) => void;
  }) {
    return (
      <div className="space-y-8">
        <StatusColumn
          status="active"
          clients={clients.filter(c => c.status === 'active')}
          onClientClick={onClientClick}
        />
        <StatusColumn
          status="inactive"
          clients={clients.filter(c => c.status === 'inactive')}
          onClientClick={onClientClick}
        />
      </div>
    );
  }