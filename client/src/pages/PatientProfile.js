import React, { useContext, useReducer, useState, useEffect } from "react";
import { Store } from "../store";
import { toast } from "react-toastify";
import { getError } from "../components/helpers/getError";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_REQ":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "DELETE_REQ":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    default:
      return state;
  }
}

const PatientProfile = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [{ loadingUpdate, loadingDelete }, localDispatch] = useReducer(
    reducer,
    {
      loadingUpdate: false,
      loadingDelete: false,
    }
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
  }, [userInfo, navigate]);

  const initialPatientData = {
    id: id.slice(-5),
    fullName: "",
    age: 0,
    medicalHistory: "",
  };

  const [formPatientData, setFormPatientData] = useState(initialPatientData);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await axios.get(
          `https://doctor-api-umjl.onrender.com/api/users/patients/${id}`,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );

        setFormPatientData({
          ...initialPatientData,
          ...response.data,
        });

        setPatientName(response.data.fullName);
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    if (id) {
      fetchPatientInfo();
    }
  }, [id, userInfo.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormPatientData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function formSubmitHandler(e) {
    e.preventDefault();

    if (
      !formPatientData.fullName ||
      formPatientData.age <= 0 ||
      !formPatientData.medicalHistory
    ) {
      return toast.error("All fields are required");
    }

    try {
      localDispatch({ type: "UPDATE_REQ" });

      const { data } = await axios.put(
        `https://doctor-api-umjl.onrender.com/api/users/patients/${id}`,
        {
          updatedPatientData: {
            fullName: formPatientData.fullName,
            age: formPatientData.age,
            medicalHistory: formPatientData.medicalHistory,
          },
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      localDispatch({ type: "UPDATE_SUCCESS" });

      ctxDispatch({
        type: "UPDATE_PATIENT",
        payload: data,
      });

      toast.success("Patient Updated Successfully");
    } catch (error) {
      localDispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(error));
    }
  }

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this patient?")) {
        localDispatch({ type: "DELETE_REQ" });

        const { data } = await axios.delete(
          `http://localhost:8080/api/users/patients/delete/${id}`,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );

        ctxDispatch({
          type: "REMOVE_PATIENT",
          payload: data,
        });

        localDispatch({ type: "DELETE_SUCCESS" });
        toast.success("Patient Deleted Successfully");
        navigate("/doctor/patients");
      }
    } catch (error) {
      localDispatch({ type: "DELETE_FAIL" });
      toast.error(getError(error));
    }
  };

  const handleCancel = () => {
    setFormPatientData(initialPatientData);
    navigate("/doctor/patients");
  };

  return (
    <div className="container">
      <Helmet>
        <title>Patient Profile</title>
      </Helmet>
      <main className="card">
        <div className="flex flex-col">
          <h2 className="heading text-center">{`${patientName}'s Profile`}</h2>
          <form onSubmit={formSubmitHandler}>
            <label className="block text-sm font-semibold mb-1" htmlFor="id">
              Patient Id
              <input
                id="id"
                className="input cursor-not-allowed"
                type="text"
                name="id"
                value={formPatientData.id}
                disabled
              />
            </label>
            <label className="block text-sm font-semibold mb-1" htmlFor="name">
              Name
              <input
                id="fullName"
                className="input"
                type="text"
                name="fullName"
                value={formPatientData.fullName}
                onChange={handleInputChange}
              />
            </label>

            <label className="block text-sm font-semibold mb-1" htmlFor="age">
              Age
              <input
                id="age"
                className="input"
                type="number"
                name="age"
                value={formPatientData.age}
                onChange={handleInputChange}
              />
            </label>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="medicalHistory"
            >
              Medical History
              <textarea
                id="medicalHistory"
                className="input"
                name="medicalHistory"
                value={formPatientData.medicalHistory}
                onChange={handleInputChange}
              />
            </label>
            <button
              disabled={
                formPatientData.name === initialPatientData.name &&
                formPatientData.age === initialPatientData.age &&
                formPatientData.medicalHistory ===
                  initialPatientData.medicalHistory
              }
              className="bg-blue-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-blue-600 disabled:cursor-not-allowed mb-4"
              type="submit"
            >
              {loadingUpdate ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-red-600 mb-4"
              type="button"
            >
              {loadingDelete ? "Deleting..." : "Delete Patient"}
            </button>
            <button
              className="bg-rose-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-rose-600"
              onClick={handleCancel}
            >
              ← Back to Patients' List
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
