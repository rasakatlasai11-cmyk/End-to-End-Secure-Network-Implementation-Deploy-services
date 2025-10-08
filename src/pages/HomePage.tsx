import { Shield, Server, Swords, FileUp, LineChart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      icon: Server,
      title: 'Service Setup',
      description: 'Document DNS, DHCP, FTP, and SSH service configurations',
      path: '/services',
      color: 'bg-blue-500',
    },
    {
      icon: Swords,
      title: 'Attack Simulations',
      description: 'Record ARP spoofing, DHCP starvation, and brute-force attacks',
      path: '/attacks',
      color: 'bg-red-500',
    },
    {
      icon: FileUp,
      title: 'Artifacts',
      description: 'Upload and manage logs, PCAPs, and screenshots',
      path: '/artifacts',
      color: 'bg-green-500',
    },
    {
      icon: LineChart,
      title: 'Analysis',
      description: 'Automated pattern detection and security findings',
      path: '/analysis',
      color: 'bg-purple-500',
    },
    {
      icon: FileText,
      title: 'Report Generator',
      description: 'Create comprehensive PDF reports from your findings',
      path: '/report',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl shadow-xl">
            <Shield className="w-16 h-16 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-slate-900">
          End-to-End Secure Network Implementation
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          A comprehensive educational platform for documenting, simulating, and analyzing
          secure network services and cybersecurity attack scenarios in controlled lab environments.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.path}
              to={feature.path}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-200 hover:border-slate-300"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Overview</h2>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            This platform provides a structured approach to implementing and testing secure
            network infrastructure. It enables cybersecurity students and professionals to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Configure and document essential network services (DNS, DHCP, FTP, SSH)</li>
            <li>Simulate common network attacks in a safe, controlled environment</li>
            <li>Upload and organize network artifacts including logs, packet captures, and screenshots</li>
            <li>Perform automated analysis to identify security patterns and vulnerabilities</li>
            <li>Generate professional reports suitable for academic or professional documentation</li>
          </ul>
          <p className="mt-6 text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <strong>Educational Use Only:</strong> This platform is designed for educational purposes
            in controlled lab environments. All simulations should be conducted ethically and legally,
            with proper authorization and within isolated test networks.
          </p>
        </div>
      </div>
    </div>
  );
}
