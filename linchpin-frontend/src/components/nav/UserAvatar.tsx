// components/nav/UserAvatar.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, User, Settings, LayoutDashboard, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ProfileDialog } from '../dialog/ProfileDialog';
import { SettingsDialog } from '../dialog/SettingsDIalog';

export function UserAvatar() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
            toast.error('Failed to logout');
        }
    };

    if (!user) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="text-xs">
                            {user.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-l border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl p-0 shadow-2xl">
                <SheetClose asChild>
                    <button
                        aria-label="Close"
                        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all duration-300 border border-black/5 dark:border-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </SheetClose>
                <SheetTitle className="sr-only">User Menu</SheetTitle>

                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* User Profile Section */}
                    <div className="relative px-8 pt-12 pb-8 flex flex-col items-center text-center border-b border-black/5 dark:border-white/5">
                        <div className="relative mb-4 group cursor-pointer" onClick={() => setProfileOpen(true)}>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity duration-500" />
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-black/50 shadow-xl relative z-10 ring-2 ring-black/5 dark:ring-white/10 group-hover:ring-primary/50 transition-all duration-300">
                                <AvatarImage src={undefined} />
                                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-black text-gray-900 dark:text-white">
                                    {user.name
                                        ?.split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 z-20 bg-primary text-white p-1.5 rounded-full border-4 border-white dark:border-black shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <Settings className="w-4 h-4" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-white/50 font-medium">{user.email}</p>

                        <div className="mt-6 flex gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-full border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white h-9 text-xs font-medium transition-all duration-300"
                                onClick={() => setProfileOpen(true)}
                            >
                                View Profile
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 rounded-full border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white h-9 text-xs font-medium transition-all duration-300"
                                onClick={() => setSettingsOpen(true)}
                            >
                                Settings
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <Link
                            href="/"
                            className={cn(
                                "group flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 border border-transparent",
                                pathname === "/"
                                    ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.3)]"
                                    : "text-gray-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:border-black/5 dark:hover:border-white/5"
                            )}
                        >
                            <LayoutDashboard className={cn("mr-3 h-5 w-5 transition-colors", pathname === "/" ? "text-primary" : "text-gray-400 dark:text-white/50 group-hover:text-gray-600 dark:group-hover:text-white")} />
                            Dashboard
                        </Link>

                        <button
                            type="button"
                            onClick={() => setProfileOpen(true)}
                            className={cn(
                                "w-full group flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 border border-transparent",
                                profileOpen
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "text-gray-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:border-black/5 dark:hover:border-white/5"
                            )}
                        >
                            <User className="mr-3 h-5 w-5 text-gray-400 dark:text-white/50 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                            Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => setSettingsOpen(true)}
                            className={cn(
                                "w-full group flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 border border-transparent",
                                settingsOpen
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "text-gray-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:border-black/5 dark:hover:border-white/5"
                            )}
                        >
                            <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-white/50 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                            Settings
                        </button>
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-6 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-500/10 rounded-2xl h-12 px-4 group transition-all duration-300"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            <div className="p-1.5 rounded-full bg-red-500/10 group-hover:bg-red-500/20 mr-3 transition-colors">
                                <LogOut className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Sign out</span>
                        </Button>
                    </div>
                </div>

                {/* Dialogs */}
                <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
                <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
            </SheetContent>
        </Sheet>
    );
}