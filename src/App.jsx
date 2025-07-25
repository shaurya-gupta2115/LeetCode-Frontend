import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./utils/authSlice";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import Admin from "./pages/Admin";
import AdminUpload from "./components/AdminUpload";

function App() {
  // code likhna pdega ki isAuthenticated hai ki nhi like agar authenticated user hai to direct homepage me land kara denge but agar nhi hai to direct signup / login page me land karana hoga

  const { isAuthenticated,user, loading  } = useSelector((state) => state.auth);

  //state.sliceKaNaam  --> states hai jo like 4 thi  => unka access ho jaega usme se isne "isAuthenticated" nikal liya hai  
  //  initialState: {
  //   user: null,
  //   isAuthenticated: false,
  //   loading: false,
  //   error: null,
  // }

  const dispatch = useDispatch();

// check initial authentication 
  useEffect(() => {
    dispatch(checkAuth())
  } , [dispatch])

  // here will will put loader when reloading is being done and it asks signup page again ...we avoid this by showing loader in the page
  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/create"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/delete"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDelete />
            ) : (
              <Navigate to="/" />
            )
          }
        />{" "}
        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/problem/:problemId" element={<ProblemPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
