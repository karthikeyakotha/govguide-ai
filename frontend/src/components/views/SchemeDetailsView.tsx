
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, ExternalLink, ShieldCheck, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Scheme {
    id: number;
    Scheme_Name: string;
    Category: string;
    Target_Beneficiaries: string;
    Eligibility_Criteria: string;
    Benefits_Provided: string;
    Documents_Required: string;
    Application_Process: string;
    Official_Website_Link: string;
    Loan_Amount_or_Subsidy: string;
    Interest_Rate: string;
}

interface SchemeDetailsViewProps {
    schemeId: number;
    onBack: () => void;
}

const SchemeDetailsView: React.FC<SchemeDetailsViewProps> = ({ schemeId, onBack }) => {
    const [scheme, setScheme] = useState<Scheme | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchemeDetails = async () => {
            const { data, error } = await supabase
                .from('schemes')
                .select('*')
                .eq('id', schemeId)
                .single();

            if (error) {
                console.error('Error fetching scheme details:', error);
            } else {
                setScheme(data);
            }
            setLoading(false);
        };

        fetchSchemeDetails();
    }, [schemeId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!scheme) {
        return (
            <div className="flex flex-col justify-center items-center h-full bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <AlertCircle size={48} className="mb-2 opacity-50" />
                <p>Scheme details not found.</p>
                <button onClick={onBack} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
            {/* Header / Nav */}
            <div className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Back to list"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{scheme.Scheme_Name}</h1>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${scheme.Category === 'Welfare' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    scheme.Category === 'Education' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        scheme.Category === 'Loan' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                    {scheme.Category || 'General'}
                </span>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Hero Section: Benefits */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 md:p-8">
                        <h2 className="text-blue-900 dark:text-blue-300 text-lg font-semibold mb-3 flex items-center gap-2">
                            <ShieldCheck size={20} /> Benefits Provided
                        </h2>
                        <p className="text-blue-800 dark:text-blue-200 text-lg leading-relaxed font-medium">
                            {scheme.Benefits_Provided}
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {scheme.Loan_Amount_or_Subsidy !== 'NA' && (
                                <div className="bg-white/60 dark:bg-gray-800/80 p-3 rounded-lg">
                                    <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">Amount / Subsidy</span>
                                    <p className="text-blue-900 dark:text-blue-100 font-semibold">{scheme.Loan_Amount_or_Subsidy}</p>
                                </div>
                            )}
                            {scheme.Interest_Rate !== 'NA' && (
                                <div className="bg-white/60 dark:bg-gray-800/80 p-3 rounded-lg">
                                    <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">Interest Rate</span>
                                    <p className="text-blue-900 dark:text-blue-100 font-semibold">{scheme.Interest_Rate}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Eligibility */}
                        <section className="space-y-4">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                                <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                                Eligibility Criteria
                            </h3>
                            <div className="prose prose-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p>{scheme.Eligibility_Criteria}</p>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Target Beneficiaries</h4>
                                <p className="text-gray-900 dark:text-white font-medium">{scheme.Target_Beneficiaries}</p>
                            </div>
                        </section>

                        {/* Documents & Process */}
                        <section className="space-y-4">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                                <FileText className="text-amber-600 dark:text-amber-400" size={20} />
                                Application Details
                            </h3>

                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Documents Required</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{scheme.Documents_Required}</p>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Process / Mistakes to Avoid</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{scheme.Application_Process}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Action */}
                    {scheme.Official_Website_Link && scheme.Official_Website_Link !== 'NA' && (
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-center">
                            <a
                                href={scheme.Official_Website_Link.startsWith('http') ? scheme.Official_Website_Link : `https://${scheme.Official_Website_Link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                            >
                                Visit Official Website <ExternalLink size={18} />
                            </a>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SchemeDetailsView;
