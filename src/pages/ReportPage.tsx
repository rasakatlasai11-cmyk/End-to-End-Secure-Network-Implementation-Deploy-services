import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, CheckSquare, Square } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportPage() {
  const { services, attacks, artifacts, analysisResults } = useApp();
  const [reportTitle, setReportTitle] = useState('Network Security Lab Report');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedAttacks, setSelectedAttacks] = useState<Set<string>>(new Set());
  const [selectedArtifacts, setSelectedArtifacts] = useState<Set<string>>(new Set());
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSelection = (set: Set<string>, id: string) => {
    const newSet = new Set(set);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    return newSet;
  };

  const selectAll = (items: any[], setter: (set: Set<string>) => void) => {
    setter(new Set(items.map((item) => item.id)));
  };

  const deselectAll = (setter: (set: Set<string>) => void) => {
    setter(new Set());
  };

  const generatePDF = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const doc = new jsPDF();
      let yPos = 20;

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(reportTitle, 105, yPos, { align: 'center' });
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
      yPos += 15;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 14, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summary = `This report documents the end-to-end secure network implementation project, including service configurations, attack simulations, and security analysis findings.`;
      const splitSummary = doc.splitTextToSize(summary, 180);
      doc.text(splitSummary, 14, yPos);
      yPos += splitSummary.length * 5 + 10;

      if (selectedServices.size > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Service Configurations', 14, yPos);
        yPos += 10;

        services
          .filter((s) => selectedServices.has(s.id))
          .forEach((service) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${service.serviceType.toUpperCase()}: ${service.title}`, 14, yPos);
            yPos += 6;

            if (service.description) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              const desc = doc.splitTextToSize(service.description, 180);
              doc.text(desc, 14, yPos);
              yPos += desc.length * 5 + 5;
            }

            if (service.commands) {
              doc.setFontSize(9);
              doc.setFont('courier', 'normal');
              const cmds = doc.splitTextToSize(service.commands, 180);
              doc.text(cmds, 14, yPos);
              yPos += cmds.length * 4 + 8;
            }
          });

        yPos += 5;
      }

      if (selectedAttacks.size > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Attack Simulations', 14, yPos);
        yPos += 10;

        attacks
          .filter((a) => selectedAttacks.has(a.id))
          .forEach((attack) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${attack.attackType.replace('_', ' ').toUpperCase()}: ${attack.title}`, 14, yPos);
            yPos += 6;

            if (attack.description) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.text('Methodology:', 14, yPos);
              yPos += 5;
              const desc = doc.splitTextToSize(attack.description, 180);
              doc.text(desc, 14, yPos);
              yPos += desc.length * 5 + 3;
            }

            if (attack.results) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.text('Results:', 14, yPos);
              yPos += 5;
              const results = doc.splitTextToSize(attack.results, 180);
              doc.text(results, 14, yPos);
              yPos += results.length * 5 + 8;
            }
          });

        yPos += 5;
      }

      if (selectedArtifacts.size > 0) {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Artifacts', 14, yPos);
        yPos += 10;

        const artifactData = artifacts
          .filter((a) => selectedArtifacts.has(a.id))
          .map((a) => [
            a.filename,
            a.fileType.toUpperCase(),
            `${(a.fileSize / 1024).toFixed(2)} KB`,
            a.createdAt.toLocaleDateString(),
          ]);

        autoTable(doc, {
          head: [['Filename', 'Type', 'Size', 'Date']],
          body: artifactData,
          startY: yPos,
          theme: 'grid',
          styles: { fontSize: 9 },
          headStyles: { fillColor: [59, 130, 246] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      if (includeAnalysis && analysisResults.length > 0) {
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Security Analysis Findings', 14, yPos);
        yPos += 10;

        const criticalCount = analysisResults.filter((r) => r.severity === 'critical').length;
        const highCount = analysisResults.filter((r) => r.severity === 'high').length;
        const mediumCount = analysisResults.filter((r) => r.severity === 'medium').length;
        const lowCount = analysisResults.filter((r) => r.severity === 'low').length;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Analyses Performed: ${analysisResults.length}`, 14, yPos);
        yPos += 6;
        doc.text(`Critical Findings: ${criticalCount}`, 14, yPos);
        yPos += 5;
        doc.text(`High Severity: ${highCount}`, 14, yPos);
        yPos += 5;
        doc.text(`Medium Severity: ${mediumCount}`, 14, yPos);
        yPos += 5;
        doc.text(`Low Severity: ${lowCount}`, 14, yPos);
        yPos += 10;

        const criticalAndHigh = analysisResults.filter(
          (r) => r.severity === 'critical' || r.severity === 'high'
        );

        if (criticalAndHigh.length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Critical and High Severity Findings:', 14, yPos);
          yPos += 8;

          criticalAndHigh.forEach((result) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }

            const artifact = artifacts.find((a) => a.id === result.artifactId);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`[${result.severity.toUpperCase()}] ${artifact?.filename || 'Unknown'}`, 14, yPos);
            yPos += 5;

            doc.setFont('helvetica', 'normal');
            const summary = doc.splitTextToSize(result.summary, 180);
            doc.text(summary, 14, yPos);
            yPos += summary.length * 5 + 6;
          });
        }
      }

      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Conclusion', 14, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const conclusion = `This report documents the complete network security implementation and testing process. All activities were conducted in a controlled lab environment for educational purposes. The findings demonstrate the importance of proper security configurations, monitoring, and defense mechanisms in production networks.`;
      const splitConclusion = doc.splitTextToSize(conclusion, 180);
      doc.text(splitConclusion, 14, yPos);

      const filename = `${reportTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      doc.save(filename);

      setIsGenerating(false);
    }, 1000);
  };

  const hasContent =
    selectedServices.size > 0 ||
    selectedAttacks.size > 0 ||
    selectedArtifacts.size > 0 ||
    (includeAnalysis && analysisResults.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Report Generator</h1>
        <p className="text-slate-600 mt-1">
          Generate comprehensive PDF reports from your lab activities
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Report Configuration</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Report Title
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter report title"
          />
        </div>
      </div>

      {services.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Services ({selectedServices.size}/{services.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => selectAll(services, setSelectedServices)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => deselectAll(setSelectedServices)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() =>
                  setSelectedServices(toggleSelection(selectedServices, service.id))
                }
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border border-slate-200"
              >
                {selectedServices.has(service.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{service.title}</div>
                  <div className="text-sm text-slate-600">{service.serviceType.toUpperCase()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {attacks.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Attacks ({selectedAttacks.size}/{attacks.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => selectAll(attacks, setSelectedAttacks)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => deselectAll(setSelectedAttacks)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {attacks.map((attack) => (
              <button
                key={attack.id}
                onClick={() =>
                  setSelectedAttacks(toggleSelection(selectedAttacks, attack.id))
                }
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border border-slate-200"
              >
                {selectedAttacks.has(attack.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{attack.title}</div>
                  <div className="text-sm text-slate-600">
                    {attack.attackType.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {artifacts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Artifacts ({selectedArtifacts.size}/{artifacts.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => selectAll(artifacts, setSelectedArtifacts)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => deselectAll(setSelectedArtifacts)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {artifacts.map((artifact) => (
              <button
                key={artifact.id}
                onClick={() =>
                  setSelectedArtifacts(toggleSelection(selectedArtifacts, artifact.id))
                }
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border border-slate-200"
              >
                {selectedArtifacts.has(artifact.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{artifact.filename}</div>
                  <div className="text-sm text-slate-600">{artifact.fileType.toUpperCase()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {analysisResults.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncludeAnalysis(!includeAnalysis)}
              className="flex-shrink-0"
            >
              {includeAnalysis ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Include Analysis Findings ({analysisResults.length})
              </h2>
              <p className="text-sm text-slate-600">
                Add automated security analysis results to the report
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <button
          onClick={generatePDF}
          disabled={!hasContent || isGenerating}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generate PDF Report
            </>
          )}
        </button>
        {!hasContent && (
          <p className="text-sm text-slate-500 text-center mt-3">
            Select at least one item to include in the report
          </p>
        )}
      </div>
    </div>
  );
}
