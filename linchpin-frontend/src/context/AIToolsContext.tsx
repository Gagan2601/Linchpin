'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { aiService, AITool } from '@/services/ai';

interface AIToolsContextType {
  tools: AITool[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const AIToolsContext = createContext<AIToolsContextType | undefined>(undefined);

export function AIToolsProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await aiService.getAllAITools();
      if (res.data) {
        setTools(res.data);
        setError(null);
      } else {
        setError(res.error || 'Failed to load AI tools');
      }
    } catch {
      setError('Failed to load AI tools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return (
    <AIToolsContext.Provider value={{ tools, loading, error, refetch: fetchTools }}>
      {children}
    </AIToolsContext.Provider>
  );
}

export function useAITools() {
  const context = useContext(AIToolsContext);
  if (context === undefined) {
    throw new Error('useAITools must be used within an AIToolsProvider');
  }
  return context;
}
