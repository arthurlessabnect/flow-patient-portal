
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => (
  <Link to={href} className="w-full">
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors",
        isActive ? "bg-green-50 text-green-700" : "text-green-900 hover:bg-green-50/50"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  </Link>
);

interface NutritionistLayoutProps {
  children: ReactNode;
  title?: string;
}

export const NutritionistLayout = ({ children, title }: NutritionistLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/nutritionist/dashboard',
    },
    {
      icon: Users,
      label: 'Pacientes',
      href: '/nutritionist/patients',
    }
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-[250px] bg-white border-r flex-shrink-0 h-screen sticky top-0">
        <div className="flex flex-col h-full">
          <div className="p-5 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-green-900">NutriFlow</h1>
                <p className="text-xs text-green-600">Área do Nutricionista</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">Nutricionista</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-green-600 hover:text-green-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50">
        {title && (
          <header className="bg-white border-b px-8 py-4">
            <h1 className="text-xl font-semibold text-green-900">{title}</h1>
          </header>
        )}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
