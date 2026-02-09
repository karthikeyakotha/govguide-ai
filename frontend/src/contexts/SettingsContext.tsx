
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'light' | 'dark' | 'system';
type Language = 'English' | 'Hindi' | 'Telugu';

interface UserProfile {
    name: string;
    district: string;
}

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    emailNotifications: boolean;
    setEmailNotifications: (enabled: boolean) => void;
    profile: UserProfile;
    updateProfile: (data: UserProfile) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme) || 'system'
    );
    const [language, setLanguage] = useState<Language>(
        () => (localStorage.getItem('language') as Language) || 'English'
    );
    const [emailNotifications, setEmailNotifications] = useState(
        () => localStorage.getItem('emailNotifications') !== 'false'
    );
    const [profile, setProfile] = useState<UserProfile>({
        name: 'User',
        district: ''
    });

    // Initialize profile from Supabase or LocalStorage
    useEffect(() => {
        const fetchUser = async () => {
            // 1. Try LocalStorage first (for instant load)
            const localProfile = localStorage.getItem('user-profile');
            if (localProfile) {
                setProfile(JSON.parse(localProfile));
            }

            // 2. Try Supabase (source of truth for auth users)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
                const district = user.user_metadata?.district || '';

                // Only update if different to avoid flickering or if local was empty
                setProfile(prev => {
                    if (prev.name === 'User' && prev.district === '') {
                        return { name: fullName, district };
                    }
                    return prev;
                });
            }
        };
        fetchUser();
    }, []);

    const updateProfile = async (data: UserProfile) => {
        setProfile(data);
        localStorage.setItem('user-profile', JSON.stringify(data));

        // Optionally update Supabase metadata if logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.auth.updateUser({
                data: { full_name: data.name, district: data.district }
            });
        }
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('emailNotifications', String(emailNotifications));
    }, [emailNotifications]);

    return (
        <SettingsContext.Provider
            value={{
                theme,
                setTheme,
                language,
                setLanguage,
                emailNotifications,
                setEmailNotifications,
                profile,
                updateProfile
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
