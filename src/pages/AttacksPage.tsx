import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit, Save, X, AlertTriangle } from 'lucide-react';
import { Attack } from '../types';

export default function AttacksPage() {
  const { attacks, addAttack, updateAttack, deleteAttack } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    attackType: 'arp_spoofing' | 'dns_spoofing' | 'dhcp_starvation' | 'ftp_brute_force' | 'ssh_brute_force';
    title: string;
    description: string;
    results: string;
    notes: string;
  }>({
    attackType: 'arp_spoofing',
    title: '',
    description: '',
    results: '',
    notes: '',
  });

  const attackTypes = [
    { value: 'arp_spoofing', label: 'ARP Spoofing', color: 'bg-red-500' },
    { value: 'dns_spoofing', label: 'DNS Spoofing', color: 'bg-orange-500' },
    { value: 'dhcp_starvation', label: 'DHCP Starvation', color: 'bg-yellow-500' },
    { value: 'ftp_brute_force', label: 'FTP Brute Force', color: 'bg-purple-500' },
    { value: 'ssh_brute_force', label: 'SSH Brute Force', color: 'bg-pink-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAttack(editingId, formData);
      setEditingId(null);
    } else {
      addAttack(formData);
      setIsAdding(false);
    }
    setFormData({
      attackType: 'arp_spoofing',
      title: '',
      description: '',
      results: '',
      notes: '',
    });
  };

  const handleEdit = (attack: Attack) => {
    setEditingId(attack.id);
    setFormData({
      attackType: attack.attackType,
      title: attack.title,
      description: attack.description,
      results: attack.results,
      notes: attack.notes,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      attackType: 'arp_spoofing',
      title: '',
      description: '',
      results: '',
      notes: '',
    });
  };

  const getAttackTypeLabel = (type: string) => {
    return attackTypes.find((t) => t.value === type)?.label || type;
  };

  const getAttackTypeColor = (type: string) => {
    return attackTypes.find((t) => t.value === type)?.color || 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attack Simulations</h1>
          <p className="text-slate-600 mt-1">
            Document cyberattack simulations and their results
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Attack
          </button>
        )}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">Ethical Use Only</h3>
            <p className="text-sm text-orange-800">
              All attack simulations must be conducted in isolated lab environments with
              proper authorization. Unauthorized access to systems is illegal and unethical.
            </p>
          </div>
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Attack Simulation' : 'New Attack Simulation'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Attack Type
              </label>
              <select
                value={formData.attackType}
                onChange={(e) =>
                  setFormData({ ...formData, attackType: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                {attackTypes.map((type) => (
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., ARP Spoofing Between Router and Client"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Methodology / Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32"
                placeholder="Describe the attack methodology, tools used, and attack steps..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Results / Observations
              </label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32"
                placeholder="Document the attack results, what was compromised, detection mechanisms..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-20"
                placeholder="Additional notes, lessons learned, or recommendations..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Save'} Attack
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
        {attacks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-md border border-slate-200">
            <p className="text-slate-500">
              No attack simulations documented yet. Add your first simulation to get started.
            </p>
          </div>
        ) : (
          attacks.map((attack) => (
            <div
              key={attack.id}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`${getAttackTypeColor(
                        attack.attackType
                      )} px-3 py-1 text-white rounded-full text-xs font-medium`}
                    >
                      {getAttackTypeLabel(attack.attackType)}
                    </span>
                    <span className="text-sm text-slate-500">
                      {attack.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{attack.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(attack)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteAttack(attack.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {attack.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Methodology</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{attack.description}</p>
                </div>
              )}

              {attack.results && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Results</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{attack.results}</p>
                </div>
              )}

              {attack.notes && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Notes</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{attack.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
