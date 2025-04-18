
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'nutritionist' || user.role === 'admin') {
        navigate('/nutritionist/dashboard');
      } else if (user.role === 'patient') {
        navigate('/patient/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await signIn(email, password);
      
      // Navigation will happen automatically in the useEffect
      // when user state changes
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white mb-4">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-green-800">NutriFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Gerenciamento de nutrição e pacientes</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="●●●●●●●●"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-xs text-gray-500">
            NutriFlow - Plataforma para nutricionistas e pacientes
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
