import React, { useState } from 'react';

const PrivacyWarning: React.FC = () => {
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed) return null;

    return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-md shadow-sm">
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.125 2.357-1.125 3.03 0l6.28 10.875c.673 1.125-.168 2.5-1.515 2.5H3.72c-1.347 0-2.188-1.375-1.515-2.5L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V5.75A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 text-sm">Privacy Notice</h3>
                    <p className="text-amber-800 text-sm mt-1">
                        <strong>Nothing is stored on our servers.</strong> All your data stays on your device. Make sure to download your chat images before closing the browser, as all data will be lost on page refresh.
                    </p>
                </div>
                <button
                    onClick={() => setIsDismissed(true)}
                    className="flex-shrink-0 text-amber-500 hover:text-amber-600 transition-colors"
                    aria-label="Dismiss warning"
                >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PrivacyWarning;
