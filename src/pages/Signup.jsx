import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../utils/authSlice.js";

// making zod Schema Validation for SignUp form
const signupSchema = z.object({
  firstName: z
    .string()
    .min(3, "Minimum 3 character should be there for firstname"),
  emailId: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "There should have atleast 1 Capital letter")
    .regex(/\W/, "there should atleast 1 special character"),
});
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth); // Removed error as it wasn't used

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) }); // here resolver will be given with signUp Schema

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white dark:bg-base-100 shadow-xl rounded-xl p-10">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          SignUp
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Sign up to start your journey with us.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              {...register("firstName")}
              className="input input-bordered w-full"
            />
            {errors.firstName && (
              <p className="text-error text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("emailId")}
              className="input input-bordered w-full"
            />
            {errors.emailId && (
              <p className="text-error text-sm mt-1">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Password Field with Toggle */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                // Added pr-10 (padding-right) to make space for the button
                className={`input input-bordered w-full pr-10 ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" // Added transform for better centering, styling
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-error text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8 flex justify-center">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm">
            Already have an account?{" "}
            <NavLink to="/login" className="link link-primary">
              Login
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// [ User fills form ]
//         ↓
// [ React Hook Form validates with Zod ]
//         ↓
// [ onSubmit() → dispatch(registerUser) ]
//         ↓
// [ Redux async thunk sends POST request ]
//         ↓
// [ Response: success or error ]
//         ↓
// [ Redux state updates (user, isAuthenticated) ]
//         ↓
// [ useEffect watches isAuthenticated ]
//         ↓
// [ navigate("/") → redirect to Homepage ]
