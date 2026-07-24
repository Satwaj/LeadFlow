import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clearRegisterState, registerPublicMember } from "../../redux/slices/authSlice.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Toast from "../common/Toast.jsx";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerStatus, registerError } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => () => dispatch(clearRegisterState()), [dispatch]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    const result = await dispatch(registerPublicMember(payload));
    if (registerPublicMember.fulfilled.match(result)) {
      setToastMessage("Account registered successfully! Redirecting to sign in...");
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Alex Morgan"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 1, message: "Name cannot be empty" },
          })}
        />

        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email address" },
          })}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter password"
          error={errors.confirmPassword?.message}
          rightElement={
            <button
              type="button"
              className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register("confirmPassword", {
            required: "Please confirm password",
            validate: (value) => value === passwordValue || "Passwords do not match",
          })}
        />

        {registerError ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--danger-soft)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger)]">
            {registerError}
          </div>
        ) : null}

        <Button className="w-full" type="submit" loading={registerStatus === "loading"}>
          Create Member Account
        </Button>

        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--brand)] hover:underline">
            Sign in
          </Link>
        </p>
      </form>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </>
  );
};

export default RegisterForm;
