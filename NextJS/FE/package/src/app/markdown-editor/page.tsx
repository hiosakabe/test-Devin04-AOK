'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { getAuthToken } from '@/utils/auth';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid2 as Grid,
  Paper,
  Divider,
  Chip,
  Stack,
  InputAdornment,
  Fade,
  Tooltip
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';

interface MarkdownNote {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const StyledSidebar = styled(Paper)(({ theme }) => ({
  height: '100vh',
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
}));

const StyledMainContent = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const StyledNoteCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  margin: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledEditorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  '& .editor-pane, & .preview-pane': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  '& .editor-pane': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

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
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }} onKeyDown={handleKeyDown}>
      <Grid container sx={{ height: '100%' }}>
        <Grid size={4}>
          <StyledSidebar elevation={0}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  Markdown Notes
                </Typography>
                <Tooltip title="New Note (Ctrl+N)">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={createNewNote}
                    sx={{ minWidth: 'auto', p: 1.5, borderRadius: 2 }}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </Tooltip>
              </Stack>
              
              <CustomTextField
                fullWidth
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && searchNotes()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={searchNotes} edge="end">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {notes.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No notes found. Create your first note!
                  </Typography>
                </Box>
              ) : (
                notes.map((note) => (
                  <Fade in key={note.id}>
                    <StyledNoteCard
                      selected={currentNote?.id === note.id}
                      onClick={() => selectNote(note)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" noWrap gutterBottom>
                              {note.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 1
                            }}>
                              {note.content.replace(/[#*`]/g, '').substring(0, 80)}...
                            </Typography>
                            <Chip 
                              label={new Date(note.updated_at).toLocaleDateString('ja-JP')}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            sx={{ ml: 1, opacity: 0.7, '&:hover': { opacity: 1, color: 'error.main' } }}
                          >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </StyledNoteCard>
                  </Fade>
                ))
              )}
            </Box>
          </StyledSidebar>
        </Grid>
        <Grid size={8}>
          <StyledMainContent>
            {currentNote ? (
              <>
                <Paper elevation={0} sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <CustomTextField
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      placeholder="Note title..."
                      variant="standard"
                      sx={{ 
                        flex: 1, 
                        mr: 3,
                        '& .MuiInput-input': { 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold',
                          color: 'text.primary'
                        }
                      }}
                    />
                    <Stack direction="row" spacing={2} alignItems="center">
                      {saveStatus && (
                        <Chip 
                          label={saveStatus}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      )}
                      <Button
                        variant="contained"
                        color="success"
                        onClick={saveNote}
                        sx={{ px: 3, py: 1, borderRadius: 2 }}
                      >
                        Save
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
                
                <StyledEditorContainer>
                  <Box className="editor-pane">
                    <Paper elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                        <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
                          Editor
                        </Typography>
                      </Stack>
                    </Paper>
                    <Box
                      component="textarea"
                      value={content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                      placeholder="Start writing your markdown here..."
                      sx={{
                        flex: 1,
                        p: 3,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'Monaco, Consolas, monospace',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        '&::placeholder': {
                          color: 'text.secondary',
                          opacity: 0.7
                        }
                      }}
                    />
                  </Box>
                  
                  <Box className="preview-pane">
                    <Paper elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="medium" color="text.secondary">
                          Preview
                        </Typography>
                      </Stack>
                    </Paper>
                    <Box sx={{ 
                      flex: 1, 
                      overflow: 'auto', 
                      p: 3, 
                      backgroundColor: 'background.paper',
                      '& .markdown-preview': {
                        fontFamily: 'inherit'
                      }
                    }}>
                      <div className="markdown-preview">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        >
                          {processMarkdownLinks(content)}
                        </ReactMarkdown>
                      </div>
                    </Box>
                  </Box>
                </StyledEditorContainer>
              </>
            ) : (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Stack spacing={3} alignItems="center">
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24" color="primary.main">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                  <Stack spacing={1}>
                    <Typography variant="h5" color="text.primary">
                      Select a note to start editing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Or create a new note to get started
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
          </StyledMainContent>
        </Grid>
      </Grid>
    </Box>
  );
}
