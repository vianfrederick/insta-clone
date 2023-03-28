import React, { useRef,useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import baseURL from "../../../url";

const Login = () => {
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const email = useRef(null);
  const password = useRef(null);

  async function loginUser(e) {
    e.preventDefault();
    const checkInputFields = [email, password];
    let isInputFieldEmpty = false;

    checkInputFields.forEach((inputField) => {
      if (inputField.current.value === "") {
        isInputFieldEmpty = true;
        inputField.current.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
      } else{
        inputField.current.style.backgroundColor = "#ffffff";
      }
    });

    if (isInputFieldEmpty) return;
    setErrorMessage('');
    setShowErrorBox(false);
    try {
      const response = await axios.post(`${baseURL}/login`,{
        email : email.current.value,
        password : password.current.value
      });
      if (response.data.status === 'error'){
        setErrorMessage(response.data.message);
        setShowErrorBox(true);
      }

      if(response.data.status === 'success'){
        localStorage.setItem('token', response.data.token);
        window.location.href="https://64225ca18806c800094ba7b4--soft-marzipan-5467f2.netlify.app/dashboard";
      }

    } catch (error) {
      setErrorMessage('Something went wrong. Please try again');
      setShowErrorBox(true);
    }
  }

  function focusInputField(e) {
    e.target.style.backgroundColor = "#ffffff";
  }

  return (
    <section className="pt-14 mb-12">
      <div className="container">
        <div className="login-container | bg-clr_base_400 grid max-w-[400px] p-4 py-8 min-[440px]:p-10 mx-auto">
          <h2 className="login-title | relative text-4xl mb-8 text-clr_secondary_400 font-semibold">
            Log In
          </h2>
          {showErrorBox && (
            <p className="error-box | bg-[#FFC107] text-clr_base_400">
              {errorMessage}
            </p>
          )}
          <form onSubmit={loginUser} className="login-form | grid gap-y-4">
            <input
              type="email"
              ref={email}
              placeholder="Enter your email"
              onFocus={focusInputField}
            />
            <input
              type="password"
              ref={password}
              placeholder="Enter password"
              onFocus={focusInputField}
            />
            <button
              className={`login-button | bg-clr_primary_400 text-clr_base_400 p-2 cursor-pointer rounded-sm mb-4 mt-4 font-semibold`}
              type="submit"
            >
              Log In
            </button>
          </form>
          <p className="text-clr_secondary_400">
            No account ?
            <Link
              className="login-text ml-1 text-clr_primary_400 font-semibold"
              to="/signup"
            >
              Signup now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
