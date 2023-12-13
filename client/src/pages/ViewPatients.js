import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../store";
import { Helmet } from "react-helmet-async";
import { MessageBox } from "../components/UI/MessageBox";

function ViewPatients() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.userInfo) {
      navigate("/signin");
    } else {
      setLoading(false);
    }
  }, [state.userInfo, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { userInfo } = state;
  const { patients } = userInfo;

  return (
    <>
      <Helmet>
        <title>Your Patients</title>
      </Helmet>

      <div className="dashboard flex">
        <section className="overflow-x-auto w-full  p-4">
          <h1 className="heading text-center">{`${userInfo.fullName}'s Patients`}</h1>
          {patients && patients.length > 0 ? (
            <div className="overflow-x-auto my-10">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="px-5 text-left">Patient Name</th>
                    <th className="px-5 text-left">Added Date</th>
                    <th className="px-5 text-left">Age</th>
                    <th className="px-5 text-left">Medical History</th>
                    <th className="px-5 text-left">Actions</th>{" "}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id} className="border-b">
                      <td className="p-5">{patient._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {patient ? patient.fullName : "USER DELETED"}
                      </td>
                      <td className="p-5">
                        {patient.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">{patient.age}</td>
                      <td className="p-5">{`${patient.medicalHistory.slice(
                        0,
                        10
                      )}....`}</td>
                      <td className="p-5">
                        <Link
                          to={`/doctor/patients/${patient._id}`}
                          className="text-blue-500 underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <MessageBox>No Patients Found!</MessageBox>
          )}
          <Link
            className="bg-rose-500 rounded-[4px] px-[20px] py-[10px] mr-4 text-white w-full hover:bg-rose-600"
            to="/"
          >
            ← Homepage
          </Link>
          <Link
            className="bg-blue-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-blue-600"
            to="/doctor/add-patient"
          >
            Click to Add One!
          </Link>
        </section>
      </div>
    </>
  );
}

export default ViewPatients;
