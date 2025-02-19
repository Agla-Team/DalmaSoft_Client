import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function UserDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* 4 Card Principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Utenti Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">56</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attivi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">987</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuovi Oggi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Area Grande per il Contenuto */}
      <div className="bg-white shadow-lg rounded-lg p-6 min-h-[500px]">
        {/* Qui puoi inserire il contenuto della pagina */}
      </div>
    </div>
  );
}
