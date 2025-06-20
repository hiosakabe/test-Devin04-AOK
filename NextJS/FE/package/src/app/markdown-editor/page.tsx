'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { getAuthToken } from '@/utils/auth';

interface MarkdownNote {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function MarkdownEditorPage() {
  const [notes, setNotes] = useState<MarkdownNote[]>([]);
  const [currentNote, setCurrentNote] = useState<MarkdownNote | null>(null);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const tokenData = await getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/v1/notes`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
        if (notesData.length > 0 && !currentNote) {
          selectNote(notesData[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectNote = (note: MarkdownNote) => {
    setCurrentNote(note);
    setContent(note.content);
    setTitle(note.title);
  };

  const createNewNote = async () => {
    try {
      const tokenData = await getAuthToken();
      
      const newNote = {
        title: 'New Note',
        content: '# New Note\n\nStart writing your markdown here...',
      };
      
      const response = await fetch(`${API_BASE}/api/v1/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify(newNote),
      });
      
      if (response.ok) {
        const createdNote = await response.json();
        setNotes([...notes, createdNote]);
        selectNote(createdNote);
        setSaveStatus('New note created');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
      setSaveStatus('Failed to create note');
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const saveNote = async () => {
    if (!currentNote) return;
    
    try {
      const tokenData = await getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/v1/notes/${currentNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
        setCurrentNote(updatedNote);
        setSaveStatus('Note saved');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      setSaveStatus('Failed to save note');
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const tokenData = await getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/v1/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      
      if (response.ok) {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        
        if (currentNote?.id === noteId) {
          if (updatedNotes.length > 0) {
            selectNote(updatedNotes[0]);
          } else {
            setCurrentNote(null);
            setContent('');
            setTitle('');
          }
        }
        
        setSaveStatus('Note deleted');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      setSaveStatus('Failed to delete note');
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const searchNotes = async () => {
    if (!searchQuery.trim()) {
      loadNotes();
      return;
    }
    
    try {
      const tokenData = await getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/v1/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      
      if (response.ok) {
        const searchResults = await response.json();
        setNotes(searchResults);
      }
    } catch (error) {
      console.error('Failed to search notes:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        saveNote();
      } else if (e.key === 'n') {
        e.preventDefault();
        createNewNote();
      }
    }
  };

  const processMarkdownLinks = (content: string) => {
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      const linkedNote = notes.find(note => 
        note.title.toLowerCase() === linkText.toLowerCase()
      );
      
      if (linkedNote) {
        return `[${linkText}](#note-${linkedNote.id})`;
      }
      return `[${linkText}](#)`;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600">
          <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50" onKeyDown={handleKeyDown}>
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Markdown Notes</h1>
            <button
              onClick={createNewNote}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="New Note (Ctrl+N)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="flex">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchNotes()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchNotes}
              className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r hover:bg-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No notes found. Create your first note!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  currentNote?.id === note.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => selectNote(note)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {note.content.replace(/[#*`]/g, '').substring(0, 60)}...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-bold bg-transparent border-none outline-none flex-1"
                  placeholder="Note title..."
                />
                <div className="flex items-center space-x-2">
                  {saveStatus && (
                    <span className="text-sm text-green-600">{saveStatus}</span>
                  )}
                  <button
                    onClick={saveNote}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    title="Save (Ctrl+S)"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex">
              <div className="w-1/2 border-r border-gray-200">
                <div className="p-2 bg-gray-100 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Editor</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-4 resize-none outline-none font-mono text-sm"
                  placeholder="Start writing your markdown here..."
                />
              </div>
              
              <div className="w-1/2">
                <div className="p-2 bg-gray-100 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Preview</span>
                </div>
                <div className="h-full overflow-y-auto p-4 prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {processMarkdownLinks(content)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">Select a note to start editing</p>
              <p className="text-sm mt-2">Or create a new note to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
