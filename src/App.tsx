import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { useUiStore } from './store/store';
import { ClientsPage } from './pages/ClientsPage';
import { FinancePage } from './pages/FinancePage';
import { InventoryPage } from './pages/InventoryPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamPage } from './pages/TeamPage';
import { VehicleModelDetailPage } from './pages/VehicleModelDetailPage';
import { VehiclesPage } from './pages/VehiclesPage';

function App() {
  const { theme, language } = useUiStore();

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
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
