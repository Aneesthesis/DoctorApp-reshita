import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../store";
import { toast } from "react-toastify";
import { getError } from "../components/helpers/getError";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_REQ":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
}

const DoctorProfile = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
  }, [userInfo, navigate]);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const initialDoctorData = {
    id: userInfo._id.slice(-5),
    fullName: userInfo.fullName,
    email: userInfo.email,
    speciality: userInfo.speciality,
    contactInfo: userInfo.contactInfo,
  };

  const initialPasswords = {
    newPassword: "",
    confirmNewPassword: "",
  };

  // State for the form
  const [formDoctorData, setFormDoctorData] = useState(initialDoctorData);
  const [formPasswords, setFormPasswords] = useState(initialPasswords);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDoctorData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setFormPasswords((prevData) => ({ ...prevData, [name]: value }));
  };

  async function formSubmitHandler(e) {
    e.preventDefault();

    // Validate input fields
    if (
      !formDoctorData.fullName ||
      !formDoctorData.email ||
      !formDoctorData.speciality ||
      !formDoctorData.contactInfo
    ) {
      return toast.error("All fields are required");
    }

    // Check if the passwords don't match or the length is less than 7 characters
    if (
      formPasswords.newPassword !== formPasswords.confirmNewPassword ||
      (formPasswords.newPassword.length > 0 &&
        formPasswords.newPassword.length < 7)
    ) {
      return toast.error(
        "Passwords did not match or password length less than 7 characters"
      );
    }

    try {
      dispatch({ type: "UPDATE_REQ" });

      const passwordToSend =
        formPasswords.newPassword.length > 0 ? formPasswords.newPassword : null;

      const { data } = await axios.put(
        `http://localhost:8080/api/users/profile`,
        {
          fullName: formDoctorData.fullName,
          email: formDoctorData.email,
          speciality: formDoctorData.speciality,
          contactInfo: formDoctorData.contactInfo,
          password: passwordToSend,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({ type: `UPDATE_SUCCESS` });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem(`userInfo`, JSON.stringify(data));
      toast.success("User Updated Successfully");

      // Clear password fields after saving changes
      setFormPasswords(initialPasswords);
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(error));
    }
  }

  const handleCancel = () => {
    setFormDoctorData(initialDoctorData);
    setFormPasswords(initialPasswords);
    navigate("/");
  };

  return (
    <div className="container">
      <main className="card">
        <div className="flex flex-col">
          <h2 className="heading text-center">{`${state.userInfo.fullName}'s Profile`}</h2>
          <form onSubmit={formSubmitHandler}>
            <label className="block text-sm font-semibold mb-1" htmlFor="id">
              Doctor Id
              <input
                id="id"
                className="input cursor-not-allowed"
                type="text"
                name="id"
                value={formDoctorData.id}
                disabled
              />
            </label>
            <label className="block text-sm font-semibold mb-1" htmlFor="name">
              FullName
              <input
                id="name"
                className="input"
                type="text"
                name="fullName"
                value={formDoctorData.fullName}
                onChange={handleInputChange}
              />
            </label>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">
              Email
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                value={formDoctorData.email}
                onChange={handleInputChange}
              />
            </label>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="speciality"
            >
              Speciality
              <input
                id="speciality"
                className="input"
                type="text"
                name="speciality"
                value={formDoctorData.speciality}
                onChange={handleInputChange}
              />
            </label>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="contactInfo"
            >
              Contact Info
              <input
                id="contactInfo"
                className="input"
                type="tel"
                name="contactInfo"
                value={formDoctorData.contactInfo}
                onChange={handleInputChange}
              />
            </label>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="newPassword"
            >
              New Password
              <input
                id="newPassword"
                className="input"
                type="password"
                name="newPassword"
                value={formPasswords.newPassword}
                onChange={handlePasswordInputChange}
              />
            </label>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="confirmNewPassword"
            >
              Confirm New Password
              <input
                id="confirmNewPassword"
                className="input"
                type="password"
                name="confirmNewPassword"
                value={formPasswords.confirmNewPassword}
                onChange={handlePasswordInputChange}
              />
            </label>
            <button
              disabled={
                formDoctorData.fullName === initialDoctorData.fullName &&
                formDoctorData.email === initialDoctorData.email &&
                formDoctorData.contactInfo === initialDoctorData.contactInfo &&
                formDoctorData.id === initialDoctorData.id &&
                formDoctorData.speciality === initialDoctorData.speciality &&
                formPasswords.newPassword.length < 7 &&
                formPasswords.confirmNewPassword.length < 7
              }
              className="bg-blue-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-blue-600 disabled:cursor-not-allowed mb-4"
              type="submit"
            >
              {loadingUpdate ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="bg-rose-500 rounded-[4px] px-[20px] py-[10px] text-white w-full hover:bg-rose-600"
              onClick={handleCancel}
            >
              ← Homepage
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
