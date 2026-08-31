export function ClientsPage() {
  const clients = [
    { name: 'Karim J.', type: 'Premium', value: '€18.4k' },
    { name: 'Nadia P.', type: 'Particulier', value: '€9.8k' },
    { name: 'Hassan A.', type: 'Business', value: '€24.7k' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Clients</h2>
      {clients.map((client) => (
        <div key={client.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div>
            <p className="font-semibold text-white">{client.name}</p>
            <p className="text-sm text-slate-400">{client.type}</p>
          </div>
          <span className="text-sm font-medium text-amber-300">{client.value}</span>
        </div>
      ))}
    </div>
  );
}
