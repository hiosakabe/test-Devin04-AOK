import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
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
  Tabs,
  Tab,
  Grid,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import TabPanel from "./TabPanel";
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

// Sample data for linked runs
const linkedRuns = [
  {
    id: "101",
    name: "Run A",
    status: "Completed",
    date: "2025-03-20",
    metrics: "98.5%",
  },
  {
    id: "102",
    name: "Run B",
    status: "In Progress",
    date: "2025-03-21",
    metrics: "75.2%",
  },
  {
    id: "103",
    name: "Run C",
    status: "Failed",
    date: "2025-03-19",
    metrics: "45.8%",
  },
];

// Sample metadata
const metadata = {
  created: "2025-03-18",
  modified: "2025-03-22",
  owner: "Admin",
  version: "1.2.3",
  tags: ["production", "test", "experimental"],
};





const ProductPerfomance = () => {
  // 月選択用
  const [month, setMonth] = useState("1");

  // モーダル開閉用
  const [open, setOpen] = useState(false);

  // クリックした行の情報を保持
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Add new state for tab management
  const [tabValue, setTabValue] = useState(0);
  
  // Input/Output content state
  const [inputContent, setInputContent] = useState<string>('');
  const [outputContent, setOutputContent] = useState<string>('');
  
  // Line counting for editors
  const inputLines = inputContent.split('\n');
  const outputLines = outputContent.split('\n');
  
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

  // モーダル内の行クリック時（ネストされたモーダル用）
  const [nestedOpen, setNestedOpen] = React.useState(false);
  const [selectedRun, setSelectedRun] = React.useState<any>(null);

  const handleNestedRowClick = (run: any) => {
    setSelectedRun(run);
    // Reset input and output content
    setInputContent('');
    setOutputContent('');
    setSaveStatus('');
    setNestedOpen(true);
  };

  const handleNestedClose = () => {
    setNestedOpen(false);
    setSelectedRun(null);
  };

  // モーダル閉じるとき
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setTabValue(0); // Reset tab when modal closes
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle input content change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(e.target.value);
  };

  // Handle output content change
  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputContent(e.target.value);
  };
  
  // Handle copying input content
  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputContent)
      .then(() => {
        setSaveStatus('Input text copied to clipboard');
        const timer = setTimeout(() => setSaveStatus(''), 3000);
        return () => clearTimeout(timer);
      })
      .catch(err => {
        console.error('Copy failed:', err);
        setSaveStatus('Copy failed');
        const timer = setTimeout(() => setSaveStatus(''), 3000);
        return () => clearTimeout(timer);
      });
  };

  // Handle copying output content
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputContent)
      .then(() => {
        setSaveStatus('Output text copied to clipboard');
        const timer = setTimeout(() => setSaveStatus(''), 3000);
        return () => clearTimeout(timer);
      })
      .catch(err => {
        console.error('Copy failed:', err);
        setSaveStatus('Copy failed');
        const timer = setTimeout(() => setSaveStatus(''), 3000);
        return () => clearTimeout(timer);
      });
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
  
  // Load the latest draft when the nested modal opens
  useEffect(() => {
    const loadDraft = async () => {
      if (!nestedOpen) return; // Only load draft when modal is open
      
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
          setTimeout(() => setSaveStatus(''), 5000);
        }
      } catch (error) {
        console.error('下書きの読み込みに失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDraft();
  }, [nestedOpen]);

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

      {/* Enhanced Modal */}
<Dialog 
  open={open} 
  onClose={handleClose} 
  maxWidth="md"
  fullWidth={true}
  sx={{ 
    "& .MuiDialog-paper": { 
      borderRadius: "12px",
      width: "80%",
      maxWidth: "900px",
      height: "80%",
      maxHeight: "700px"
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
    Product Details
  </DialogTitle>
  
  {/* Tabs */}
  <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
    <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
      <Tab label="Example" id="tab-0" aria-controls="tabpanel-0" />
      <Tab label="Linked Runs" id="tab-1" aria-controls="tabpanel-1" />
      <Tab label="Metadata" id="tab-2" aria-controls="tabpanel-2" />
    </Tabs>
  </Box>
  
  <DialogContent dividers sx={{ p: 0 }}>
    {selectedProduct && (
      <>
        {/* Tab 1: Example - Product Details */}
        <TabPanel value={tabValue} index={0}>
          <Table
            aria-label="product-details"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            <TableBody>
              {/* ID */}
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize="15px" fontWeight={500}>
                    {selectedProduct.id}
                  </Typography>
                </TableCell>
              </TableRow>
              {/* Post */}
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Assigned
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedProduct.name}
                  </Typography>
                  <Typography color="textSecondary" fontSize="13px">
                    {selectedProduct.post}
                  </Typography>
                </TableCell>
              </TableRow>
              {/* Product Name */}
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {selectedProduct.pname}
                  </Typography>
                </TableCell>
              </TableRow>
              {/* Priority */}
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Priority
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      pl: "4px",
                      pr: "4px",
                      backgroundColor: selectedProduct.pbg,
                      color: "#fff",
                    }}
                    size="small"
                    label={selectedProduct.priority}
                  />
                </TableCell>
              </TableRow>
              {/* Budget */}
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Budget
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    ${selectedProduct.budget}k
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabPanel>
        
        {/* Tab 2: Linked Runs */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table aria-label="linked runs">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Metrics</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {linkedRuns.map((run) => (
                  <TableRow 
                    key={run.id}
                    onClick={() => handleNestedRowClick(run)}
                    hover
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{run.id}</TableCell>
                    <TableCell>{run.name}</TableCell>
                    <TableCell>{run.status}</TableCell>
                    <TableCell>{run.date}</TableCell>
                    <TableCell>{run.metrics}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Tab 3: Metadata */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Metadata Information</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Created:</Typography>
              <Typography variant="body1">{metadata.created}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Last Modified:</Typography>
              <Typography variant="body1">{metadata.modified}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Owner:</Typography>
              <Typography variant="body1">{metadata.owner}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Version:</Typography>
              <Typography variant="body1">{metadata.version}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Tags:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {metadata.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </>
    )}
  </DialogContent>
  {/* Close button removed as per requirement */}
</Dialog>

{/* Nested Modal for Linked Runs */}
<Dialog 
  open={nestedOpen} 
  onClose={handleNestedClose} 
  maxWidth="md"
  fullWidth={true}
  sx={{ 
    "& .MuiDialog-paper": { 
      borderRadius: "12px",
      width: "80%",
      maxWidth: "900px",
      height: "80%",
      maxHeight: "700px"
    } 
  }}
>
  <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center' }}>
    {/* Back button */}
    <IconButton 
      edge="start" 
      color="inherit" 
      onClick={handleNestedClose} 
      aria-label="back"
      sx={{ mr: 1 }}
    >
      <ArrowBackIcon />
    </IconButton>
    Run Details
  </DialogTitle>
  
  <DialogContent dividers>
    {selectedRun && (
      <Grid container spacing={2}>
        {/* Input Column (Left Side) */}
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>Input</Typography>
            <Box sx={{ 
              display: 'flex', 
              height: 'calc(100% - 40px)', 
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Copy button */}
              <button 
                onClick={handleCopyInput}
                style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px', 
                  padding: '4px 12px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <span style={{ marginRight: '4px' }}>Copy</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
              
              {/* Line numbers */}
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '8px 8px',
                textAlign: 'right',
                color: '#666',
                userSelect: 'none',
                borderRight: '1px solid #ddd'
              }}>
                {inputLines.map((_, i) => (
                  <div key={i} style={{ lineHeight: '1.5' }}>
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Input textarea */}
              <textarea
                style={{ 
                  flex: 1,
                  padding: '8px',
                  outline: 'none',
                  resize: 'none',
                  border: 'none',
                  fontFamily: 'monospace',
                  minHeight: '400px',
                  lineHeight: '1.5'
                }}
                value={inputContent}
                onChange={handleInputChange}
                placeholder="Enter input text here..."
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Output Column (Right Side) */}
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>Output</Typography>
            <Box sx={{ 
              display: 'flex', 
              height: 'calc(100% - 40px)', 
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Copy button */}
              <button 
                onClick={handleCopyOutput}
                style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px', 
                  padding: '4px 12px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <span style={{ marginRight: '4px' }}>Copy</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
              
              {/* Line numbers */}
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '8px 8px',
                textAlign: 'right',
                color: '#666',
                userSelect: 'none',
                borderRight: '1px solid #ddd'
              }}>
                {outputLines.map((_, i) => (
                  <div key={i} style={{ lineHeight: '1.5' }}>
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Output textarea */}
              <textarea
                style={{ 
                  flex: 1,
                  padding: '8px',
                  outline: 'none',
                  resize: 'none',
                  border: 'none',
                  fontFamily: 'monospace',
                  minHeight: '400px',
                  lineHeight: '1.5'
                }}
                value={outputContent}
                onChange={handleOutputChange}
                placeholder="Enter output text here..."
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Status message */}
        {saveStatus && (
          <Box sx={{ 
            position: 'absolute', 
            top: '60px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            backgroundColor: 'rgba(0, 200, 0, 0.1)',
            color: '#008800',
            border: '1px solid rgba(0, 200, 0, 0.3)',
            borderRadius: '4px',
            zIndex: 10
          }}>
            {saveStatus}
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
            <CircularProgress size={40} />
          </Box>
        )}
        
        {/* Save and Publish buttons */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
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
        </Grid>
      </Grid>
    )}
  </DialogContent>
</Dialog>
    </>
  );
};

export default ProductPerfomance;
