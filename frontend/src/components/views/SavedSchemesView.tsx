import React from 'react';
import { Bookmark } from 'lucide-react';
import { useSavedSchemes } from '../../contexts/SavedSchemesContext';
import ReactMarkdown from 'react-markdown';

interface SavedSchemesViewProps {
    onSelectScheme?: (id: string) => void;
}

const SavedSchemesView: React.FC<SavedSchemesViewProps> = ({ onSelectScheme }) => {
    const { savedSchemes, removeScheme } = useSavedSchemes();

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Remove this scheme from saved?")) {
            removeScheme(id);
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Bookmark className="text-blue-600 dark:text-blue-400" />
                    Saved Schemes
                </h1>

                {savedSchemes.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {savedSchemes.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelectScheme?.(item.id)}
                                className={`bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-all group flex flex-col justify-between h-full ${onSelectScheme ? 'cursor-pointer hover:shadow-md' : ''}`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-100 dark:border-green-800">
                                            {item.category || "Saved"}
                                        </span>
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-red-500 dark:hover:text-red-400 transition-colors z-10"
                                            title="Unsave (Remove)"
                                        >
                                            <Bookmark size={20} fill="currentColor" />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 overflow-hidden">
                                        <ReactMarkdown>
                                            {item.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                    Saved on {new Date(item.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500">
                            <Bookmark size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No saved schemes yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Bookmark schemes during your chat to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedSchemesView;
