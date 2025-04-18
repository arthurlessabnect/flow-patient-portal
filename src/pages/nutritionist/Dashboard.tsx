
import { useState, useEffect } from "react";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Activity, 
  Clock 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Dados fictícios para o gráfico de novos pacientes
const patientGrowthData = [
  { month: 'Jan', count: 4 },
  { month: 'Fev', count: 5 },
  { month: 'Mar', count: 7 },
  { month: 'Abr', count: 6 },
  { month: 'Mai', count: 9 },
  { month: 'Jun', count: 8 },
  { month: 'Jul', count: 11 },
  { month: 'Ago', count: 12 },
];

// Dados fictícios para o feed de atividades recentes
const recentActivities = [
  { id: 1, action: "Nova dieta criada", patient: "Maria Silva", time: "há 2 horas" },
  { id: 2, action: "Resultado registrado", patient: "João Pereira", time: "há 5 horas" },
  { id: 3, action: "Novo paciente adicionado", patient: "Ana Souza", time: "há 1 dia" },
  { id: 4, action: "Dieta atualizada", patient: "Carlos Santos", time: "há 2 dias" },
];

export default function NutritionistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeDiets: 0,
  });

  // Efeito para carregar os dados (simulação)
  useEffect(() => {
    // Em um cenário real, isso viria do Supabase
    setStats({
      totalPatients: 24,
      activeDiets: 18,
    });
  }, []);

  return (
    <NutritionistLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pacientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 em comparação ao mês passado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dietas Ativas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDiets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                75% dos pacientes com dietas ativas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Satisfação
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5% em comparação ao último trimestre
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Média de Resultados
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 dias</div>
              <p className="text-xs text-muted-foreground mt-1">
                Para alcance do primeiro objetivo
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Growth Chart & Activities */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Crescimento de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientGrowthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between gap-2 items-start border-b pb-3">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.patient}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NutritionistLayout>
  );
}
