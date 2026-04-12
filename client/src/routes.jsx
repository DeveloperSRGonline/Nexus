import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import AppShell from "@/components/layout/AppShell/AppShell";

// Existing Pages (will be removed/updated later)
import Dashboard from "@/pages/Dashboard/Dashboard";
import Tasks from "@/pages/Tasks/Tasks";
import Projects from "@/pages/Projects/Projects";
import ProjectDetail from "@/pages/ProjectDetail/ProjectDetail";
import Events from "@/pages/Events/Events";
import Queue from "@/pages/Queue/Queue";
import Settings from "@/pages/Settings/Settings";
import AuthPage from "@/pages/Auth/AuthPage";

// New v2 Pages (placeholders for Phase 0.4)
import Today from "@/pages/Today/Today";
import Inbox from "@/pages/Inbox/Inbox";
import Next7Days from "@/pages/Next7Days/Next7Days";
import Habits from "@/pages/Habits/Habits";
import Focus from "@/pages/Focus/Focus";
import Lists from "@/pages/Lists/Lists";
import ListDetail from "@/pages/ListDetail/ListDetail";
import Tags from "@/pages/Tags/Tags";
import TagDetail from "@/pages/TagDetail/TagDetail";
import Completed from "@/pages/Completed/Completed";
import Trash from "@/pages/Trash/Trash";

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
      <Route index element={<Navigate to="/inbox" replace />} />
      
      {/* Old v1 Routes (temporary, will be removed) */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:id" element={<ProjectDetail />} />
      <Route path="events" element={<Events />} />
      <Route path="queue" element={<Queue />} />
      <Route path="settings" element={<Settings />} />
      
      {/* New v2 Routes (Phase 0.4) */}
      <Route path="today" element={<Today />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="next-7-days" element={<Next7Days />} />
      <Route path="habits" element={<Habits />} />
      <Route path="focus" element={<Focus />} />
      <Route path="lists" element={<Lists />} />
      <Route path="lists/:id" element={<ListDetail />} />
      <Route path="tags" element={<Tags />} />
      <Route path="tags/:id" element={<TagDetail />} />
      <Route path="completed" element={<Completed />} />
      <Route path="trash" element={<Trash />} />
    </Route>
  </Routes>
);

export default AppRoutes;
