import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes wrapped inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/features" element={<div>Features Page</div>} />
          <Route path="/shop" element={<div>Shop Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
