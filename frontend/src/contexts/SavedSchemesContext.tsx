
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SavedScheme {
    id: string;
    title: string;
    content: string;
    date: string;
    category: string;
}

interface SavedSchemesContextType {
    savedSchemes: SavedScheme[];
    saveScheme: (content: string) => void;
    removeScheme: (id: string) => void;
    isSaved: (content: string) => boolean;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

export function SavedSchemesProvider({ children }: { children: React.ReactNode }) {
    const [savedSchemes, setSavedSchemes] = useState<SavedScheme[]>(() => {
        const stored = localStorage.getItem('saved-schemes');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('saved-schemes', JSON.stringify(savedSchemes));
    }, [savedSchemes]);

    const saveScheme = (content: string) => {
        // Simple heuristic to extract a title from the content
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        let title = lines[0] || 'Untitled Scheme';

        // Cleanup title if it's markdown header
        title = title.replace(/^#+\s*/, '').trim();
        if (title.length > 50) title = title.substring(0, 50) + '...';

        const newScheme: SavedScheme = {
            id: Date.now().toString(),
            title,
            content,
            date: new Date().toISOString(),
            category: 'General'
        };

        setSavedSchemes(prev => [newScheme, ...prev]);
    };

    const removeScheme = (id: string) => {
        setSavedSchemes(prev => prev.filter(scheme => scheme.id !== id));
    };

    const isSaved = (content: string) => {
        return savedSchemes.some(scheme => scheme.content === content);
    };

    return (
        <SavedSchemesContext.Provider value={{ savedSchemes, saveScheme, removeScheme, isSaved }}>
            {children}
        </SavedSchemesContext.Provider>
    );
}

export function useSavedSchemes() {
    const context = useContext(SavedSchemesContext);
    if (context === undefined) {
        throw new Error('useSavedSchemes must be used within a SavedSchemesProvider');
    }
    return context;
}
