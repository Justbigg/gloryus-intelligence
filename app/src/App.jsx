import { Routes, Route } from "react-router";

// Layouts
import LandingLayout from "./components/layout/LandingLayout.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

// Pages
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Trends from "./pages/Trends.jsx";
import TrendRadar from "./pages/TrendRadar.jsx";
import SocialIntelligence from "./pages/SocialIntelligence.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import AiDiscoverability from "./pages/AiDiscoverability.jsx";
import Audiences from "./pages/Audiences.jsx";
import Competitors from "./pages/Competitors.jsx";
import ContentLab from "./pages/ContentLab.jsx";
import Assistant from "./pages/Assistant.jsx";
import Scenarios from "./pages/Scenarios.jsx";
import Reports from "./pages/Reports.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public landing */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* App pages */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/trend-radar" element={<TrendRadar />} />
        <Route path="/social-intelligence" element={<SocialIntelligence />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/ai-discoverability" element={<AiDiscoverability />} />
        <Route path="/audiences" element={<Audiences />} />
        <Route path="/competitors" element={<Competitors />} />
        <Route path="/content-lab" element={<ContentLab />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
