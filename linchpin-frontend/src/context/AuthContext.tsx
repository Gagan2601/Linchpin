// context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { User, SignupPayload } from '@/services/auth';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (payload: SignupPayload) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAdmin = user?.role === 'admin';

    const updateUser = useCallback((updatedUser: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updatedUser } : null);
    }, []);

    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simply make the auth check - cookies will be sent automatically
            const response = await authService.checkAuth();
            if (response.error) {
                if (response.status === 401) {
                    const refreshResponse = await authService.refreshToken();
                    if (!refreshResponse.error) {
                        const retryResponse = await authService.checkAuth();
                        if (retryResponse.data) {
                            setUser(retryResponse.data);
                            return;
                        }
                    }
                }
                setUser(null);
            } else if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authService.checkAuth();

            if (response.error) {
                // If unauthorized, try refreshing the token
                if (response.status === 401) {
                    const refreshResponse = await authService.refreshToken();
                    if (!refreshResponse.error) {
                        // Retry with new token
                        const retryResponse = await authService.checkAuth();
                        if (retryResponse.data) {
                            setUser(retryResponse.data);
                            return;
                        }
                    }
                }
                setUser(null);
            } else if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login({ email, password });
            if (response.error) {
                toast.error(response.error || 'Failed to login');
                return;
            }

            if (response.data?.user) {
                setUser(response.data.user);
                toast.success('Welcome back!');
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An unexpected error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (payload: SignupPayload) => {
        setIsLoading(true);
        try {
            const response = await authService.signup(payload);

            if (response.error) {
                toast.error(response.error || 'Failed to sign up');
                return;
            }

            // Handle message from either response.message or response.data.message
            const message = response.message || response.data?.message;
            if (message) {
                toast.success(message);
                router.push('/auth/verify-email');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('An unexpected error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyEmail = async (token: string) => {
        setIsLoading(true);
        try {
            const response = await authService.verifyEmail(token);

            if (response.error) {
                toast.error(response.error || 'Failed to verify email');
                return;
            }

            // Handle message from either response.message or response.data.message  
            const message = response.message || response.data?.message;
            if (message) {
                toast.success(message);
                router.push('/auth?mode=login');
            }
        } catch (error) {
            console.error('Email verification error:', error);
            toast.error('An unexpected error occurred during verification');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            const response = await authService.logout();

            if (response.error) {
                toast.error(response.error || 'Failed to logout');
            } else {
                setUser(null);
                toast.success('You have been logged out successfully');
                // Force a full page refresh to clear all state
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('An unexpected error occurred during logout');
            setUser(null);
            window.location.href = '/';
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        isAdmin,
        login,
        signup,
        logout,
        verifyEmail,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}