// components/nav/Navbar.tsx
'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '../Logo';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const UserAvatar = dynamic(() => import('./UserAvatar').then(mod => mod.UserAvatar), {
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
    ssr: false
});

export function Navbar() {
    const { setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user, isLoading, logout } = useAuth();
    console.log(user);

    const navLinks = [
        { name: 'AI Tools', href: '/tools' },
        { name: 'Submit', href: '/submit' },
        { name: 'About', href: '/about' },
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
            toast.error('Failed to logout');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
                {/* Mobile menu button and logo */}
                <div className="flex items-center md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full max-w-xs px-4 py-6">
                            <SheetTitle className="sr-only">User Menu</SheetTitle>
                            <div className="flex flex-col h-full">
                                {/* Logo in mobile menu */}
                                <div className="mb-6 px-2">
                                    <Logo className="h-8 w-auto" />
                                </div>

                                {/* Navigation links */}
                                <nav className="flex-1 space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                                                pathname === link.href
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground'
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>

                                {/* User section and theme toggle */}
                                <div className="mt-auto space-y-4 pt-4 border-t">
                                    {user ? (
                                        <div className="flex items-center space-x-3 px-3 py-2">
                                            <UserAvatar />
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Button variant="outline" className="w-full" asChild>
                                                <Link href="/auth?mode=login">Login</Link>
                                            </Button>
                                            <Button className="w-full" asChild>
                                                <Link href="/auth?mode=signup">Sign Up</Link>
                                            </Button>
                                        </div>
                                    )}

                                    {isMounted && (
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                        >
                                            {resolvedTheme === 'dark' ? (
                                                <>
                                                    <Sun className="mr-2 h-4 w-4" />
                                                    Light Mode
                                                </>
                                            ) : (
                                                <>
                                                    <Moon className="mr-2 h-4 w-4" />
                                                    Dark Mode
                                                </>
                                            )}
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
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/auth?mode=login">Login</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/auth?mode=signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile right side - Only theme toggle */}
                <div className="flex md:hidden items-center space-x-2">
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
                </div>
            </div>
        </header>
    );
}