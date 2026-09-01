import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { useUiStore } from './store/store';
import { useAuthStore } from './store/authStore';
import { ClientsPage } from './pages/ClientsPage';
import { AuthPage } from './pages/AuthPage';
import { CustomerFeedbackPage } from './pages/CustomerFeedbackPage';
import { FinancePage } from './pages/FinancePage';
import { InventoryPage } from './pages/InventoryPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamPage } from './pages/TeamPage';
import { VehicleModelDetailPage } from './pages/VehicleModelDetailPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { SetupPage } from './pages/SetupPage';

function App() {
  const { theme, language } = useUiStore();
  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme, language]);

  return (
    <BrowserRouter>
      <div className={`app-shell ${theme === 'light' ? 'light' : 'dark'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {account ? (
          <>
            <Sidebar />
            <Layout>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/services/new" element={<ServicesPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:id" element={<VehicleModelDetailPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
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
            <Route path="*" element={<AuthPage />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
