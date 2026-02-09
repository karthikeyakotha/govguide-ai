import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, List, Bookmark, Settings, User, LogOut, ChevronLeft, ChevronRight, X, LogIn } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    isAuthenticated: boolean;
    onViewChange: (view: 'chat' | 'history' | 'saved' | 'settings') => void;
    currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, toggleCollapse, isAuthenticated, onViewChange, currentView }) => {
    const navigate = useNavigate();
    const { profile } = useSettings();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col shadow-sm",
                isOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}>

                {/* Header / Logo */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 h-20">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-xl">G</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight leading-none">GovGuide</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-0.5">Citizen Assistant</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col h-full p-3 overflow-hidden">

                    {/* Main Navigation */}
                    <div className="flex flex-col gap-2 mt-2">

                        <button
                            onClick={() => { onViewChange('chat'); onClose(); }}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 w-full text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 rounded-lg transition-all mb-4 group font-medium",
                                isCollapsed ? "justify-center px-0" : ""
                            )}>
                            <Plus size={22} />
                            {!isCollapsed && <span className="font-semibold text-base">New Request</span>}
                        </button>

                        <button
                            onClick={() => { onViewChange('history'); onClose(); }}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                                currentView === 'history' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                                isCollapsed ? "justify-center" : ""
                            )}>
                            <List size={20} className={clsx(currentView === 'history' ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600")} />
                            {!isCollapsed && <span className="font-medium">My Requests</span>}
                        </button>

                        <button
                            onClick={() => { onViewChange('saved'); onClose(); }}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                                currentView === 'saved' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                                isCollapsed ? "justify-center" : ""
                            )}>
                            <Bookmark size={20} className={clsx(currentView === 'saved' ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600")} />
                            {!isCollapsed && <span className="font-medium">Saved Schemes</span>}
                        </button>

                    </div>

                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3 space-y-2">
                        <button
                            onClick={() => { onViewChange('settings'); onClose(); }}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-colors",
                                currentView === 'settings' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                                isCollapsed ? "justify-center" : ""
                            )}>
                            <Settings size={20} className={clsx(currentView === 'settings' ? "text-blue-600" : "")} />
                            {!isCollapsed && <span className="font-medium">Settings</span>}
                        </button>

                        {isAuthenticated ? (
                            <div className={clsx("flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700", isCollapsed ? "justify-center p-2" : "")}>
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 flex-shrink-0">
                                    <User size={16} />
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <div className="flex-1 text-left flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{profile.name}</span>
                                            {profile.district && <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{profile.district}</span>}
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 w-full text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm font-medium",
                                    isCollapsed ? "justify-center px-0" : ""
                                )}
                            >
                                <LogIn size={20} />
                                {!isCollapsed && <span className="font-semibold">Login / Sign Up</span>}
                            </button>
                        )}
                    </div>

                    {/* Collapse Toggle (Desktop) */}
                    <div className="hidden md:flex justify-end mt-4">
                        <button
                            onClick={toggleCollapse}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    </div>
                </div >

                {/* Mobile Close Button */}
                < button
                    onClick={onClose}
                    className="absolute top-4 right-[-45px] p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full shadow-lg md:hidden border border-gray-100 dark:border-gray-700"
                    style={{ display: isOpen ? 'block' : 'none' }
                    }
                >
                    <X size={20} />
                </button >
            </div >
        </>
    );
};

export default Sidebar;
