
import React, { useState, useRef, useCallback } from 'react';
import { type Participant, type Message } from './types';
import Controls from './components/Controls';
import IphoneFrame from './components/IphoneFrame';
import PrivacyWarning from './components/PrivacyWarning';
import Tutorial from './components/Tutorial';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// @ts-ignore
const html2canvas = window.html2canvas;

const App: React.FC = () => {
    const defaultParticipants: Participant[] = [
        { id: 'me', name: 'Me', avatarUrl: '', isMe: true },
        { id: 'person2', name: 'Alex', avatarUrl: `https://picsum.photos/seed/alex/100`, isMe: false },
        { id: 'person3', name: 'Taylor', avatarUrl: `https://picsum.photos/seed/taylor/100`, isMe: false },
    ];

    const defaultMessages: Message[][] = [
        [
            { id: 'msg1', text: 'Hey, are we still on for tonight?', senderId: 'person2' },
            { id: 'msg2', text: 'Yeah, I\'m in! What time?', senderId: 'person3' },
            { id: 'msg3', text: 'I can be ready by 8. Does that work for everyone?', senderId: 'me' },
            { id: 'msg4', text: 'Perfect! See you then.', senderId: 'person2' },
        ],
    ];

    const [participants, setParticipants] = useState<Participant[]>(defaultParticipants);
    const [pages, setPages] = useState<Message[][]>(defaultMessages);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [chatName, setChatName] = useState<string>('Alex, Taylor');
    const [showTutorial, setShowTutorial] = useState<boolean>(true);

    const screenshotRef = useRef<HTMLDivElement>(null);

    const addParticipant = (name: string, avatarUrl: string) => {
        const newParticipant: Participant = {
            id: `person${Date.now()}`,
            name,
            avatarUrl: avatarUrl || `https://picsum.photos/seed/${name}/100`,
            isMe: false,
        };
        setParticipants([...participants, newParticipant]);
    };

    const updateParticipant = (id: string, name: string, avatarUrl: string) => {
        setParticipants(
            participants.map((p) => (p.id === id ? { ...p, name, avatarUrl } : p))
        );
    };

    const removeParticipant = (id: string) => {
        setParticipants(participants.filter((p) => p.id !== id));
        const newPages = pages.map(page => page.filter(msg => msg.senderId !== id));
        setPages(newPages);
    };

    const addMessage = (text: string, senderId: string) => {
        const newMessage: Message = { id: `msg${Date.now()}`, text, senderId };
        const newPages = [...pages];
        newPages[currentPageIndex] = [...newPages[currentPageIndex], newMessage];
        setPages(newPages);
    };
    
    const removeMessage = (id: string) => {
      const newPages = pages.map((page, index) => {
          if (index === currentPageIndex) {
              return page.filter(msg => msg.id !== id);
          }
          return page;
      });
      setPages(newPages);
    };

    const editMessage = (id: string, text: string, senderId: string) => {
      const newPages = pages.map((page, index) => {
          if (index === currentPageIndex) {
              return page.map(msg => msg.id === id ? { ...msg, text, senderId } : msg);
          }
          return page;
      });
      setPages(newPages);
    };

    const moveMessageUp = (id: string) => {
      const newPages = pages.map((page, index) => {
          if (index === currentPageIndex) {
              const msgIndex = page.findIndex(msg => msg.id === id);
              if (msgIndex > 0) {
                  const newPage = [...page];
                  [newPage[msgIndex], newPage[msgIndex - 1]] = [newPage[msgIndex - 1], newPage[msgIndex]];
                  return newPage;
              }
          }
          return page;
      });
      setPages(newPages);
    };

    const moveMessageDown = (id: string) => {
      const newPages = pages.map((page, index) => {
          if (index === currentPageIndex) {
              const msgIndex = page.findIndex(msg => msg.id === id);
              if (msgIndex < page.length - 1) {
                  const newPage = [...page];
                  [newPage[msgIndex], newPage[msgIndex + 1]] = [newPage[msgIndex + 1], newPage[msgIndex]];
                  return newPage;
              }
          }
          return page;
      });
      setPages(newPages);
    };

    const moveMessage = useCallback((dragIndex: number, hoverIndex: number) => {
        setPages(prevPages => {
            const newPages = [...prevPages];
            const currentPage = [...newPages[currentPageIndex]];
            const [draggedItem] = currentPage.splice(dragIndex, 1);
            currentPage.splice(hoverIndex, 0, draggedItem);
            newPages[currentPageIndex] = currentPage;
            return newPages;
        });
    }, [currentPageIndex]);

    const importFromJSON = (jsonData: any) => {
        try {
            const { chatName: importedChatName, participants: importedParticipants, pages: importedPages } = jsonData;
            
            // Process participants
            if (Array.isArray(importedParticipants)) {
                const newParticipants = importedParticipants.map((p: any) => ({
                    id: p.id || `person${Date.now()}-${Math.random()}`,
                    name: p.name || 'New User',
                    avatarUrl: p.avatarUrl || `https://picsum.photos/seed/${p.name || 'user'}/100`,
                    isMe: p.isMe === true
                }));
                setParticipants(newParticipants);
            }

            // Process chat name
            if (importedChatName) {
                setChatName(importedChatName);
            }

            // Process pages and messages
            if (Array.isArray(importedPages)) {
                const newPages = importedPages.map((page: any) => {
                    if (Array.isArray(page)) {
                        return page.map((msg: any) => ({
                            id: msg.id || `msg${Date.now()}-${Math.random()}`,
                            text: msg.text || '',
                            senderId: msg.senderId || ''
                        }));
                    }
                    return [];
                });
                setPages(newPages);
            }

            return true;
        } catch (error) {
            console.error('Failed to import JSON:', error);
            return false;
        }
    };

    const addPage = () => {
        setPages([...pages, []]);
        setCurrentPageIndex(pages.length);
    };
    
    const removePage = (index: number) => {
        if (pages.length <= 1) return;
        const newPages = pages.filter((_, i) => i !== index);
        setPages(newPages);
        setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    };

    const handleSaveScreenshot = async (pageIndex: number) => {
        if (!screenshotRef.current || !html2canvas) return;

        // Temporarily switch to the page to be screenshotted
        const originalIndex = currentPageIndex;
        setCurrentPageIndex(pageIndex);

        // Allow time for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const canvas = await html2canvas(screenshotRef.current, {
                useCORS: true,
                backgroundColor: null,
                scale: 3 // Higher scale for better quality
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `imessage-chat-page-${pageIndex + 1}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Oops, something went wrong!', error);
        } finally {
            // Switch back to the original page
            setCurrentPageIndex(originalIndex);
        }
    };

    const handleSaveAllScreenshots = async () => {
        for (let i = 0; i < pages.length; i++) {
            await handleSaveScreenshot(i);
            // Add a small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-slate-800">iMessage Chat Creator</h1>
                    <p className="text-slate-600 mt-2">Craft your perfect conversation and save it as a high-quality image.</p>
                </header>
                <PrivacyWarning />
                {showTutorial && (
                    <div className="relative">
                        <Tutorial />
                        <button
                            onClick={() => setShowTutorial(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className="flex justify-end mb-4">
                    {!showTutorial && (
                        <button
                            onClick={() => setShowTutorial(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            📚 Show Tutorial
                        </button>
                    )}
                </div>
                <main className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3 xl:w-1/4">
                        <Controls
                            participants={participants}
                            onAddParticipant={addParticipant}
                            onUpdateParticipant={updateParticipant}
                            onRemoveParticipant={removeParticipant}
                            onAddMessage={addMessage}
                            pages={pages}
                            currentPageIndex={currentPageIndex}
                            onSetCurrentPageIndex={setCurrentPageIndex}
                            onAddPage={addPage}
                            onRemovePage={removePage}
                            onSaveScreenshot={() => handleSaveScreenshot(currentPageIndex)}
                            onSaveAllScreenshots={handleSaveAllScreenshots}
                            onImportJSON={importFromJSON}
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-start items-center">
                        <IphoneFrame
                            ref={screenshotRef}
                            messages={pages[currentPageIndex] || []}
                            participants={participants}
                            onRemoveMessage={removeMessage}
                            moveMessage={moveMessage}
                            onEditMessage={editMessage}
                            onMoveMessageUp={moveMessageUp}
                            onMoveMessageDown={moveMessageDown}
                            chatName={chatName}
                            onChatNameChange={setChatName}
                            currentPageIndex={currentPageIndex}
                            totalPages={pages.length}
                            onPageChange={setCurrentPageIndex}
                        />
                    </div>
                </main>
            </div>
        </DndProvider>
    );
};

export default App;