import { Link, usePage } from "@inertiajs/react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavItem } from "@/types";


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
