import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavGroup {
    colapsableGroup: string;
    items: NavItem[];
}

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();

    return (
        <div className="px-2 py-0">
            {groups.map((group) => (
                <SidebarGroup key={group.colapsableGroup} className="mb-2">
                    <SidebarGroupLabel>{group.colapsableGroup}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.numBadge ?<div className="absolute top-1 right-2 aspect-square flex items-center w-6 rounded-full bg-white border-2 border-red-400 text-center text-xs text-red-900">
                                    <div className=' font-semibold scale-90 my-auto mx-auto'>{item.numBadge}</div>
                                </div>:null}
                                <SidebarMenuButton asChild isActive={item.url === page.url || page.url.startsWith(item.url)}>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon className="mr-2" />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
