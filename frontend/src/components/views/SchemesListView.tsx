
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, ExternalLink, Loader2 } from 'lucide-react';

interface Scheme {
    id: number;
    Scheme_Name: string;
    Category: string;
    Target_Beneficiaries: string;
    Benefits_Provided: string;
    Official_Website_Link: string;
}

interface SchemesListViewProps {
    onSelectScheme?: (id: number) => void;
}

const SchemesListView: React.FC<SchemesListViewProps> = ({ onSelectScheme }) => {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchemes = async () => {
            const { data, error } = await supabase
                .from('schemes')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching schemes:', error);
            } else {
                setSchemes(data || []);
            }
            setLoading(false);
        };

        fetchSchemes();
    }, []);

    // Extract unique categories
    const categories = Array.from(new Set(schemes.map(s => s.Category).filter(Boolean))).sort();

    const filteredSchemes = schemes.filter(scheme => {
        const matchesSearch = scheme.Scheme_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.Category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.Target_Beneficiaries?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory ? scheme.Category === selectedCategory : true;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex-1 h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 px-8 py-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Government Schemes Repository</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Browse and search through all available government schemes.</p>

                {/* Search Bar */}
                <div className="mt-6 relative max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search schemes by name, category, or beneficiary..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === null
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchemes.map((scheme) => (
                            <div
                                key={scheme.id}
                                onClick={() => onSelectScheme?.(scheme.id)}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 flex flex-col group"
                            >
                                <span className={`self-start px-3 py-1 rounded-full text-xs font-medium mb-3 ${scheme.Category === 'Welfare' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                    scheme.Category === 'Education' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                        scheme.Category === 'Loan' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {scheme.Category || 'General'}
                                </span>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2" title={scheme.Scheme_Name}>
                                    {scheme.Scheme_Name}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                                    {scheme.Benefits_Provided}
                                </p>

                                <div className="mt-auto space-y-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Beneficiaries:</span> {scheme.Target_Beneficiaries}
                                    </div>

                                    {scheme.Official_Website_Link && scheme.Official_Website_Link !== 'NA' && (
                                        <a
                                            href={scheme.Official_Website_Link.startsWith('http') ? scheme.Official_Website_Link : `https://${scheme.Official_Website_Link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                        >
                                            Visit Website <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredSchemes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No schemes found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchemesListView;
