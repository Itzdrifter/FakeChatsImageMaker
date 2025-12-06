
import React, { useEffect, useRef } from 'react';
import { type Message, type Participant } from '../types';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
    messages: Message[];
    participants: Participant[];
    onRemoveMessage: (id: string) => void;
    moveMessage: (dragIndex: number, hoverIndex: number) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, participants, onRemoveMessage, moveMessage }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const findSender = (senderId: string) => {
        return participants.find(p => p.id === senderId);
    };

    return (
        <div className="flex-1 overflow-y-auto p-3 bg-white">
            <div className="flex flex-col space-y-2">
                {messages.map((msg, index) => {
                    const sender = findSender(msg.senderId);
                    if (!sender) return null;

                    return (
                        <MessageBubble
                            key={msg.id}
                            id={msg.id}
                            index={index}
                            message={msg}
                            sender={sender}
                            onRemove={onRemoveMessage}
                            moveMessage={moveMessage}
                        />
                    );
                })}
            </div>
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default ChatArea;
