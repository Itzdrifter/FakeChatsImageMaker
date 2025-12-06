
import React, { useRef } from 'react';
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
}

const ItemTypes = {
    MESSAGE: 'message',
};

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ id, index, message, sender, onRemove, moveMessage }) => {
    const isMe = sender.isMe;
    const ref = useRef<HTMLDivElement>(null);

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

    const bubbleClasses = isMe
        ? 'bg-ios-blue text-white self-end'
        : 'bg-ios-gray text-black self-start';

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`flex items-end gap-2 max-w-[80%] group ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
        >
            {!isMe && (
                <img
                    src={sender.avatarUrl}
                    alt={sender.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
            )}
            <div className={`${bubbleClasses} rounded-2xl px-3 py-2 break-words`}>
                {message.text}
            </div>
             <button onClick={() => onRemove(message.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 p-1">
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default MessageBubble;