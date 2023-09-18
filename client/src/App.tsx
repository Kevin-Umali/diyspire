import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Home from "./pages/Home";
import ErrorFallback from "./components/ErrorFallback";
import { Box, CSSReset } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FAQ from "./pages/FAQ";
import HowToGuideDetails from "./pages/HowToGuideDetail";
import HowToGuidesList from "./pages/HowToGuideList";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectDetailById from "./pages/ProjectDetailById";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CSSReset />
      <Box>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/guide" element={<HowToGuidesList />} />
            <Route path="/guide/:path" element={<HowToGuideDetails />} />
            <Route path="/project-detail" element={<ProjectDetail />} />
            <Route path="/project-detail/:id" element={<ProjectDetailById />} />
          </Routes>
        </div>
      </Box>
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
