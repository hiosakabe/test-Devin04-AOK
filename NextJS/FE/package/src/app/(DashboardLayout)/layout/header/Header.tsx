import React, { useContext, useState, useRef } from 'react';
import { 
  Box, AppBar, Toolbar, styled, Stack, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';
import { DashboardContext } from '@/app/context/DashboardContext';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAuthToken } from "@/utils/auth";
// components
import Profile from './Profile';
import Notification from './Notification';
import { IconMenu2, IconUpload, IconX } from '@tabler/icons-react';

const Header = () => {
  const { isMobileSidebar, setIsMobileSidebar } = useContext(DashboardContext);
  const [datasetModalOpen, setDatasetModalOpen] = useState(false);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset message after 3 seconds
  const resetMessage = () => {
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadStatus('idle');
      setMessage('');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDatasetUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadStatus('idle');
    
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/v1/upload/dataset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        setUploadStatus('success');
        setMessage('ファイルのアップロードに成功しました');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setUploadStatus('error');
        setMessage('アップロードに失敗しました');
      }
    } catch (error) {
      setUploadStatus('error');
      setMessage('エラーが発生しました');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      resetMessage();
    }
  };
  
  const handleEvaluationUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadStatus('idle');
    
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/v1/upload/evaluation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        setUploadStatus('success');
        setMessage('評価ファイルのアップロードに成功しました');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setUploadStatus('error');
        setMessage('アップロードに失敗しました');
      }
    } catch (error) {
      setUploadStatus('error');
      setMessage('エラーが発生しました');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      resetMessage();
    }
  };
  
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
    zIndex: 'unset'
  }));
  
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => setIsMobileSidebar(!isMobileSidebar)}
            sx={{
              display: {
                lg: "none",
                xs: "inline",
              },
            }}
          >
            <IconMenu2 width="20" height="20" />
          </IconButton>

          <Notification />

          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setDatasetModalOpen(true)}
              sx={{ borderRadius: "8px", textTransform: "none" }}
            >
              ＋データセット追加
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => setEvaluationModalOpen(true)}
              sx={{ borderRadius: "8px", textTransform: "none" }}
            >
              ＋評価追加
            </Button>

            <Profile />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>

      {/* Dataset Upload Modal */}
      <Dialog 
        open={datasetModalOpen} 
        onClose={() => setDatasetModalOpen(false)} 
        maxWidth="sm"
        fullWidth={true}
        sx={{ 
          "& .MuiDialog-paper": { 
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px"
          } 
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => setDatasetModalOpen(false)} 
            aria-label="back"
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          データセットアップロード
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".csv,.json,.txt"
              style={{ display: 'none' }}
              id="dataset-file-upload"
            />
            
            <Box 
              sx={{ 
                border: '2px dashed #e0e0e0',
                borderRadius: '8px',
                p: 4,
                textAlign: 'center',
                mb: 3,
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload size={48} color="#9e9e9e" />
              <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                クリックしてファイルを選択
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.disabled' }}>
                CSVまたはJSONファイル（最大10MB）
              </Typography>
            </Box>
            
            {file && (
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body1">{file.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{(file.size / 1024).toFixed(2)} KB • {file.type || 'unknown'}</Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleRemoveFile}
                  sx={{ p: 1 }}
                  aria-label="ファイルを削除"
                >
                  <IconX size={20} />
                </IconButton>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDatasetModalOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDatasetUpload}
            disabled={!file || uploading}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              position: 'relative'
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                アップロード中...
              </>
            ) : 'アップロード'}
          </Button>
        </DialogActions>
        
        {message && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: uploadStatus === 'success' ? 'success.light' : 'error.light',
              color: uploadStatus === 'success' ? 'success.dark' : 'error.dark',
              position: 'absolute',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: '4px',
              zIndex: 1300
            }}
          >
            {message}
          </Box>
        )}
      </Dialog>

      {/* Evaluation Upload Modal */}
      <Dialog 
        open={evaluationModalOpen} 
        onClose={() => setEvaluationModalOpen(false)} 
        maxWidth="sm"
        fullWidth={true}
        sx={{ 
          "& .MuiDialog-paper": { 
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px"
          } 
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => setEvaluationModalOpen(false)} 
            aria-label="back"
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          評価ファイルアップロード
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".csv,.json,.txt"
              style={{ display: 'none' }}
              id="evaluation-file-upload"
            />
            
            <Box 
              sx={{ 
                border: '2px dashed #e0e0e0',
                borderRadius: '8px',
                p: 4,
                textAlign: 'center',
                mb: 3,
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload size={48} color="#9e9e9e" />
              <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                クリックしてファイルを選択
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.disabled' }}>
                CSVまたはJSONファイル（最大10MB）
              </Typography>
            </Box>
            
            {file && (
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body1">{file.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{(file.size / 1024).toFixed(2)} KB • {file.type || 'unknown'}</Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleRemoveFile}
                  sx={{ p: 1 }}
                  aria-label="ファイルを削除"
                >
                  <IconX size={20} />
                </IconButton>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setEvaluationModalOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleEvaluationUpload}
            disabled={!file || uploading}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              position: 'relative'
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                アップロード中...
              </>
            ) : 'アップロード'}
          </Button>
        </DialogActions>
        
        {message && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: uploadStatus === 'success' ? 'success.light' : 'error.light',
              color: uploadStatus === 'success' ? 'success.dark' : 'error.dark',
              position: 'absolute',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: '4px',
              zIndex: 1300
            }}
          >
            {message}
          </Box>
        )}
      </Dialog>
    </>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
