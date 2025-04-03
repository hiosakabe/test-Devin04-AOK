"use client";
import { styled, Container, Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/commonLayout/layout/sidebar/Sidebar";
import Footer from "./layout/footer/page";
import Topbar from "./layout/header/Topbar";
import theme from "@/utils/theme";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "25px",
  flexDirection: "column",
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/authentication/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f5f7fa'
        }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          読み込み中...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainWrapper className="mainwrapper">
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        <Topbar />
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        <Sidebar />
        
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: '270px',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header />
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
              minHeight: 'calc(100vh - 240px)'
            }}
          >
            {/* ------------------------------------------- */}
            {/* Page Route */}
            {/* ------------------------------------------- */}
            <Box>{children}</Box>
            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Container>
          {/* ------------------------------------------- */}
          {/* Footer */}
          {/* ------------------------------------------- */}
          <Footer />
        </Box>
      </PageWrapper>
    </MainWrapper>
  );
}

