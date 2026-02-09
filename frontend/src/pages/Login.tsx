import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { ArrowRight, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                navigate('/');
            }
        } catch (error: any) {
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Citizen Login" subtitle="Access your digital services securely">
            <form onSubmit={handleLogin} className="space-y-5">

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">Forgot Password?</a>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Verifying...' : (
                        <span className="flex items-center gap-2">
                            Login securely <ArrowRight size={16} />
                        </span>
                    )}
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-800 hover:underline">
                        Register Now
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
