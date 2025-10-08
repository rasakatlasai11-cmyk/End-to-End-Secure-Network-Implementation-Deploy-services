import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyzeArtifact } from '../utils/analyzer';

export default function AnalysisPage() {
  const { artifacts, analysisResults, addAnalysisResult } = useApp();
  const [selectedArtifact, setSelectedArtifact] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!selectedArtifact) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const artifact = artifacts.find((a) => a.id === selectedArtifact);
      if (artifact) {
        const { findings, summary, severity } = analyzeArtifact(artifact);
        addAnalysisResult({
          artifactId: artifact.id,
          analysisType: `${artifact.fileType}_analysis`,
          findings,
          summary,
          severity,
        });
      }
      setIsAnalyzing(false);
      setSelectedArtifact('');
    }, 1500);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const severityData = [
    {
      name: 'Critical',
      count: analysisResults.filter((r) => r.severity === 'critical').length,
      color: '#dc2626',
    },
    {
      name: 'High',
      count: analysisResults.filter((r) => r.severity === 'high').length,
      color: '#ea580c',
    },
    {
      name: 'Medium',
      count: analysisResults.filter((r) => r.severity === 'medium').length,
      color: '#ca8a04',
    },
    {
      name: 'Low',
      count: analysisResults.filter((r) => r.severity === 'low').length,
      color: '#16a34a',
    },
  ].filter((d) => d.count > 0);

  const keywordData = analysisResults
    .flatMap((r) => r.findings.keywords || [])
    .reduce((acc: any[], kw) => {
      const existing = acc.find((item) => item.keyword === kw.keyword);
      if (existing) {
        existing.count += kw.count;
      } else {
        acc.push({ ...kw });
      }
      return acc;
    }, [])
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analysis</h1>
        <p className="text-slate-600 mt-1">
          Automated pattern detection and security findings from uploaded artifacts
        </p>
      </div>

      {artifacts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-md border border-slate-200">
          <p className="text-slate-500">
            No artifacts available for analysis. Upload artifacts first to perform analysis.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Run Analysis</h2>
            <div className="flex gap-4">
              <select
                value={selectedArtifact}
                onChange={(e) => setSelectedArtifact(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select an artifact to analyze</option>
                {artifacts.map((artifact) => (
                  <option key={artifact.id} value={artifact.id}>
                    {artifact.filename} ({artifact.fileType})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAnalyze}
                disabled={!selectedArtifact || isAnalyzing}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {analysisResults.length > 0 && (
            <>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">Total Analyses</div>
                  <div className="text-3xl font-bold text-slate-900">
                    {analysisResults.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">Critical Findings</div>
                  <div className="text-3xl font-bold text-red-600">
                    {analysisResults.filter((r) => r.severity === 'critical').length}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">High Severity</div>
                  <div className="text-3xl font-bold text-orange-600">
                    {analysisResults.filter((r) => r.severity === 'high').length}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">Artifacts Analyzed</div>
                  <div className="text-3xl font-bold text-slate-900">
                    {new Set(analysisResults.map((r) => r.artifactId)).size}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {severityData.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Findings by Severity
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={severityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {keywordData.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Security Keywords Detected
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={keywordData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="keyword" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8b5cf6" name="Occurrences" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
                {analysisResults
                  .slice()
                  .reverse()
                  .map((result) => {
                    const artifact = artifacts.find((a) => a.id === result.artifactId);
                    return (
                      <div
                        key={result.id}
                        className={`bg-white rounded-xl p-6 shadow-md border-2 ${getSeverityColor(
                          result.severity
                        )}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(result.severity)}
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">
                                {artifact?.filename || 'Unknown File'}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-600">
                                  {result.analysisType.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className="text-sm text-slate-400">•</span>
                                <span className="text-sm text-slate-600">
                                  {result.createdAt.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold uppercase`}
                          >
                            {result.severity}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Summary</h4>
                          <p className="text-slate-800">{result.summary}</p>
                        </div>

                        {result.findings.patterns && result.findings.patterns.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">
                              Detected Patterns
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                              {result.findings.patterns.map((pattern: string, idx: number) => (
                                <li key={idx} className="text-slate-700">
                                  {pattern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.findings.totalLines && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {result.findings.totalLines > 0 && (
                              <div>
                                <div className="text-slate-600">Total Lines</div>
                                <div className="text-lg font-bold text-slate-900">
                                  {result.findings.totalLines}
                                </div>
                              </div>
                            )}
                            {result.findings.failedLogins !== undefined && (
                              <div>
                                <div className="text-slate-600">Failed Logins</div>
                                <div className="text-lg font-bold text-red-600">
                                  {result.findings.failedLogins}
                                </div>
                              </div>
                            )}
                            {result.findings.successfulLogins !== undefined && (
                              <div>
                                <div className="text-slate-600">Successful Logins</div>
                                <div className="text-lg font-bold text-green-600">
                                  {result.findings.successfulLogins}
                                </div>
                              </div>
                            )}
                            {result.findings.uniqueIPs && result.findings.uniqueIPs.length > 0 && (
                              <div>
                                <div className="text-slate-600">Unique IPs</div>
                                <div className="text-lg font-bold text-slate-900">
                                  {result.findings.uniqueIPs.length}
                                </div>
                              </div>
                            )}
                            {result.findings.dhcpDiscoverCount !== undefined && (
                              <div>
                                <div className="text-slate-600">DHCP Discovers</div>
                                <div className="text-lg font-bold text-slate-900">
                                  {result.findings.dhcpDiscoverCount}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
