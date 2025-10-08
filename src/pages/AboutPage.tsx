import { Shield, Book, AlertTriangle, Target, Users, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">About</h1>
        <p className="text-slate-600 mt-1">
          Learn how to use this platform and understand ethical guidelines
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <Shield className="w-12 h-12 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-2">
              End-to-End Secure Network Implementation
            </h2>
            <p className="text-blue-100 leading-relaxed">
              An educational platform designed for cybersecurity students and professionals
              to document, simulate, and analyze secure network infrastructure implementations
              and security testing in controlled lab environments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Project Goals</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Document network service configurations (DNS, DHCP, FTP, SSH)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Simulate and analyze common network attacks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Collect and organize security artifacts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Perform automated security analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Generate professional lab reports</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Target Audience</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Cybersecurity students in academic programs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Network security professionals in training</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Penetration testers learning attack techniques</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>System administrators improving security skills</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Researchers documenting security experiments</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 shadow-md">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-orange-900 mb-3">
              Ethical Use Guidelines
            </h3>
            <div className="space-y-3 text-orange-900">
              <p className="font-medium">
                This platform is designed exclusively for educational purposes in authorized,
                controlled environments. Users must adhere to the following guidelines:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-1">✓</span>
                  <span>
                    <strong>Only use in isolated lab networks:</strong> All activities must
                    be performed in dedicated test environments separate from production
                    systems
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-1">✓</span>
                  <span>
                    <strong>Obtain proper authorization:</strong> Always have written
                    permission before performing any security testing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-1">✓</span>
                  <span>
                    <strong>Follow legal requirements:</strong> Comply with all applicable
                    laws and regulations in your jurisdiction
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-1">✓</span>
                  <span>
                    <strong>Respect privacy and data:</strong> Never access unauthorized
                    systems or data belonging to others
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-1">✓</span>
                  <span>
                    <strong>Document responsibly:</strong> Use findings to improve security,
                    not to cause harm
                  </span>
                </li>
              </ul>
              <p className="mt-4 bg-orange-100 p-3 rounded-lg font-semibold border border-orange-300">
                Unauthorized access to computer systems is illegal. Misuse of these
                techniques can result in criminal prosecution.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Book className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">How to Use This Platform</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">1. Services Page</h4>
            <p className="text-slate-700">
              Document your network service configurations. For each service (DNS, DHCP, FTP,
              SSH), record the setup process, configuration commands, and implementation notes.
              This creates a reference for your lab setup and helps document your learning process.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">2. Attacks Page</h4>
            <p className="text-slate-700">
              Record attack simulations including ARP spoofing, DNS spoofing, DHCP starvation,
              and brute-force attacks. Document the methodology used, tools employed, observed
              results, and lessons learned. This helps understand attack vectors and defense
              mechanisms.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">3. Artifacts Page</h4>
            <p className="text-slate-700">
              Upload evidence files from your lab activities. This includes system logs, packet
              captures (PCAPs), screenshots of configurations or attack results, and other
              relevant files. Organized artifacts provide proof of your work and enable detailed
              analysis.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">4. Analysis Page</h4>
            <p className="text-slate-700">
              Run automated analysis on uploaded artifacts. The system detects patterns such as
              failed login attempts, DHCP anomalies, suspicious network activity, and security
              indicators. Analysis results are categorized by severity (low, medium, high,
              critical) to help prioritize findings.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">5. Report Generator</h4>
            <p className="text-slate-700">
              Compile all your documented work into a professional PDF report. Select which
              services, attacks, artifacts, and analysis results to include. The generated report
              is suitable for academic submissions, professional documentation, or lab notebooks.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-slate-100 p-3 rounded-lg">
            <Code className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Lab Setup Recommendations</h3>
        </div>

        <div className="space-y-4 text-slate-700">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Virtualization</h4>
            <p>
              Use virtual machines (VirtualBox, VMware, or Hyper-V) to create isolated test
              environments. This allows safe experimentation without risking production systems.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Network Isolation</h4>
            <p>
              Configure host-only or internal networks to ensure lab activities remain isolated
              from production networks and the internet.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Common Tools</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Wireshark for packet capture and analysis</li>
              <li>Kali Linux for security testing tools</li>
              <li>Ubuntu/CentOS for service configuration</li>
              <li>Metasploit for penetration testing</li>
              <li>Nmap for network scanning</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Documentation Practices</h4>
            <p>
              Take screenshots at each step, save command outputs, capture network traffic, and
              maintain detailed notes. Good documentation is essential for learning and creating
              comprehensive reports.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
        <p className="text-slate-600">
          For questions, feedback, or support, please refer to your course instructor or lab
          administrator. Remember: ethical cybersecurity practices protect everyone.
        </p>
      </div>
    </div>
  );
}
