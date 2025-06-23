import React, { useEffect } from "react";
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth); // Removed error as it wasn't used

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) }); // here resolver will be given with signUp Schema

  useEffect(() => {
    if(isAuthenticated){
      navigate("/")
    }
  },[isAuthenticated,navigate])

  

  const onSubmit = (data) => {
    dispatch(registerUser(data))
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full text-base font-semibold shadow-md hover:shadow-lg transition">
              Create Account
            </button>
          </div>
        </form>
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