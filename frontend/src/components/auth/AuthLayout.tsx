import React from 'react';
import { Landmark } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-gray-900">

            {/* Header / Logo */}
            <div className="mb-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                    <Landmark size={32} className="text-blue-700" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">GovGuide AI</h1>
                <p className="text-blue-800 font-medium text-lg">Your Digital Government Assistant</p>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-6 text-center">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <p className="text-blue-100 text-sm mt-1">{subtitle}</p>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                <p>Secure • Encrypted • Official Government Portal</p>
                <div className="mt-2 flex gap-4 justify-center underline decoration-gray-300">
                    <span>Terms of Service</span>
                    <span>Privacy Policy</span>
                    <span>Help</span>
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;
