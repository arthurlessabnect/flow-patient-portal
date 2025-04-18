
import { useState, useEffect } from "react";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Bot,
  User,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MealChatHistory } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export default function RecentMealsIA() {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<MealChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Em um caso real, você buscaria do Supabase
        // Simulando dados por enquanto
        const mockChatHistory: MealChatHistory[] = [
          {
            id: "1",
            patient_id: "patient1",
            created_at: "2023-04-29T08:30:00Z",
            message: "Bom dia! Tomei café com 2 ovos mexidos, 1 torrada integral com abacate e um copo de suco de laranja.",
            is_from_ai: false,
            meal_data: {
              meal_type: "Café da Manhã",
              food_items: [
                { name: "Ovos mexidos", quantity: "2 unidades", calories: 180 },
                { name: "Torrada integral", quantity: "1 fatia", calories: 80 },
                { name: "Abacate", quantity: "1/4 unidade", calories: 80 },
                { name: "Suco de laranja", quantity: "200ml", calories: 90 }
              ],
              total_calories: 430
            }
          },
          {
            id: "2",
            patient_id: "patient1",
            created_at: "2023-04-29T08:31:00Z",
            message: "Obrigado pelo registro! Seu café da manhã tem ótimas fontes de proteína e gorduras saudáveis. Totalizou 430 calorias, o que representa 21% da sua meta diária de 2000 calorias.",
            is_from_ai: true,
            meal_data: null
          },
          {
            id: "3",
            patient_id: "patient1",
            created_at: "2023-04-29T12:45:00Z",
            message: "Almocei frango grelhado (150g), arroz integral (4 colheres), feijão e salada de alface com tomate. Bebi água.",
            is_from_ai: false,
            meal_data: {
              meal_type: "Almoço",
              food_items: [
                { name: "Frango grelhado", quantity: "150g", calories: 250 },
                { name: "Arroz integral", quantity: "4 colheres", calories: 150 },
                { name: "Feijão", quantity: "concha pequena", calories: 110 },
                { name: "Salada de alface e tomate", quantity: "à vontade", calories: 50 }
              ],
              total_calories: 560
            }
          },
          {
            id: "4",
            patient_id: "patient1",
            created_at: "2023-04-29T12:46:00Z",
            message: "Excelente refeição balanceada! Seu almoço totalizou aproximadamente 560 calorias, com boa distribuição de proteínas, carboidratos complexos e fibras. Você já consumiu cerca de 990 calorias hoje (49.5% da meta).",
            is_from_ai: true,
            meal_data: null
          },
          {
            id: "5",
            patient_id: "patient1",
            created_at: "2023-04-29T16:15:00Z",
            message: "Lanche da tarde: uma maçã e um punhado de castanhas.",
            is_from_ai: false,
            meal_data: {
              meal_type: "Lanche",
              food_items: [
                { name: "Maçã", quantity: "1 unidade", calories: 80 },
                { name: "Castanhas mistas", quantity: "30g", calories: 180 }
              ],
              total_calories: 260
            }
          },
          {
            id: "6",
            patient_id: "patient1",
            created_at: "2023-04-29T16:16:00Z",
            message: "Ótima escolha para o lanche! As castanhas fornecem gorduras saudáveis e a maçã traz fibras e nutrientes. Esse lanche tem aproximadamente 260 calorias. Até agora, você consumiu cerca de 1250 calorias hoje (62.5% da sua meta).",
            is_from_ai: true,
            meal_data: null
          },
          {
            id: "7",
            patient_id: "patient1",
            created_at: "2023-04-28T08:15:00Z",
            message: "Café da manhã: iogurte natural com granola e banana.",
            is_from_ai: false,
            meal_data: {
              meal_type: "Café da Manhã",
              food_items: [
                { name: "Iogurte natural", quantity: "200g", calories: 120 },
                { name: "Granola", quantity: "30g", calories: 150 },
                { name: "Banana", quantity: "1 unidade", calories: 90 }
              ],
              total_calories: 360
            }
          },
          {
            id: "8",
            patient_id: "patient1",
            created_at: "2023-04-28T08:16:00Z",
            message: "Bom dia! Seu café da manhã parece delicioso e nutritivo. Total aproximado de 360 calorias, com bom aporte de carboidratos, incluindo fibras da banana e granola, além de proteínas do iogurte.",
            is_from_ai: true,
            meal_data: null
          },
        ];
        
        setTimeout(() => {
          setChatHistory(mockChatHistory);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error("Erro ao buscar histórico de chat:", error);
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  // Agrupar mensagens por data
  const groupMessagesByDate = () => {
    const grouped: { [key: string]: MealChatHistory[] } = {};
    
    chatHistory.forEach(message => {
      const date = new Date(message.created_at).toLocaleDateString('pt-BR');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    // Ordenar as datas (mais recentes primeiro)
    return Object.entries(grouped)
      .sort((a, b) => {
        const dateA = new Date(a[0].split('/').reverse().join('-'));
        const dateB = new Date(b[0].split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
  };

  const groupedMessages = groupMessagesByDate();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <PatientLayout title="Histórico IA">
        <div className="flex items-center justify-center h-64">
          <p>Carregando histórico de conversas...</p>
        </div>
      </PatientLayout>
    );
  }

  if (chatHistory.length === 0) {
    return (
      <PatientLayout title="Histórico IA">
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma conversa encontrada</h2>
          <p className="text-muted-foreground">
            Você ainda não registrou nenhuma refeição através do chat.
          </p>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Histórico IA">
      <div className="space-y-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Histórico de Conversas
            </CardTitle>
            <CardDescription>
              Suas últimas interações com o assistente de nutrição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Este é o histórico dos últimos 15 dias das suas conversas com a Nutri Lessa IA.
              As refeições registradas são automaticamente contabilizadas no seu progresso diário.
            </p>
          </CardContent>
        </Card>

        {groupedMessages.map(([date, messages]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{date}</h3>
            </div>
            
            {messages
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.is_from_ai ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.is_from_ai
                          ? "bg-water-100 text-water-600"
                          : "bg-nutriflow-100 text-nutriflow-600"
                      }`}
                    >
                      {message.is_from_ai ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  <div
                    className={`relative p-4 rounded-lg max-w-[80%] text-sm ${
                      message.is_from_ai
                        ? "bg-water-50 text-water-900"
                        : "bg-nutriflow-50 text-nutriflow-900"
                    }`}
                  >
                    <div className="mb-2">
                      {message.message}
                    </div>
                    
                    {message.meal_data && (
                      <div className="mt-2 p-3 bg-white rounded border">
                        <p className="font-medium text-xs mb-2">
                          {message.meal_data.meal_type} - {message.meal_data.total_calories} calorias
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {message.meal_data.food_items.map((item: any, index: number) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.name} ({item.quantity})</span>
                              <span>{item.calories} kcal</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </PatientLayout>
  );
}
