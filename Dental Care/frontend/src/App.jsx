
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Hearder from "./pages/components/Hearder";
import Footers from "./pages/components/Footers";  
import EditProduct from "./pages/EditProduct";
import Edit from "./pages/edit";


 function App() {

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Toaster/>
        <Hearder/>
        <Footers/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Login" element={ <Login/> } />
          <Route path="/Register" element={<Register/>} />
          <Route path="/Contact" element={<Contact/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products/edit/:id" 
            element={
              <ProtectedRoute requiredRole="admin">
                <EditProduct/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Edit/>
              </ProtectedRoute>
            } 
          />
      
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;