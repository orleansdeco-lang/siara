import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { useUiStore } from './store/store';
import { ClientsPage } from './pages/ClientsPage';
            <Route path="/feedback/:serviceId" element={<CustomerFeedbackPage />} />            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
