
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Patient } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { UserCircle2, Pencil, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!user || !patientId) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPatient(data);
          setEditedPatient(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [user, patientId]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedPatient) return;
    
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric inputs
    if (["height", "initial_weight", "body_fat_percentage", "bmr"].includes(name)) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setEditedPatient({ ...editedPatient, [name]: parsedValue });
  };

  const handleSelectChange = (value: string, name: string) => {
    if (!editedPatient) return;
    setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!editedPatient) return;
    
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          name: editedPatient.name,
          email: editedPatient.email,
          phone: editedPatient.phone,
          gender: editedPatient.gender,
          birth_date: editedPatient.birth_date,
          height: editedPatient.height,
          initial_weight: editedPatient.initial_weight,
          body_fat_percentage: editedPatient.body_fat_percentage,
          bmr: editedPatient.bmr,
          goal: editedPatient.goal
        })
        .eq('id', patientId);
      
      if (error) throw error;
      
      setPatient(editedPatient);
      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Dados do paciente atualizados",
      });
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados do paciente",
        variant: "destructive",
      });
    }
  };

  const handleCreateDiet = () => {
    if (patient) {
      navigate(`/nutritionist/create-diet/${patient.id}`);
    }
  };

  const handleRegisterResult = () => {
    if (patient) {
      navigate(`/nutritionist/register-result/${patient.id}`);
    }
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
          <p className="text-gray-500 mt-2">
            O paciente que você está procurando não existe.
          </p>
        </div>
      </NutritionistLayout>
    );
  }

  return (
    <NutritionistLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-green-900">Paciente: {patient.name}</h1>
          <div className="space-x-3">
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 pb-6 mb-6 border-b">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <UserCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-green-900">{patient.name}</h2>
                <p className="text-gray-500">
                  {patient.email} • {patient.phone || "Sem telefone"} • {calculateAge(patient.birth_date)} anos
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Altura</p>
                <p className="text-lg font-medium">{patient.height ? `${patient.height} cm` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Peso Inicial</p>
                <p className="text-lg font-medium">{patient.initial_weight ? `${patient.initial_weight} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">% Gordura Corporal</p>
                <p className="text-lg font-medium">{patient.body_fat_percentage ? `${patient.body_fat_percentage}%` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">TMB</p>
                <p className="text-lg font-medium">{patient.bmr ? `${patient.bmr} kcal` : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white border p-1 rounded-md">
            <TabsTrigger 
              value="overview" 
              className={`py-2 px-4 rounded-md ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-700'}`}
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="diets" 
              className={`py-2 px-4 rounded-md ${activeTab === 'diets' ? 'bg-green-600 text-white' : 'text-gray-700'}`}
            >
              Dietas
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className={`py-2 px-4 rounded-md ${activeTab === 'results' ? 'bg-green-600 text-white' : 'text-gray-700'}`}
            >
              Resultados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Informações do Paciente</h3>
                </div>

                {isEditing ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-medium">Dados Pessoais</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            name="name"
                            value={editedPatient?.name || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={editedPatient?.email || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={editedPatient?.phone || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gênero</Label>
                          <Select
                            value={editedPatient?.gender || ''}
                            onValueChange={(value) => handleSelectChange(value, 'gender')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="birth_date">Data de Nascimento</Label>
                          <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            value={editedPatient?.birth_date || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Objetivos e Medidas</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="goal">Objetivo</Label>
                          <Input
                            id="goal"
                            name="goal"
                            value={editedPatient?.goal || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Altura (cm)</Label>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            value={editedPatient?.height || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="initial_weight">Peso Inicial (kg)</Label>
                          <Input
                            id="initial_weight"
                            name="initial_weight"
                            type="number"
                            step="0.1"
                            value={editedPatient?.initial_weight || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="body_fat_percentage">% Gordura Corporal</Label>
                          <Input
                            id="body_fat_percentage"
                            name="body_fat_percentage"
                            type="number"
                            step="0.1"
                            value={editedPatient?.body_fat_percentage || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bmr">TMB (kcal)</Label>
                          <Input
                            id="bmr"
                            name="bmr"
                            type="number"
                            value={editedPatient?.bmr || ''}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-end space-x-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedPatient(patient);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSaveChanges}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-4">Dados Pessoais</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Nome:</span>
                          <span>{patient.name}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Email:</span>
                          <span>{patient.email}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Telefone:</span>
                          <span>{patient.phone || "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Gênero:</span>
                          <span>{patient.gender || "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Data de Nascimento:</span>
                          <span>{patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('pt-BR') : "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Idade:</span>
                          <span>{calculateAge(patient.birth_date)} anos</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Objetivos e Medidas</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Objetivo:</span>
                          <span>{patient.goal || "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Altura:</span>
                          <span>{patient.height ? `${patient.height} cm` : "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">Peso Inicial:</span>
                          <span>{patient.initial_weight ? `${patient.initial_weight} kg` : "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">% Gordura Corporal:</span>
                          <span>{patient.body_fat_percentage ? `${patient.body_fat_percentage}%` : "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-sm text-gray-500">TMB:</span>
                          <span>{patient.bmr ? `${patient.bmr} kcal` : "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diets" className="mt-6">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">Dietas</h3>
                  </div>
                  <Button 
                    onClick={handleCreateDiet}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Dieta
                  </Button>
                </div>
                
                <div className="text-center py-12">
                  <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma dieta cadastrada</h3>
                  <p className="text-gray-500 mb-6">
                    Você ainda não criou nenhuma dieta para este paciente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">Resultados</h3>
                  </div>
                  <Button 
                    onClick={handleRegisterResult}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Registrar Resultado
                  </Button>
                </div>
                
                <div className="text-center py-12">
                  <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem registros de resultados</h3>
                  <p className="text-gray-500 mb-6">
                    Este paciente ainda não possui resultados registrados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NutritionistLayout>
  );
}
