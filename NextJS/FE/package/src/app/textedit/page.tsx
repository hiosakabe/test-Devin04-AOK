'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAuthHeaders } from '@/utils/auth';

export default function TextEditPage() {
  const [text, setText] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lines = text.split('\n');
  
  // Clear any existing timeout when component unmounts
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Helper function to show status messages with auto-disappearing behavior
  const showStatusMessage = (message: string, type: 'success' | 'error') => {
    // Clear any existing timeout
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    
    setSaveStatus(message);
    setStatusType(type);
    
    // Set timeout to clear message
    const timeout = setTimeout(() => {
      setSaveStatus('');
    }, type === 'success' ? 3000 : 5000); // 3 seconds for success, 5 for errors
    
    statusTimeoutRef.current = timeout;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showStatusMessage('テキストがコピーされました', 'success');
      })
      .catch(err => {
        console.error('コピーに失敗しました:', err);
        showStatusMessage('コピーに失敗しました', 'error');
      });
  };
  
  const handlePublish = async () => {
    try {
      // Get authentication headers using the utility function
      const headers = await getAuthHeaders();

      // Send text to backend with token
      const response = await fetch("http://localhost:8000/api/v1/textbox_commit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: text
        }),
      });
      
      if (response.ok) {
        showStatusMessage('公開されました', 'success');
      } else {
        showStatusMessage('公開に失敗しました', 'error');
      }
    } catch (error) {
      console.error('公開に失敗しました:', error);
      showStatusMessage('公開に失敗しました', 'error');
    }
  };
  
  const handleSaveDraft = async () => {
    try {
      // Get authentication headers using the utility function
      const headers = await getAuthHeaders();

      // Send text to backend with token
      const res2 = await fetch("http://localhost:8000/api/v1/textbox_draft", {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: text
        }),
      });
      
      if (res2.ok) {
        showStatusMessage('下書きが保存されました', 'success');
      } else {
        showStatusMessage('保存に失敗しました', 'error');
      }
    } catch (error) {
      console.error('下書き保存に失敗しました:', error);
      showStatusMessage('保存に失敗しました', 'error');
    }
  };

  useEffect(() => {
    const loadDraft = async () => {
      try {
        setIsLoading(true);
        // Get authentication headers
        const headers = await getAuthHeaders();
        
        // Fetch latest draft
        const response = await fetch("http://localhost:8000/api/v1/textbox_draft", {
          method: "GET",
          headers,
        });
        
        if (response.ok) {
          const draftData = await response.json();
          setText(draftData.content);
        } else if (response.status !== 404) {
          // Only show error if it's not a 404 (no drafts found)
          console.error('下書きの読み込みに失敗しました:', response.statusText);
          showStatusMessage('読み込みに失敗しました', 'error');
        }
      } catch (error) {
        console.error('下書きの読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDraft();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">リッチテキストエディタ</h1>
      <div className="relative flex flex-row flex-grow border border-gray-300 rounded-md overflow-hidden">
        <button 
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200 transition-colors flex items-center z-10"
        >
          <span className="mr-1">Copy</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
        
        {/* Add Publish button */}
        <button 
          onClick={handlePublish}
          className="absolute top-2 right-[152px] px-3 py-1 bg-green-100 text-green-700 rounded border border-green-300 hover:bg-green-200 transition-colors flex items-center z-10"
        >
          <span className="mr-1">公開</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        {/* Add Save Draft button */}
        <button 
          onClick={handleSaveDraft}
          className="absolute top-2 right-24 px-3 py-1 bg-blue-100 text-blue-700 rounded border border-blue-300 hover:bg-blue-200 transition-colors flex items-center z-10"
        >
          <span className="mr-1">下書き保存</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </button>
        
        {/* Add save status indicator with dynamic styling based on status type */}
        {saveStatus && (
          <div className={`absolute top-2 right-48 px-3 py-1 rounded border z-10 transition-opacity ${
            statusType === 'success' 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : 'bg-red-100 text-red-700 border-red-300'
          }`}>
            {saveStatus}
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
            <div className="text-blue-600">
              <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        )}
        <div className="line-numbers bg-gray-100 py-2 px-2 text-right text-gray-500 select-none">
          {lines.map((_, i) => (
            <div key={i} className="line-number">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          className="flex-grow p-2 outline-none resize-none font-mono"
          value={text}
          onChange={handleTextChange}
          placeholder="ここにテキストを入力してください..."
        />
      </div>
    </div>
  );
}
