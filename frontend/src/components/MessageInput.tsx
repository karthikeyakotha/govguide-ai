import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Languages, ChevronDown, MicOff, Camera, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface MessageInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    isAuthenticated?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled, isAuthenticated }) => {
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('English');
    const [isListening, setIsListening] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Language code mapping for Web Speech API
    const languageCodes: { [key: string]: string } = {
        'English': 'en-IN',
        'Hindi': 'hi-IN',
        'Telugu': 'te-IN'
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessingImage(true);
        try {
            // Use createWorker for better control over parameters
            const worker = await Tesseract.createWorker('eng', 1, {
                logger: m => console.log(m)
            });

            // Set parameters to preserve layout and reading order
            await worker.setParameters({
                preserve_interword_spaces: '1',
            });

            const result = await worker.recognize(file);
            const text = result.data.text;

            await worker.terminate();

            if (text.trim()) {
                const formattedText = text.split('\n').map(line => line.trim()).filter(line => line).join('\n');
                setInput(prev => prev + (prev ? '\n\n' : '') + `--- Scanned Document ---\n${formattedText}\n----------------------`);

                if (textareaRef.current) {
                    setTimeout(() => {
                        textareaRef.current?.focus();
                        textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight}px`;
                    }, 100);
                }
            } else {
                alert('No readable text found in the image.');
            }
        } catch (err) {
            console.error('OCR Error:', err);
            alert('Failed to read text from image. Please try a clearer image.');
        } finally {
            setIsProcessingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const [interimText, setInterimText] = useState('');

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Allow continuous speech
            recognitionRef.current.interimResults = true; // Show text as you speak

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                let currentInterim = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        currentInterim += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
                }
                setInterimText(currentInterim);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setInterimText('');
            };

            recognitionRef.current.onend = () => {
                // If we want it to be truly continuous, we might restart it here unless stopped manually
                // But for now, let's allow it to stop naturally if silence or manual stop
                if (!isListening) { // Only clear if we really stopped
                    setInterimText('');
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setInterimText('');
        } else {
            recognitionRef.current.lang = languageCodes[language];
            recognitionRef.current.start();
            setIsListening(true);
            setInterimText('');
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    return (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            {/* Control Bar (Language & Voice) */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between md:justify-center md:gap-4 overflow-x-auto">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide hidden sm:inline">Language:</span>
                    <button
                        onClick={() => {
                            const langs = ['English', 'Hindi', 'Telugu'];
                            const next = langs[(langs.indexOf(language) + 1) % langs.length];
                            setLanguage(next);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:border-blue-500 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Languages size={16} className="text-blue-600" />
                        {language}
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex gap-2">
                    {isAuthenticated && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessingImage}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:border-blue-500 hover:text-blue-700 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
                        >
                            {isProcessingImage ? (
                                <>
                                    <Loader2 size={16} className="animate-spin text-blue-600" />
                                    <span className="hidden sm:inline">Scanning...</span>
                                </>
                            ) : (
                                <>
                                    <Camera size={16} className="text-gray-600" />
                                    <span className="hidden sm:inline">Upload Image</span>
                                    <span className="sm:hidden">Scan</span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={toggleVoiceInput}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm font-medium transition-all shadow-sm whitespace-nowrap ${isListening
                            ? 'bg-red-50 border-red-500 text-red-700 animate-pulse'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-700'
                            }`}
                    >
                        {isListening ? (
                            <>
                                <MicOff size={16} className="text-red-500" />
                                <span className="hidden sm:inline">Stop</span>
                            </>
                        ) : (
                            <>
                                <Mic size={16} className="text-red-500" />
                                <span className="hidden sm:inline">Voice Input</span>
                                <span className="sm:hidden">Voice</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Interim Text Badge */}
            {isListening && (
                <div className="absolute bottom-full left-0 w-full px-4 pb-2">
                    <div className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-medium">Listening...</span>
                        <span className="text-gray-300 italic truncate max-w-xl">{interimText}</span>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-4 md:py-6">
                <div className="md:max-w-3xl lg:max-w-[48rem] mx-auto flex gap-3">
                    <div className="relative flex-grow">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask or upload an image (forms, notices)..."
                            className="w-full resize-none border border-gray-300 rounded-lg bg-white p-4 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 text-base shadow-sm min-h-[60px] max-h-[200px] overflow-y-auto"
                            style={{ height: '60px' }}
                            rows={1}
                        />
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        className="flex-shrink-0 w-[60px] h-[60px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center group border border-blue-700"
                        disabled={!input.trim() || disabled}
                    >
                        <Send size={24} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
                <div className="text-center text-xs text-gray-400 mt-2 font-medium">
                    Secure • Encrypted • Official Government Assistant
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
