import { useEffect, useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export default function UserControl() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Errore nel recupero utenti:", error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/toggleAccountStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Stato aggiornato!");
        fetchUsers();
      } else {
        toast.error("Errore nell'aggiornamento stato.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  const updateUser = async (id, email, role) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/updateUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email, role }),
      });

      if (response.ok) {
        toast.success("Utente aggiornato!");
        fetchUsers();
      } else {
        toast.error("Errore nell'aggiornamento.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Gestione Utenti</h2>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Nome</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Ruolo</TableCell>
            <TableCell>Login</TableCell>
            <TableCell>Stato</TableCell>
            <TableCell>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Input 
                  value={user.name}
                  onChange={(e) => updateUser(user.id, e.target.value, user.role, user.email)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={user.email}
                  onChange={(e) => updateUser(user.id, e.target.value, user.role, user.name)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={user.role}
                  onChange={(e) => updateUser(user.id, user.name, user.email, e.target.value)}
                />
              </TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{user.isActive ? "Attivo" : "Disattivo"}</TableCell>
              <TableCell>
                <Button onClick={() => toggleStatus(user.id)}>
                  {user.isActive ? "Disattiva" : "Attiva"}
                </Button>
                <Button onClick={() => updateUser(user.id, user.name, user.email, user.role)}>
                  Modifica
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
