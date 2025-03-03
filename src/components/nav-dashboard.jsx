import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2,
  } from "lucide-react";
  import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    //SquareTerminal,
  } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar";

    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const frontUrl = import.meta.env.VITE_FRONT_URL;
  
  export function NavDash({ dashboard }) {
    const { isMobile } = useSidebar();
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-red-800 uppercase font-bold text-xs px-3 py-2">Generale</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={`${frontUrl}/user-dashboard`}>
              <PieChart />
              <span className="ml-2 text-sm text-gray-600">Dashboard</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={`${frontUrl}/planning`}>
              <Map /> {/* Icona modificabile a piacere */}
              <span className="ml-2 text-sm text-gray-600">Planning</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
      );
    }
  