import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const Tutorial: React.FC = () => {
    const [expandedStep, setExpandedStep] = useState<number | null>(0);

    const steps = [
        {
            title: "1. Add Participants",
            description: "Start by adding people to your chat. Click on the Participants section and enter their names. You can optionally add custom avatar URLs or use auto-generated avatars.",
            tips: [
                "Give each participant a unique name",
                "Avatar URLs are optional - we'll generate them for you",
                "You can edit or remove participants anytime"
            ]
        },
        {
            title: "2. Compose Messages",
            description: "Switch to the 'Add Message' section to write your conversation. Select who should send each message and type what they should say.",
            tips: [
                "Select the sender from the dropdown",
                "Type your message in the text area",
                "Messages appear in the iPhone frame in real-time"
            ]
        },
        {
            title: "3. Edit & Reorder",
            description: "You can edit the chat name by clicking on it in the iPhone header. Drag messages up or down to reorder them. Hover over messages to delete them.",
            tips: [
                "Click the chat name to edit it",
                "Drag messages to reorder them",
                "Hover over a message and click the trash icon to delete"
            ]
        },
        {
            title: "4. Create Multiple Pages",
            description: "Want multiple screenshots? Create additional pages in the Pages section. Each page is a separate conversation that you can download individually.",
            tips: [
                "Click 'Add New Page' to create another chat",
                "Switch between pages using the page buttons",
                "Each page saves independently"
            ]
        },
        {
            title: "5. Download Your Chat",
            description: "When you're happy with your chat, download it as a high-quality PNG image. Choose to download the current page or all pages at once.",
            tips: [
                "Use 'Save Current Page' for a single screenshot",
                "Use 'Save All Pages' to download the whole conversation",
                "Images are downloaded in high resolution (3x scale)"
            ]
        },
        {
            title: "6. Important: Save Your Work",
            description: "⚠️ Remember: All data is stored ONLY in your browser's memory. When you refresh the page or close the browser, your chat will be lost forever. Always download your images before leaving!",
            tips: [
                "Download before refreshing the page",
                "No data is saved on our servers",
                "Close the browser = data is gone",
                "Keep backups of your downloaded images"
            ]
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">📚 How to Use</h2>
            <p className="text-slate-600 mb-6">Follow these steps to create your perfect iMessage chat:</p>
            
            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                            className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                        >
                            <span className="font-semibold text-slate-800">{step.title}</span>
                            <ChevronDownIcon className={`w-5 h-5 text-slate-600 transition-transform ${expandedStep === index ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {expandedStep === index && (
                            <div className="px-4 py-4 bg-white border-t border-slate-200">
                                <p className="text-slate-700 mb-3">{step.description}</p>
                                <div className="bg-blue-50 rounded-md p-3 border-l-4 border-blue-500">
                                    <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tips:</p>
                                    <ul className="space-y-1">
                                        {step.tips.map((tip, tipIndex) => (
                                            <li key={tipIndex} className="text-sm text-blue-800">
                                                • {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-900 text-sm">
                    <strong>⚠️ Remember:</strong> All your data is stored locally in your browser. It will be erased when you refresh or close this page. Always download your images before leaving!
                </p>
            </div>
        </div>
    );
};

export default Tutorial;
