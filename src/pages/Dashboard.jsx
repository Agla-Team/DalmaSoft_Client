import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Funzione per generare i breadcrumb dinamici
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;

      return (
        <BreadcrumbItem key={routeTo}>
          {isLast ? (
            <BreadcrumbPage>{formatBreadcrumbText(name)}</BreadcrumbPage>
          ) : (
            <>
              <BreadcrumbLink href={routeTo}>{formatBreadcrumbText(name)}</BreadcrumbLink>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
        </BreadcrumbItem>
      );
    });
  };

  // Funzione per formattare i nomi dei breadcrumb (es. "user-dashboard" → "User Dashboard")
  const formatBreadcrumbText = (text) => {
    return text
      .replace(/-/g, " ") // Sostituisce i trattini con spazi
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Mette la prima lettera in maiuscolo
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">DalmaWeb</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {generateBreadcrumbs()}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-100">
          <Outlet/>         
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
