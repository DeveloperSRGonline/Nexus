import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import AppShell from "@/components/layout/AppShell/AppShell";

// Pages
import Dashboard from "@/pages/Dashboard/Dashboard";
import Tasks from "@/pages/Tasks/Tasks";
import Projects from "@/pages/Projects/Projects";
import ProjectDetail from "@/pages/ProjectDetail/ProjectDetail";
import Events from "@/pages/Events/Events";
import Queue from "@/pages/Queue/Queue";
import Settings from "@/pages/Settings/Settings";
import AuthPage from "@/pages/Auth/AuthPage";

const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

const AppRoutes = () => (
  <Routes>
    {/* Auth */}
    <Route path="/login" element={<AuthPage mode="sign-in" />} />
    <Route path="/signup" element={<AuthPage mode="sign-up" />} />

    {/* Protected App */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:id" element={<ProjectDetail />} />
      <Route path="events" element={<Events />} />
      <Route path="queue" element={<Queue />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
);

export default AppRoutes;
