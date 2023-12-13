import axios from "axios";
import React, { useContext, useState } from "react";
import { getError } from "../components/helpers/getError";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Store } from "../store";

const AddPatient = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    medicalHistory: "",
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/users/patients/add",
        {
          fullName: patientData.name,
          age: patientData.age,
          medicalHistory: patientData.medicalHistory,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      ctxDispatch({ type: "ADD_PATIENT", payload: data });
      toast.success("New Patient Added");

      setPatientData({
        name: "",
        age: "",
        medicalHistory: "",
      });
      navigate("/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const handleCancel = () => {
    setPatientData({ name: "", age: "", medicalHistory: "" });

    navigate("/");
  };

  return (
    <div className="container">
      <main className="card">
        <div className="flex flex-col">
          <h1 className="heading text-center">Add Patient</h1>
          <p>Please fill in the required information to add a new patient.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Patient Name
            <input
              id="name"
              className="input"
              type="text"
              name="name"
              value={patientData.name}
              onChange={handleInputChange}
              required
            />
          </label>

          <label htmlFor="age" className="block text-sm font-semibold mb-1">
            Age
            <input
              id="age"
              className="input"
              type="number"
              name="age"
              value={patientData.age}
              onChange={handleInputChange}
              required
              min="0"
              max="130"
            />
          </label>

          <label
            htmlFor="medicalHistory"
            className="block text-sm font-semibold mb-1"
          >
            Medical History
            <textarea
              id="medicalHistory"
              className="input"
              name="medicalHistory"
              value={patientData.medicalHistory}
              onChange={handleInputChange}
              required
            />
          </label>
          <button
            className="bg-blue-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-blue-600 mb-4"
            type="submit"
          >
            Add Patient
          </button>
          <button
            onClick={handleCancel}
            className="bg-rose-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-rose-600"
          >
            ← Homepage
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddPatient;
