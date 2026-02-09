import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSavedSchemes } from '../../contexts/SavedSchemesContext';

interface SavedSchemeDetailsViewProps {
    schemeId: string;
    onBack: () => void;
}

const SavedSchemeDetailsView: React.FC<SavedSchemeDetailsViewProps> = ({ schemeId, onBack }) => {
    const { savedSchemes, removeScheme } = useSavedSchemes();
    const [scheme, setScheme] = useState(savedSchemes.find(s => s.id === schemeId));

    useEffect(() => {
        setScheme(savedSchemes.find(s => s.id === schemeId));
    }, [schemeId, savedSchemes]);

    if (!scheme) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-gray-500 mb-4">Scheme not found or deleted.</p>
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Saved Schemes
                </button>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this saved scheme?")) {
            removeScheme(scheme.id);
            onBack();
        }
    };

    return (
        <div className="flex-1 h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Back to list"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{scheme.title}</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Delete Scheme"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            <Tag size={14} />
                            <span>{scheme.category || 'General'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            <Calendar size={14} />
                            <span>Saved on {new Date(scheme.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Markdown Content */}
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                        <ReactMarkdown>{scheme.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedSchemeDetailsView;
