import { Bot } from "lucide-react";
import { NavDash } from "@/components/nav-dashboard";
import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";

export function AppSidebar(props) {
    const data = {
        navMain: [
            {
                title: "Elenco Automobili",
                className: "text-sm text-gray-400",
                url: "#",
                icon: Bot,
                items: [
                    {
                        title: "Dashboard",
                        url: `/autoPark`,
                        className: "text-sm text-gray-400",
                    },

                    {
                        title: "Auto Nuove",
                        isTitle: true,
                        className:
                            "mt-2 mb-1 text-sm font-bold text-red-500 uppercase",
                    },
                    {
                        title: "Nuove In Stock Dalma",
                        url: `/infinity_interno`,
                        className: "ml-2 text-sm text-gray-400",
                    },
                    {
                        title: "Nuove In Stock Esterni",
                        url: `/infinity_esterno`,
                        className: "ml-2 text-sm text-gray-400",
                    },

                    {
                        title: "Auto Usate",
                        isTitle: true,
                        className:
                            "mt-2 mb-1 text-sm font-bold text-red-500 uppercase",
                    },
                    {
                        title: "Usate In Stock Dalma",
                        url: `/autoPark`,
                        className: "ml-2 text-sm text-gray-400",
                    },
                    {
                        title: "Usate In Stock Esterni",
                        url: `/autoPark`,
                        className: "ml-2 text-sm text-gray-400",
                    },

                    {
                        title: "Altri Stock",
                        isTitle: true,
                        className:
                            "mt-2 text-xs font-bold text-gray-400 uppercase",
                    },
                    { title: "Assegnate", url: `/autoPark` },
                    { title: "Virtuali", url: `/autoPark` },
                ],
            },
            {
                title: "Inventario",
                url: "#",
                icon: Bot,
                items: [
                    { title: "Nuove", url: `/invent_nuove` },
                    { title: "Usate", url: `/invent_usate` },
                    { title: "Assegnate", url: `/invent_ass` },
                    { title: "Inventariate", url: `/inventariate` },
                ],
            },
        ],
    };
    const { open } = useSidebar();

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="py-5">
                {open && (
                    <div className="max-w-[150px] mx-auto">
                        <img
                            src="./logo/dalma_black.png"
                            alt="Dalma Logo"
                            className="w-full"
                        />
                    </div>
                )}
            </SidebarHeader>
            <SidebarContent>
                <NavDash />
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
