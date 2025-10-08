import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Service } from '../types';

export default function ServicesPage() {
  const { services, addService, updateService, deleteService } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    serviceType: 'dns' | 'dhcp' | 'ftp' | 'ssh';
    title: string;
    description: string;
    commands: string;
    notes: string;
  }>({
    serviceType: 'dns',
    title: '',
    description: '',
    commands: '',
    notes: '',
  });

  const serviceTypes = [
    { value: 'dns', label: 'DNS (Domain Name System)' },
    { value: 'dhcp', label: 'DHCP (Dynamic Host Configuration Protocol)' },
    { value: 'ftp', label: 'FTP (File Transfer Protocol)' },
    { value: 'ssh', label: 'SSH (Secure Shell)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateService(editingId, formData);
      setEditingId(null);
    } else {
      addService(formData);
      setIsAdding(false);
    }
    setFormData({
      serviceType: 'dns',
      title: '',
      description: '',
      commands: '',
      notes: '',
    });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      serviceType: service.serviceType,
      title: service.title,
      description: service.description,
      commands: service.commands,
      notes: service.notes,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      serviceType: 'dns',
      title: '',
      description: '',
      commands: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Setup</h1>
          <p className="text-slate-600 mt-1">
            Document network service configurations (DNS, DHCP, FTP, SSH)
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Service' : 'New Service Configuration'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Service Type
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {serviceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Primary DNS Server Configuration"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                placeholder="Detailed description of the service configuration..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Commands / Configuration
              </label>
              <textarea
                value={formData.commands}
                onChange={(e) => setFormData({ ...formData, commands: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 font-mono text-sm"
                placeholder="sudo systemctl start named&#10;sudo systemctl enable named&#10;..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                placeholder="Additional notes, observations, or important details..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Save'} Service
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md border border-slate-200">
            <p className="text-slate-500">
              No services configured yet. Add your first service configuration to get started.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">
                      {service.serviceType}
                    </span>
                    <span className="text-sm text-slate-500">
                      {service.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {service.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Description</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{service.description}</p>
                </div>
              )}

              {service.commands && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Commands</h4>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {service.commands}
                  </pre>
                </div>
              )}

              {service.notes && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Notes</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{service.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
