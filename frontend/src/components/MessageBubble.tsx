import React, { useState, useEffect } from 'react';
import { User, Landmark, Volume2, Square, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
}

interface MessageBubbleProps {
    message: Message;
    onBookmark?: (content: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onBookmark }) => {
    const isUser = message.role === 'user';
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Cancel speech when component unmounts
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleBookmarkClick = () => {
        if (onBookmark) {
            onBookmark(message.content);
            setIsBookmarked(true);
            setTimeout(() => setIsBookmarked(false), 2000); // Visual feedback reset
        }
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const text = message.content.replace(/[*#_]/g, ''); // Strip markdown chars for cleaner speech
        const utterance = new SpeechSynthesisUtterance(text);

        // Language Detection Logic
        const isHindi = /[\u0900-\u097F]/.test(text);
        const isTelugu = /[\u0C00-\u0C7F]/.test(text);

        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;

        if (isHindi) {
            utterance.lang = 'hi-IN';
            selectedVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
        } else if (isTelugu) {
            utterance.lang = 'te-IN';
            selectedVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('Telugu'));
        } else {
            utterance.lang = 'en-IN'; // Prefer Indian English
            selectedVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.includes('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={clsx(
            "group w-full border-b border-gray-100",
            isUser ? "bg-white" : "bg-gray-50"
        )}>
            <div className="text-base gap-4 md:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] flex lg:px-0 m-auto w-full py-6 px-4">

                {/* Avatar */}
                <div className="relative flex-shrink-0 flex flex-col items-end">
                    <div className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-lg shadow-sm",
                        isUser ? "bg-blue-600" : "bg-blue-600"
                    )}>
                        {isUser ? (
                            <User size={18} className="text-white" />
                        ) : (
                            <Landmark size={18} className="text-white" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Name label */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm text-gray-700">
                            {isUser ? 'You' : 'GovGuide AI'}
                        </div>

                        {/* TTS & Bookmark Buttons (Only for AI) */}
                        {!isUser && (
                            <div className="flex items-center gap-1">
                                {onBookmark && (
                                    <button
                                        onClick={handleBookmarkClick}
                                        className={clsx(
                                            "opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded hover:bg-gray-200",
                                            isBookmarked ? "text-blue-600 opacity-100" : "text-gray-500 hover:text-blue-700"
                                        )}
                                        title="Bookmark Scheme"
                                    >
                                        <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                                    </button>
                                )}
                                <button
                                    onClick={handleSpeak}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-200 rounded text-gray-500 hover:text-blue-700"
                                    title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                                >
                                    {isSpeaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
                                </button>
                            </div>
                        )}
                    </div>

                    {isUser ? (
                        <div className="text-gray-800 leading-7 whitespace-pre-wrap">
                            {message.content}
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none text-gray-800 markdown-content">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-4 text-gray-900" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-3 text-gray-900" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2 mt-2 text-gray-900" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-3 leading-7" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
                                    li: ({ node, ...props }) => <li className="leading-7" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-700" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-3" {...props} />,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessageBubble;
