import React, { useRef, useEffect } from 'react';
import MessageBubble, { type Message } from './MessageBubble';
import MessageInput from './MessageInput';
import { Menu, Landmark, ArrowLeft, Database } from 'lucide-react';

interface ChatAreaProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    onOpenSidebar: () => void;
    serviceTitle?: string;
    onBackToDashboard?: () => void;
    isLoading?: boolean;
    isAuthenticated?: boolean;
    onBookmark?: (content: string) => void;
    onViewSchemes?: () => void;
}


const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, onOpenSidebar, serviceTitle, onBackToDashboard, isLoading, isAuthenticated, onBookmark, onViewSchemes }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const isDashboard = !serviceTitle && messages.length === 0;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">

            {/* Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 sticky top-0 h-16">
                <button onClick={onOpenSidebar} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md md:hidden mr-2">
                    <Menu size={24} />
                </button>

                {serviceTitle ? (
                    <div className="flex items-center gap-3">
                        {onBackToDashboard && (
                            <button onClick={onBackToDashboard} className="p-2 -ml-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-50">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">{serviceTitle}</span>
                            <span className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Official Assistant
                            </span>
                        </div>
                    </div>
                ) : (
                    <span className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-6 w-auto opacity-80 dark:invert" />
                        GovGuide Dashboard
                    </span>
                )}

                {/* Schemes Button */}
                {onViewSchemes && (
                    <button
                        onClick={onViewSchemes}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors"
                        title="View All Schemes"
                    >
                        <Database size={16} />
                        <span className="hidden sm:inline">Schemes</span>
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto w-full pb-48 scroll-smooth">
                {isDashboard ? (
                    <div className="flex flex-col items-center justify-center min-h-[80%] px-4 text-center">

                        {/* Welcome Panel */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-2xl w-full border border-transparent dark:border-gray-700">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 mx-auto border border-blue-100 dark:border-blue-800">
                                <Landmark size={40} className="text-blue-700 dark:text-blue-400" />
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">GovGuide AI</h1>
                            <h2 className="text-xl text-blue-800 dark:text-blue-300 font-medium mb-4">Your Digital Government Assistant</h2>

                            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                                Ask about schemes, eligibility, documents, or application procedures.
                            </p>

                            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600">Official Data</span>
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600">Secure</span>
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600">24/7 Support</span>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} onBookmark={onBookmark} />
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex items-start gap-3 max-w-3xl">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Landmark size={16} className="text-blue-700" />
                                </div>
                                <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <MessageInput onSend={onSendMessage} isAuthenticated={isAuthenticated} />
        </div>
    );
};

export default ChatArea;
