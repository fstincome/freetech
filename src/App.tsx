import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PWAInstallButton from "@/components/PWAInstallButton";
import Index from "./pages/Index.tsx";
import GitegaStudySpace from "./pages/GitegaStudySpace.tsx";
import OurTeam from "./pages/OurTeam.tsx";
import JobOpportunities from "./pages/JobOpportunities.tsx";
import TeamMemberBio from "./pages/TeamMemberBio.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import TheoryOfChange from "./pages/TheoryOfChange.tsx";
import CmsPage from "@/components/cms/CmsPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useVisitorTracking();
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/" element={<><Navbar /><main><CmsPage slug="" fallback={<Index />} /></main><Footer /></>} />
      <Route path="/gitega-study-space" element={<><Navbar /><main><CmsPage fallback={<GitegaStudySpace />} /></main><Footer /></>} />
      <Route path="/our-team" element={<><Navbar /><main><CmsPage fallback={<OurTeam />} /></main><Footer /></>} />
      <Route path="/our-team/:slug" element={<><Navbar /><main><CmsPage slug="our-team/:slug" fallback={<TeamMemberBio />} /></main><Footer /></>} />
      <Route path="/buja-hackathon" element={<Navigate to="/job-opportunities" replace />} />
      <Route path="/job-opportunities" element={<><Navbar /><main><CmsPage fallback={<JobOpportunities />} /></main><Footer /></>} />
      <Route path="/theorie-du-changement" element={<><Navbar /><main><CmsPage fallback={<TheoryOfChange />} /></main><Footer /></>} />
      <Route path="*" element={<><Navbar /><main><CmsPage fallback={<NotFound />} /></main><Footer /></>} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
            <PWAInstallButton />
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
