import { Car } from "lucide-react";
import { NavInfinity } from "@/components/nav-autoinfinity";
import { NavDalma } from "@/components/nav-autodalma";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { NavDash } from "./nav-dashboard";
import { NavUser } from "./nav-user";

export function AppSidebar(props) {
    const data = {
        NavInfinity: [
            {
                title: "Elenco Automobili",
                className: "ml-2 text-sm text-gray-600",
                url: "#",
                icon: Car,
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
                        url: `/infinity_interno_usate`,
                        className: "ml-2 text-sm text-gray-400",
                    },
                    {
                        title: "Usate In Stock Esterni",
                        url: `/infinity_esterno_usate`,
                        className: "ml-2 text-sm text-gray-400",
                    },

                    {
                        title: "Altri Stock",
                        isTitle: true,
                        className:
                            "mt-2 text-xs font-bold text-gray-400 uppercase",
                    },
                    { title: "Assegnate", url: `#` },
                    { title: "Virtuali", url: `#` },
                ],
            },
        ],
        NavDalma: [
            {
                title: "Elenco Automobili",
                url: "#",
                className: "ml-2 text-sm text-gray-600",
                icon: Car,
                items: [
                    {
                        title: "Dashboard",
                        url: `#`,
                        className: "text-sm text-gray-400",
                    },

                    {
                        title: "Gestione Auto",
                        isTitle: true,
                        className:
                            "mt-2 mb-1 text-sm font-bold text-red-500 uppercase",
                    },
                    { title: "Inventario Auto", url: `/invent_nuove` },
                    { title: "Inserimento Manuale", url: `#` },
                    { title: "Sposta Auto", url: `#` },

                    {
                        title: "Elenchi",
                        isTitle: true,
                        className:
                            "mt-2 mb-1 text-sm font-bold text-red-500 uppercase",
                    },
                    { title: "Auto Nuove", url: `/dalma_nuove` },
                    { title: "Auto Usate", url: `/dalma_usate` },
                    { title: "Veicoli Commerciali", url: `#` },
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
                <NavInfinity items={data.NavInfinity} />
                <NavDalma items={data.NavDalma} />
            </SidebarContent>
            <SidebarFooter>
                {" "}
                <NavUser user={data.user} />{" "}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
