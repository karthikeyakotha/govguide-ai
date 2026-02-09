import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { ArrowRight, User, Phone, MapPin, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { INDIAN_STATES } from '../lib/indian-states';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        state: '',
        district: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'state') {
            setFormData({ ...formData, state: value, district: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        full_name: formData.fullName,
                        mobile: formData.mobile,
                        state: formData.state,
                        district: formData.district,
                    }
                }
            });

            if (error) throw error;

            // Auto-login after signup (no email verification needed)
            if (data.user) {
                navigate('/');
            }
        } catch (error: any) {
            setError(error.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="New Registration" subtitle="Create your official citizen account">
            <form onSubmit={handleSignup} className="space-y-4">

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name (as per Aadhaar)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                        </div>
                        <input
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Ex. Ravi Kumar"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={18} className="text-gray-400" />
                        </div>
                        <input
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter 10-digit number"
                            required
                            pattern="[0-9]{10}"
                        />
                    </div>
                </div>

                {/* State Dropdown */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">State</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin size={18} className="text-gray-400" />
                        </div>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                            required
                        >
                            <option value="">Select State</option>
                            {Object.keys(INDIAN_STATES).map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* District Dropdown */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">District</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin size={18} className="text-gray-400" />
                        </div>
                        <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                            required
                            disabled={!formData.state}
                        >
                            <option value="">Select District</option>
                            {formData.state && INDIAN_STATES[formData.state]?.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Create Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : (
                            <span className="flex items-center gap-2">
                                Register Account <ArrowRight size={16} />
                            </span>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 hover:underline">
                        Login Here
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Signup;
