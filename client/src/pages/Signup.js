import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Store } from "../store";
import { getError } from "../components/helpers/getError";

function Signup() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [speciality, setSpeciality] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  //redirect to homepage if user already logged in
  useEffect(() => {
    if (state.userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, state.userInfo]);

  const signupHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }
    if (password.length < 7) {
      alert("minimum length should be 7 characters");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/users/signup",
        {
          fullName,
          email,
          password,
          speciality,
          contactInfo,
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  // add prefix to name
  const handleNameBlur = () => {
    setFullName("Dr. " + fullName);
  };

  return (
    <div>
      <div className="container">
        <main className="card">
          <div className="flex flex-col">
            <h1 className="heading">Doctor Sign Up</h1>
            <p>Please fill in the required information to create an account.</p>
          </div>

          <form onSubmit={signupHandler} className="mt-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                className="input"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={handleNameBlur}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1"
              >
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1"
              >
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                placeholder="Enter your password (minimum 7 characters)"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirm password"
                className="input"
                value={confirmPassword}
                type="password"
                placeholder="Renter password to confirm"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="speciality"
                className="block text-sm font-semibold mb-1"
              >
                Speciality
              </label>
              <input
                id="speciality"
                className="input"
                type="text"
                value={speciality}
                placeholder="Enter your medical speciality"
                onChange={(e) => setSpeciality(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="contactInfo"
                className="block text-sm font-semibold mb-1"
              >
                Contact Info
              </label>
              <input
                id="contactInfo"
                className="input"
                type="tel"
                value={contactInfo}
                placeholder="Enter your contact number"
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>

            <button className="button w-full">Sign Up</button>
          </form>

          <div className="mt-4">
            <p>
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500">
                Sign In here!
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup;
