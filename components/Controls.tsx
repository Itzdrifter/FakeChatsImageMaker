
import React, { useState, useEffect } from 'react';
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
}

const Controls: React.FC<ControlsProps> = ({
    participants,
    onAddParticipant,
    onRemoveParticipant,
    onAddMessage,
    pages,
    currentPageIndex,
    onSetCurrentPageIndex,
    onAddPage,
    onRemovePage,
    onSaveScreenshot,
    onSaveAllScreenshots
}) => {
    const [openSection, setOpenSection] = useState('participants');
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantAvatar, setNewParticipantAvatar] = useState('');
    const [newMessageText, setNewMessageText] = useState('');
    const [selectedSender, setSelectedSender] = useState(participants[0]?.id || '');

    // Update selectedSender when participants change
    useEffect(() => {
        if (!selectedSender || !participants.find(p => p.id === selectedSender)) {
            setSelectedSender(participants[0]?.id || '');
        }
    }, [participants, selectedSender]);

    const handleAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newParticipantName.trim()) {
            onAddParticipant(newParticipantName.trim(), newParticipantAvatar.trim());
            setNewParticipantName('');
            setNewParticipantAvatar('');
        }
    };

    const handleAddMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessageText.trim() && selectedSender) {
            onAddMessage(newMessageText, selectedSender);
            setNewMessageText('');
        }
    };

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
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-4">
                    {participants.map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                                <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-medium text-sm text-slate-700">{p.name} {p.isMe && '(Me)'}</span>
                            </div>
                            {!p.isMe && <button onClick={() => onRemoveParticipant(p.id)} className="text-slate-500 hover:text-red-600 p-1 rounded-full"><TrashIcon className="w-4 h-4" /></button>}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddParticipant} className="space-y-3">
                    <input type="text" value={newParticipantName} onChange={e => setNewParticipantName(e.target.value)} placeholder="New participant name..." className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition" />
                    <input type="text" value={newParticipantAvatar} onChange={e => setNewParticipantAvatar(e.target.value)} placeholder="Avatar URL (optional)" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300" disabled={!newParticipantName.trim()}>
                        <PlusIcon className="w-4 h-4" /> Add Participant
                    </button>
                </form>
            </AccordionSection>

            <AccordionSection title="Add Message" id="message">
                <form onSubmit={handleAddMessage} className="space-y-3">
                    <select value={selectedSender} onChange={e => setSelectedSender(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition">
                        {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <textarea value={newMessageText} onChange={e => setNewMessageText(e.target.value)} placeholder="Type a message..." rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition resize-none"></textarea>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-green-300" disabled={!newMessageText.trim()}>
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
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPageIndex === index ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                            >
                                Page {index + 1}
                            </button>
                            {pages.length > 1 && (
                                <button 
                                    onClick={() => onRemovePage(index)} 
                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={onAddPage} className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                   <PlusIcon className="w-4 h-4" /> Add New Page
                </button>
            </AccordionSection>

            <AccordionSection title="Export" id="export">
                 <div className="space-y-3">
                    <button onClick={onSaveScreenshot} className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                        Save Current Page (.png)
                    </button>
                    <button onClick={onSaveAllScreenshots} className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
                        Save All Pages (.png)
                    </button>
                 </div>
            </AccordionSection>
        </div>
    );
};

export default Controls;