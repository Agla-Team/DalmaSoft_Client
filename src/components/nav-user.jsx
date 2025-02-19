import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    UserCircle
  } from "lucide-react";
  import {
    Avatar,
    //AvatarFallback,
    AvatarImage
  } from "@/components/ui/avatar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar";

  import { useNavigate } from "react-router-dom";
  
  export function NavUser({ user }) {
    const { isMobile } = useSidebar();

    // gestione navigazione tra pages
    const navigate = useNavigate();
    const handleControl = () => {
      navigate("/user-management"); // Naviga alla pagina UserManagement.jsx
    };

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    
    const handleLogout = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/logout`, {
          method: "POST",
          credentials: "include", // Se il server usa i cookie per la sessione
        });
    
        if (response.ok) {
          localStorage.removeItem("token"); // Rimuove il token dal frontend
          window.location.href = "/login"; // Reindirizza alla pagina di login
        } else {
          console.error("Errore nel logout:", await response.json());
        }
      } catch (error) {
        console.error("Errore di rete durante il logout:", error);
      }
    };

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.role} />
                  <UserCircle className="w-8 h-8 text-gray-100" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{user.email}</span>
                  <span className="truncate font-semibold">{user.role}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.role} />
                    <UserCircle className="w-8 h-8 text-gray-500" />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">{user.email}</span>
                    <span className="truncate font-semibold">{user.role}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleControl}>
                  <Sparkles />
                  Gestione Utenti
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Aggiorna Auto Nuove
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Aggiorna Auto Usate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Aggiorna Clienti
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Messaggi
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  