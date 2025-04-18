
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-destructive mb-4">Acesso Não Autorizado</h1>
        
        <p className="text-muted-foreground mb-8">
          Você não tem permissão para acessar esta página. 
          Por favor, retorne para a área designada ao seu perfil.
        </p>
        
        <div className="flex justify-center">
          {user?.role === 'nutritionist' || user?.role === 'admin' ? (
            <Button asChild>
              <Link to="/nutritionist/dashboard">
                Ir para Dashboard do Nutricionista
              </Link>
            </Button>
          ) : user?.role === 'patient' ? (
            <Button asChild>
              <Link to="/patient/dashboard">
                Ir para Dashboard do Paciente
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">
                Voltar para Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
