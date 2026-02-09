
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface HistoryItem {
    id: string;
    title: string;
    created_at: string;
    user_id?: string;
}

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (title: string, conversationId: string) => void;
    loadHistory: () => Promise<void>;
    loading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const stored = localStorage.getItem('chat-history');
        return stored ? JSON.parse(stored) : [];
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        localStorage.setItem('chat-history', JSON.stringify(history));
    }, [history]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            // 1. Try Supabase first
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data) {
                    setHistory(data);
                    // Sync to local
                    localStorage.setItem('chat-history', JSON.stringify(data));
                    return;
                }
            }

            // 2. Fallback to LocalStorage (already handled by initial state, but helpful for re-fetches)
            const stored = localStorage.getItem('chat-history');
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Error loading history:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToHistory = async (title: string, conversationId: string) => {
        const newItem: HistoryItem = {
            id: conversationId,
            title,
            created_at: new Date().toISOString()
        };

        // Optimistic update
        setHistory(prev => [newItem, ...prev.filter(h => h.id !== conversationId)]);

        // Persist to Supabase if logged in (logic often handled by Dashboard, but good to ensure sync)
        // Note: Dashboard.tsx currently inserts into 'conversations'. 
        // We rely on Dashboard to handle the Database insert for now to avoid double insertion, 
        // but we update the local list here for immediate UI reflection.
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, loadHistory, loading }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}
