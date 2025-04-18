
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Lazy-loaded components
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
const ConfirmInvitation = lazy(() => import("@/pages/ConfirmInvitation"));

// Nutritionist pages
const NutritionistDashboard = lazy(() => import("@/pages/nutritionist/Dashboard"));
const PatientsList = lazy(() => import("@/pages/nutritionist/PatientsList"));
const PatientDetails = lazy(() => import("@/pages/nutritionist/PatientDetails"));
const AddPatient = lazy(() => import("@/pages/nutritionist/AddPatient"));
const CreateDiet = lazy(() => import("@/pages/nutritionist/CreateDiet"));
const RegisterResult = lazy(() => import("@/pages/nutritionist/RegisterResult"));

// Patient pages
const PatientDashboard = lazy(() => import("@/pages/patient/Dashboard"));
const MyDiet = lazy(() => import("@/pages/patient/MyDiet"));
const MyResults = lazy(() => import("@/pages/patient/MyResults"));
const RecentMealsIA = lazy(() => import("@/pages/patient/RecentMealsIA"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/confirm-invitation" element={<ConfirmInvitation />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Nutritionist routes */}
            <Route element={<ProtectedRoute allowedRoles={['nutritionist', 'admin']} />}>
              <Route path="/nutritionist/dashboard" element={<NutritionistDashboard />} />
              <Route path="/nutritionist/patients" element={<PatientsList />} />
              <Route path="/nutritionist/patient/:patientId" element={<PatientDetails />} />
              <Route path="/nutritionist/add-patient" element={<AddPatient />} />
              <Route path="/nutritionist/create-diet/:patientId" element={<CreateDiet />} />
              <Route path="/nutritionist/register-result/:patientId" element={<RegisterResult />} />
            </Route>
            
            {/* Patient routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/my-diet" element={<MyDiet />} />
              <Route path="/patient/my-results" element={<MyResults />} />
              <Route path="/patient/recent-meals-ia" element={<RecentMealsIA />} />
            </Route>
            
            {/* Default routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
