
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { UserCircle2, ClipboardList, LineChart } from "lucide-react";

export default function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!user || !patientId) return;

      try {
        setIsLoading(true);
        
        // Em um caso real, você buscaria do Supabase
        // Usando dados fictícios por enquanto
        const mockPatient: Patient = {
          id: patientId,
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
        };
        
        // Simular atraso de carregamento
        setTimeout(() => {
          setPatient(mockPatient);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error);
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [user, patientId]);

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

  if (isLoading) {
    return (
      <NutritionistLayout title="Detalhes do Paciente">
        <div className="flex items-center justify-center h-64">
          <p>Carregando informações do paciente...</p>
        </div>
      </NutritionistLayout>
    );
  }

  if (!patient) {
    return (
      <NutritionistLayout title="Detalhes do Paciente">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Paciente não encontrado</h2>
          <p className="text-muted-foreground mt-2">
            O paciente que você está procurando não existe.
          </p>
        </div>
      </NutritionistLayout>
    );
  }

  return (
    <NutritionistLayout title={`Paciente: ${patient.name}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-nutriflow-100 flex items-center justify-center">
                <UserCircle2 className="h-8 w-8 text-nutriflow-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <CardDescription>
                  {patient.email} • {patient.phone || "Sem telefone"} • {calculateAge(patient.birth_date)} anos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Altura</p>
                <p className="text-lg font-medium">{patient.height ? `${patient.height} cm` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Inicial</p>
                <p className="text-lg font-medium">{patient.initial_weight ? `${patient.initial_weight} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">% Gordura Corporal</p>
                <p className="text-lg font-medium">{patient.body_fat_percentage ? `${patient.body_fat_percentage}%` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TMB</p>
                <p className="text-lg font-medium">{patient.bmr ? `${patient.bmr} kcal` : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="py-2">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="diets" className="py-2">
              Dietas
            </TabsTrigger>
            <TabsTrigger value="results" className="py-2">
              Resultados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle2 className="h-5 w-5" />
                  Informações do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-2">Dados Pessoais</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Nome:</span>
                        <span>{patient.name}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span>{patient.email}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Telefone:</span>
                        <span>{patient.phone || "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Gênero:</span>
                        <span>{patient.gender || "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Data de Nascimento:</span>
                        <span>{patient.birth_date || "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Idade:</span>
                        <span>{calculateAge(patient.birth_date)} anos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Objetivos e Medidas</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Objetivo:</span>
                        <span>{patient.goal || "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Altura:</span>
                        <span>{patient.height ? `${patient.height} cm` : "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">Peso Inicial:</span>
                        <span>{patient.initial_weight ? `${patient.initial_weight} kg` : "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">% Gordura Corporal:</span>
                        <span>{patient.body_fat_percentage ? `${patient.body_fat_percentage}%` : "-"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-sm text-muted-foreground">TMB:</span>
                        <span>{patient.bmr ? `${patient.bmr} kcal` : "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Dietas
                </CardTitle>
                <CardDescription>
                  Gerenciamento de dietas do paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma dieta cadastrada</h3>
                  <p className="text-muted-foreground mb-6">
                    Você ainda não criou nenhuma dieta para este paciente.
                  </p>
                  <Button>Criar Nova Dieta</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Resultados
                </CardTitle>
                <CardDescription>
                  Acompanhamento de resultados e progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem registros de resultados</h3>
                  <p className="text-muted-foreground mb-6">
                    Este paciente ainda não registrou resultados.
                  </p>
                  <Button>Registrar Resultado</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NutritionistLayout>
  );
}
