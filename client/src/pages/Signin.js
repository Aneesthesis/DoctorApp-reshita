import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../components/helpers/getError";

function Signin() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  //redirect to homepage if user already logged in
  useEffect(() => {
    if (state.userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, state.userInfo]);

  const signinHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/users/signin",
        {
          email,
          password,
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div>
      <div className="container">
        <main className="card">
          <div className="flex flex-col">
            <h1 className="heading">Welcome Doctor!</h1>
            <p>Please Enter Your Login Credentials</p>
          </div>

          <form onSubmit={signinHandler} className="mt-6">
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email
              <input
                id="email"
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1"
            >
              Password
              <input
                id="password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="button w-full">Signin</button>

            <div className="mt-4">
              <p>
                Not yet registered?{" "}
                <Link to="/signup" className="text-blue-500">
                  Click here to Register!
                </Link>
              </p>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Signin;
