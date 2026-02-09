
import React, { useState } from 'react';
import { Settings, Moon, Globe, User, Bell, Shield } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import EditProfileModal from '../modals/EditProfileModal';

const SettingsView: React.FC = () => {
    const {
        theme, setTheme,
        language, setLanguage,
        emailNotifications, setEmailNotifications,
        profile, updateProfile
    } = useSettings();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSaveProfile = (data: { name: string; district: string }) => {
        updateProfile(data);
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Settings className="text-blue-600" />
                    Settings
                </h1>

                <div className="space-y-6">
                    {/* Account Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User size={18} /> Account
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{profile.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{profile.district}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Globe size={18} /> Preferences
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Language</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Default response language</p>
                                    </div>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="border-gray-300 dark:border-gray-600 rounded-lg text-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Telugu">Telugu</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                        <Moon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Appearance</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Light or Dark mode</p>
                                    </div>
                                </div>
                                <select
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value as any)}
                                    className="border-gray-300 dark:border-gray-600 rounded-lg text-sm p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell size={18} /> Notifications
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new schemes</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={emailNotifications}
                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Shield size={12} />
                            Version 1.0.0 • Secure Official App
                        </p>
                    </div>

                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
                initialData={profile}
            />
        </div>
    );
};

export default SettingsView;
