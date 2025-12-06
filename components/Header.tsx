
import React, { useState } from 'react';
import { type Participant } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface HeaderProps {
    participants: Participant[];
    chatName: string;
    onChatNameChange: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ participants, chatName, onChatNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(chatName);
    const otherParticipants = participants.filter(p => !p.isMe);

    const handleSave = () => {
        if (editValue.trim()) {
            onChatNameChange(editValue.trim());
        } else {
            setEditValue(chatName);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditValue(chatName);
            setIsEditing(false);
        }
    };

    return (
        <header className="bg-ios-bg border-b border-gray-300 px-3 py-2 text-center sticky top-0 z-10">
            <div className="relative flex items-center justify-center h-full">
                <button className="absolute left-0 flex items-center text-ios-blue">
                    <ChevronLeftIcon />
                    <span className="text-base">Messages</span>
                </button>
                <div className="flex flex-col items-center">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="font-bold text-base leading-tight border-b-2 border-ios-blue bg-transparent text-center outline-none px-2"
                        />
                    ) : (
                        <h1 
                            className="font-bold text-base leading-tight cursor-pointer hover:text-gray-600 transition-colors"
                            onClick={() => {
                                setEditValue(chatName);
                                setIsEditing(true);
                            }}
                        >
                            {chatName}
                        </h1>
                    )}
                    {otherParticipants.length > 1 && (
                         <div className="flex -space-x-2 mt-1">
                            {otherParticipants.slice(0, 4).map(p => (
                                <img key={p.id} src={p.avatarUrl} alt={p.name} className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                    )}
                </div>
                <button className="absolute right-0 text-ios-blue text-base">Details</button>
            </div>
        </header>
    );
};

export default Header;
