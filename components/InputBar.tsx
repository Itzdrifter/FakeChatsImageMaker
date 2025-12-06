
import React from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

const InputBar: React.FC = () => {
    return (
        <div className="bg-ios-bg border-t border-gray-300 p-2 flex items-center space-x-2">
            <button className="p-1">
                <CameraIcon />
            </button>
            <div className="flex-1">
                <div className="bg-white border border-gray-300 rounded-2xl px-3 py-1.5 text-gray-400">
                    iMessage
                </div>
            </div>
            <button className="p-1">
                <MicrophoneIcon />
            </button>
        </div>
    );
};

export default InputBar;
