
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart as LineChartIcon, 
  Scale, 
  TrendingDown, 
  Flame, 
  Droplet, 
  Plus 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { PatientProgress, PatientProgressFormData } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function MyResults() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<PatientProgress[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [formData, setFormData] = useState<PatientProgressFormData>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    calories_consumed: 0,
    water_consumed: 0,
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Em um caso real, você buscaria do Supabase
        // Simulando dados por enquanto
        const mockProgressData: PatientProgress[] = [
          {
            id: "1",
            patient_id: "patient1",
            date: "2023-04-01",
            weight: 75.5,
            calories_consumed: 1980,
            water_consumed: 2.0,
            notes: "Primeira semana da dieta"
          },
          {
            id: "2",
            patient_id: "patient1",
            date: "2023-04-08",
            weight: 74.8,
            calories_consumed: 1950,
            water_consumed: 2.2,
            notes: "Reduzi um pouco o carboidrato"
          },
          {
            id: "3",
            patient_id: "patient1",
            date: "2023-04-15",
            weight: 74.0,
            calories_consumed: 1920,
            water_consumed: 2.3,
            notes: "Aumentei a atividade física"
          },
          {
            id: "4",
            patient_id: "patient1",
            date: "2023-04-22",
            weight: 73.3,
            calories_consumed: 1930,
            water_consumed: 2.4,
            notes: "Mantendo o ritmo"
          },
          {
            id: "5",
            patient_id: "patient1",
            date: "2023-04-29",
            weight: 72.7,
            calories_consumed: 1900,
            water_consumed: 2.5,
            notes: "Continuo perdendo peso gradualmente"
          },
        ];
        
        // Ordenar por data
        const sortedData = [...mockProgressData].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Formatar dados para os gráficos
        const formattedData = sortedData.map(item => ({
          date: new Date(item.date).toLocaleDateString('pt-BR'),
          peso: item.weight,
          calorias: item.calories_consumed,
          agua: item.water_consumed
        }));
        
        setTimeout(() => {
          setProgressData(sortedData);
          setChartData(formattedData);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error("Erro ao buscar dados de progresso:", error);
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric inputs
    if (
      ["weight", "calories_consumed", "water_consumed"].includes(name)
    ) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const validateForm = () => {
    if (!formData.date) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira a data",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.weight <= 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um peso válido",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para registrar resultados",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Em um caso real, você enviaria para o Supabase
      // Simulando o envio por enquanto
      
      const newProgress: PatientProgress = {
        id: `${Date.now()}`,
        patient_id: user.id,
        date: formData.date,
        weight: formData.weight,
        calories_consumed: formData.calories_consumed,
        water_consumed: formData.water_consumed,
        notes: formData.notes || null
      };
      
      // Simular processamento assíncrono
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar estado
      const updatedProgressData = [...progressData, newProgress].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Atualizar dados do gráfico
      const newChartData = [
        ...chartData,
        {
          date: new Date(formData.date).toLocaleDateString('pt-BR'),
          peso: formData.weight,
          calorias: formData.calories_consumed,
          agua: formData.water_consumed
        }
      ].sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
      
      setProgressData(updatedProgressData);
      setChartData(newChartData);
      
      toast({
        title: "Sucesso!",
        description: "Resultado registrado com sucesso",
      });
      
      // Resetar formulário e fechar modal
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: 0,
        calories_consumed: 0,
        water_consumed: 0,
        notes: ""
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Erro ao registrar resultado:", error);
      
      toast({
        title: "Erro ao registrar resultado",
        description: "Ocorreu um erro ao salvar seus dados",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = () => {
    if (progressData.length < 2) return { weight: 0, calories: 0, water: 0 };
    
    const first = progressData[0];
    const last = progressData[progressData.length - 1];
    
    return {
      weight: Number(((last.weight || 0) - (first.weight || 0)).toFixed(1)),
      calories: Number(((last.calories_consumed || 0) - (first.calories_consumed || 0)).toFixed(0)),
      water: Number(((last.water_consumed || 0) - (first.water_consumed || 0)).toFixed(1))
    };
  };

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <PatientLayout title="Meus Resultados">
        <div className="flex items-center justify-center h-64">
          <p>Carregando seus resultados...</p>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Meus Resultados">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Meu Progresso</h2>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Resultado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Novo Resultado</DialogTitle>
                <DialogDescription>
                  Registre seu peso e consumo para acompanhar seu progresso
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Data
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="calories_consumed" className="text-right">
                      Calorias
                    </Label>
                    <Input
                      id="calories_consumed"
                      name="calories_consumed"
                      type="number"
                      value={formData.calories_consumed || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="water_consumed" className="text-right">
                      Água (L)
                    </Label>
                    <Input
                      id="water_consumed"
                      name="water_consumed"
                      type="number"
                      step="0.1"
                      value={formData.water_consumed || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Observações
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ""}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className={progress.weight < 0 ? "border-green-500" : "border-red-500"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Scale className="h-4 w-4 mr-2" />
                Variação de Peso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {progress.weight < 0 ? (
                  <TrendingDown className="h-5 w-5 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500 mr-1 transform rotate-180" />
                )}
                {progress.weight} kg
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Desde {progressData.length > 0 ? new Date(progressData[0].date).toLocaleDateString('pt-BR') : "-"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Flame className="h-4 w-4 mr-2" />
                Variação de Calorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.calories} kcal
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Consumo médio diário
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Droplet className="h-4 w-4 mr-2" />
                Variação de Água
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.water} L
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Consumo médio diário
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="charts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Peso</CardTitle>
                <CardDescription>
                  Acompanhamento do peso ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="peso"
                        stroke="#4CAF50"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Consumo de Calorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="calorias" fill="#FF9800" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Consumo de Água</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="agua" fill="#03A9F4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Resultados</CardTitle>
                <CardDescription>
                  Todos os seus registros de progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Peso (kg)</TableHead>
                        <TableHead>Calorias</TableHead>
                        <TableHead>Água (L)</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {progressData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Nenhum registro encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Mostrar do mais recente para o mais antigo
                        [...progressData]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                {new Date(item.date).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>{item.weight}</TableCell>
                              <TableCell>{item.calories_consumed}</TableCell>
                              <TableCell>{item.water_consumed}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {item.notes || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
}
