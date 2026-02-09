

import React from 'react';
import { Clock, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { useHistory } from '../../contexts/HistoryContext';

interface HistoryViewProps {
    onLoadConversation: (id: string, title: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onLoadConversation }) => {
    const { history, loading } = useHistory();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Clock className="text-blue-600 dark:text-blue-400" />
                    My Requests History
                </h1>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-blue-600" size={30} />
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onLoadConversation(item.id, item.title || 'Untitled Request')}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                            {item.title || "Untitled Request"}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(item.created_at)}</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>No history found. Start a new request!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
