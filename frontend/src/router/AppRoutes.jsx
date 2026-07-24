import { Routes, Route } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "../pages/Login.jsx";
import Apply from "../pages/Apply.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";

import EnterprisesPage from "../pages/Enterprises/EnterprisesPage.jsx";
import EnterpriseFormPage from "../pages/Enterprises/EnterpriseFormPage.jsx";
import EnterpriseViewPage from "../pages/Enterprises/EnterpriseViewPage.jsx";

import CollectionPage from "../pages/Collection/CollectionPage.jsx";
import CampaignFormPage from "../pages/Collection/CampaignFormPage.jsx";
import CampaignViewPage from "../pages/Collection/CampaignViewPage.jsx";

import ReviewPage from "../pages/Review/ReviewPage.jsx";
import GisPage from "../pages/Gis/GisPage.jsx";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage.jsx";

import ReportsPage from "../pages/Reports/ReportsPage.jsx";
import ReportFormPage from "../pages/Reports/ReportFormPage.jsx";
import ReportViewPage from "../pages/Reports/ReportViewPage.jsx";

import LinkagePage from "../pages/Linkage/LinkagePage.jsx";
import OpportunityFormPage from "../pages/Linkage/OpportunityFormPage.jsx";
import OpportunityViewPage from "../pages/Linkage/OpportunityViewPage.jsx";

import BenchmarkPage from "../pages/Benchmark/BenchmarkPage.jsx";
import NotificationsPage from "../pages/Notifications/NotificationsPage.jsx";

import UsersPage from "../pages/Users/UsersPage.jsx";
import UserFormPage from "../pages/Users/UserFormPage.jsx";
import UserViewPage from "../pages/Users/UserViewPage.jsx";

import AuditPage from "../pages/Audit/AuditPage.jsx";
import ConfigPage from "../pages/Config/ConfigPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/apply" element={<Apply />} />
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/enterprises" element={<EnterprisesPage />} />
        <Route path="/enterprises/new" element={<EnterpriseFormPage />} />
        <Route path="/enterprises/:id" element={<EnterpriseViewPage />} />
        <Route path="/enterprises/:id/edit" element={<EnterpriseFormPage />} />

        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/collection/campaigns/new" element={<CampaignFormPage />} />
        <Route path="/collection/campaigns/:id" element={<CampaignViewPage />} />
        <Route path="/collection/campaigns/:id/edit" element={<CampaignFormPage />} />

        <Route path="/review" element={<ReviewPage />} />
        <Route path="/gis" element={<GisPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />

        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/new" element={<ReportFormPage />} />
        <Route path="/reports/:id" element={<ReportViewPage />} />
        <Route path="/reports/:id/edit" element={<ReportFormPage />} />

        <Route path="/linkage" element={<LinkagePage />} />
        <Route path="/linkage/opportunities/new" element={<OpportunityFormPage />} />
        <Route path="/linkage/opportunities/:id" element={<OpportunityViewPage />} />
        <Route path="/linkage/opportunities/:id/edit" element={<OpportunityFormPage />} />

        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/new" element={<UserFormPage />} />
        <Route path="/users/:id" element={<UserViewPage />} />
        <Route path="/users/:id/edit" element={<UserFormPage />} />

        <Route path="/audit" element={<AuditPage />} />
        <Route path="/config" element={<ConfigPage />} />
      </Route>
    </Routes>
  );
}
