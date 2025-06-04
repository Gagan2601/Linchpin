// components/nav/UserAvatar.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function UserAvatar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();

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
            <SheetContent side="right" className="w-full max-w-xs px-4 py-6">
                <SheetTitle className="sr-only">Main Navigation</SheetTitle>
                <div className="flex flex-col h-full">
                    {/* User info */}
                    <div className="flex items-center space-x-3 px-2 py-4 border-b">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="text-sm">
                                {user.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    {/* Menu items */}
                    <nav className="flex-1 py-4 space-y-1">
                        <Link
                            href="/"
                            className={cn(
                                "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === "/"
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent/50 hover:text-accent-foreground"
                            )}
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/profile"
                            className={cn(
                                "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === "/profile"
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent/50 hover:text-accent-foreground"
                            )}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </Link>
                        <Link
                            href="/settings"
                            className={cn(
                                "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === "/settings"
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent/50 hover:text-accent-foreground"
                            )}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </nav>

                    {/* Logout button */}
                    <div className="mt-auto pt-4 border-t">
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}