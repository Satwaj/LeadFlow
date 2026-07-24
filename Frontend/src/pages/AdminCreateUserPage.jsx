import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { clearCreateUserState, createUserByAdmin } from "../redux/slices/authSlice.js";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import Toast from "../components/common/Toast.jsx";

const AdminCreateUserPage = () => {
  const dispatch = useDispatch();
  const { user, createUserStatus, createUserError } = useSelector((state) => state.auth);

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
      role: "member",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => () => dispatch(clearCreateUserState()), [dispatch]);

  if (user?.role !== "admin") {
    return (
      <div className="panel p-8 text-center max-w-lg mx-auto mt-10">
        <span className="inline-block rounded-full bg-[var(--danger-soft)] px-3 py-1 text-xs font-semibold text-[var(--danger)]">
          Access Restricted
        </span>
        <h2 className="mt-4 text-2xl font-semibold">Admin Permission Required</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Only LeadFlow Administrators can access the Create User portal.
        </p>
        <div className="mt-6">
          <Link to="/app/dashboard">
            <Button variant="secondary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    };

    const result = await dispatch(createUserByAdmin(payload));
    if (createUserByAdmin.fulfilled.match(result)) {
      const createdUser = result.payload;
      setToastMessage(`User ${createdUser?.name || values.name} created successfully as ${values.role.toUpperCase()}.`);
      reset();
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <section className="panel p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-default)] pb-4">
          <div className="p-2.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
            <UserPlus className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Team Account</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Provision a new Member or Admin user for your LeadFlow workspace.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Sarah Jenkins"
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
            placeholder="sarah@company.com"
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

          <Select
            label="Role"
            error={errors.role?.message}
            {...register("role", { required: "Role selection is required" })}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Select>

          {createUserError ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--danger-soft)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger)]">
              {createUserError}
            </div>
          ) : null}

          <Button className="w-full" type="submit" loading={createUserStatus === "loading"}>
            Create User Account
          </Button>
        </form>
      </section>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};

export default AdminCreateUserPage;
