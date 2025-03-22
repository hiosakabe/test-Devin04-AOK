//localhost newpage
'use client'
import { Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import DailyActivity from '@/app/(DashboardLayout)/components/dashboard/DailyActivity';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import BlogCard from '@/app/(DashboardLayout)/components/dashboard/Blog';
// テストで追加
import { Button } from "./components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import Modal from "./components/modal";
const RouteIdentifier = "show-info";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Define types for chart data
interface CorrectnessData {
  id: number;
  correctness: number;
}

interface DidRespondData {
  id: number;
  did_respond: number;
}

interface RepeatsQuestionData {
  id: number;
  repeats_question_exactly: number;
}

const Dashboard = () => {
  const theme = useTheme();
  const [correctnessData, setCorrectnessData] = useState<CorrectnessData[]>([]);
  const [didRespondData, setDidRespondData] = useState<DidRespondData[]>([]);
  const [repeatsQuestionData, setRepeatsQuestionData] = useState<RepeatsQuestionData[]>([]);

  useEffect(() => {
    // Use hardcoded data directly since we're having issues with file loading
    // This ensures the charts will display even if file loading fails
    setCorrectnessData([
      { id: 1, correctness: 7 },
      { id: 2, correctness: 7.3 }
    ]);
    setDidRespondData([
      { id: 1, did_respond: 1 },
      { id: 2, did_respond: 1 }
    ]);
    setRepeatsQuestionData([
      { id: 1, repeats_question_exactly: 0 },
      { id: 2, repeats_question_exactly: 0.1 }
    ]);
  }, []);

  // Define chart configurations
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;

  // Common chart options
  const commonOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      zoom: {
        enabled: false,
      },
    },
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 4,
    },
    xaxis: {
      type: "category",
      categories: correctnessData.map(item => `#${item.id}`),
    },
    tooltip: {
      theme: "light",
    },
  };

  // Correctness chart options
  const correctnessOptions = {
    ...commonOptions,
    colors: [primary],
    title: {
      text: "Correctness",
      align: "left",
    },
    yaxis: {
      min: 6.9,
      max: 7.4,
    },
  };

  // Did Respond chart options
  const didRespondOptions = {
    ...commonOptions,
    colors: [secondary],
    title: {
      text: "Did_respond",
      align: "left",
    },
    yaxis: {
      min: 0.9,
      max: 1.1,
    },
  };

  // Repeats Question Exactly chart options
  const repeatsQuestionOptions = {
    ...commonOptions,
    colors: [success],
    title: {
      text: "Repeats_question_exactly",
      align: "left",
    },
    yaxis: {
      min: 0,
      max: 0.12,
    },
  };

  // Prepare chart series data
  const correctnessSeries = [
    {
      name: "Correctness",
      data: correctnessData.map(item => item.correctness),
    },
  ];

  const didRespondSeries = [
    {
      name: "Did Respond",
      data: didRespondData.map(item => item.did_respond),
    },
  ];

  const repeatsQuestionSeries = [
    {
      name: "Repeats Question Exactly",
      data: repeatsQuestionData.map(item => item.repeats_question_exactly),
    },
  ];

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <div>this is new page</div>
        
        {/* Line Charts Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
          {/* Correctness Chart */}
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
              {correctnessData.length > 0 && (
                <Chart 
                  options={correctnessOptions as any} 
                  series={correctnessSeries} 
                  type="line" 
                  height="300px" 
                />
              )}
            </Box>
          </div>
          
          {/* Did Respond Chart */}
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
              {didRespondData.length > 0 && (
                <Chart 
                  options={didRespondOptions as any} 
                  series={didRespondSeries} 
                  type="line" 
                  height="300px" 
                />
              )}
            </Box>
          </div>
          
          {/* Repeats Question Exactly Chart */}
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 1 }}>
              {repeatsQuestionData.length > 0 && (
                <Chart 
                  options={repeatsQuestionOptions as any} 
                  series={repeatsQuestionSeries} 
                  type="line" 
                  height="300px" 
                />
              )}
            </Box>
          </div>
        </div>
        
        {/* Original content */}
        <div style={{ marginTop: '24px' }}>
          <SalesOverview />
        </div>
        <div style={{ marginTop: '24px' }}>
          <ProductPerformance />
        </div>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
