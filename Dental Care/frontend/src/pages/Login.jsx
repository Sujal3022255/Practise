import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUserApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Add focus effect
    e.target.style.borderColor = "#667eea";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#e0e0e0";
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#667eea";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUserApi(formData);
      
      const token = response.data.token;
      const userData = response.data.user;
      
      // Use auth context to login
      login(userData, token);
      
      toast.success("Login successful!");
      
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate("/admin");
        } else if (userData.role === 'dentist') {
          navigate("/");
        } else {
          navigate("/");
        }
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={styles.input}
            />
          </div>

          <div style={styles.forgotPassword}>
            <a href="/forgot-password" style={styles.forgotLink}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#5568d3";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#667eea";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.registerText}>
            Don't have an account?{" "}
            <a href="/register" style={styles.registerLink}>
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    padding: "40px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: "20px",
    marginTop: "-10px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#667eea",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  registerText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  registerLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
