import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NutritionistLayout } from "@/layouts/NutritionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserCircle2, Pencil, PlusCircle, BarChart, FileText, Image, Gauge, ArrowUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [diets, setDiets] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
          const patientData: Patient = {
            ...data,
            height: data.height_cm,
            initial_weight: data.initial_weight_kg,
            bmr: data.basal_metabolic_rate,
            auth_user_id: '',
          };
          
          if ('auth_user_id' in data) {
            patientData.auth_user_id = data.auth_user_id;
          }
          
          setPatient(patientData);
          setEditedPatient(patientData);

          const fetchDiets = async () => {
            if (!patientId) return;
            
            try {
              const { data, error } = await supabase
                .from('diets')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false });
                
              if (error) throw error;
              
              setDiets(data || []);
            } catch (error) {
              console.error("Erro ao buscar dietas:", error);
            }
          };

          const fetchProgressData = async () => {
            if (!patientId) return;
            
            try {
              const { data, error } = await supabase
                .from('patient_progress')
                .select('*')
                .eq('patient_id', patientId)
                .order('record_date', { ascending: false });
                
              if (error) throw error;
              
              setProgressData(data || []);
            } catch (error) {
              console.error("Erro ao buscar registros de progresso:", error);
            }
          };

          fetchDiets();
          fetchProgressData();
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
          height_cm: editedPatient.height,
          initial_weight_kg: editedPatient.initial_weight,
          basal_metabolic_rate: editedPatient.bmr,
          body_fat_percentage: editedPatient.body_fat_percentage,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !patientId) return;
    
    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${patientId}-${Date.now()}.${fileExt}`;
      const filePath = `progress-photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('patient-progress')
        .upload(filePath, selectedImage);
      
      if (uploadError) throw uploadError;
      
      const { error: recordError } = await supabase
        .from('patient_progress')
        .insert({
          patient_id: patientId,
          record_date: new Date().toISOString().split('T')[0],
          measurements: {
            progress_photo_url: `${filePath}`
          }
        });
      
      if (recordError) throw recordError;
      
      setSelectedImage(null);
      
      toast({
        title: "Sucesso",
        description: "Imagem de progresso carregada com sucesso",
      });
      
      const { data, error } = await supabase
        .from('patient_progress')
        .select('*')
        .eq('patient_id', patientId)
        .order('record_date', { ascending: false });
        
      if (!error) {
        setProgressData(data || []);
      }
      
    } catch (error: any) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer upload da imagem",
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

        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-green-600" />
              Metas Nutricionais Diárias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {diets.length > 0 && diets[0] ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Calorias</p>
                  <p className="text-xl font-medium text-green-800">{diets[0].target_calories || '-'}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Proteínas</p>
                  <p className="text-xl font-medium text-blue-800">{diets[0].target_protein_g || '-'}</p>
                  <p className="text-xs text-gray-500">gramas</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Carboidratos</p>
                  <p className="text-xl font-medium text-amber-800">{diets[0].target_carbohydrate_g || '-'}</p>
                  <p className="text-xs text-gray-500">gramas</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Gorduras</p>
                  <p className="text-xl font-medium text-red-800">{diets[0].target_fat_g || '-'}</p>
                  <p className="text-xs text-gray-500">gramas</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Fibras</p>
                  <p className="text-xl font-medium text-orange-800">{diets[0].target_fiber_g || '-'}</p>
                  <p className="text-xs text-gray-500">gramas</p>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Água</p>
                  <p className="text-xl font-medium text-cyan-800">{diets[0].target_water_ml ? `${diets[0].target_water_ml / 1000}` : '-'}</p>
                  <p className="text-xs text-gray-500">litros</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Nenhuma dieta com metas nutricionais definida. 
                <Button variant="link" className="text-green-600 p-0" onClick={handleCreateDiet}>
                  Criar uma dieta
                </Button>
              </div>
            )}
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
              Resultados e Fotos
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
                    <FileText className="h-5 w-5 text-green-600" />
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
                
                {diets.length > 0 ? (
                  <div className="space-y-4">
                    {diets.map((diet) => (
                      <div key={diet.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-lg">{diet.name || "Plano Alimentar"}</h4>
                            <p className="text-sm text-gray-500">
                              Vigência: {new Date(diet.start_date).toLocaleDateString('pt-BR')} 
                              {diet.end_date && ` até ${new Date(diet.end_date).toLocaleDateString('pt-BR')}`}
                            </p>
                          </div>
                          {diet.diet_pdf_url && (
                            <a 
                              href={diet.diet_pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-green-600 hover:text-green-800"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              <span className="text-sm">Ver PDF</span>
                            </a>
                          )}
                        </div>
                        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
                          <div className="text-center py-1 px-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Calorias</p>
                            <p className="font-medium">{diet.target_calories || '-'}</p>
                          </div>
                          <div className="text-center py-1 px-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Proteínas</p>
                            <p className="font-medium">{diet.target_protein_g || '-'}</p>
                          </div>
                          <div className="text-center py-1 px-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Carboidratos</p>
                            <p className="font-medium">{diet.target_carbohydrate_g || '-'}</p>
                          </div>
                          <div className="text-center py-1 px-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Gorduras</p>
                            <p className="font-medium">{diet.target_fat_g || '-'}</p>
                          </div>
                          <div className="text-center py-1 px-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Fibras</p>
                            <p className="font-medium">{diet.target_fiber_g || '-'}</p>
                          </div>
                          <div className="text-center py-1 px-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Água</p>
                            <p className="font-medium">{diet.target_water_ml ? `${diet.target_water_ml / 1000}L` : '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma dieta cadastrada</h3>
                    <p className="text-gray-500 mb-4">
                      Você ainda não criou nenhuma dieta para este paciente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-600" />
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
                
                {progressData.filter(p => p.weight_kg).length > 0 ? (
                  <div className="space-y-4">
                    {progressData
                      .filter(p => p.weight_kg)
                      .map((progress) => (
                        <div key={progress.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg">{new Date(progress.record_date).toLocaleDateString('pt-BR')}</h4>
                              <div className="flex items-center mt-1">
                                <p className="text-sm font-medium">{progress.weight_kg} kg</p>
                                {progress.body_fat_percentage && (
                                  <p className="text-sm ml-4">Gordura corporal: {progress.body_fat_percentage}%</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {progress.calories_consumed && (
                              <div className="text-center py-1 px-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-500">Calorias consumidas</p>
                                <p className="font-medium">{progress.calories_consumed} kcal</p>
                              </div>
                            )}
                            {progress.water_ml_consumed && (
                              <div className="text-center py-1 px-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-500">Água consumida</p>
                                <p className="font-medium">{progress.water_ml_consumed} ml</p>
                              </div>
                            )}
                          </div>
                          {progress.notes && (
                            <p className="text-sm mt-3 text-gray-700">{progress.notes}</p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sem registros de resultados</h3>
                    <p className="text-gray-500 mb-4">
                      Este paciente ainda não possui resultados registrados.
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Image className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Fotos de Progresso</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium mb-2">Adicionar nova foto de progresso</p>
                      <p className="text-sm text-gray-500 mb-4">JPG, PNG (máx. 5MB)</p>
                      
                      <Input
                        id="progress-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      
                      <div className="flex flex-col items-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('progress-image')?.click()}
                          className="mb-2"
                        >
                          Selecionar imagem
                        </Button>
                        
                        {selectedImage && (
                          <>
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                              <Image className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-green-800">{selectedImage.name}</span>
                            </div>
                            
                            <Button
                              onClick={handleImageUpload}
                              className="bg-green-600 hover:bg-green-700 mt-4"
                            >
                              <ArrowUp className="h-4 w-4 mr-2" />
                              Fazer upload
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {progressData
                      .filter(p => p.measurements?.progress_photo_url)
                      .length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                          {progressData
                            .filter(p => p.measurements?.progress_photo_url)
                            .map((progress) => (
                              <div key={`photo-${progress.id}`} className="border rounded overflow-hidden">
                                <div className="aspect-square bg-gray-100 relative">
                                  <img 
                                    src={supabase.storage.from('patient-progress').getPublicUrl(progress.measurements.progress_photo_url).data.publicUrl} 
                                    alt={`Progresso em ${new Date(progress.record_date).toLocaleDateString('pt-BR')}`}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="p-2 text-center text-sm">
                                  {new Date(progress.record_date).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">
                            Nenhuma foto de progresso adicionada.
                          </p>
                        </div>
                      )}
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NutritionistLayout>
  );
}
