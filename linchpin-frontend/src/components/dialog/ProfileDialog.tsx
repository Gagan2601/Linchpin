'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '@/services/user';
import { X } from 'lucide-react';

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
    const { user, updateUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            username: user?.username || '',
            aboutMe: user?.aboutMe || '',
        },
    });
    const [loading, setLoading] = useState(false);

    // Keep form in sync with user changes
    useEffect(() => {
        if (open && user) {
            reset({
                name: user.name || '',
                username: user.username || '',
                aboutMe: user.aboutMe || '',
            });
        }
    }, [open, user, reset]);

    const onSubmit = async (data: { name: string; username: string; aboutMe: string }) => {
        setLoading(true);
        try {
            // Only send username/aboutMe to backend per your API, but update name in frontend context too
            const resp = await userService.updateUser(user!._id, {
                username: data.username,
                aboutMe: data.aboutMe,
            });

            if (resp.error) throw new Error(resp.error);

            toast.success('Profile updated!');
            updateUser({ username: data.username, aboutMe: data.aboutMe, name: data.name });
            onOpenChange(false);
        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message || 'Could not update profile');
            } else {
                toast.error('Could not update profile');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b border-black/5 dark:border-white/10 relative">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</DialogTitle>
                    <DialogClose asChild>
                        <button
                            aria-label="Close"
                            className="absolute top-6 right-6 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity" />
                                <Avatar className="h-24 w-24 border-4 border-white dark:border-black/50 shadow-xl relative z-10">
                                    <AvatarImage src={undefined} />
                                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-black text-gray-900 dark:text-white">
                                        {user.name
                                            ?.split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-white/50">Click to change avatar</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 dark:text-white/70">Full Name</Label>
                                <Input
                                    id="name"
                                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: { value: 2, message: 'Name is too short' },
                                    })}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 dark:text-red-400">{errors.name.message as string}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-700 dark:text-white/70">Username</Label>
                                <Input
                                    id="username"
                                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                    {...register('username', {
                                        required: 'Username is required',
                                        pattern: {
                                            value: /^[a-z0-9_]+$/i,
                                            message: 'Only letters, numbers and underscores allowed',
                                        },
                                        minLength: { value: 2, message: 'Username is too short' },
                                    })}
                                />
                                {errors.username && (
                                    <p className="text-xs text-red-500 dark:text-red-400">{errors.username.message as string}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aboutMe" className="text-gray-700 dark:text-white/70">About Me</Label>
                                <Input
                                    id="aboutMe"
                                    className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                    {...register('aboutMe', {
                                        maxLength: { value: 180, message: 'Max 180 characters' },
                                    })}
                                />
                                {errors.aboutMe && (
                                    <p className="text-xs text-red-500 dark:text-red-400">{errors.aboutMe.message as string}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !isDirty}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}