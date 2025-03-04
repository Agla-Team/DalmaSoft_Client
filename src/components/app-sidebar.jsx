import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator"
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
import { NavDash } from "@/components/nav-dashboard";
import { NavInfinity } from "@/components/nav-autoinfinity";
import { NavDalma } from "@/components/nav-autodalma";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { useNavigate } from "react-router-dom";
import { Link } from "react-router";
import Dashboard from "@/pages/Dashboard";
// <Link to="/qrCode_scan">

const baseUrl = import.meta.env.VITE_BACKEND_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;

export function AppSidebar(props) {


  // gestione navigazione tra pages
  const navigate = useNavigate();
  const AutoGest = () => {
    navigate("/autoPark"); // Naviga alla pagina UserManagement.jsx
  };

  const [user, setUser] = useState({
    name: "Loading...",
    role: "Loading...",
    email: "Loading...",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const response = await fetch(`${baseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUser({
            name: data.name,
            role: data.role,
            email: data.email,
          });
        }
      } catch (error) {
        console.error("Errore nel recupero utente:", error);
      }
    };
  
    fetchUser();
  }, []);

  const data = {
    user: {
      name: user.name,
      role: user.role,
      email: user.email,
    },
    NavInfinity: [
      { title: "Elenco Automobili", className: "ml-2 text-sm text-gray-600", url: "#", icon: Bot, items: [
          { title: "Dashboard", url: `${frontUrl}/autoPark`, className: "text-sm text-gray-400"},

          { title: "Auto Nuove", isTitle: true, className: "mt-2 mb-1 text-sm font-bold text-red-500 uppercase" },
          { title: "Nuove In Stock Dalma", url: `${frontUrl}/infinity_interno`, className: "ml-2 text-sm text-gray-400"},
          { title: "Nuove In Stock Esterni", url: `${frontUrl}/infinity_esterno`, className: "ml-2 text-sm text-gray-400"},
                     
          { title: "Auto Usate", isTitle: true, className: "mt-2 mb-1 text-sm font-bold text-red-500 uppercase" },
          { title: "Usate In Stock Dalma", url: `${frontUrl}/infinity_interno_usate`, className: "ml-2 text-sm text-gray-400" },
          { title: "Usate In Stock Esterni", url: `${frontUrl}/infinity_esterno_usate`, className: "ml-2 text-sm text-gray-400"},
          
          { title: "Altri Stock", isTitle: true, className: "mt-2 text-xs font-bold text-gray-400 uppercase" },
          { title: "Assegnate", url: `#`}, 
          { title: "Virtuali", url: `#`}, 
        ], },
    ],
    NavDalma: [
      { title: "Elenco Automobili", url: "#", className: "ml-2 text-sm text-gray-600", icon: Bot, items: [
        { title: "Dashboard", url: `#`, className: "text-sm text-gray-400"},

        { title: "Gestione Auto", isTitle: true, className: "mt-2 mb-1 text-sm font-bold text-red-500 uppercase" },
        { title: "Inventario Auto", url: `${frontUrl}/invent_nuove`},
        { title: "Inserimento Manuale", url: `#`},
        { title: "Sposta Auto", url: `#`},
        
        { title: "Elenchi", isTitle: true, className: "mt-2 mb-1 text-sm font-bold text-red-500 uppercase" },
        { title: "Auto Nuove", url: `#`}, 
        { title: "Auto Usate", url: `${frontUrl}/dalma_usate`},
        { title: "Veicoli Commerciali", url: `#`},  
      ] },
    ],
  };

  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img 
          src="./logo/dalma_black.png" 
          alt="Dalma Logo" 
          style={{ width: "150px", height: "auto", margin: "0 auto", display: "block" }} 
        />
      </SidebarHeader>
      <SidebarContent>
        <NavDash />
        <NavInfinity items={data.NavInfinity} />
        <NavDalma items={data.NavDalma} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}