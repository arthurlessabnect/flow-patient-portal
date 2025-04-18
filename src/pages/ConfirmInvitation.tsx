
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmInvitation() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Obter token de convite da URL
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast({
        title: "Link inválido",
        description: "O link de convite não contém um token válido.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [token, navigate, toast]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (!token) {
        throw new Error("Token não encontrado");
      }
      
      // Definir a senha usando o token de recuperação
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Senha definida com sucesso",
        description: "Você pode fazer login agora",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao definir senha:", error);
      
      toast({
        title: "Erro ao definir senha",
        description: error.message || "Ocorreu um erro ao definir sua senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-nutriflow-500 flex items-center justify-center text-white mb-4">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-nutriflow-800">NutriFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Confirme seu convite</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Definir Senha</CardTitle>
            <CardDescription>
              Defina sua senha para acessar sua conta de paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="●●●●●●●●"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="●●●●●●●●"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processando..." : "Confirmar Senha"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-xs text-muted-foreground">
            NutriFlow - Plataforma para nutricionistas e pacientes
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
