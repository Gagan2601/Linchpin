'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { SignupPayload } from '@/services/auth';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SignupFormProps {
    onSuccess?: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
    const { signup, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupPayload>();

    const onSubmit = async (data: SignupPayload) => {
        try {
            await signup(data);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.log(error);
            toast.error('Signup failed. Please try again.');
        }
    };

    return (
        <div className="space-y-10">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Create Account</h1>
                <p className="text-muted-foreground">Get started with Linchpin</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        {...register('name', {
                            required: 'Name is required',
                            minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters',
                            },
                        })}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        placeholder="@johndoe"
                        {...register('username', {
                            required: 'Username is required',
                            pattern: {
                                value: /^[a-z0-9_]+$/i,
                                message: 'Username can only contain letters, numbers and underscores',
                            },
                        })}
                    />
                    {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="your@email.com"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2 pb-7">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
            </form>
        </div>
    );
}