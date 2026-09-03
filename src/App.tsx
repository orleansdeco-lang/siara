import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { useUiStore } from './store/store';
import { useAuthStore } from './store/authStore';
import { ClientsPage } from './pages/ClientsPage';
import { AuthPage } from './pages/AuthPage';
import { ActivityHistoryPage } from './pages/ActivityHistoryPage';
import { CustomerFeedbackPage } from './pages/CustomerFeedbackPage';
import { FinancePage } from './pages/FinancePage';
import { InventoryPage } from './pages/InventoryPage';
import { OverviewPage } from './pages/OverviewPage';
import { OwnerTeamPage } from './pages/OwnerTeamPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamPage } from './pages/TeamPage';
import { VehicleModelDetailPage } from './pages/VehicleModelDetailPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { SetupPage } from './pages/SetupPage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { CustomerDashboardPage, CustomerGaragePage, CustomerHistoryPage, CustomerProfilePage, CustomerVehiclePage } from './pages/PersonalAppPage';

function PermissionGate({ permission, children }: { permission: string; children: ReactNode }) {
  const account = useAuthStore((state) => state.account);
  const allowed = account?.isOwner || account?.permissions?.includes(permission);
  return allowed ? <>{children}</> : <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center text-amber-200">Accès non autorisé pour ce compte.</div>;
}

function App() {
  const { theme, language } = useUiStore();
  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('midnight', theme === 'midnight');
  }, [theme, language]);

  return (
    <BrowserRouter>
      <div className={`app-shell ${theme}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {account?.role === 'CUSTOMER' ? (
          <Routes>
            <Route path="/app" element={<CustomerDashboardPage />} />
            <Route path="/app/garage" element={<CustomerGaragePage />} />
            <Route path="/app/garage/:id" element={<CustomerVehiclePage />} />
            <Route path="/app/history" element={<CustomerHistoryPage />} />
            <Route path="/app/profile" element={<CustomerProfilePage />} />
            <Route path="*" element={<CustomerDashboardPage />} />
          </Routes>
        ) : account ? (
          <>
            <Sidebar />
            <Layout>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/services/new" element={<PermissionGate permission="Services"><ServicesPage /></PermissionGate>} />
                <Route path="/clients" element={<PermissionGate permission="Clients"><ClientsPage /></PermissionGate>} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:id" element={<VehicleModelDetailPage />} />
                <Route path="/inventory" element={<PermissionGate permission="Stock"><InventoryPage /></PermissionGate>} />
                <Route path="/finance" element={<PermissionGate permission="Finance"><FinancePage /></PermissionGate>} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/owner/team" element={<PermissionGate permission="owner"><OwnerTeamPage /></PermissionGate>} />
                <Route path="/owner/activity" element={<PermissionGate permission="owner"><ActivityHistoryPage /></PermissionGate>} />
                <Route path="/reviews" element={<PermissionGate permission="Avis"><ReviewsPage /></PermissionGate>} />
                <Route path="/feedback/:serviceId" element={<CustomerFeedbackPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/setup" element={<SetupPage />} />
              </Routes>
            </Layout>
          </>
        ) : (
          <Routes>
            <Route path="/feedback/:serviceId" element={<CustomerFeedbackPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/app/auth" element={<CustomerAuthPage />} />
            <Route path="*" element={<AuthPage />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
