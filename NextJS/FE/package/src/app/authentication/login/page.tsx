'use client'
import React from 'react';
import { Box, Container } from '@mui/material';
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from '../auth/AuthLogin';

const Login = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("/images/bg-pattern.svg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.05,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        mb: 4
                    }}
                >
                    <Box 
                        sx={{ 
                            mb: 4, 
                            p: 2, 
                            backgroundColor: 'white', 
                            borderRadius: '50%',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
                        }}
                    >
                        <Logo />
                    </Box>
                    <AuthLogin />
                </Box>
            </Container>
        </Box>
    )
}

export default Login
