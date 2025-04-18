import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Páginas de Autenticação
import Login from "./pages/Login";
import ConfirmInvitation from "./pages/ConfirmInvitation";
import Unauthorized from "./pages/Unauthorized";

// Páginas do Nutricionista
import NutritionistDashboard from "./pages/nutritionist/Dashboard";
import PatientsList from "./pages/nutritionist/PatientsList";
import AddPatient from "./pages/nutritionist/AddPatient";
import PatientDetails from "./pages/nutritionist/PatientDetails";

// Páginas do Paciente
import PatientDashboard from "./pages/patient/Dashboard";
import MyDiet from "./pages/patient/MyDiet";
import MyResults from "./pages/patient/MyResults";
import RecentMealsIA from "./pages/patient/RecentMealsIA";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota inicial - redireciona para login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Rotas públicas de autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/confirm-invitation" element={<ConfirmInvitation />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rotas protegidas do Nutricionista */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'nutritionist']} />}>
              <Route path="/nutritionist/dashboard" element={<NutritionistDashboard />} />
              <Route path="/nutritionist/patients" element={<PatientsList />} />
              <Route path="/nutritionist/add-patient" element={<AddPatient />} />
              <Route path="/nutritionist/patient/:patientId" element={<PatientDetails />} />
            </Route>
            
            {/* Rotas protegidas do Paciente */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/my-diet" element={<MyDiet />} />
              <Route path="/patient/my-results" element={<MyResults />} />
              <Route path="/patient/recent-meals-ia" element={<RecentMealsIA />} />
            </Route>
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
