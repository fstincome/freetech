import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  useVisitorTracking();
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/" element={<><Navbar /><main><Index /></main><Footer /></>} />
      <Route path="/gitega-study-space" element={<><Navbar /><main><GitegaStudySpace /></main><Footer /></>} />
      <Route path="/our-team" element={<><Navbar /><main><OurTeam /></main><Footer /></>} />
      <Route path="*" element={<><Navbar /><main><NotFound /></main><Footer /></>} />
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
