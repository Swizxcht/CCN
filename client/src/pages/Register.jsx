import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/forms/InputField";
import PasswordField from "../components/forms/PasswordField";
import SubmitButton from "../components/forms/SubmitButton";
import AlertModal from "../components/modals/AlertModal";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        type: "warning",
        title: "Password Mismatch",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setAlert({
        type: "success",
        title: "Registration Successful",
        message: "Your account was created. You can now log in.",
        redirectToLogin: true,
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Registration Failed",
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  const closeAlert = () => {
    const shouldRedirect = alert?.redirectToLogin;
    setAlert(null);
    if (shouldRedirect) navigate("/login");
  };

  return (
    <section className="bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">
            Create account
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Register for your customer portal.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Create an account to apply for service, track requests, and manage
            your subscriber information.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 text-slate-950 shadow-2xl">
          <h2 className="text-3xl font-black">Register</h2>
          <p className="mt-2 text-slate-600">
            Use an email address you can access for account updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Juan Dela Cruz"
            />

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
              placeholder="Create a password"
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />

            <SubmitButton text="Register" />
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-cyan-700">
              Login
            </Link>
          </p>
        </div>
      </div>
      <AlertModal
        open={Boolean(alert)}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message}
        onClose={closeAlert}
      />
    </section>
  );
}

export default Register;
