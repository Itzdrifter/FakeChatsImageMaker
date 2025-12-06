
import React, { forwardRef } from 'react';
import { type Participant, type Message } from '../types';
import Header from './Header';
import ChatArea from './ChatArea';
import InputBar from './InputBar';

interface IphoneFrameProps {
    messages: Message[];
    participants: Participant[];
    onRemoveMessage: (id: string) => void;
    moveMessage: (dragIndex: number, hoverIndex: number) => void;
    chatName: string;
    onChatNameChange: (name: string) => void;
}

const IphoneFrame = forwardRef<HTMLDivElement, IphoneFrameProps>(({ messages, participants, onRemoveMessage, moveMessage, chatName, onChatNameChange }, ref) => {
    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[780px] w-full shadow-2xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                <div ref={ref} className="rounded-[2rem] overflow-hidden w-full h-full bg-white flex flex-col">
                    <div className="bg-ios-bg px-3 pt-1 text-black text-xs font-semibold">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                                <span className="inline-block w-1 h-1 bg-black rounded-full"></span>
                                <span className="inline-block w-1 h-1 bg-black rounded-full"></span>
                                <span className="inline-block w-1 h-1 bg-black rounded-full"></span>
                                <span className="inline-block w-1 h-1 bg-black rounded-full opacity-50"></span>
                                <span className="font-bold">Sprint</span>
                            </div>
                            <span>4:08 PM</span>
                             <div className="flex items-center space-x-1">
                                <span>75%</span>
                                <div className="w-5 h-2.5 border border-black rounded-sm flex justify-end items-center p-px">
                                    <div className="w-3/4 h-full bg-black rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Header participants={participants} chatName={chatName} onChatNameChange={onChatNameChange} />
                    <ChatArea messages={messages} participants={participants} onRemoveMessage={onRemoveMessage} moveMessage={moveMessage}/>
                    <InputBar />
                </div>
            </div>
        </div>
    );
});

IphoneFrame.displayName = 'IphoneFrame';

export default IphoneFrame;
