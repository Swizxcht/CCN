import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/forms/InputField";
import PasswordField from "../components/forms/PasswordField";
import SubmitButton from "../components/forms/SubmitButton";
import AlertModal from "../components/modals/AlertModal";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      login(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else if (res.data.user.role === "technician") {
        navigate("/technician");
      } else {
        navigate("/portal");
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Login Failed",
        message: error.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <section className="bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Account access
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Sign in to manage your CCN account.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Customers can view bills, payments, and service requests. Staff can
            access the tools assigned to their role.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 text-slate-950 shadow-2xl">
          <h2 className="text-3xl font-black">Login</h2>
          <p className="mt-2 text-slate-600">
            Enter your email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <SubmitButton text="Login" />
          </form>

          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/forgot-password" className="font-bold text-cyan-700">
              Forgot password?
            </Link>
            <span>
              No account?{" "}
              <Link to="/register" className="font-bold text-cyan-700">
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
      <AlertModal
        open={Boolean(alert)}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />
    </section>
  );
}

export default Login;
