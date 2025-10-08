import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Trash2, FileText, Image, File } from 'lucide-react';

export default function ArtifactsPage() {
  const { artifacts, addArtifact, deleteArtifact } = useApp();
  const [formData, setFormData] = useState({
    fileType: 'log' as const,
    notes: '',
    relatedService: '',
    relatedAttack: '',
  });

  const fileTypes = [
    { value: 'log', label: 'Log File', icon: FileText },
    { value: 'pcap', label: 'PCAP (Packet Capture)', icon: File },
    { value: 'screenshot', label: 'Screenshot', icon: Image },
    { value: 'other', label: 'Other', icon: File },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result as string;
      addArtifact({
        filename: file.name,
        fileType: formData.fileType,
        fileData,
        fileSize: file.size,
        notes: formData.notes,
        relatedService: formData.relatedService || undefined,
        relatedAttack: formData.relatedAttack || undefined,
      });
      setFormData({
        fileType: 'log',
        notes: '',
        relatedService: '',
        relatedAttack: '',
      });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const fileType = fileTypes.find((t) => t.value === type);
    return fileType?.icon || File;
  };

  const downloadFile = (artifact: typeof artifacts[0]) => {
    const link = document.createElement('a');
    link.href = artifact.fileData;
    link.download = artifact.filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Artifacts</h1>
        <p className="text-slate-600 mt-1">
          Upload and manage logs, PCAPs, screenshots, and other files
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Upload New Artifact</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              File Type
            </label>
            <select
              value={formData.fileType}
              onChange={(e) =>
                setFormData({ ...formData, fileType: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {fileTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Related Service (optional)
              </label>
              <input
                type="text"
                value={formData.relatedService}
                onChange={(e) =>
                  setFormData({ ...formData, relatedService: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., DNS, DHCP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Related Attack (optional)
              </label>
              <input
                type="text"
                value={formData.relatedAttack}
                onChange={(e) =>
                  setFormData({ ...formData, relatedAttack: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., ARP Spoofing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-20"
              placeholder="Brief description of this artifact..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    Logs, PCAPs, screenshots, or any file type
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="*/*"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Uploaded Artifacts ({artifacts.length})
          </h2>
        </div>

        {artifacts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">
              No artifacts uploaded yet. Upload your first file to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Related
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {artifacts.map((artifact) => {
                  const Icon = getFileIcon(artifact.fileType);
                  return (
                    <tr key={artifact.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <button
                            onClick={() => downloadFile(artifact)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                          >
                            {artifact.filename}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium uppercase">
                          {artifact.fileType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatFileSize(artifact.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {artifact.relatedService && (
                          <div className="text-xs">Service: {artifact.relatedService}</div>
                        )}
                        {artifact.relatedAttack && (
                          <div className="text-xs">Attack: {artifact.relatedAttack}</div>
                        )}
                        {!artifact.relatedService && !artifact.relatedAttack && (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {artifact.notes || <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {artifact.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => deleteArtifact(artifact.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
