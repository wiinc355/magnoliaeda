import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleGate from './auth/RoleGate';

import CityHome from './pages/CityHome';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import { EnotifySubscribePage, EnotifyConfirmPage, EnotifyUnsubscribePage } from './pages/EnotifyPage';
import ContentPage from './pages/ContentPage';
import SearchPage from './pages/SearchPage';
import PoliceDept from './pages/PoliceDept';
import DepartmentsPage from './pages/DepartmentsPage';
import LoginPage from './pages/auth/LoginPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import AdminPortalPage from './pages/auth/AdminPortalPage';
import StaffPortalPage from './pages/auth/StaffPortalPage';
import DepartmentPortalPage from './pages/auth/DepartmentPortalPage';
import MyProfilePage from './pages/auth/MyProfilePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import AnnouncementsManager from './pages/dashboard/AnnouncementsManager';
import EventsManager from './pages/dashboard/EventsManager';
import ContactsManager from './pages/dashboard/ContactsManager';
import ProjectsManager from './pages/dashboard/ProjectsManager';
import PersonnelManager from './pages/dashboard/PersonnelManager';
import BuildingAddressesManager from './pages/dashboard/BuildingAddressesManager';
import ProfilesManager from './pages/dashboard/ProfilesManager';
import SubscribersManager from './pages/dashboard/SubscribersManager';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div id="page" className="site">
            <Header />
            <main id="content" className="site-content">
              <Routes>
                <Route path="/" element={<CityHome />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route
                  path="/profile"
                  element={(
                    <ProtectedRoute>
                      <MyProfilePage />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/dashboard"
                  element={(
                    <ProtectedRoute>
                      <RoleGate allow={['Admin', 'Staff']}>
                        <DashboardPage />
                      </RoleGate>
                    </ProtectedRoute>
                  )}
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="announcements" element={<AnnouncementsManager />} />
                  <Route path="events" element={<EventsManager />} />
                  <Route path="contacts" element={<ContactsManager />} />
                  <Route path="projects" element={<ProjectsManager />} />
                  <Route path="personnel" element={<PersonnelManager />} />
                  <Route path="building-addresses" element={<BuildingAddressesManager />} />
                  <Route path="profiles" element={<ProfilesManager />} />
                  <Route path="subscribers" element={<SubscribersManager />} />
                </Route>
                <Route
                  path="/admin-portal"
                  element={(
                    <ProtectedRoute>
                      <RoleGate allow={['Admin']}>
                        <AdminPortalPage />
                      </RoleGate>
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/staff-portal"
                  element={(
                    <ProtectedRoute>
                      <RoleGate allow={['Admin', 'Staff']}>
                        <StaffPortalPage />
                      </RoleGate>
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/department-portal"
                  element={(
                    <ProtectedRoute>
                      <RoleGate allow={['Admin', 'Department User']}>
                        <DepartmentPortalPage />
                      </RoleGate>
                    </ProtectedRoute>
                  )}
                />
                <Route path="/government/mayor-council" element={<ContentPage pageKey="mayorCouncil" />} />
                <Route path="/government/town-manager" element={<ContentPage pageKey="townManager" />} />
                <Route path="/government/boards-committees" element={<ContentPage pageKey="boardsCommittees" />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/departments/index.php" element={<DepartmentsPage />} />
                <Route path="/department/fire" element={<ContentPage pageKey="fire" />} />
                <Route path="/department/police" element={<PoliceDept />} />
                <Route path="/department/parks-recreation" element={<ContentPage pageKey="parksRecreation" />} />
                <Route path="/department/public-works" element={<ContentPage pageKey="publicWorks" />} />
                <Route path="/department/finance" element={<ContentPage pageKey="finance" />} />
                <Route path="/resource/online-bill-pay" element={<ContentPage pageKey="onlineBillPay" />} />
                <Route path="/resource/agendas-minutes" element={<ContentPage pageKey="agendasMinutes" />} />
                <Route path="/resource/solid-waste-recycling" element={<ContentPage pageKey="solidWaste" />} />
                <Route path="/resource/permits-licenses" element={<ContentPage pageKey="permitsLicenses" />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/enotify" element={<EnotifySubscribePage />} />
                <Route path="/enotify/confirm/:token" element={<EnotifyConfirmPage />} />
                <Route path="/enotify/unsubscribe/:token" element={<EnotifyUnsubscribePage />} />
                <Route path="/alerts/enotify" element={<EnotifySubscribePage />} />
                <Route path="/how-do-i/contact-us" element={<ContentPage pageKey="contactUs" />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
