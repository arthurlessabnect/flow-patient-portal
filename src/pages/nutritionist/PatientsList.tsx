
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
import { Card } from "@/components/ui/card";

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
        
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('nutritionist_id', user.id);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPatients(data);
          setFilteredPatients(data);
        }
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
          patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.goal?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const calculateAge = (birthDateStr: string | null) => {
    if (!birthDateStr) return "-";
    
    try {
      const birthDate = new Date(birthDateStr);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (e) {
      return "-";
    }
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAddPatient}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Paciente
          </Button>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Idade</TableHead>
                <TableHead className="font-semibold">Objetivo</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
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
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{calculateAge(patient.birth_date)}</TableCell>
                    <TableCell>{patient.goal || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPatient(patient.id)}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </NutritionistLayout>
  );
}
