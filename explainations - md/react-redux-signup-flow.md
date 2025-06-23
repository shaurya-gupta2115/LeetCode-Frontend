# 🔐 React + Redux Toolkit Signup Flow (Complete Guide)

This document explains the complete flow of user signup in a React application using **React Hook Form**, **Zod for validation**, **Redux Toolkit** for state management, and **Axios** for API calls.

---

## ✅ Step 1: Form Handling with React Hook Form + Zod

```js
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum 3 characters"),
  emailId: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must have at least 1 capital letter")
    .regex(/\W/, "Must have at least 1 special character"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(signupSchema)
});
```

---

## ✅ Step 2: Dispatch Redux Async Thunk on Submit

```js
const onSubmit = (data) => {
  dispatch(registerUser(data));
};
```

---

## ✅ Step 3: Async Thunk `registerUser` (Redux Toolkit)

```js
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData , { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

---

## ✅ Step 4: State Management in `authSlice`

```js
initialState: {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}
```

Handles:

- `.pending`: set loading true
- `.fulfilled`: store user, set `isAuthenticated` true
- `.rejected`: handle errors

---

## ✅ Step 5: Redirect after Signup

```js
useEffect(() => {
  if (isAuthenticated) {
    navigate("/");
  }
}, [isAuthenticated, navigate]);
```

---

## 🔄 Visual Flow

```
[ User Fills Form ]
        ↓
[ Validation via Zod ]
        ↓
[ Submit → dispatch(registerUser) ]
        ↓
[ Axios POST to backend ]
        ↓
[ Redux updates auth state ]
        ↓
[ isAuthenticated = true ]
        ↓
[ Redirect to Homepage ]
```

---

## 🔧 File Responsibility Table

| File | Role |
|------|------|
| Signup.jsx | UI + Validation + Dispatch |
| authSlice.js | API + Redux Logic |
| axiosClient.js | Axios Config |
| store.js | Redux Store Setup |
| App.jsx | Routing + Redirect |

---

✅ That's the complete working of the signup flow with Redux Toolkit, React Hook Form, and Zod.