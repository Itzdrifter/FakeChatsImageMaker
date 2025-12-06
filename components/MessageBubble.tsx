
import React, { useRef, useState, useCallback } from 'react';
import { type Message, type Participant } from '../types';
import { useDrag, useDrop, type XYCoord } from 'react-dnd';
import { TrashIcon } from './icons/TrashIcon';

interface MessageBubbleProps {
    id: any;
    index: number;
    message: Message;
    sender: Participant;
    onRemove: (id: string) => void;
    moveMessage: (dragIndex: number, hoverIndex: number) => void;
    onEditMessage: (id: string, text: string, senderId: string) => void;
    onMoveMessageUp: (id: string) => void;
    onMoveMessageDown: (id: string) => void;
    participants: Participant[];
}

const ItemTypes = {
    MESSAGE: 'message',
};

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
    id, 
    index, 
    message, 
    sender, 
    onRemove, 
    moveMessage, 
    onEditMessage,
    onMoveMessageUp,
    onMoveMessageDown,
    participants 
}) => {
    const isMe = sender.isMe;
    const ref = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);
    const [editSenderId, setEditSenderId] = useState(message.senderId);

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any }>({
        accept: ItemTypes.MESSAGE,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveMessage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.MESSAGE,
        item: () => ({ id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const handleSave = useCallback(() => {
        if (editText.trim()) {
            onEditMessage(id, editText.trim(), editSenderId);
            setIsEditing(false);
        }
    }, [editText, editSenderId, id, onEditMessage]);

    const handleCancel = useCallback(() => {
        setEditText(message.text);
        setEditSenderId(message.senderId);
        setIsEditing(false);
    }, [message.text, message.senderId]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }, [handleSave, handleCancel]);

    const bubbleClasses = isMe
        ? 'bg-ios-blue text-white self-end'
        : 'bg-ios-gray text-black self-start';

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`flex items-end gap-2 max-w-[85%] group ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
        >
            {!isMe && !isEditing && (
                <img
                    src={sender.avatarUrl}
                    alt={sender.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
            )}
            {isEditing ? (
                <div className="bg-slate-50 rounded-2xl p-3 space-y-2 flex-1 border-2 border-blue-500">
                    <div className="flex gap-2">
                        <select
                            value={editSenderId}
                            onChange={(e) => setEditSenderId(e.target.value)}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                        >
                            {participants.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-300 outline-none"
                        rows={2}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs font-medium hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 bg-slate-400 text-white py-1 px-2 rounded text-xs font-medium hover:bg-slate-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={`${bubbleClasses} rounded-2xl px-3 py-2 break-words cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setIsEditing(true)}>
                        {message.text}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <button
                            onClick={() => onMoveMessageUp(message.id)}
                            className="text-slate-400 hover:text-blue-600 p-1 text-xs"
                            title="Move up"
                        >
                            ↑
                        </button>
                        <button
                            onClick={() => onMoveMessageDown(message.id)}
                            className="text-slate-400 hover:text-blue-600 p-1 text-xs"
                            title="Move down"
                        >
                            ↓
                        </button>
                        <button
                            onClick={() => onRemove(message.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MessageBubble;