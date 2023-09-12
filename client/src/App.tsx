import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Home from "./pages/Home";
import ErrorFallback from "./components/ErrorFallback";
import { Box, CSSReset } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CSSReset />
      <Box>
        <Navbar />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </Router>
      </Box>
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
