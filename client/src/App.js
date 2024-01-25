import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer, toast } from "react-toastify";
import NotFound from "./pages/NotFound";
import DoctorProfile from "./pages/DoctorProfile";
import React, { Suspense } from "react";
import AddPatient from "./pages/AddPatient";
import ViewPatients from "./pages/ViewPatients";
import PatientProfile from "./pages/PatientProfile";
import Footer from "./components/UI/Footer";
import StopWatch from "./pages/StopWatch";
const Homepage = React.lazy(() => import("./pages/Homepage"));

function App() {
  return (
    <>
      <div className="min-h-screen">
        <BrowserRouter>
          <ToastContainer
            className="fixed top-0 left-[37%] transform -translate-x-1/2 z-50 md px-4"
            limit={1}
          />
          <Routes>
            <Route path="/" element={<Homepage />}>
              <Route
                index
                element={
                  <Suspense
                    fallback={
                      <div>
                        Welcome Doctor! Please wait while we load your
                        profile...
                      </div>
                    }
                  />
                }
              />
            </Route>

            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route
              path={`/doctor/doctor-profile`}
              element={<DoctorProfile />}
            ></Route>
            <Route path="/doctor/add-patient" element={<AddPatient />}></Route>
            <Route path="/doctor/patients" element={<ViewPatients />}></Route>
            <Route
              path="/doctor/patients/:id"
              element={<PatientProfile />}
            ></Route>

            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <StopWatch />
      <Footer />
    </>
  );
}

export default App;
