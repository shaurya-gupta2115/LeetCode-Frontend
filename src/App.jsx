import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./utils/authSlice";
import { useEffect } from "react";

function App() {
  // code likhna pdega ki isAuthenticated hai ki nhi like agar authenticated user hai to direct homepage me land kara denge but agar nhi hai to direct signup / login page me land karana hoga

  const { isAuthenticated } = useSelector((state) => state.auth);

  //state.sliceKaNaam  --> states hai jo like 4 thi  => unka access ho jaega usme se isne "isAuthenticated" nikal liya hai  
  //  initialState: {
  //   user: null,
  //   isAuthenticated: false,
  //   loading: false,
  //   error: null,
  // }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth())
  } , [dispatch])

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ?<Homepage /> : <Navigate to="/signUp"/>} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login /> } />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
      </Routes>
    </>
  );
}

export default App;
