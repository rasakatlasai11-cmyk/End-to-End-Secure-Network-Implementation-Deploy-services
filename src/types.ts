export interface Service {
  id: string;
  serviceType: 'dns' | 'dhcp' | 'ftp' | 'ssh';
  title: string;
  description: string;
  commands: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attack {
  id: string;
  attackType: 'arp_spoofing' | 'dns_spoofing' | 'dhcp_starvation' | 'ftp_brute_force' | 'ssh_brute_force';
  title: string;
  description: string;
  results: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Artifact {
  id: string;
  filename: string;
  fileType: 'log' | 'pcap' | 'screenshot' | 'other';
  fileData: string;
  fileSize: number;
  notes: string;
  relatedService?: string;
  relatedAttack?: string;
  createdAt: Date;
}

export interface AnalysisResult {
  id: string;
  artifactId: string;
  analysisType: string;
  findings: Record<string, any>;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export interface Report {
  id: string;
  title: string;
  includedServices: string[];
  includedAttacks: string[];
  includedArtifacts: string[];
  createdAt: Date;
}
