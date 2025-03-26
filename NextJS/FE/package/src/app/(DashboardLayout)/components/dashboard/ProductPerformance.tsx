import React from "react";
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
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import TabPanel from "./TabPanel";

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
  const [month, setMonth] = React.useState("1");

  // モーダル開閉用
  const [open, setOpen] = React.useState(false);

  // クリックした行の情報を保持
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  
  // Add new state for tab management
  const [tabValue, setTabValue] = React.useState(0);

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
    setTabValue(0); // Reset tab when modal closes
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
                  <TableRow key={run.id}>
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
  <DialogActions sx={{ justifyContent: "center" }}>
    <Button
      onClick={handleClose}
      variant="contained"
      color="primary"
      startIcon={<CloseIcon />}
      sx={{
        borderRadius: "8px",
        textTransform: "none",
        px: 3,
        py: 1.2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

export default ProductPerfomance;
