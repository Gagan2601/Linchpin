// components/nav/Navbar.tsx
'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Sparkles, Send, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '../Logo';
import { useState, useEffect } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '../auth/AuthModal';

const UserAvatar = dynamic(() => import('./UserAvatar').then(mod => mod.UserAvatar), {
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
    ssr: false
});

export function Navbar() {
    const { setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    // Auth Modal State
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setAuthModalOpen(true);
        setIsOpen(false); // Close mobile menu if open
    };

    const navLinks = [
        { name: 'AI Tools', href: '/ai-tools', icon: Sparkles },
        { name: 'Submit', href: '/submit', icon: Send },
        { name: 'About', href: '/about', icon: Info },
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1920px] z-50 border border-white/10 bg-white/5 dark:bg-black/5 backdrop-blur-md rounded-full shadow-lg transition-all duration-300">
                <div className="flex h-14 items-center justify-between px-4 md:px-6">
                    {/* Mobile menu button and logo */}
                    <div className="flex items-center md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Menu className="h-7 w-7" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full max-w-xs border-r border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl p-0 shadow-2xl">
                                <SheetClose asChild>
                                    <button
                                        aria-label="Close"
                                        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all duration-300 border border-black/5 dark:border-white/5"
                                    >
                                        <X className="h-7 w-7" />
                                    </button>
                                </SheetClose>
                                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                                <div className="flex flex-col h-full relative overflow-hidden">
                                    {/* Decorative Background Elements */}
                                    <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />
                                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                                    {/* Logo Section */}
                                    <div className="relative px-6 pt-8 pb-6 border-b border-black/5 dark:border-white/5">
                                        <Logo className="h-30 w-auto" />
                                    </div>

                                    {/* Navigation Links */}
                                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    "group flex items-center px-4 py-3.5 rounded-2xl text-md font-medium transition-all duration-300 border border-transparent",
                                                    pathname === link.href
                                                        ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.3)]"
                                                        : "text-gray-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:border-black/5 dark:border-white/5"
                                                )}
                                            >
                                                <link.icon className={cn("mr-3 h-7 w-7 transition-colors", pathname === link.href ? "text-primary" : "text-gray-400 dark:text-white/50 group-hover:text-gray-600 dark:group-hover:text-white")} />
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>

                                    {/* Footer Section */}
                                    <div className="p-6 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 space-y-4">
                                        {user ? (
                                            <div className="flex items-center space-x-3 px-2 py-2 mb-2 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                                <UserAvatar />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-white/50 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                                                    onClick={() => openAuth('login')}
                                                >
                                                    Login
                                                </Button>
                                                <Button
                                                    className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                                    onClick={() => openAuth('signup')}
                                                >
                                                    Sign Up
                                                </Button>
                                            </div>
                                        )}

                                        {isMounted && (
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl h-14 px-4 group transition-all duration-300 border border-transparent hover:border-black/5 dark:hover:border-white/5"
                                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                            >
                                                <div className="p-2 rounded-full bg-black/5 dark:bg-white/10 group-hover:bg-black/10 dark:group-hover:bg-white/20 mr-3 transition-colors">
                                                    {resolvedTheme === 'dark' ? (
                                                        <Sun className="h-6 w-6" />
                                                    ) : (
                                                        <Moon className="h-6 w-6" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-md">
                                                    {resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Logo - Left side */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 font-bold">
                            <Logo className="h-30 w-30" />
                        </Link>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'transition-colors hover:text-foreground/80',
                                    pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side controls - Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        {isMounted && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 px-0"
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        )}

                        {user ? (
                            <UserAvatar />
                        ) : (
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openAuth('login')}>
                                    Login
                                </Button>
                                <Button size="sm" onClick={() => openAuth('signup')}>
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile right side - Only theme toggle */}
                    <div className="flex md:hidden items-center space-x-2">
                        {isMounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-6 w-6" />
                                ) : (
                                    <Moon className="h-6 w-6" />
                                )}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
}