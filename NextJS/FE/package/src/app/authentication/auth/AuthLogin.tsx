import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    TextField,
    InputAdornment,
    IconButton,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { handleSocialAuth } from '@/utils/auth/socialAuth';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

interface LoginType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: LoginType) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [rememberDevice, setRememberDevice] = useState(true);
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('メールアドレスとパスワードを入力してください');
            return;
        }
        
        const success = await login(email, password);
        if (success) {
            router.push('/');
        } else {
            setError('ログインに失敗しました。認証情報を確認してください。');
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        const result = await handleSocialAuth(provider);
        if (result.success) {
            // In a real app, you would use the token to authenticate
            router.push('/');
        } else {
            setError(`${provider === 'google' ? 'Google' : 'GitHub'} ログインに失敗しました`);
        }
    };

    return (
        <Box
            sx={{
                p: 4,
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '480px',
            }}
        >
            <Typography variant="h4" fontWeight="700" align="center" mb={1} color="primary">
                ようこそ
            </Typography>

            <Typography variant="body1" align="center" color="textSecondary" mb={4}>
                アプリケーションを使用するにはログインしてください。
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleLogin}>
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            variant="subtitle2"
                            fontWeight={500}
                            component="label"
                            htmlFor="email"
                            mb="5px"
                        >
                            メールアドレス
                        </Typography>
                        <TextField
                            id="email"
                            fullWidth
                            size="medium"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            variant="outlined"
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            fontWeight={500}
                            component="label"
                            htmlFor="password"
                            mb="5px"
                        >
                            パスワード
                        </Typography>
                        <TextField
                            id="password"
                            fullWidth
                            size="medium"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOffOutlinedIcon />
                                            ) : (
                                                <VisibilityOutlinedIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberDevice}
                                        onChange={(e) => setRememberDevice(e.target.checked)}
                                    />
                                }
                                label="このデバイスを記憶する"
                            />
                        </FormGroup>
                        <Typography
                            component={Link}
                            href="/authentication/forgot-password"
                            fontWeight="500"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                            }}
                        >
                            パスワードをお忘れですか？
                        </Typography>
                    </Stack>

                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={loading}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            '続ける'
                        )}
                    </Button>
                </Stack>
            </form>

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                mt={3}
            >
                <Typography color="textSecondary" variant="body2">
                    アカウントが未登録ですか？
                </Typography>
                <Typography
                    component={Link}
                    href="/authentication/register"
                    fontWeight="500"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                    }}
                >
                    サインアップ
                </Typography>
            </Stack>

            <Box mt={4} mb={3}>
                <Divider>
                    <Typography
                        variant="body2"
                        sx={{
                            px: 2,
                            color: 'text.secondary',
                        }}
                    >
                        または
                    </Typography>
                </Divider>
            </Box>

            <Stack spacing={2}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => handleSocialLogin('google')}
                    sx={{
                        py: 1.5,
                        textTransform: 'none',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                            backgroundColor: 'rgba(66, 133, 244, 0.04)',
                        },
                    }}
                >
                    Google で続ける
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    onClick={() => handleSocialLogin('github')}
                    sx={{
                        py: 1.5,
                        textTransform: 'none',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    GitHub で続ける
                </Button>
            </Stack>
        </Box>
    );
};

export default AuthLogin;
