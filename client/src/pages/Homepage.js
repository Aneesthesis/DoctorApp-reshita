import React, { useContext, useEffect, useState } from "react";
import EditDocDetailsIcon from "../components/UI/icons/EditDocDetailsIcon";
import CreateNewPatientRecordIcon from "../components/UI/icons/CreateNewPatientRecordIcon";
import ViewPatientsIcon from "../components/UI/icons/ViewPatientsIcon";
import { Store } from "../store";
import { Link, useNavigate } from "react-router-dom";

function Homepage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!state.userInfo) {
        navigate("/signin");
      }
      setLoading(false);
    };

    checkUser();
  }, [state.userInfo, navigate]);

  function logoutHandler() {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("patients");
    navigate("/signin");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <main className="card p-6">
        <h1 className="text-2xl text-center font-bold mb-4">
          {`Welcome ${state.userInfo.fullName}`}
        </h1>
        <button
          onClick={logoutHandler}
          className="bg-rose-500 rounded-[4px] px-[20px] py-[10px] absolute top-30 text-white "
        >
          Log out
        </button>

        <div className="flex justify-around">
          <div className="text-center">
            <div className="card">
              <Link to={`/doctor/doctor-profile`}>
                <EditDocDetailsIcon />
                <p>View / Edit your profile</p>
              </Link>
            </div>
            <div className="card">
              <Link to="/doctor/add-patient">
                <CreateNewPatientRecordIcon />
                <p>Create New Patient Record</p>
              </Link>
            </div>
            <div className="card">
              <Link to="/doctor/patients">
                <ViewPatientsIcon />
                <p>Your Patients</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Homepage;
