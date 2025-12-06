
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type Participant, type Message } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ControlsProps {
    participants: Participant[];
    onAddParticipant: (name: string, avatarUrl: string) => void;
    onUpdateParticipant: (id: string, name: string, avatarUrl: string) => void;
    onRemoveParticipant: (id: string) => void;
    onAddMessage: (text: string, senderId: string) => void;
    pages: Message[][];
    currentPageIndex: number;
    onSetCurrentPageIndex: (index: number) => void;
    onAddPage: () => void;
    onRemovePage: (index: number) => void;
    onSaveScreenshot: () => void;
    onSaveAllScreenshots: () => void;
    onImportJSON: (jsonData: any) => boolean;
}

// Participant Item Component - Memoized to prevent re-renders
const ParticipantItem: React.FC<{
    participant: Participant;
    isEditing: boolean;
    editingName: string;
    onEdit: (id: string) => void;
    onSave: (id: string) => void;
    onEditNameChange: (name: string) => void;
    onKeyDown: (e: React.KeyboardEvent, id: string) => void;
    onRemove: (id: string) => void;
}> = React.memo(({
    participant,
    isEditing,
    editingName,
    onEdit,
    onSave,
    onEditNameChange,
    onKeyDown,
    onRemove
}) => (
    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-md hover:bg-slate-100 transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0">
            <img src={participant.avatarUrl} alt={participant.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            {isEditing ? (
                <input
                    type="text"
                    value={editingName}
                    onChange={(e) => onEditNameChange(e.target.value)}
                    onBlur={() => onSave(participant.id)}
                    onKeyDown={(e) => onKeyDown(e, participant.id)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-blue-400 rounded text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                />
            ) : (
                <span
                    onClick={() => !participant.isMe && onEdit(participant.id)}
                    className={`font-medium text-sm truncate ${
                        participant.isMe
                            ? 'text-slate-700'
                            : 'text-slate-700 cursor-pointer hover:text-blue-600 transition-colors'
                    }`}
                    title={participant.name}
                >
                    {participant.name} {participant.isMe && '(Me)'}
                </span>
            )}
        </div>
        {!participant.isMe && (
            <button
                onClick={() => onRemove(participant.id)}
                className="text-slate-500 hover:text-red-600 p-1 rounded-full flex-shrink-0 transition-colors"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        )}
    </div>
));

ParticipantItem.displayName = 'ParticipantItem';

const Controls: React.FC<ControlsProps> = ({
    participants,
    onAddParticipant,
    onUpdateParticipant,
    onRemoveParticipant,
    onAddMessage,
    pages,
    currentPageIndex,
    onSetCurrentPageIndex,
    onAddPage,
    onRemovePage,
    onSaveScreenshot,
    onSaveAllScreenshots,
    onImportJSON
}) => {
    const [openSection, setOpenSection] = useState('participants');
    const [newParticipantAvatar, setNewParticipantAvatar] = useState('');
    const [newMessageText, setNewMessageText] = useState('');
    const [selectedSender, setSelectedSender] = useState<string>('');
    const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    // Initialize selectedSender only once
    useEffect(() => {
        if (!selectedSender && participants.length > 0) {
            setSelectedSender(participants[0].id);
        }
    }, []);

    // Update selectedSender if current one is removed
    useEffect(() => {
        if (selectedSender && !participants.find(p => p.id === selectedSender) && participants.length > 0) {
            setSelectedSender(participants[0].id);
        }
    }, [participants, selectedSender]);

    const handleAddParticipant = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onAddParticipant('New User', newParticipantAvatar.trim());
        setNewParticipantAvatar('');
    }, [newParticipantAvatar, onAddParticipant]);

    const handleAddMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (newMessageText.trim() && selectedSender) {
            onAddMessage(newMessageText, selectedSender);
            setNewMessageText('');
        }
    }, [newMessageText, selectedSender, onAddMessage]);

    const handleEditParticipant = useCallback((participantId: string) => {
        const participant = participants.find(p => p.id === participantId);
        if (participant && !participant.isMe) {
            setEditingParticipantId(participantId);
            setEditingName(participant.name);
        }
    }, [participants]);

    const handleSaveParticipantName = useCallback((participantId: string) => {
        if (editingName.trim()) {
            const participant = participants.find(p => p.id === participantId);
            if (participant) {
                onUpdateParticipant(participantId, editingName.trim(), participant.avatarUrl);
            }
        }
        setEditingParticipantId(null);
        setEditingName('');
    }, [editingName, participants, onUpdateParticipant]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, participantId: string) => {
        if (e.key === 'Enter') {
            handleSaveParticipantName(participantId);
        } else if (e.key === 'Escape') {
            setEditingParticipantId(null);
            setEditingName('');
        }
    }, [handleSaveParticipantName]);

    // Memoize participant list to prevent unnecessary re-renders
    const participantsList = useMemo(() => (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-4">
            {participants.map(p => (
                <ParticipantItem
                    key={p.id}
                    participant={p}
                    isEditing={editingParticipantId === p.id}
                    editingName={editingParticipantId === p.id ? editingName : ''}
                    onEdit={handleEditParticipant}
                    onSave={handleSaveParticipantName}
                    onEditNameChange={setEditingName}
                    onKeyDown={handleKeyDown}
                    onRemove={onRemoveParticipant}
                />
            ))}
        </div>
    ), [participants, editingParticipantId, editingName, handleEditParticipant, handleSaveParticipantName, handleKeyDown, onRemoveParticipant]);

    const AccordionSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => {
        const isOpen = openSection === id;
        return (
            <div className="border-b border-slate-200 last:border-b-0">
                <h2 id={`accordion-header-${id}`}>
                    <button
                        type="button"
                        className="flex items-center justify-between w-full py-4 font-semibold text-left text-slate-800"
                        onClick={() => setOpenSection(isOpen ? '' : id)}
                        aria-expanded={isOpen}
                        aria-controls={`accordion-body-${id}`}
                    >
                        <span>{title}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </h2>
                {isOpen && (
                    <div id={`accordion-body-${id}`} className="pb-4" aria-labelledby={`accordion-header-${id}`}>
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <AccordionSection title="Participants" id="participants">
                {participantsList}
                <form onSubmit={handleAddParticipant} className="space-y-3">
                    <input
                        type="text"
                        value={newParticipantAvatar}
                        onChange={(e) => setNewParticipantAvatar(e.target.value)}
                        placeholder="Avatar URL (optional)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                    />
                    <label className="block">
                        <span className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-700 cursor-pointer hover:bg-slate-50 transition outline-none inline-block text-center">
                            📁 Choose Avatar File
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                        setNewParticipantAvatar(evt.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="hidden"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" /> Add Participant
                    </button>
                </form>
            </AccordionSection>

            <AccordionSection title="Add Message" id="message">
                <form onSubmit={handleAddMessage} className="space-y-3">
                    <select
                        value={selectedSender}
                        onChange={(e) => setSelectedSender(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
                    >
                        {participants.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <textarea
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder="Type a message..."
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition resize-none outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-green-300"
                        disabled={!newMessageText.trim()}
                    >
                        <PlusIcon className="w-4 h-4" /> Add Message
                    </button>
                </form>
            </AccordionSection>

            <AccordionSection title="Pages" id="pages">
                <div className="flex flex-wrap gap-2 mb-4">
                    {pages.map((_, index) => (
                        <div key={index} className="relative group">
                            <button
                                onClick={() => onSetCurrentPageIndex(index)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    currentPageIndex === index
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                            >
                                Page {index + 1}
                            </button>
                            {pages.length > 1 && (
                                <button
                                    onClick={() => onRemovePage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={onAddPage}
                    className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" /> Add New Page
                </button>
            </AccordionSection>

            <AccordionSection title="Import & Export" id="import-export">
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <h3 className="font-semibold text-sm mb-2 text-slate-700">📥 Import Chat from JSON</h3>
                        <p className="text-xs text-slate-500 mb-3">Load entire chats, participants, pages, and messages at once.</p>
                        
                        <label className="block">
                            <span className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-700 cursor-pointer hover:bg-slate-50 transition outline-none inline-block text-center text-sm">
                                📂 Choose JSON File
                            </span>
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (evt) => {
                                            try {
                                                const jsonData = JSON.parse(evt.target?.result as string);
                                                if (onImportJSON(jsonData)) {
                                                    alert('✅ Chat imported successfully!');
                                                } else {
                                                    alert('❌ Failed to import chat. Check JSON format.');
                                                }
                                            } catch (error) {
                                                alert('❌ Invalid JSON file.');
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>

                        <div className="mt-3 space-y-2">
                            <p className="text-xs text-slate-500 font-medium">Or paste JSON text:</p>
                            <textarea
                                placeholder="Paste your JSON here..."
                                onPaste={(e) => {
                                    setTimeout(() => {
                                        try {
                                            const jsonData = JSON.parse(e.currentTarget.value);
                                            if (onImportJSON(jsonData)) {
                                                alert('✅ Chat imported successfully!');
                                                e.currentTarget.value = '';
                                            } else {
                                                alert('❌ Failed to import chat. Check JSON format.');
                                            }
                                        } catch (error) {
                                            alert('❌ Invalid JSON text.');
                                        }
                                    }, 0);
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono resize-none focus:ring-2 focus:ring-blue-300 outline-none"
                                rows={4}
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    const textarea = (e.currentTarget as HTMLButtonElement).previousElementSibling as HTMLTextAreaElement;
                                    if (textarea && textarea.value.trim()) {
                                        try {
                                            const jsonData = JSON.parse(textarea.value);
                                            if (onImportJSON(jsonData)) {
                                                alert('✅ Chat imported successfully!');
                                                textarea.value = '';
                                            } else {
                                                alert('❌ Failed to import chat. Check JSON format.');
                                            }
                                        } catch (error) {
                                            alert('❌ Invalid JSON text.');
                                        }
                                    }
                                }}
                                className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                📌 Import JSON Text
                            </button>
                        </div>

                        <details className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                            <summary className="cursor-pointer font-medium text-slate-700 mb-2">📋 View Sample JSON Format</summary>
                            <pre className="text-xs bg-slate-900 text-green-400 p-2 rounded overflow-x-auto max-h-64 overflow-y-auto font-mono">
{`{
  "chatName": "My Group",
  "participants": [
    {
      "id": "me",
      "name": "Me",
      "avatarUrl": "",
      "isMe": true
    },
    {
      "id": "person1",
      "name": "Alex",
      "avatarUrl": "https://picsum.photos/seed/alex/100",
      "isMe": false
    },
    {
      "id": "person2",
      "name": "Jamie",
      "isMe": false
    }
  ],
  "pages": [
    [
      {
        "id": "msg1",
        "text": "Hey!",
        "senderId": "person1"
      },
      {
        "id": "msg2",
        "text": "Hi there!",
        "senderId": "me"
      }
    ]
  ]
}`}
                            </pre>
                        </details>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm mb-2 text-slate-700">📤 Export Chat to JSON</h3>
                        <button
                            onClick={() => {
                                const data = {
                                    chatName,
                                    participants,
                                    pages
                                };
                                const dataStr = JSON.stringify(data, null, 2);
                                const link = document.createElement('a');
                                link.href = `data:text/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                                link.download = `chat-${Date.now()}.json`;
                                link.click();
                            }}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            💾 Download as JSON
                        </button>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-sm mb-2 text-slate-700">🖼️ Export Images</h3>
                        <div className="space-y-2">
                            <button
                                onClick={onSaveScreenshot}
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm"
                            >
                                Save Current Page (.png)
                            </button>
                            <button
                                onClick={onSaveAllScreenshots}
                                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors text-sm"
                            >
                                Save All Pages (.png)
                            </button>
                        </div>
                    </div>
                </div>
            </AccordionSection>
        </div>
    );
};

export default Controls;
