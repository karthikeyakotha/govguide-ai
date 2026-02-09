import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import type { Message } from '../components/MessageBubble'
import { getChatCompletion, type ChatMessage } from '../lib/openai'
import HistoryView from '../components/views/HistoryView'
import SchemesListView from '../components/views/SchemesListView'
import SavedSchemesView from '../components/views/SavedSchemesView'
import SettingsView from '../components/views/SettingsView'
import { useSavedSchemes } from '../contexts/SavedSchemesContext'
import { useHistory } from '../contexts/HistoryContext'
import { supabase } from '../lib/supabase'

import SchemeDetailsView from '../components/views/SchemeDetailsView'
import SavedSchemeDetailsView from '../components/views/SavedSchemeDetailsView'

interface DashboardProps {
    isAuthenticated: boolean;
}

type ViewState = 'chat' | 'history' | 'saved' | 'settings' | 'schemes' | 'scheme-details' | 'saved-scheme-details';

function Dashboard({ isAuthenticated }: DashboardProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [serviceTitle, setServiceTitle] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>('chat');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [selectedSchemeId, setSelectedSchemeId] = useState<number | null>(null);
    const [selectedSavedSchemeId, setSelectedSavedSchemeId] = useState<string | null>(null);
    const { saveScheme } = useSavedSchemes();
    const { addToHistory } = useHistory();

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const handleViewChange = (view: ViewState) => {
        setCurrentView(view);
        if (view === 'chat') {
            // New Request: Reset chat and conversation ID
            setMessages([]);
            setServiceTitle(undefined);
            setConversationId(null);
        }
    };

    const handleSelectScheme = (id: number) => {
        setSelectedSchemeId(id);
        setCurrentView('scheme-details');
    };

    const handleSelectSavedScheme = (id: string) => {
        setSelectedSavedSchemeId(id);
        setCurrentView('saved-scheme-details');
    };

    const handleSendMessage = async (content: string) => {
        let currentTitle = serviceTitle;

        // If first message, determine title
        if (!currentTitle) {
            currentTitle = "General Service Request";
            if (content.toLowerCase().includes("scheme")) currentTitle = "Scheme Explorer";
            else if (content.toLowerCase().includes("eligibility")) currentTitle = "Eligibility Checker";
            else if (content.toLowerCase().includes("form")) currentTitle = "Form Assistant";
            else if (content.toLowerCase().includes("voice")) currentTitle = "Voice Assistant";

            setServiceTitle(currentTitle);
        }

        // Add User Message (UI)
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            let activeConversationId = conversationId;

            // Database Persistence (User Message)
            if (isAuthenticated) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Create conversation if new
                    if (!activeConversationId) {
                        const { data: convData, error: convError } = await supabase
                            .from('conversations')
                            .insert({
                                user_id: user.id,
                                title: currentTitle
                            })
                            .select()
                            .single();

                        if (convData) {
                            activeConversationId = convData.id;
                            setConversationId(convData.id);
                            // Sync to global history context
                            addToHistory(currentTitle, convData.id);
                        } else if (convError) {
                            console.error('Error creating conversation:', convError);
                        }
                    }

                    // Insert User Message
                    if (activeConversationId) {
                        await supabase.from('messages').insert({
                            conversation_id: activeConversationId,
                            role: 'user',
                            content: content
                        });
                    }
                }
            }

            // Prepare conversation history for AI
            const chatHistory: ChatMessage[] = messages.map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            }));
            chatHistory.push({ role: 'user', content: content });

            // Get AI response
            const aiResponse = await getChatCompletion(chatHistory);

            // Add AI Message (UI)
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
            };
            setMessages(prev => [...prev, aiMessage]);

            // Database Persistence (AI Message)
            if (isAuthenticated && activeConversationId) {
                await supabase.from('messages').insert({
                    conversation_id: activeConversationId,
                    role: 'assistant',
                    content: aiResponse
                });
            }

        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: error instanceof Error ? error.message : 'I apologize, but I encountered an error processing your request.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToDashboard = () => {
        setMessages([]);
        setServiceTitle(undefined);
        setConversationId(null);
    };

    const handleLoadConversation = async (id: string, title: string) => {
        setIsLoading(true);
        try {
            // Fetch messages
            const { data: msgs, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (msgs) {
                const formattedMessages: Message[] = msgs.map(m => ({
                    id: m.id,
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                }));

                setMessages(formattedMessages);
                setServiceTitle(title);
                setConversationId(id);
                setCurrentView('chat');
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'history':
                return <HistoryView onLoadConversation={handleLoadConversation} />;
            case 'saved':
                return <SavedSchemesView onSelectScheme={handleSelectSavedScheme} />;
            case 'saved-scheme-details':
                return selectedSavedSchemeId ? (
                    <SavedSchemeDetailsView
                        schemeId={selectedSavedSchemeId}
                        onBack={() => setCurrentView('saved')}
                    />
                ) : <SavedSchemesView onSelectScheme={handleSelectSavedScheme} />;
            case 'settings':
                return <SettingsView />;
            case 'schemes':
                return <SchemesListView onSelectScheme={handleSelectScheme} />;
            case 'scheme-details':
                return selectedSchemeId ? (
                    <SchemeDetailsView
                        schemeId={selectedSchemeId}
                        onBack={() => setCurrentView('schemes')}
                    />
                ) : <SchemesListView onSelectScheme={handleSelectScheme} />;
            case 'chat':
            default:
                return (
                    <ChatArea
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                        serviceTitle={serviceTitle}
                        onBackToDashboard={messages.length > 0 ? handleBackToDashboard : undefined}
                        isLoading={isLoading}
                        isAuthenticated={isAuthenticated}
                        onBookmark={saveScheme}
                        onViewSchemes={() => setCurrentView('schemes')}
                    />
                );
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                isAuthenticated={isAuthenticated}
                onViewChange={handleViewChange}
                currentView={currentView}
            />

            {renderView()}
        </div>
    )
}

export default Dashboard
