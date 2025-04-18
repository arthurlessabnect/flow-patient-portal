
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const data = [
  { date: '01/04', weight: 75.5, bodyFat: 22.0 },
  { date: '08/04', weight: 74.8, bodyFat: 21.5 },
  { date: '15/04', weight: 74.2, bodyFat: 21.2 },
  { date: '22/04', weight: 73.5, bodyFat: 20.8 },
  { date: '29/04', weight: 73.0, bodyFat: 20.5 },
  { date: '06/05', weight: 72.6, bodyFat: 20.0 },
  { date: '13/05', weight: 72.0, bodyFat: 19.7 },
];

const nutritionData = [
  { date: '07/04', calories: 1950, protein: 130, carbs: 220, fat: 65 },
  { date: '14/04', calories: 1980, protein: 140, carbs: 210, fat: 60 },
  { date: '21/04', calories: 1920, protein: 135, carbs: 200, fat: 62 },
  { date: '28/04', calories: 1940, protein: 138, carbs: 215, fat: 58 },
  { date: '05/05', calories: 1960, protein: 142, carbs: 208, fat: 59 },
  { date: '12/05', calories: 1930, protein: 140, carbs: 205, fat: 60 },
];

export default function MyResults() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(data);
  const [nutritionData, setNutritionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // Here you would fetch real data from Supabase
        // For now using the mock data
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  return (
    <PatientLayout title="Meus Resultados">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-900">Evolução de Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      name="Peso (kg)"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-900">Percentual de Gordura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bodyFat"
                      name="Gordura Corporal (%)"
                      stroke="#FF9800"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-900">Consumo Médio Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={nutritionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    scale="point" 
                    padding={{ left: 30, right: 30 }}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="calories" 
                    name="Calorias" 
                    fill="#4CAF50" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-900">Proteína (g)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={nutritionData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      scale="point" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="protein" 
                      name="Proteína" 
                      fill="#F44336" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-900">Carboidratos (g)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={nutritionData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      scale="point" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="carbs" 
                      name="Carboidratos" 
                      fill="#FFC107" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-900">Gorduras (g)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={nutritionData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      scale="point" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="fat" 
                      name="Gorduras" 
                      fill="#2196F3" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
