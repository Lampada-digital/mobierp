import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutPublico } from './components/LayoutPublico';
import { LayoutAdmin } from './components/LayoutAdmin';
import { HomePage } from './pages/HomePage';
import { ImoveisPage } from './pages/ImoveisPage';
import { ImovelDetalhePage } from './pages/ImovelDetalhePage';
import { ContatoPage } from './pages/ContatoPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminImoveisPage } from './pages/admin/ImoveisPage';
import { ImovelFormPage } from './pages/admin/ImovelFormPage';
import { LeadsPage } from './pages/admin/LeadsPage';
import { isAuthenticated } from './lib/auth';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Site público */}
        <Route
          path="/"
          element={
            <LayoutPublico>
              <HomePage />
            </LayoutPublico>
          }
        />
        <Route
          path="/imoveis"
          element={
            <LayoutPublico>
              <ImoveisPage />
            </LayoutPublico>
          }
        />
        <Route
          path="/imoveis/:id"
          element={
            <LayoutPublico>
              <ImovelDetalhePage />
            </LayoutPublico>
          }
        />
        <Route
          path="/contato"
          element={
            <LayoutPublico>
              <ContatoPage />
            </LayoutPublico>
          }
        />

        {/* Admin - sem layout */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin - com layout */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <DashboardPage />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/imoveis"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <AdminImoveisPage />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/imoveis/novo"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <ImovelFormPage />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/imoveis/:id/editar"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <ImovelFormPage />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <LeadsPage />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />

        {/* Redirect admin root */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
