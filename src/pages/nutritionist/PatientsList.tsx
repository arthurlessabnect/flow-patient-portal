
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Em um caso real, você buscaria do Supabase
        // Usando dados fictícios por enquanto
        const mockPatients: Patient[] = [
          {
            id: "1",
            auth_user_id: "auth1",
            nutritionist_id: user.id,
            created_at: "2023-01-15",
            name: "Maria Silva",
            email: "maria@example.com",
            phone: "11999999999",
            gender: "Feminino",
            birth_date: "15/05/1985",
            height: 165,
            initial_weight: 68,
            goal: "Perda de peso",
            body_fat_percentage: 28,
            bmr: 1500,
          },
          {
            id: "2",
            auth_user_id: "auth2",
            nutritionist_id: user.id,
            created_at: "2023-02-20",
            name: "João Pereira",
            email: "joao@example.com",
            phone: "11988888888",
            gender: "Masculino",
            birth_date: "10/07/1990",
            height: 180,
            initial_weight: 85,
            goal: "Ganho de massa",
            body_fat_percentage: 18,
            bmr: 2000,
          },
          {
            id: "3",
            auth_user_id: "auth3",
            nutritionist_id: user.id,
            created_at: "2023-03-05",
            name: "Ana Souza",
            email: "ana@example.com",
            phone: "11977777777",
            gender: "Feminino",
            birth_date: "22/11/1980",
            height: 160,
            initial_weight: 62,
            goal: "Manutenção",
            body_fat_percentage: 25,
            bmr: 1400,
          },
        ];
        
        setPatients(mockPatients);
        setFilteredPatients(mockPatients);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.goal?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const calculateAge = (birthDateStr: string | null) => {
    if (!birthDateStr) return "-";
    
    // Assumindo formato DD/MM/AAAA
    const parts = birthDateStr.split('/');
    if (parts.length !== 3) return "-";
    
    const birthDate = new Date(
      parseInt(parts[2]), 
      parseInt(parts[1]) - 1, 
      parseInt(parts[0])
    );
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleAddPatient = () => {
    navigate("/nutritionist/add-patient");
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/nutritionist/patient/${patientId}`);
  };

  return (
    <NutritionistLayout title="Pacientes">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddPatient}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Paciente
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Carregando pacientes...
                  </TableCell>
                </TableRow>
              ) : filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{calculateAge(patient.birth_date)}</TableCell>
                    <TableCell>{patient.goal || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </NutritionistLayout>
  );
}
