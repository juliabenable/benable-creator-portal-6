import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CreatorProvider } from '@/context/CreatorContext';
import { DesignModeProvider } from '@/context/DesignModeContext';
import Layout from '@/pages/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ApplyPage from '@/pages/ApplyPage';
import CampaignPage from '@/pages/CampaignPage';
import CampaignsListPage from '@/pages/CampaignsListPage';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  return (
    <DesignModeProvider>
    <CreatorProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/campaigns" element={<CampaignsListPage />} />
            <Route path="/campaign/:id" element={<CampaignPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </CreatorProvider>
    </DesignModeProvider>
  );
}

export default App;
