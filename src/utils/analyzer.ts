import { Artifact } from '../types';

export interface AnalysisFindings {
  totalLines?: number;
  failedLogins?: number;
  successfulLogins?: number;
  suspiciousIPs?: string[];
  dhcpDiscoverCount?: number;
  arpChanges?: number;
  uniqueIPs?: string[];
  patterns?: string[];
  keywords?: { keyword: string; count: number }[];
}

export function analyzeArtifact(artifact: Artifact): {
  findings: AnalysisFindings;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  try {
    const content = atob(artifact.fileData.split(',')[1] || '');

    if (artifact.fileType === 'log') {
      return analyzeLogFile(content, artifact.filename);
    } else if (artifact.fileType === 'pcap') {
      return analyzePcapFile(artifact.filename);
    } else {
      return analyzeGenericFile(content);
    }
  } catch (error) {
    return {
      findings: {},
      summary: 'Unable to analyze file. File may be binary or corrupted.',
      severity: 'low',
    };
  }
}

function analyzeLogFile(content: string, filename: string): {
  findings: AnalysisFindings;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  const lines = content.split('\n').filter(line => line.trim());
  const findings: AnalysisFindings = {
    totalLines: lines.length,
    patterns: [],
    keywords: [],
  };

  const isSSHLog = filename.toLowerCase().includes('ssh') ||
                   content.toLowerCase().includes('sshd') ||
                   content.toLowerCase().includes('ssh');

  const isFTPLog = filename.toLowerCase().includes('ftp') ||
                   content.toLowerCase().includes('ftp');

  const isDHCPLog = filename.toLowerCase().includes('dhcp') ||
                    content.toLowerCase().includes('dhcp');

  const isDNSLog = filename.toLowerCase().includes('dns') ||
                   content.toLowerCase().includes('bind') ||
                   content.toLowerCase().includes('named');

  if (isSSHLog) {
    findings.failedLogins = (content.match(/Failed password|authentication failure|Invalid user/gi) || []).length;
    findings.successfulLogins = (content.match(/Accepted password|session opened/gi) || []).length;

    const ipPattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;
    const ips = content.match(ipPattern) || [];
    findings.uniqueIPs = [...new Set(ips)];

    if (findings.failedLogins > 10) {
      findings.patterns?.push('Multiple failed login attempts detected');
    }

    if (findings.failedLogins > 50) {
      findings.patterns?.push('Possible brute force attack detected');
    }
  }

  if (isFTPLog) {
    findings.failedLogins = (content.match(/530 Login incorrect|Login failed|Authentication failed/gi) || []).length;
    findings.successfulLogins = (content.match(/230 Login successful|User .* logged in/gi) || []).length;

    if (findings.failedLogins > 20) {
      findings.patterns?.push('Multiple FTP authentication failures detected');
    }
  }

  if (isDHCPLog) {
    findings.dhcpDiscoverCount = (content.match(/DHCPDISCOVER|DHCP DISCOVER/gi) || []).length;
    const requestCount = (content.match(/DHCPREQUEST|DHCP REQUEST/gi) || []).length;
    const ackCount = (content.match(/DHCPACK|DHCP ACK/gi) || []).length;

    if (findings.dhcpDiscoverCount > 100) {
      findings.patterns?.push('Excessive DHCP DISCOVER messages - possible DHCP starvation attack');
    }

    findings.patterns?.push(`DHCP Activity: ${findings.dhcpDiscoverCount} discovers, ${requestCount} requests, ${ackCount} acks`);
  }

  if (isDNSLog) {
    const queryCount = (content.match(/query:|A\?|AAAA\?/gi) || []).length;
    const nxdomainCount = (content.match(/NXDOMAIN/gi) || []).length;

    findings.patterns?.push(`DNS Queries: ${queryCount} total, ${nxdomainCount} NXDOMAIN responses`);

    if (nxdomainCount > 50) {
      findings.patterns?.push('High number of NXDOMAIN responses - possible DNS spoofing or tunneling');
    }
  }

  const keywords = [
    { keyword: 'error', count: 0 },
    { keyword: 'warning', count: 0 },
    { keyword: 'denied', count: 0 },
    { keyword: 'failed', count: 0 },
    { keyword: 'attack', count: 0 },
    { keyword: 'suspicious', count: 0 },
  ];

  keywords.forEach(kw => {
    const regex = new RegExp(kw.keyword, 'gi');
    kw.count = (content.match(regex) || []).length;
  });

  findings.keywords = keywords.filter(kw => kw.count > 0);

  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let summary = `Analyzed ${findings.totalLines} log lines. `;

  if (findings.failedLogins && findings.failedLogins > 0) {
    summary += `Found ${findings.failedLogins} failed login attempts. `;
    if (findings.failedLogins > 50) {
      severity = 'critical';
    } else if (findings.failedLogins > 20) {
      severity = 'high';
    } else if (findings.failedLogins > 5) {
      severity = 'medium';
    }
  }

  if (findings.dhcpDiscoverCount && findings.dhcpDiscoverCount > 100) {
    severity = 'high';
    summary += `Detected ${findings.dhcpDiscoverCount} DHCP DISCOVER messages (potential attack). `;
  }

  if (findings.patterns && findings.patterns.length > 0) {
    summary += `${findings.patterns.length} patterns identified.`;
  }

  if (severity === 'low' && findings.patterns?.length === 0) {
    summary += 'No significant security issues detected.';
  }

  return { findings, summary, severity };
}

function analyzePcapFile(filename: string): {
  findings: AnalysisFindings;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  return {
    findings: {
      patterns: ['PCAP file detected - requires Wireshark or tcpdump for detailed analysis'],
    },
    summary: `PCAP file "${filename}" uploaded. Use network analysis tools like Wireshark for detailed packet inspection.`,
    severity: 'low',
  };
}

function analyzeGenericFile(content: string): {
  findings: AnalysisFindings;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  const lines = content.split('\n').filter(line => line.trim());

  return {
    findings: {
      totalLines: lines.length,
      patterns: ['Generic file analysis - no specific patterns detected'],
    },
    summary: `File contains ${lines.length} lines. No specific security patterns identified.`,
    severity: 'low',
  };
}
