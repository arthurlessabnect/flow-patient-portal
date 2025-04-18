
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Apple, 
  LineChart,
  MessageSquare,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MainLayout } from './MainLayout';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => (
  <Link to={href} className="w-full">
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        isActive ? "bg-water-100 hover:bg-water-200 text-water-700" : ""
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Button>
  </Link>
);

interface PatientLayoutProps {
  children: ReactNode;
  title: string;
}

export const PatientLayout = ({ children, title }: PatientLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/patient/dashboard',
    },
    {
      icon: Apple,
      label: 'Minhas Dietas',
      href: '/patient/my-diet',
    },
    {
      icon: LineChart,
      label: 'Meus Resultados',
      href: '/patient/my-results',
    },
    {
      icon: MessageSquare,
      label: 'Histórico IA',
      href: '/patient/recent-meals-ia',
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 bg-sidebar shadow-md flex-shrink-0 h-screen sticky top-0 border-r">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-water-500 flex items-center justify-center text-white">
                <Apple className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-water-800">NutriFlow</h1>
                <p className="text-xs text-water-600">Área do Paciente</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href || currentPath.startsWith(`${item.href}/`)}
              />
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-water-600" />
              <span className="text-sm text-water-800">Paciente</span>
            </div>
          </div>
        </div>
      </aside>
      <MainLayout title={title}>
        {children}
      </MainLayout>
    </div>
  );
};
