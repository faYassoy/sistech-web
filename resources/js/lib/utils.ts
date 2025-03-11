import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const extractBreadcrumbs = (url: string): { title: string; href: string }[] => {
    const segments = url.split("/").filter(Boolean); // Remove empty segments
    let path = "";
    
    return segments.map((segment) => {
        path += `/${segment}`;
        return {
            title: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize
            href: path,
        };
    });
};

export function generatePassword() {
    const consonants = "bcdfghjklmnpqrstvwxyz";
    const vowels = "aeiou";
    const numbers = "0123456789";
    let password = "";

    for (let i = 0; i < 3; i++) {
        password += consonants[Math.floor(Math.random() * consonants.length)];
        password += vowels[Math.floor(Math.random() * vowels.length)];
    }

    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    return password;
}