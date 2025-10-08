import { createContext, useContext, useState, ReactNode } from 'react';
import { Service, Attack, Artifact, AnalysisResult } from '../types';

interface AppContextType {
  services: Service[];
  attacks: Attack[];
  artifacts: Artifact[];
  analysisResults: AnalysisResult[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addAttack: (attack: Omit<Attack, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAttack: (id: string, attack: Partial<Attack>) => void;
  deleteAttack: (id: string) => void;
  addArtifact: (artifact: Omit<Artifact, 'id' | 'createdAt'>) => void;
  deleteArtifact: (id: string) => void;
  addAnalysisResult: (result: Omit<AnalysisResult, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const addService = (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...service,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addAttack = (attack: Omit<Attack, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAttack: Attack = {
      ...attack,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAttacks(prev => [...prev, newAttack]);
  };

  const updateAttack = (id: string, updates: Partial<Attack>) => {
    setAttacks(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a))
    );
  };

  const deleteAttack = (id: string) => {
    setAttacks(prev => prev.filter(a => a.id !== id));
  };

  const addArtifact = (artifact: Omit<Artifact, 'id' | 'createdAt'>) => {
    const newArtifact: Artifact = {
      ...artifact,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setArtifacts(prev => [...prev, newArtifact]);
  };

  const deleteArtifact = (id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id));
    setAnalysisResults(prev => prev.filter(r => r.artifactId !== id));
  };

  const addAnalysisResult = (result: Omit<AnalysisResult, 'id' | 'createdAt'>) => {
    const newResult: AnalysisResult = {
      ...result,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setAnalysisResults(prev => [...prev, newResult]);
  };

  return (
    <AppContext.Provider
      value={{
        services,
        attacks,
        artifacts,
        analysisResults,
        addService,
        updateService,
        deleteService,
        addAttack,
        updateAttack,
        deleteAttack,
        addArtifact,
        deleteArtifact,
        addAnalysisResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
