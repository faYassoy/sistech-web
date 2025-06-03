/* eslint-disable @typescript-eslint/ban-ts-comment */
// import AppLogoIcon from '@/components/app-logo-icon';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    // @ts-ignore
        const logo = usePage().props.general.logo;
    
    return (
        <div className="bg-red-600 flex min-h-svh h-screen flex-col items-center justify-center gap-6">
            <div className="w-full max-w-sm h-full bg-red-600 p-2">
                <div className="translate-y-[22%] flex flex-col gap-8 bg-background p-8 rounded-lg">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-24 w-24 items-center justify-center rounded-md">
                                {/* <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" /> */}
                                <img className='h-24' src={logo} alt="Company Logo" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
