import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import { getAuthToken } from "@/utils/auth";

const products = [
  {
    id: "1",
    name: "Sunil Joshi",
    post: "Web Designer",
    pname: "Elite Admin",
    priority: "Low",
    pbg: "primary.main",
    budget: "3.9",
  },
  {
    id: "2",
    name: "Andrew McDownland",
    post: "Project Manager",
    pname: "Real Homes WP Theme",
    priority: "Medium",
    pbg: "secondary.main",
    budget: "24.5",
  },
  {
    id: "3",
    name: "Christopher Jamil",
    post: "Project Manager",
    pname: "MedicalPro WP Theme",
    priority: "High",
    pbg: "error.main",
    budget: "12.8",
  },
  {
    id: "4",
    name: "Nirav Joshi",
    post: "Frontend Engineer",
    pname: "Hosting Press HTML",
    priority: "Critical",
    pbg: "success.main",
    budget: "2.4",
  },
];

const ProductPerfomance = () => {
  // 月選択用
  const [month, setMonth] = useState("1");

  // モーダル開閉用
  const [open, setOpen] = useState(false);

  // クリックした行の情報を保持
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Input/Output content state
  const [inputContent, setInputContent] = useState<string>('');
  const [outputContent, setOutputContent] = useState<string>('');
  
  // Save status and loading state
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: any) => {
    setMonth(event.target.value);
  };

  // 行クリック時
  const handleRowClick = (product: any) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  // モーダル閉じるとき
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };
  
  // Handle input content change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(e.target.value);
  };

  // Handle output content change
  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputContent(e.target.value);
  };
  
  // Handle saving draft
  const handleSaveDraft = async () => {
    try {
      setIsLoading(true);
      setSaveStatus(''); // Clear any existing status message
      
      // Get authentication token
      const tokenData = await getAuthToken();

      // Send text to backend with token
      const response = await fetch("http://localhost:8000/api/v1/prompt_draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          input_content: inputContent,
          output_content: outputContent
        }),
      });
      
      if (response.ok) {
        setSaveStatus('下書きが保存されました');
        // Use a cleanup function to ensure the timeout is cleared if component unmounts
        const timer = setTimeout(() => setSaveStatus(''), 3000); // Clear status after 3 seconds
        return () => clearTimeout(timer);
      } else {
        setSaveStatus('保存に失敗しました');
        const timer = setTimeout(() => setSaveStatus(''), 5000); // Clear error status after 5 seconds
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('下書き保存に失敗しました:', error);
      setSaveStatus('保存に失敗しました');
      const timer = setTimeout(() => setSaveStatus(''), 5000); // Clear error status after 5 seconds
      return () => clearTimeout(timer);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle publishing
  const handlePublish = async () => {
    try {
      setIsLoading(true);
      setSaveStatus(''); // Clear any existing status message
      
      // Get authentication token
      const tokenData = await getAuthToken();

      // Send text to backend with token
      const response = await fetch("http://localhost:8000/api/v1/prompt_commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          input_content: inputContent,
          output_content: outputContent
        }),
      });
      
      if (response.ok) {
        setSaveStatus('公開されました');
        const timer = setTimeout(() => setSaveStatus(''), 3000); // Clear status after 3 seconds
        return () => clearTimeout(timer);
      } else {
        setSaveStatus('公開に失敗しました');
        const timer = setTimeout(() => setSaveStatus(''), 5000); // Clear error status after 5 seconds
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('公開に失敗しました:', error);
      setSaveStatus('公開に失敗しました');
      const timer = setTimeout(() => setSaveStatus(''), 5000); // Clear error status after 5 seconds
      return () => clearTimeout(timer);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load the latest draft when modal opens
  useEffect(() => {
    let statusTimer: NodeJS.Timeout;
    
    const loadDraft = async () => {
      if (!open) return; // Only load draft when modal is open
      
      try {
        setIsLoading(true);
        setSaveStatus(''); // Clear any existing status message
        
        // Get authentication token
        const tokenData = await getAuthToken();
        
        // Fetch latest draft
        const response = await fetch("http://localhost:8000/api/v1/prompt_draft", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });
        
        if (response.ok) {
          const draftData = await response.json();
          setInputContent(draftData.input_content);
          setOutputContent(draftData.output_content);
        } else if (response.status !== 404) {
          // Only show error if it's not a 404 (no drafts found)
          console.error('下書きの読み込みに失敗しました:', response.statusText);
          setSaveStatus('読み込みに失敗しました');
          statusTimer = setTimeout(() => setSaveStatus(''), 5000);
        }
      } catch (error) {
        console.error('下書きの読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDraft();
    
    // Cleanup function to clear any timeouts when component unmounts or effect reruns
    return () => {
      if (statusTimer) clearTimeout(statusTimer);
    };
  }, [open]);

  return (
    <>
      <BaseCard
        title="Product Perfomance"
        action={
          <Select
            labelId="month-dd"
            id="month-dd"
            value={month}
            size="small"
            onChange={handleChange}
          >
            <MenuItem value={1}>March 2025</MenuItem>
            <MenuItem value={2}>April 2025</MenuItem>
            <MenuItem value={3}>May 2025</MenuItem>
          </Select>
        }
      >
        <TableContainer
          sx={{
            width: {
              xs: "274px",
              sm: "100%",
            },
          }}
        >
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Assigned
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Priority
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Budget
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  // 行クリックでモーダル表示
                  onClick={() => handleRowClick(product)}
                  hover
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Typography fontSize="15px" fontWeight={500}>
                      {product.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography color="textSecondary" fontSize="13px">
                          {product.post}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="h6">
                      {product.pname}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor: product.pbg,
                        color: "#fff",
                      }}
                      size="small"
                      label={product.priority}
                    ></Chip>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">${product.budget}k</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BaseCard>

      {/* Enhanced Modal with two-column layout */}
<Dialog 
  open={open} 
  onClose={handleClose} 
  maxWidth="lg"
  fullWidth={true}
  sx={{ 
    "& .MuiDialog-paper": { 
      borderRadius: "12px",
      width: "90%",
      maxWidth: "1200px",
      height: "80%",
      maxHeight: "800px"
    } 
  }}
>
  <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center' }}>
    {/* Back button */}
    <IconButton 
      edge="start" 
      color="inherit" 
      onClick={handleClose} 
      aria-label="back"
      sx={{ mr: 1 }}
    >
      <ArrowBackIcon />
    </IconButton>
    Prompt Editor
  </DialogTitle>
  
  <DialogContent dividers sx={{ p: 3 }}>
    {/* Two column layout */}
    <Grid container spacing={3}>
      {/* Input column (left) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Input label */}
          <Typography variant="h6" gutterBottom>
            Input
          </Typography>
          
          {/* Input text box */}
          <Box sx={{ 
            flex: 1, 
            border: '1px solid #e0e0e0', 
            borderRadius: '4px', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            mb: 2
          }}>
            <textarea
              style={{ 
                flex: 1,
                padding: '12px',
                outline: 'none',
                resize: 'none',
                border: 'none',
                fontFamily: 'monospace',
                minHeight: '400px'
              }}
              value={inputContent}
              onChange={handleInputChange}
              placeholder="Enter input text here..."
            />
          </Box>
        </Paper>
      </Grid>
      
      {/* Output column (right) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Output label */}
          <Typography variant="h6" gutterBottom>
            Output
          </Typography>
          
          {/* Output text box */}
          <Box sx={{ 
            flex: 1, 
            border: '1px solid #e0e0e0', 
            borderRadius: '4px', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            mb: 2
          }}>
            {/* Save status indicator */}
            {saveStatus && (
              <Box sx={{ 
                position: 'absolute', 
                top: '8px', 
                right: '8px', 
                px: 2, 
                py: 1, 
                backgroundColor: 'rgba(0, 200, 83, 0.1)', 
                borderRadius: '4px',
                zIndex: 10
              }}>
                <Typography variant="body2" color="primary">
                  {saveStatus}
                </Typography>
              </Box>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 20
              }}>
                <Typography color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  Loading...
                </Typography>
              </Box>
            )}
            
            <textarea
              style={{ 
                flex: 1,
                padding: '12px',
                outline: 'none',
                resize: 'none',
                border: 'none',
                fontFamily: 'monospace',
                minHeight: '400px'
              }}
              value={outputContent}
              onChange={handleOutputChange}
              placeholder="Enter output text here..."
            />
          </Box>
          
          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              onClick={handleSaveDraft}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1.2,
                backgroundColor: '#4285F4',
                '&:hover': {
                  backgroundColor: '#2A75F3',
                }
              }}
            >
              一時保存
            </Button>
            
            <Button
              onClick={handlePublish}
              variant="contained"
              color="success"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1.2,
                backgroundColor: '#0F9D58',
                '&:hover': {
                  backgroundColor: '#0B8043',
                }
              }}
            >
              公開
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </DialogContent>
</Dialog>
    </>
  );
};

export default ProductPerfomance;
