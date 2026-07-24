import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, login } from "../../redux/slices/authSlice.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/app/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onSubmit = async (values) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="admin@example.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
        })}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />
      {error ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--danger-soft)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger)]">
          {error}
        </div>
      ) : null}
      <Button className="w-full" type="submit" loading={status === "loading"}>
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
