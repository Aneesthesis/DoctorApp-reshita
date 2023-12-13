import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Signin from "./pages/Signin";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import { ToastContainer, toast } from "react-toastify";
import NotFound from "./pages/NotFound";
import DoctorProfile from "./pages/DoctorProfile";
import { useContext } from "react";
import { Store } from "./store";
import AddPatient from "./pages/AddPatient";
import ViewPatients from "./pages/ViewPatients";
import PatientProfile from "./pages/PatientProfile";

function App() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  return (
    <BrowserRouter>
      <ToastContainer
        className="fixed top-0 left-[37%] transform -translate-x-1/2 z-50 md px-4"
        limit={1}
      />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path={`/doctor/doctor-profile`}
          element={<DoctorProfile />}
        ></Route>
        <Route path="/doctor/add-patient" element={<AddPatient />}></Route>
        <Route path="/doctor/patients" element={<ViewPatients />}></Route>
        <Route path="/doctor/patients/:id" element={<PatientProfile />}></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
